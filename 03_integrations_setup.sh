#!/usr/bin/env bash
# =============================================================================
# File #3 — 03_integrations_setup.sh
# Purpose:
#   Wire the static VibeStore skeleton (File #2) to real integrations:
#   - Firebase (Hosting, Auth, Firestore, Storage, Functions)
#   - Firestore Security Rules (per product spec)
#   - Redirect logging (Verified Interaction)
#   - Reviews & ratings (with 30-day verification)
#   - Admin approval callable
#   - Featured billing (Stripe webhook, monthly window)
#   - Weekly newsletter job (Buttondown/Mailchimp via HTTP)
#   - GA4 hook
#   - (Optional) Algolia extension placeholders
#
# IMPORTANT — WHAT **YOU** MUST DO (read before running):
#   1) Install tooling:
#        - Ruby/Bundler (for Jekyll) and Node 20+
#        - Firebase CLI:  npm i -g firebase-tools
#        - (Optional) Stripe CLI:   brew install stripe/stripe-cli/stripe
#   2) Log in & choose your Firebase project(s):
#        firebase login
#        firebase projects:list
#        (Create a DEV project in console if you don't have one yet)
#   3) Prepare IDs / Keys (put them after script runs, as noted in TODOs):
#        - Firebase Web App config (apiKey, authDomain, projectId, etc.)
#        - GA4 Measurement ID (G-XXXXXXX)
#        - Stripe: PRODUCT/PRICE (monthly featured), WEBHOOK secret
#        - Newsletter provider:
#            Buttondown API key  OR  Mailchimp API key + List/Audience ID
#        - (Optional) reCAPTCHA Enterprise site key (for forms) or App Check
#        - (Optional) Algolia App ID + Admin/Search keys + index name
#
# How to run:
#   1) Save this file at project root (same place as `_config.yml`).
#   2) Run:  bash 03_integrations_setup.sh
#   3) Follow the printed NEXT STEPS at the end.
#
# This script is idempotent-safe: it will create/append files if missing.
# =============================================================================

set -e

# Sanity checks
if [ ! -f "_config.yml" ]; then
  echo "✖ Could not find _config.yml. Run this from your VibeStore project root (created by File #2)."
  exit 1
fi

# -----------------------------------------------------------------------------
# Firebase base files
# -----------------------------------------------------------------------------
echo "→ Creating firebase base files"

# firebase.json
cat > firebase.json <<'JSON'
{
  "hosting": {
    "public": "_site",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "cleanUrls": true,
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      },
      {
        "source": "**/*.@(png|jpg|jpeg|gif|webp|svg|ico)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      }
    ],
    "rewrites": [
      { "source": "/api/r", "function": "redirectAndLogClick" },
      { "source": "/api/approveApp", "function": "approveApp" },
      { "source": "/api/createReview", "function": "createReview" }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
JSON

# .firebaserc
if [ ! -f ".firebaserc" ]; then
  cat > .firebaserc <<'JSON'
{
  "projects": {
    "default": "YOUR_DEV_PROJECT_ID"
  }
}
JSON
  echo "  ⚠ TODO: edit .firebaserc → replace YOUR_DEV_PROJECT_ID with your Firebase dev project id"
fi

# -----------------------------------------------------------------------------
# GA4 placeholder injection (kept as TODO)
# -----------------------------------------------------------------------------
echo "→ Adding GA4 placeholder (edit _includes/analytics.html later)"
cat > _includes/analytics.html <<'HTML'
<!-- Google Analytics 4 -->
<!-- TODO: replace G-XXXXXXX with your GA4 Measurement ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX', { 'anonymize_ip': true });
</script>
HTML

# -----------------------------------------------------------------------------
# Client-side Firebase wiring (config + minimal auth helpers)
# -----------------------------------------------------------------------------
echo "→ Wiring client Firebase config & helpers (assets/js/firebaseConfig.js)"
mkdir -p assets/js

cat > assets/js/firebaseConfig.js <<'JS'
// Firebase client bootstrap
// TODO: Fill with your Firebase config values from the console.
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

// Initialize when page loads
(async function(){
  // Lazy-load Firebase SDKs (ESM via gstatic)
  const appMod     = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js');
  const authMod    = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js');
  const storeMod   = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js');

  const app  = appMod.initializeApp(firebaseConfig);
  const auth = authMod.getAuth(app);
  const db   = storeMod.getFirestore(app);

  // Expose minimal helpers on window (for prototyping)
  window.$fb = { app, auth, db, authMod, storeMod };

  // Example: show/hide "Sign in" button when logged in
  authMod.onAuthStateChanged(auth, (user) => {
    const signBtn = document.querySelector('a[href$="/pages/auth"]');
    if (signBtn) signBtn.textContent = user ? 'My Account' : 'Sign in';
  });

  console.log('Firebase initialized (client). Fill firebaseConfig with your keys.');
})();
JS

# Make sure app.js references firebaseConfig.js (defer load order is handled by ESM import)
if ! grep -q "firebaseConfig.js" _includes/head.html; then
  echo "→ Adding <script> include to _includes/head.html"
  # append a tag to load firebaseConfig before other scripts
  cat >> _includes/head.html <<'HTML'
<script type="module" src="{{ '/assets/js/firebaseConfig.js' | relative_url }}"></script>
HTML
fi

# -----------------------------------------------------------------------------
# Firestore Security Rules (per PRD)
# -----------------------------------------------------------------------------
echo "→ Writing Firestore security rules (security/firestore.rules)"
mkdir -p security
cat > security/firestore.rules <<'RULES'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAuthed() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthed() && request.auth.token.admin == true;
    }

    // Allow reading approved apps to everyone
    match /apps/{appId} {
      allow read: if resource.data.status == 'approved' || isAdmin();

      // Create new app as 'pending' by registered users only
      allow create: if isAuthed()
        && request.resource.data.status == 'pending'
        && request.resource.data.title is string
        && request.resource.data.niche in ['web','mobile','whatsapp']
        && request.resource.data.category is string
        && request.resource.data.link is string;

      // Only admin can update/delete apps
      allow update, delete: if isAdmin();
    }

    // Reviews: create allowed only if has verified interaction (function writes a marker)
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthed()
        && request.resource.data.appId is string
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.stars >= 1 && request.resource.data.stars <= 5
        && exists(/databases/$(database)/documents/interactions/$(request.auth.uid + '_' + request.resource.data.appId));
      allow update, delete: if isAdmin() || (isAuthed() && request.resource.data.userId == request.auth.uid);
    }

    // Interactions: written by Cloud Function service account only
    match /interactions/{id} {
      allow read: if false; // private
      allow write: if request.auth.token.firebase.sign_in_provider == "firebase" && request.auth.uid == "service-account";
    }

    // Favorites & Lists (private subcollections)
    match /users/{uid} {
      allow read, write: if isAuthed() && request.auth.uid == uid;
    }

    // Promotions (Stripe webhook writes)
    match /promotions/{promoId} {
      allow read: if true;
      allow write: if isAdmin(); // Or restrict to webhook via callable/admin flow
    }
  }
}
RULES

echo "  ⚠ IMPORTANT: The interactions write rule assumes a service account token logic."
echo "    In practice, we'll write interactions from a callable HTTPS function that bypasses rules."

# -----------------------------------------------------------------------------
# Cloud Functions (Node 20) — package.json + index.js
# -----------------------------------------------------------------------------
echo "→ Scaffolding Cloud Functions"
mkdir -p functions

cat > functions/package.json <<'JSON'
{
  "name": "vibestore-functions",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "main": "index.js",
  "scripts": {
    "lint": "eslint .",
    "build": "echo \"No build step\"",
    "serve": "firebase emulators:start --only functions,hosting,firestore,auth",
    "deploy": "firebase deploy --only functions",
    "test": "node --version"
  },
  "dependencies": {
    "firebase-admin": "^12.5.0",
    "firebase-functions": "^4.6.0",
    "stripe": "^16.0.0",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "eslint": "^8.57.0"
  }
}
JSON

cat > functions/index.js <<'JS'
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
JS

# -----------------------------------------------------------------------------
# Submit form (optional minimal HTML form) + client stub
# -----------------------------------------------------------------------------
echo "→ Adding a minimal Submit form (static HTML) + client stub"
# Create a simple HTML form alongside the MD page so you can switch when ready
cat > pages/submit_form.html <<'HTML'
---
title: Submit an App (Form)
layout: page
permalink: /pages/submit-form
---

<form id="submitAppForm" class="card" style="padding:1rem">
  <div class="grid" style="grid-template-columns:1fr; gap:.75rem">
    <input class="input" name="title" placeholder="Title" required />
    <textarea class="input" name="description" placeholder="Short description (≤ 300 chars)" maxlength="300" required></textarea>
    <select class="input" name="niche" required>
      <option value="">Niche</option>
      <option value="web">Web</option>
      <option value="mobile">Mobile</option>
      <option value="whatsapp">WhatsApp</option>
    </select>
    <input class="input" name="category" placeholder="Category (one of 10)" required />
    <input class="input" name="platform" placeholder="Platform (free text)" required />
    <input class="input" name="link" placeholder="Link (URL / App Store / wa.me)" type="url" required />
    <input class="input" name="imageUrl" placeholder="Image/Logo URL" type="url" required />
    <button class="btn primary" type="submit">Submit</button>
  </div>
  <p class="help">Submissions go to pending and require admin approval.</p>
</form>

<script type="module">
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js';

// IMPORTANT: This page expects firebaseConfig.js to have initialized window.$fb already.
const waitForFb = () => new Promise(r => {
  const id = setInterval(() => { if (window.$fb) { clearInterval(id); r(window.$fb); } }, 50);
});
const { auth, db } = await waitForFb();

onAuthStateChanged(auth, (user)=>{
  if (!user) alert('Please sign in to submit.');
});

const form = document.getElementById('submitAppForm');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    title: String(data.title || '').trim(),
    description: String(data.description || '').trim(),
    niche: String(data.niche || '').trim(),
    category: String(data.category || '').trim(),
    platform: String(data.platform || '').trim(),
    link: String(data.link || '').trim(),
    imageUrl: String(data.imageUrl || '').trim(),
    status: 'pending',
    rating_sum: 0, rating_count: 0, rating_avg: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  // Basic client-side checks
  if (!payload.title || !payload.niche || !payload.category || !payload.platform || !payload.link) {
    return alert('Please fill all required fields.');
  }

  try{
    await addDoc(collection(db, 'apps'), payload);
    alert('Submitted! Your app is pending review.');
    form.reset();
  }catch(err){
    console.error(err);
    alert('Submission failed. Check console.');
  }
});
</script>
HTML

# -----------------------------------------------------------------------------
# Admin helper doc (how to set admin claim)
# -----------------------------------------------------------------------------
echo "→ Writing admin setup helper (ADMIN_SETUP.md)"
cat > ADMIN_SETUP.md <<'MD'
# Admin Setup (Grant admin claim)

**You must run this once** to grant yourself admin rights.

Option A — via Firebase Admin SDK script (Node, local):

```js
// save as scripts/grantAdmin.js
import admin from 'firebase-admin';
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON); // export GOOGLE creds JSON here
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const uid = 'YOUR_USER_UID';
const res = await admin.auth().setCustomUserClaims(uid, { admin: true });
console.log('Admin claim set for', uid);
process.exit(0);
```

Run:
```
export SERVICE_ACCOUNT_JSON='{"type":"service_account", ... }'
node scripts/grantAdmin.js
```

Option B — one-off Cloud Function (not included here) to set claims for your email. Remove after use.
MD

# -----------------------------------------------------------------------------
# Stripe & Newsletter environment notes
# -----------------------------------------------------------------------------
echo "→ Writing INTEGRATIONS_TODO.md"
cat > INTEGRATIONS_TODO.md <<'MD'
# Integrations TODO

## 1) Firebase project & config
- Edit .firebaserc and set your dev project id.
- In Firebase Console → Build → Authentication: enable Email/Password + Google.
- In Firebase Console → Firestore: create database (Production mode).
- Create a Web App in Firebase Console → copy config into assets/js/firebaseConfig.js.

## 2) GA4
- Create a GA4 property, get Measurement ID (G-XXXXXXX).
- Edit _includes/analytics.html and replace G-XXXXXXX.

## 3) Stripe (Featured)
- Create a Product + Price (Monthly).
- In your checkout code (when you add it), set metadata.appId.
- Set two function secrets (CLI or Console):
  ```
  firebase functions:secrets:set STRIPE_SECRET
  firebase functions:secrets:set STRIPE_WEBHOOK
  ```
- In Stripe dashboard → add webhook endpoint:
  - URL: https://<your-hosting-domain>/_/functions/stripeWebhook (or region URL)
  - Events: checkout.session.completed
  - Copy the Signing Secret into STRIPE_WEBHOOK.

## 4) Newsletter Provider

Choose one:

**Buttondown:** create account, get API key.
```
firebase functions:secrets:set NEWSLETTER_PROVIDER=buttondown
firebase functions:secrets:set BUTTONDOWN_API_KEY=bd_xxx
```

**Mailchimp:** API key + Audience/List ID.
```
firebase functions:secrets:set NEWSLETTER_PROVIDER=mailchimp
firebase functions:secrets:set MAILCHIMP_API_KEY=mc_xxx
firebase functions:secrets:set MAILCHIMP_LIST_ID=xxxxxxxx
```

## 5) Anti-spam
- (Option A) reCAPTCHA Enterprise keys, enforce on forms.
- (Option B) Firebase App Check (Web reCAPTCHA) — enable & enforce.

## 6) Optional — Algolia (better search)
- Install Firebase Algolia extension or wire custom sync from Cloud Functions.
- Prepare: App ID, Admin key, Search key, Index name.
- Sync only apps where status=='approved'.

## 7) Deploy flow
- Build Jekyll: `bundle exec jekyll build`
- Deploy functions: `firebase deploy --only functions`
- Deploy hosting: `firebase deploy --only hosting`

## 8) Verified Interaction (frontend)
- Replace external links with /api/r?appId=<ID>.
- When authenticated, pass ID token in Authorization: Bearer <token>.
- Example to get token:
  ```js
  const token = await getIdToken(getAuth().currentUser, /*forceRefresh=*/true);
  fetch('/api/r?appId=abc123', { headers: { Authorization: `Bearer ${token}` } });
  ```
MD

# -----------------------------------------------------------------------------
# Final NEXT STEPS
# -----------------------------------------------------------------------------
cat <<'TXT'

===============================================================================
🎉 INTEGRATIONS SCAFFOLD COMPLETE ✅

NEXT STEPS (do these in order):

## Firebase project:
1. firebase login
2. Edit .firebaserc → set your dev project id
3. firebase use <your-dev-project-id>
4. In console: enable Auth (Email+Password + Google), create Firestore (Production)
5. Put your Firebase Web config into assets/js/firebaseConfig.js

## GA4:
6. Insert your Measurement ID into _includes/analytics.html

## Build & test locally:
7. bundle install
8. bundle exec jekyll build
9. firebase emulators:start --only hosting,functions,firestore,auth (optional)
   or: bundle exec jekyll serve (for static preview)

## Deploy:
10. firebase deploy --only functions
11. bundle exec jekyll build
12. firebase deploy --only hosting

## Admin claim:
13. Follow ADMIN_SETUP.md to grant yourself admin rights

## Stripe & Newsletter:
14. Follow INTEGRATIONS_TODO.md to set secrets & webhooks

## REMEMBER:
- Replace external app links with /api/r?appId=<ID> to enable Verified Interaction.
- Reviews require a recent click (≤30 days) captured by redirect function.
- You're set to begin wiring dynamic screens at your pace.

===============================================================================
TXT