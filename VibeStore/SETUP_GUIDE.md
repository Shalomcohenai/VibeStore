# VibeStore Setup Guide 🚀

This guide will help you set up and run the **VibeStore** project locally and deploy it to Firebase.

## 📋 Prerequisites

Before starting, ensure you have:

- **Ruby** ≥ 3.0.0 (for Jekyll)
- **Bundler** (Ruby package manager)
- **Node.js** ≥ 20 (for Firebase Functions)
- **npm** (comes with Node.js)
- **Git** (for version control)

## 🏁 Quick Start

### 1. Install Dependencies

```bash
# Install Ruby gems locally
bundle config set --local path vendor/bundle
bundle install

# Install Node.js dependencies
npm install
cd functions && npm install && cd ..
```

### 2. Run Static Site Locally

```bash
# Start Jekyll development server
npm run dev
# OR: bundle exec jekyll serve --port 4000

# Site will be available at: http://localhost:4000
```

### 3. Build Static Site

```bash
npm run build
# OR: bundle exec jekyll build
```

## 🔥 Firebase Setup

### Step 1: Firebase Project Creation

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (choose any name, e.g., "vibestore-dev")
3. Enable **Google Analytics** (optional but recommended)

### Step 2: Firebase CLI Authentication

```bash
# Login to Firebase
npm run firebase:login
# OR: npx firebase login
```

### Step 3: Configure Project

1. **Edit `.firebaserc`:**
   ```json
   {
     "projects": {
       "default": "your-project-id-here"
     }
   }
   ```

2. **Get Firebase Web App Configuration:**
   - In Firebase Console → Project Settings → General
   - Scroll to "Your apps" → Add Web App
   - Copy the config object

3. **Edit `assets/js/firebaseConfig.js`:**
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

### Step 4: Enable Firebase Services

**In Firebase Console:**

1. **Authentication:**
   - Go to Authentication → Sign-in method
   - Enable **Email/Password** and **Google** providers

2. **Firestore Database:**
   - Go to Firestore Database → Create database
   - Choose **Production mode**
   - Select a location (closest to your users)

3. **Storage:**
   - Go to Storage → Get started
   - Use default security rules for now

### Step 5: Deploy Security Rules

```bash
# Deploy Firestore security rules
npx firebase deploy --only firestore:rules
```

### Step 6: Deploy Functions

```bash
# Deploy Cloud Functions
npm run firebase:deploy:functions
# OR: npx firebase deploy --only functions
```

### Step 7: Deploy Hosting

```bash
# Build and deploy to Firebase Hosting
npm run firebase:deploy:hosting
# OR: npm run firebase:deploy (deploys everything)
```

## 🔧 Development Workflow

### Local Development

```bash
# Start Jekyll dev server
npm run dev

# In another terminal, start Firebase emulators (optional)
npm run firebase:serve
```

### Testing with Emulators

```bash
# Start Firebase emulators (includes Firestore, Auth, Functions, Hosting)
npm run firebase:serve

# This will:
# 1. Build Jekyll site
# 2. Start emulators for all services
# 3. Host the site locally with Firebase integration
```

### Deployment

```bash
# Deploy functions only
npm run firebase:deploy:functions

# Deploy hosting only
npm run firebase:deploy:hosting

# Deploy everything
npm run firebase:deploy
```

## 👨‍💼 Admin Setup

### Set Admin Claims

You need to grant admin privileges to your user account:

1. **Find your User UID:**
   - Login to your app
   - Go to Firebase Console → Authentication → Users
   - Copy your UID

2. **Create admin script:**
   ```bash
   mkdir scripts
   ```

3. **Create `scripts/grantAdmin.js`:**
   ```javascript
   import admin from 'firebase-admin';
   
   // Download service account key from Firebase Console → Project Settings → Service Accounts
   const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
   
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
   });
   
   const uid = 'YOUR_USER_UID_HERE'; // Replace with your UID
   await admin.auth().setCustomUserClaims(uid, { admin: true });
   console.log('Admin claim set for', uid);
   process.exit(0);
   ```

4. **Run the script:**
   ```bash
   # Set service account JSON as environment variable
   export SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
   
   # Run the script
   node scripts/grantAdmin.js
   ```

## 📊 Analytics Setup

### Google Analytics 4

1. Create a GA4 property
2. Get your Measurement ID (G-XXXXXXX)
3. Edit `_includes/analytics.html` and replace `G-XXXXXXX` with your ID

## 💳 Stripe Integration (Optional)

See `INTEGRATIONS_TODO.md` for detailed Stripe setup instructions.

## 📧 Newsletter Setup (Optional)

### Buttondown

1. Create account at [Buttondown](https://buttondown.email/)
2. Get API key
3. Set Firebase secret:
   ```bash
   npx firebase functions:secrets:set NEWSLETTER_PROVIDER=buttondown
   npx firebase functions:secrets:set BUTTONDOWN_API_KEY=your_api_key
   ```

### Mailchimp

1. Create account at [Mailchimp](https://mailchimp.com/)
2. Get API key and List ID
3. Set Firebase secrets:
   ```bash
   npx firebase functions:secrets:set NEWSLETTER_PROVIDER=mailchimp
   npx firebase functions:secrets:set MAILCHIMP_API_KEY=your_api_key
   npx firebase functions:secrets:set MAILCHIMP_LIST_ID=your_list_id
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Permission errors with Ruby gems:**
   ```bash
   bundle config set --local path vendor/bundle
   bundle install
   ```

2. **Firebase CLI not found:**
   ```bash
   npm install firebase-tools
   npx firebase --version
   ```

3. **Jekyll build fails:**
   ```bash
   bundle update
   bundle exec jekyll build --verbose
   ```

4. **Functions deployment fails:**
   ```bash
   cd functions
   npm install
   cd ..
   npx firebase deploy --only functions --debug
   ```

### Getting Help

- Check `INTEGRATIONS_TODO.md` for integration-specific setup
- Review `ADMIN_SETUP.md` for admin user setup
- Check Firebase Console for error logs
- Ensure all required services are enabled in Firebase

## 🎯 Next Steps

1. **Test the complete flow:**
   - Register a user
   - Submit an app
   - Admin approve it
   - Test reviews and favorites

2. **Customize the design:**
   - Edit `assets/css/main.css`
   - Modify layouts in `_layouts/`
   - Update content in `pages/`

3. **Add real content:**
   - Replace sample apps in `_data/sample_apps.json`
   - Update terms and privacy pages
   - Configure email settings

4. **Production considerations:**
   - Set up monitoring and alerts
   - Configure backup strategies
   - Set up CI/CD pipeline
   - Enable security features (reCAPTCHA, App Check)

---

**Congratulations!** 🎉 Your VibeStore is now ready to discover and showcase amazing no-code applications!
