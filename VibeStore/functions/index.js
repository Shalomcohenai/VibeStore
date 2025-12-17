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

import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
// import { defineSecret } from 'firebase-functions/params';
import admin from 'firebase-admin';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import sharp from 'sharp';

admin.initializeApp();
const db = admin.firestore();


// Secrets (deploy and link via "functions:secrets:set")
// For now, we'll use environment variables instead of secrets
const STRIPE_SECRET        = process.env.STRIPE_SECRET || 'sk_test_placeholder';
const STRIPE_WEBHOOK       = process.env.STRIPE_WEBHOOK || 'whsec_placeholder';
const NEWSLETTER_PROVIDER  = process.env.NEWSLETTER_PROVIDER || 'buttondown';
const BUTTONDOWN_API_KEY   = process.env.BUTTONDOWN_API_KEY || 'bd_placeholder';
const MAILCHIMP_API_KEY    = process.env.MAILCHIMP_API_KEY || 'mc_placeholder';
const MAILCHIMP_LIST_ID    = process.env.MAILCHIMP_LIST_ID || 'list_placeholder';

/**
 * Helper: check admin claim
 */
function assertAdmin(context){
  if (!context.auth?.token?.admin) {
    throw new HttpsError('permission-denied', 'Admin privileges required.');
  }
}

// Debug function removed for production security

/**
 * updateAppUsersCount (callable)
 * - Counts unique users who clicked on an app from interactions collection
 * - Counts unique sessions from anonymous_clicks collection
 * - Updates the app's usersCount field with combined count
 */
export const updateAppUsersCount = onCall(
  { cors: true },
  async (req) => {
    const { appId } = req.data || {};
    if (!appId) throw new HttpsError('invalid-argument', 'Missing appId');

    try {
      // Count unique authenticated users who clicked on this app
      const interactionsQuery = db.collection('interactions').where('appId', '==', String(appId));
      const interactionsSnap = await interactionsQuery.get();
      
      const uniqueUsers = new Set();
      interactionsSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.uid) {
          uniqueUsers.add(data.uid);
        }
      });
      
      // Count unique anonymous sessions who clicked on this app
      const anonymousQuery = db.collection('anonymous_clicks').where('appId', '==', String(appId));
      const anonymousSnap = await anonymousQuery.get();
      
      const uniqueSessions = new Set();
      anonymousSnap.docs.forEach(doc => {
        const data = doc.data();
        if (data.sessionId) {
          uniqueSessions.add(data.sessionId);
        }
      });
      
      const totalUsersCount = uniqueUsers.size + uniqueSessions.size;
      
      // Update the app with the combined users count
      const appRef = db.collection('apps').doc(String(appId));
      await appRef.update({ 
        usersCount: totalUsersCount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      logger.info(`Updated users count for app ${appId}: ${totalUsersCount} total users (${uniqueUsers.size} authenticated + ${uniqueSessions.size} anonymous)`);
      return { 
        ok: true, 
        usersCount: totalUsersCount,
        authenticatedUsers: uniqueUsers.size,
        anonymousSessions: uniqueSessions.size
      };
      
    } catch (error) {
      logger.error('Error updating app users count:', error);
      throw new HttpsError('internal', 'Failed to update users count');
    }
  }
);

/**
 * updateAllAppsUsersCount (callable, admin only)
 * - Updates users count for all approved apps (combined authenticated + anonymous)
 * - Useful for batch updates
 */
export const updateAllAppsUsersCount = onCall(
  { cors: true },
  async (req) => {
    assertAdmin(req);
    
    try {
      const appsQuery = db.collection('apps').where('status', '==', 'approved');
      const appsSnap = await appsQuery.get();
      
      const updatePromises = appsSnap.docs.map(async (appDoc) => {
        const appId = appDoc.id;
        
        // Count unique authenticated users for this app
        const interactionsQuery = db.collection('interactions').where('appId', '==', appId);
        const interactionsSnap = await interactionsQuery.get();
        
        const uniqueUsers = new Set();
        interactionsSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.uid) {
            uniqueUsers.add(data.uid);
          }
        });
        
        // Count unique anonymous sessions for this app
        const anonymousQuery = db.collection('anonymous_clicks').where('appId', '==', appId);
        const anonymousSnap = await anonymousQuery.get();
        
        const uniqueSessions = new Set();
        anonymousSnap.docs.forEach(doc => {
          const data = doc.data();
          if (data.sessionId) {
            uniqueSessions.add(data.sessionId);
          }
        });
        
        const totalUsersCount = uniqueUsers.size + uniqueSessions.size;
        
        // Update the app with combined count
        return appDoc.ref.update({ 
          usersCount: totalUsersCount,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      logger.info(`Updated users count for ${appsSnap.size} apps (combined authenticated + anonymous)`);
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
 * - If anonymous, writes to anonymous_clicks collection with sessionId
 * - 302 redirect to external link
 *
 * NOTE: For static site, authorize via Firebase Web Auth and send ID token header
 */
export const redirectAndLogClick = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      const appId = req.query.appId;
      if (!appId) return res.status(400).send('Missing appId');
      const appRef = db.collection('apps').doc(String(appId));
      const snap = await appRef.get();
      if (!snap.exists) return res.status(404).send('App not found');
      const app = snap.data();
      if (app.status !== 'approved') return res.status(403).send('App not approved');

      // Try to verify user via Firebase token (from query params or headers)
      const idToken = req.query.token || (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.split('Bearer ')[1]
        : null);

      let uid = null;
      if (idToken) {
        try {
          const decoded = await admin.auth().verifyIdToken(idToken);
          uid = decoded.uid;
        } catch (e) {
          logger.warn('Invalid ID token for redirect', e.message);
        }
      }

      // Get session ID for anonymous users (from query params or headers)
      const sessionId = req.query.sessionId || req.headers['x-session-id'] || null;

      if (uid) {
        // Authenticated user - use existing interactions collection
        const interRef = db.collection('interactions').doc(`${uid}_${appId}`);
        const interSnap = await interRef.get();
        
        let isFirstClick = false;
        
        if (!interSnap.exists) {
          // First time clicking this app
          isFirstClick = true;
          await interRef.set({ 
            uid, 
            appId, 
            lastClickAt: admin.firestore.FieldValue.serverTimestamp(),
            firstClickAt: admin.firestore.FieldValue.serverTimestamp(),
            clickCount: 1
          });
          logger.info(`First interaction logged for user ${uid} and app ${appId}`);
        } else {
          // Update existing interaction
          const existingData = interSnap.data();
          await interRef.set({ 
            uid, 
            appId, 
            lastClickAt: admin.firestore.FieldValue.serverTimestamp(),
            firstClickAt: existingData.firstClickAt || admin.firestore.FieldValue.serverTimestamp(),
            clickCount: (existingData.clickCount || 0) + 1
          }, { merge: true });
          logger.info(`Interaction updated for user ${uid} and app ${appId}`);
        }
        
        // Only increment user count if this is the first time clicking
        if (isFirstClick) {
          try {
            await appRef.update({
              usersCount: admin.firestore.FieldValue.increment(1),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            logger.info(`User count incremented for app ${appId} (first-time click by user ${uid})`);
          } catch (error) {
            logger.error(`Failed to increment user count for app ${appId}:`, error);
          }
        } else {
          logger.info(`User count not incremented for app ${appId} (not a first-time click)`);
        }
      } else if (sessionId) {
        // Anonymous user - check if first click from this session
        const anonymousQuery = db.collection('anonymous_clicks')
          .where('sessionId', '==', sessionId)
          .where('appId', '==', appId);
        
        const existingClicks = await anonymousQuery.get();
        
        if (existingClicks.empty) {
          // First time clicking this app from this session
          await db.collection('anonymous_clicks').add({
            sessionId,
            appId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] || null
          });
          
          // Increment user count for anonymous user
          try {
            await appRef.update({
              usersCount: admin.firestore.FieldValue.increment(1),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            logger.info(`User count incremented for app ${appId} (first-time click by anonymous session ${sessionId})`);
          } catch (error) {
            logger.error(`Failed to increment user count for app ${appId}:`, error);
          }
        } else {
          logger.info(`Anonymous session ${sessionId} already clicked app ${appId}, not incrementing count`);
        }
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
 * trackClick - POST /api/track-click
 * - Tracks app clicks for both authenticated and anonymous users
 * - Used by session tracker for more detailed tracking
 */
export const trackClick = onRequest(
  { cors: true },
  async (req, res) => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).send('Method not allowed');
      }

      const { appId, source = 'direct', sessionId } = req.body;
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
          logger.warn('Invalid ID token for track click', e.message);
        }
      }

      const currentSessionId = sessionId || req.headers['x-session-id'] || null;

      if (uid) {
        // Authenticated user - use existing interactions collection
        const interRef = db.collection('interactions').doc(`${uid}_${appId}`);
        const interSnap = await interRef.get();
        
        let isFirstClick = false;
        
        if (!interSnap.exists) {
          // First time clicking this app
          isFirstClick = true;
          await interRef.set({ 
            uid, 
            appId, 
            lastClickAt: admin.firestore.FieldValue.serverTimestamp(),
            firstClickAt: admin.firestore.FieldValue.serverTimestamp(),
            clickCount: 1,
            source: source
          });
          logger.info(`First interaction logged for user ${uid} and app ${appId} from source: ${source}`);
        } else {
          // Update existing interaction
          const existingData = interSnap.data();
          await interRef.set({ 
            uid, 
            appId, 
            lastClickAt: admin.firestore.FieldValue.serverTimestamp(),
            firstClickAt: existingData.firstClickAt || admin.firestore.FieldValue.serverTimestamp(),
            clickCount: (existingData.clickCount || 0) + 1,
            source: source
          }, { merge: true });
          logger.info(`Interaction updated for user ${uid} and app ${appId} from source: ${source}`);
        }
        
        // Only increment user count if this is the first time clicking
        if (isFirstClick) {
          try {
            await appRef.update({
              usersCount: admin.firestore.FieldValue.increment(1),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            logger.info(`User count incremented for app ${appId} (first-time click by user ${uid} from source: ${source})`);
          } catch (error) {
            logger.error(`Failed to increment user count for app ${appId}:`, error);
          }
        }
      } else if (currentSessionId) {
        // Anonymous user - check if first click from this session
        const anonymousQuery = db.collection('anonymous_clicks')
          .where('sessionId', '==', currentSessionId)
          .where('appId', '==', appId);
        
        const existingClicks = await anonymousQuery.get();
        
        if (existingClicks.empty) {
          // First time clicking this app from this session
          await db.collection('anonymous_clicks').add({
            sessionId: currentSessionId,
            appId,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'] || null,
            source: source
          });
          
          // Increment user count for anonymous user
          try {
            await appRef.update({
              usersCount: admin.firestore.FieldValue.increment(1),
              updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            logger.info(`User count incremented for app ${appId} (first-time click by anonymous session ${currentSessionId} from source: ${source})`);
          } catch (error) {
            logger.error(`Failed to increment user count for app ${appId}:`, error);
          }
        } else {
          logger.info(`Anonymous session ${currentSessionId} already clicked app ${appId}, not incrementing count`);
        }
      }

      res.json({ success: true, appId, source });
    } catch (err) {
      logger.error('trackClick error', err);
      res.status(500).json({ error: 'Internal error' });
    }
  }
);

/**
 * approveApp (admin callable)
 * - Sets status='approved' and updatedAt=now
 */
export const approveApp = onCall(
  { cors: true },
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
 * deleteApp (admin callable)
 * - Permanently deletes app from Firestore
 * - Also deletes related reviews and interactions
 */
export const deleteApp = onCall(
  { cors: true },
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
 * createReview (callable)
 * - Requires verified interaction within last 30 days
 * - Writes review and updates app's aggregates (ratingAvg, ratingCount, ratingSum)
 */
export const createReview = onCall(
  { cors: true },
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
 * stripeWebhook — activate/deactivate Featured
 * - Expect Stripe checkout.session.completed with metadata.appId and period end
 * - Set apps/{appId}.featured.active=true with start/end timestamps
 *
 * TODO (YOU): Create a PRICE (monthly) in Stripe dashboard and configure Checkout.
 */
export const stripeWebhook = onRequest(
  { cors: true },
  async (req, res) => {
    const stripe = new Stripe(STRIPE_SECRET);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK);
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
 * cacheAdminStats — Calculate and cache admin statistics
 * - Runs every hour
 * - Caches results in admin_stats collection
 * - Reduces load on Firestore for admin panel
 */
export const cacheAdminStats = onSchedule(
  { schedule: '0 * * * *', timeZone: 'UTC' },
  async () => {
    try {
      logger.info('Starting admin stats caching...');
      
      // Fetch all collections in parallel
      const [appsSnap, usersSnap, reviewsSnap, interactionsSnap, newsletterSnap, reportsSnap] = await Promise.all([
        db.collection('apps').get(),
        db.collection('users').get(),
        db.collection('reviews').get(),
        db.collection('interactions').get(),
        db.collection('newsletter_subscriptions').get(),
        db.collection('reports').get()
      ]);
      
      // Calculate app statistics
      let appStats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        featured: 0,
        editorChoice: 0
      };
      
      let totalLikes = 0;
      let totalRatings = 0;
      let totalRatingSum = 0;
      
      appsSnap.forEach(doc => {
        const app = doc.data();
        appStats.total++;
        
        if (app.status === 'pending') appStats.pending++;
        else if (app.status === 'approved') appStats.approved++;
        else if (app.status === 'rejected') appStats.rejected++;
        
        if (app.featured?.active) appStats.featured++;
        if (app.editor_pick) appStats.editorChoice++;
        
        totalLikes += Number(app.likes_count || 0);
        totalRatings += Number(app.rating_count || 0);
        totalRatingSum += Number(app.rating_sum || 0);
      });
      
      // User statistics
      const userStats = {
        total: usersSnap.size,
        withFavorites: 0,
        withLists: 0
      };
      
      usersSnap.forEach(doc => {
        const user = doc.data();
        if (user.favorites && user.favorites.length > 0) userStats.withFavorites++;
        if (user.lists && user.lists.length > 0) userStats.withLists++;
      });
      
      // Review statistics
      const reviewStats = {
        total: reviewsSnap.size,
        averageRating: totalRatings > 0 ? (totalRatingSum / totalRatings).toFixed(2) : 0
      };
      
      // Interaction statistics
      const interactionStats = {
        total: interactionsSnap.size,
        uniqueUsers: new Set(interactionsSnap.docs.map(doc => doc.data().uid)).size
      };
      
      // Newsletter statistics
      const newsletterStats = {
        total: newsletterSnap.size,
        recent: newsletterSnap.docs.filter(doc => {
          const data = doc.data();
          const createdAt = data.createdAt?.toDate?.() || new Date(0);
          const daysSince = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return daysSince <= 30;
        }).length
      };
      
      // Report statistics
      const reportStats = {
        total: reportsSnap.size,
        unresolved: reportsSnap.docs.filter(doc => {
          const data = doc.data();
          return !data.resolved;
        }).length
      };
      
      // Firebase connection status
      const firebaseStats = {
        connected: true,
        lastCheck: admin.firestore.Timestamp.now()
      };
      
      // Compile all statistics
      const stats = {
        apps: appStats,
        users: userStats,
        reviews: reviewStats,
        interactions: interactionStats,
        likes: { total: totalLikes },
        newsletter: newsletterStats,
        reports: reportStats,
        firebase: firebaseStats,
        lastUpdated: admin.firestore.Timestamp.now(),
        nextUpdate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 60 * 60 * 1000))
      };
      
      // Save to admin_stats collection
      await db.collection('admin_stats').doc('current').set(stats);
      
      logger.info('Admin stats cached successfully:', stats);
      
    } catch (error) {
      logger.error('Error caching admin stats:', error);
    }
  }
);

/**
 * getAdminStats — Get cached admin statistics
 * - Returns cached stats from admin_stats collection
 * - Admin only
 */
export const getAdminStats = onCall(
  { cors: true },
  async (req) => {
    assertAdmin(req);
    
    try {
      const statsDoc = await db.collection('admin_stats').doc('current').get();
      
      if (!statsDoc.exists) {
        throw new HttpsError('not-found', 'Stats not cached yet. Wait for next hourly update.');
      }
      
      return { ok: true, stats: statsDoc.data() };
      
    } catch (error) {
      logger.error('Error getting admin stats:', error);
      throw new HttpsError('internal', 'Failed to get admin stats');
    }
  }
);

/**
 * getNewsletterSubscriptions — Get newsletter subscriptions for admin
 * - Returns all newsletter subscriptions
 * - Admin only
 */
export const getNewsletterSubscriptions = onCall(
  { cors: true },
  async (req) => {
    assertAdmin(req);
    
    try {
      const subscriptionsSnap = await db.collection('newsletter_subscriptions')
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
      
      const subscriptions = subscriptionsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.().toISOString?.() || null
      }));
      
      return { ok: true, subscriptions };
      
    } catch (error) {
      logger.error('Error getting newsletter subscriptions:', error);
      throw new HttpsError('internal', 'Failed to get newsletter subscriptions');
    }
  }
);

/**
 * getReports — Get user reports for admin
 * - Returns all reports with optional filter
 * - Admin only
 */
export const getReports = onCall(
  { cors: true },
  async (req) => {
    assertAdmin(req);
    
    const { resolved } = req.data || {};
    
    try {
      let query = db.collection('reports').orderBy('createdAt', 'desc').limit(100);
      
      if (resolved !== undefined) {
        query = query.where('resolved', '==', Boolean(resolved));
      }
      
      const reportsSnap = await query.get();
      
      const reports = reportsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.().toISOString?.() || null
      }));
      
      return { ok: true, reports };
      
    } catch (error) {
      logger.error('Error getting reports:', error);
      throw new HttpsError('internal', 'Failed to get reports');
    }
  }
);

/**
 * markReportResolved — Mark a report as resolved
 * - Admin only
 */
export const markReportResolved = onCall(
  { cors: true },
  async (req) => {
    assertAdmin(req);
    
    const { reportId, resolved } = req.data || {};
    
    if (!reportId) {
      throw new HttpsError('invalid-argument', 'Missing reportId');
    }
    
    try {
      await db.collection('reports').doc(reportId).update({
        resolved: Boolean(resolved),
        resolvedAt: admin.firestore.FieldValue.serverTimestamp(),
        resolvedBy: req.auth.uid
      });
      
      return { ok: true };
      
    } catch (error) {
      logger.error('Error marking report resolved:', error);
      throw new HttpsError('internal', 'Failed to mark report resolved');
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
  { schedule: '0 8 * * 0', timeZone: 'UTC' },
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

      const provider = (NEWSLETTER_PROVIDER || '').toLowerCase();
      if (provider === 'buttondown') {
        const resp = await fetch('https://api.buttondown.email/v1/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${BUTTONDOWN_API_KEY}`
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
 * processImage - Cloud Function for automatic image processing
 * Creates optimized versions of uploaded images
 */
export const processImage = onRequest(
  { secrets: [], cors: true },
  async (req, res) => {
    try {
      const { imageUrl, appId, type = 'screenshot' } = req.body;
      
      if (!imageUrl || !appId) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      logger.info(`Processing image: ${imageUrl} for app: ${appId}`);
      
      // Download original image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      
      const imageBuffer = await response.buffer();
      
      // Define sizes based on type
      const sizes = type === 'icon' 
        ? [{ size: 512, name: 'large' }, { size: 256, name: 'medium' }, { size: 128, name: 'small' }]
        : [{ size: 1920, name: 'large' }, { size: 1024, name: 'medium' }, { size: 512, name: 'small' }];
      
      const processedImages = {};
      
      // Process each size
      for (const { size, name } of sizes) {
        try {
          const processedBuffer = await sharp(imageBuffer)
            .resize(size, size, { 
              fit: 'inside',
              withoutEnlargement: true 
            })
            .jpeg({ quality: 85 })
            .toBuffer();
          
          // Upload to Storage
          const fileName = `processed/${appId}/${type}_${name}_${Date.now()}.jpg`;
          const bucket = admin.storage().bucket();
          const file = bucket.file(fileName);
          
          await file.save(processedBuffer, {
            metadata: {
              contentType: 'image/jpeg',
              cacheControl: 'public, max-age=31536000'
            }
          });
          
          // Make public and get URL
          await file.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          processedImages[name] = {
            size,
            url: publicUrl,
            width: size,
            height: size
          };
          
          logger.info(`Created ${name} version: ${publicUrl}`);
          
        } catch (sizeError) {
          logger.error(`Error processing ${name} size:`, sizeError);
        }
      }
      
      // Update Firestore with processed image URLs
      if (Object.keys(processedImages).length > 0) {
        const appRef = db.collection('apps').doc(appId);
        await appRef.update({
          [`processedImages_${type}`]: processedImages,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        logger.info(`Updated Firestore for app ${appId} with processed images`);
      }
      
      res.json({ 
        success: true, 
        message: 'Image processing completed',
        processedImages,
        original: imageUrl
      });
      
    } catch (error) {
      logger.error('processImage error:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  }
);

/**
 * generateThumbnail - Generate optimized thumbnails for images
 * Callable function for manual thumbnail generation
 */
export const generateThumbnail = onCall(
  { cors: true },
  async (req) => {
    try {
      const { imageUrl, sizes = [512, 256, 128], appId } = req.data || {};
      
      if (!imageUrl) {
        throw new HttpsError('invalid-argument', 'Missing imageUrl');
      }
      
      logger.info(`Generating thumbnails for: ${imageUrl}`);
      
      // Download original image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      
      const imageBuffer = await response.buffer();
      const thumbnails = [];
      
      // Generate thumbnails for each size
      for (const size of sizes) {
        try {
          const thumbnailBuffer = await sharp(imageBuffer)
            .resize(size, size, { 
              fit: 'cover',
              position: 'center'
            })
            .jpeg({ quality: 80 })
            .toBuffer();
          
          // Upload to Storage
          const fileName = `thumbnails/${appId || 'temp'}/thumb_${size}_${Date.now()}.jpg`;
          const bucket = admin.storage().bucket();
          const file = bucket.file(fileName);
          
          await file.save(thumbnailBuffer, {
            metadata: {
              contentType: 'image/jpeg',
              cacheControl: 'public, max-age=31536000'
            }
          });
          
          // Make public and get URL
          await file.makePublic();
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
          
          thumbnails.push({
            size,
            url: publicUrl,
            width: size,
            height: size
          });
          
          logger.info(`Created thumbnail ${size}x${size}: ${publicUrl}`);
          
        } catch (sizeError) {
          logger.error(`Error creating thumbnail ${size}:`, sizeError);
        }
      }
      
      return { 
        ok: true, 
        thumbnails,
        original: imageUrl
      };
      
    } catch (error) {
      logger.error('generateThumbnail error:', error);
      throw new HttpsError('internal', 'Failed to generate thumbnails');
    }
  }
);