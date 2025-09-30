// Firebase client bootstrap
// TODO: Fill with your Firebase config values from the console.
const firebaseConfig = {
  apiKey:            "AIzaSyCpzqQ4eKeLej8BeN2ly7lOspkx5nnEttE",
  authDomain:        "vibestore-7af1e.firebaseapp.com",
  projectId:         "vibestore-7af1e",
  storageBucket:     "vibestore-7af1e.firebasestorage.app",
  messagingSenderId: "282481643143",
  appId:             "1:282481643143:web:a7ab34bfe49766eec43222",
  measurementId:     "G-59FYNPQGEP"
};

// Initialize when page loads
(async function(){
  // Lazy-load Firebase SDKs (ESM via gstatic)
  const appMod     = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js');
  const authMod    = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js');
  const storeMod   = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js');
  const storageMod = await import('https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js');

  const app     = appMod.initializeApp(firebaseConfig);
  const auth    = authMod.getAuth(app);
  const db      = storeMod.getFirestore(app);
  const storage = storageMod.getStorage(app);

  // Expose minimal helpers on window (for prototyping)
  window.$fb = { app, auth, db, storage, authMod, storeMod, storageMod };

  // Global waitForFirebase function - used by all modules
  window.waitForFirebase = () => new Promise(resolve => {
    const check = () => {
      if (window.$fb && window.$fb.auth && window.$fb.db) {
        resolve(window.$fb);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });

  // Global auth state management handled in app.js
  // This ensures consistent behavior across all pages

  console.log('Firebase initialized (client). Fill firebaseConfig with your keys.');
})();
