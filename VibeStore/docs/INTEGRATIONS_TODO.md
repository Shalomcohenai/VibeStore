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
