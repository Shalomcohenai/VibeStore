/**
 * Simple Firestore connection test
 */

// Test Firestore connection
async function testFirestoreConnection() {
  try {

    // Wait for Firebase to initialize
    const waitForFirebase = window.waitForFirebase;

    const { db, storeMod, auth, authMod } = await waitForFirebase();
    const { collection, getDocs, doc, getDoc } = storeMod;

    // Test auth state
    authMod.onAuthStateChanged(auth, async (user) => {
      if (user) {

        try {
          // Test reading from apps collection (should work for everyone)
          const appsSnapshot = await getDocs(collection(db, 'apps'));

          // Test reading user document
          const userDoc = await getDoc(doc(db, 'users', user.uid));

          if (userDoc.exists()) {
          }

        } catch (error) {
          console.error('❌ Firestore test failed:', error);

          // Check if it's a permission error
          if (error.code === 'permission-denied') {
            console.error('🚫 Permission denied - check Firestore rules');
          } else if (error.code === 'unavailable') {
            console.error('📡 Firestore unavailable - check network connection');
          }
        }
      } else {
      }
    });

  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
}

// Run test when page loads
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(testFirestoreConnection, 2000); // Wait 2 seconds for Firebase to initialize
});

