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
