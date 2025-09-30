/**
 * VibeStore — Cloud Functions (Node 20, ESM)
 * Features:
 *  - redirectAndLogClick: HTTP → logs verified interaction, then 302 to external link
 *  - approveApp: callable (admin) → approves pending app
 *  - createReview: callable → enforces 30d verified-interaction window
 *  - stripeWebhook: HTTP → activates/deactivates Featured (monthly)
 *  - weeklyNewsletterJob: scheduled → composes + sends digest via Buttondown/Mailchimp
 *
 * ENV VARS (set via `firebase functions:config:set key=value` or use secrets):
 *  - stripe.secret=sk_live_xxx
 *  - stripe.webhook_secret=whsec_xxx
 *  - newsletter.provider=buttondown|mailchimp
 *  - buttondown.api_key=bd_xxx
 *  - mailchimp.api_key=mc_xxx
 *  - mailchimp.list_id=xxxxxxxx
 */

import { onRequest, onCall, HttpsError, logger, onSchedule } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import fetch from 'node-fetch';

admin.initializeApp();
const db = admin.firestore();


// Secrets (deploy and link via "functions:secrets:set")
const STRIPE_SECRET        = defineSecret('STRIPE_SECRET');
const STRIPE_WEBHOOK       = defineSecret('STRIPE_WEBHOOK');
const NEWSLETTER_PROVIDER  = defineSecret('NEWSLETTER_PROVIDER');
const BUTTONDOWN_API_KEY   = defineSecret('BUTTONDOWN_API_KEY');
const MAILCHIMP_API_KEY    = defineSecret('MAILCHIMP_API_KEY');
const MAILCHIMP_LIST_ID    = defineSecret('MAILCHIMP_LIST_ID');

/**
 * Helper: check admin claim
 */
function assertAdmin(context){
  if (!context.auth?.token?.admin) {
    throw new HttpsError('permission-denied', 'Admin privileges required.');
  }
}

/**
 * ONE-TIME FUNCTION: Grant admin privileges to Shalom
 * Call this once, then remove it from the code
 */
export const grantAdminToShalom = onRequest(
  { secrets: [] },
  async (req, res) => {
    try {
      const email = 'shalom.cohen.111@gmail.com';
      
      // Get user by email
      const userRecord = await admin.auth().getUserByEmail(email);
      console.log('Found user:', userRecord.uid);
      
      // Set admin claims
      await admin.auth().setCustomUserClaims(userRecord.uid, { 
        admin: true,
        role: 'admin',
        grantedAt: new Date().toISOString()
      });
      
      res.json({
        success: true,
        message: `Admin privileges granted to ${email}`,
        uid: userRecord.uid,
        claims: { admin: true, role: 'admin' },
        note: 'User must sign out and sign back in for changes to take effect'
      });
      
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);

/**
 * redirectAndLogClick
 * GET /api/r?appId=...
 * - Fetches app link
 * - If user is authenticated, writes interactions/{uid_appId} with lastClickAt=now
 * - 302 redirect to external link
 *
 * NOTE: For static site, authorize via Firebase Web Auth and send ID token header
 */
export const redirectAndLogClick = onRequest(
  { secrets: [] }, // none required here
  async (req, res) => {
    try {
      const appId = req.query.appId;
      if (!appId) return res.status(400).send('Missing appId');
      const appRef = db.collection('apps').doc(String(appId));
      const snap = await appRef.get();
      if (!snap.exists) return res.status(404).send('App not found');
      const app = snap.data();
      if (app.status !== 'approved') return res.status(403).send('App not approved');

      // Try to verify user via Firebase token (optional)
      const idToken = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split('Bearer ')[1]
        : null;

      let uid = null;
      if (idToken) {
        try {
          const decoded = await admin.auth().verifyIdToken(idToken);
          uid = decoded.uid;
        } catch (e) {
          logger.warn('Invalid ID token for redirect', e.message);
        }
      }

      if (uid) {
        const interRef = db.collection('interactions').doc(`${uid}_${appId}`);
        await interRef.set({ uid, appId, lastClickAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      }

      // 302 redirect
      return res.redirect(302, app.link);
    } catch (err) {
      logger.error('redirectAndLogClick error', err);
      return res.status(500).send('Internal error');
    }
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);

/**
 * approveApp (admin callable)
 * - Sets status='approved' and updatedAt=now
 */
export const approveApp = onCall(
  { enforceAppCheck: false }, // enable later if needed
  async (req) => {
    assertAdmin(req);
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');
    const ref = db.collection('apps').doc(String(appId));
    await ref.update({ status: 'approved', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    return { ok: true };
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);

/**
 * deleteApp (admin callable)
 * - Permanently deletes app from Firestore
 * - Also deletes related reviews and interactions
 */
export const deleteApp = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');
    
    const appRef = db.collection('apps').doc(String(appId));
    
    // Check if app exists
    const appSnap = await appRef.get();
    if (!appSnap.exists) {
      throw new HttpsError('not-found', 'App not found');
    }
    
    // Delete related reviews
    const reviewsQuery = db.collection('reviews').where('appId', '==', String(appId));
    const reviewsSnap = await reviewsQuery.get();
    const reviewDeletes = reviewsSnap.docs.map(doc => doc.ref.delete());
    
    // Delete related interactions
    const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
    const interactionsSnap = await interactionsQuery.get();
    const interactionDeletes = interactionsSnap.docs.map(doc => doc.ref.delete());
    
    // Delete the app itself
    await appRef.delete();
    
    // Delete related data
    await Promise.all([...reviewDeletes, ...interactionDeletes]);
    
    logger.info(`App ${appId} and all related data deleted by admin`);
    return { ok: true, deletedReviews: reviewsSnap.size, deletedInteractions: interactionsSnap.size };
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);

/**
 * createReview (callable)
 * - Requires verified interaction within last 30 days
 * - Writes review and updates app's aggregates (ratingAvg, ratingCount, ratingSum)
 */
export const createReview = onCall(
  { enforceAppCheck: false },
  async (req) => {
    if (!req.auth?.uid) throw new HttpsError('unauthenticated', 'Login required');
    const uid = req.auth.uid;
    const { appId, stars, text } = req.data || {};
    if (!appId || !stars || stars < 1 || stars > 5) {
      throw new HttpsError('invalid-argument', 'Invalid review payload');
    }

    const interRef = db.collection('interactions').doc(`${uid}_${appId}`);
    const interSnap = await interRef.get();
    if (!interSnap.exists) throw new HttpsError('failed-precondition', 'No verified interaction');
    const inter = interSnap.data();
    const lastClickAt = inter.lastClickAt?.toDate?.() || new Date(0);
    const days = (Date.now() - lastClickAt.getTime()) / (1000*60*60*24);
    if (days > 30) throw new HttpsError('failed-precondition', 'Verification expired. Click the app again.');

    // Write review
    const reviewRef = db.collection('reviews').doc();
    await reviewRef.set({
      reviewId: reviewRef.id,
      appId,
      userId: uid,
      stars,
      text: String(text || ''),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update aggregates
    const appRef = db.collection('apps').doc(String(appId));
    await db.runTransaction(async (tx) => {
      const appSnap = await tx.get(appRef);
      if (!appSnap.exists) throw new HttpsError('not-found', 'App not found');
      const a = appSnap.data() || {};
      const ratingCount = Number(a.rating_count || 0) + 1;
      const ratingSum   = Number(a.rating_sum || 0) + Number(stars);
      const ratingAvg   = Math.round((ratingSum / ratingCount) * 10) / 10;
      tx.update(appRef, { rating_count: ratingCount, rating_sum: ratingSum, rating_avg: ratingAvg });
    });

    return { ok: true };
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);

/**
 * stripeWebhook — activate/deactivate Featured
 * - Expect Stripe checkout.session.completed with metadata.appId and period end
 * - Set apps/{appId}.featured.active=true with start/end timestamps
 *
 * TODO (YOU): Create a PRICE (monthly) in Stripe dashboard and configure Checkout.
 */
export const stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET, STRIPE_WEBHOOK] },
  async (req, res) => {
    const stripe = new Stripe(STRIPE_SECRET.value());
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK.value());
    } catch (err) {
      logger.error('Webhook signature verification failed', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const appId = session?.metadata?.appId;
      if (!appId) {
        logger.warn('checkout.session.completed without appId metadata');
      } else {
        const now = admin.firestore.Timestamp.now();
        // naive +30 days; in production, prefer Stripe subscriptions data
        const end = admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30*24*60*60*1000));
        await db.collection('apps').doc(String(appId)).set({
          featured: { active: true, startAt: now, endAt: end }
        }, { merge: true });
        logger.info(`Featured activated for app ${appId}`);
      }
    }

    res.json({ received: true });
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);

/**
 * weeklyNewsletterJob — compose digest & send via provider
 * - Runs weekly (Sunday 08:00 UTC as example)
 * - Picks "New", "Trending", "Editor's Picks" (naive example)
 *
 * TODO (YOU): Set provider secret + template content.
 */
export const weeklyNewsletterJob = onSchedule(
  { schedule: '0 8 * * 0', timeZone: 'UTC', secrets: [NEWSLETTER_PROVIDER, BUTTONDOWN_API_KEY, MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID] },
  async () => {
    try {
      // Fetch some items
      const recent = await db.collection('apps').where('status','==','approved').orderBy('createdAt','desc').limit(5).get();
      const editors = await db.collection('apps').where('status','==','approved').where('editor_pick','==',true).limit(5).get();
      const featured = await db.collection('apps').where('status','==','approved').where('featured.active','==',true).limit(5).get();

      const section = (snap) => snap.docs.map(d => {
        const a = d.data();
        return `• ${a.title} — ${a.description?.slice(0, 120) || ''}`;
      }).join('\n');

      const body = [
        'VibeStore Weekly Digest',
        '',
        'New:',
        section(recent) || '—',
        '',
        "Editor's Picks:",
        section(editors) || '—',
        '',
        'Featured:',
        section(featured) || '—',
        '',
        'Visit VibeStore to explore more.'
      ].join('\n');

      const provider = (NEWSLETTER_PROVIDER.value() || '').toLowerCase();
      if (provider === 'buttondown') {
        const resp = await fetch('https://api.buttondown.email/v1/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${BUTTONDOWN_API_KEY.value()}`
          },
          body: JSON.stringify({
            subject: 'VibeStore — Weekly Digest',
            body,
            to: 'everyone' // requires a default audience in Buttondown
          })
        });
        logger.info('Buttondown response', await resp.text());
      } else if (provider === 'mailchimp') {
        // Minimal example (real Mailchimp campaigns require more steps)
        logger.warn('Mailchimp integration is placeholder — implement campaign creation/send flow.');
      } else {
        logger.warn('No newsletter provider configured.');
      }
    } catch (e) {
      logger.error('weeklyNewsletterJob error', e);
    }
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);

/**
 * createReview (callable)
 * - Requires verified interaction within last 30 days
 * - Writes review and updates app's aggregates (ratingAvg, ratingCount, ratingSum)
 */
export const createReview = onCall(
  { enforceAppCheck: false },
  async (req) => {
    if (!req.auth?.uid) throw new HttpsError('unauthenticated', 'Login required');
    const uid = req.auth.uid;
    const { appId, stars, text } = req.data || {};
    if (!appId || !stars || stars < 1 || stars > 5) {
      throw new HttpsError('invalid-argument', 'Invalid review payload');
    }

    const interRef = db.collection('interactions').doc(`${uid}_${appId}`);
    const interSnap = await interRef.get();
    if (!interSnap.exists) throw new HttpsError('failed-precondition', 'No verified interaction');
    const inter = interSnap.data();
    const lastClickAt = inter.lastClickAt?.toDate?.() || new Date(0);
    const days = (Date.now() - lastClickAt.getTime()) / (1000*60*60*24);
    if (days > 30) throw new HttpsError('failed-precondition', 'Verification expired. Click the app again.');

    // Write review
    const reviewRef = db.collection('reviews').doc();
    await reviewRef.set({
      reviewId: reviewRef.id,
      appId,
      userId: uid,
      stars,
      text: String(text || ''),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update aggregates
    const appRef = db.collection('apps').doc(String(appId));
    await db.runTransaction(async (tx) => {
      const appSnap = await tx.get(appRef);
      if (!appSnap.exists) throw new HttpsError('not-found', 'App not found');
      const a = appSnap.data() || {};
      const ratingCount = Number(a.rating_count || 0) + 1;
      const ratingSum   = Number(a.rating_sum || 0) + Number(stars);
      const ratingAvg   = Math.round((ratingSum / ratingCount) * 10) / 10;
      tx.update(appRef, { rating_count: ratingCount, rating_sum: ratingSum, rating_avg: ratingAvg });
    });

    return { ok: true };
  }
);

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Updates the app's usersCount field
 */
export const updateAppUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      // Count unique UIDs
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      const usersCount = uniqueUsers.size;
      
      // Update the app with the users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: usersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${usersCount} users`);
      return { ok: true, usersCount };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { enforceAppCheck: false },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        const appData = appDoc.data();
        
        // Count unique users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        const usersCount = uniqueUsers.size;
        
        // Update the app
        return appDoc.ref.update({ 
          usersCount: usersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps`);
      return { ok: true, updatedApps: appsSnap.size };
      
    } catch (error) {
      logger.error('Error updating all apps users count:', error);
      throw new HttpsError('internal', 'Failed to update users count for all apps');
    }
  }
);
