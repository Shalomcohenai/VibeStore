/**
 * Simple Firestore connection test
 */

// Test Firestore connection
async function testFirestoreConnection() {
  try {
    console.log('🧪 Testing Firestore connection...');
    
    // Wait for Firebase to initialize
    const waitForFirebase = window.waitForFirebase;
    
    const { db, storeMod, auth, authMod } = await waitForFirebase();
    const { collection, getDocs, doc, getDoc } = storeMod;
    
    console.log('✅ Firebase SDK loaded');
    
    // Test auth state
    authMod.onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('✅ User authenticated:', user.email);
        
        try {
          // Test reading from apps collection (should work for everyone)
          console.log('🧪 Testing apps collection read...');
          const appsSnapshot = await getDocs(collection(db, 'apps'));
          console.log('✅ Apps collection accessible, docs:', appsSnapshot.size);
          
          // Test reading user document
          console.log('🧪 Testing user document read...');
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          console.log('✅ User document accessible, exists:', userDoc.exists());
          
          if (userDoc.exists()) {
            console.log('📄 User data:', userDoc.data());
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
        console.log('❌ User not authenticated');
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

console.log('🧪 Firestore test script loaded');
