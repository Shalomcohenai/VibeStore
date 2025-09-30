/**
 * VibeStore - Favorites Management
 * This module handles adding/removing favorites across the site
 */

// Wait for Firebase to initialize
const waitForFirebase = () => {
  return new Promise(resolve => {
    const check = () => {
      if (window.waitForFirebase) {
        resolve(window.waitForFirebase());
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

// Create review function (client-side, no Cloud Functions needed)
async function createReview(appId, stars, text = '') {
  if (!currentUser) {
    alert('Please sign in to create reviews');
    return false;
  }
  
  try {
    const { db, storeMod } = await waitForFirebase();
    const { collection, addDoc, doc, updateDoc, getDoc, runTransaction } = storeMod;
    
    // Create review document
    const reviewRef = await addDoc(collection(db, 'reviews'), {
      appId: appId,
      userId: currentUser.uid,
      stars: stars,
      text: text,
      createdAt: new Date()
    });
    
    // Update app aggregates
    const appRef = doc(db, 'apps', appId);
    await runTransaction(db, async (transaction) => {
      const appSnap = await transaction.get(appRef);
      if (!appSnap.exists()) {
        throw new Error('App not found');
      }
      
      const appData = appSnap.data();
      const ratingCount = (appData.rating_count || 0) + 1;
      const ratingSum = (appData.rating_sum || 0) + stars;
      const ratingAvg = Math.round((ratingSum / ratingCount) * 10) / 10;
      
      transaction.update(appRef, {
        rating_count: ratingCount,
        rating_sum: ratingSum,
        rating_avg: ratingAvg,
        updatedAt: new Date()
      });
    });
    
    console.log('Review created successfully');
    return true;
  } catch (error) {
    console.error('Error creating review:', error);
    alert('Error creating review: ' + error.message);
    return false;
  }
}

// Get current user
let currentUser = null;

// Local cache for better performance
let favoritesCache = null;
let likesCountCache = new Map();

// Export functions
window.VibeStoreFavorites = {
  initializeFavorites,
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  isAppFavorited,
  updateFavoriteButtons,
  updateLikesCounters,
  updateLikesCountOptimistic,
  createFavoriteButton,
  initializeFavoriteButtons,
  getAppLikesCount,
  incrementAppLikes,
  createReview,
  // Cache functions for debugging
  getFavoritesCache: () => favoritesCache,
  clearFavoritesCache: () => { favoritesCache = null; },
  getLikesCountCache: () => likesCountCache,
  clearLikesCountCache: () => { likesCountCache.clear(); },
  
  // Public API for manual cleanup (can be called from console or admin panel)
  cleanupOrphanedFavorites: async function() {
    if (!currentUser) {
      console.log('No user logged in');
      return;
    }
    
    console.log('Starting manual cleanup of orphaned favorites...');
    const result = await cleanupOrphanedFavorites(currentUser.uid);
    console.log('Cleanup completed:', result);
    
    // Refresh the UI
    await refreshFavoritesUI();
    
    return result;
  },
  
  // Public API for checking if app exists
  appExists: async function(appId) {
    return await appExists(appId);
  }
};

// Initialize favorites system
async function initializeFavorites() {
  try {
    const { auth, authMod } = await waitForFirebase();
    
    authMod.onAuthStateChanged(auth, (user) => {
      currentUser = user;
      updateFavoriteButtons();
    });
    
  } catch (error) {
    console.error('Error initializing favorites:', error);
  }
}

// Check if app exists in Firestore
async function appExists(appId) {
  const { db, storeMod } = await waitForFirebase();
  const { doc, getDoc } = storeMod;
  
  try {
    const appDoc = await getDoc(doc(db, 'apps', appId));
    return appDoc.exists();
  } catch (error) {
    console.error('Error checking if app exists:', error);
    return false;
  }
}

// Clean up orphaned favorites (remove apps that no longer exist)
async function cleanupOrphanedFavorites(uid) {
  const { db, storeMod } = await waitForFirebase();
  const { doc, getDoc, setDoc } = storeMod;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const favorites = userData.favorites || [];
    
    if (favorites.length === 0) return;
    
    console.log('Checking for orphaned favorites...');
    const validFavorites = [];
    const orphanedFavorites = [];
    
    // Check each favorite app
    for (const appId of favorites) {
      const exists = await appExists(appId);
      if (exists) {
        validFavorites.push(appId);
      } else {
        orphanedFavorites.push(appId);
        console.warn('Removing orphaned favorite:', appId);
      }
    }
    
    // Update user data if orphaned favorites were found
    if (orphanedFavorites.length > 0) {
      console.log(`Cleaned up ${orphanedFavorites.length} orphaned favorites:`, orphanedFavorites);
      await setDoc(doc(db, 'users', uid), {
        ...userData,
        favorites: validFavorites,
        updatedAt: new Date()
      }, { merge: true });
      
      // Orphaned favorites cleaned up successfully
    }
    
    return { validFavorites, orphanedFavorites };
  } catch (error) {
    console.error('Error cleaning up orphaned favorites:', error);
    return { validFavorites: [], orphanedFavorites: [] };
  }
}

// Get user data from Firestore
async function getUserData(uid) {
  const { db, storeMod } = await waitForFirebase();
  const { doc, getDoc, setDoc } = storeMod;
  
  console.log('Getting user data for UID:', uid);
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('Found existing user data:', userData);
      
      // Clean up orphaned favorites on first load
      if (userData.favorites && userData.favorites.length > 0) {
        await cleanupOrphanedFavorites(uid);
      }
      
      return userData;
    } else {
      console.log('User document does not exist, creating new one');
      // Create user document if it doesn't exist
      const userData = {
        uid: uid,
        email: currentUser.email,
        displayName: currentUser.displayName || currentUser.email.split('@')[0],
        favorites: [],
        lists: [],
        createdAt: new Date()
      };
      console.log('Creating user document with data:', userData);
      await setDoc(doc(db, 'users', uid), userData);
      console.log('User document created successfully');
      return userData;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    console.error('Error details:', error.message, error.code);
    return null;
  }
}

// Update user data in Firestore
async function updateUserData(uid, data) {
  const { db, storeMod } = await waitForFirebase();
  const { doc, updateDoc } = storeMod;
  
  console.log('Updating user data for UID:', uid, 'with data:', data);
  
  try {
    await updateDoc(doc(db, 'users', uid), data);
    console.log('User data updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    console.error('Error details:', error.message, error.code);
    return false;
  }
}

// Increment app likes counter in Firestore
async function incrementAppLikes(appId, increment) {
  const { db, storeMod } = await waitForFirebase();
  const { doc, updateDoc, getDoc, setDoc, increment: firestoreIncrement } = storeMod;
  
  console.log('Incrementing app likes for:', appId, 'by:', increment);
  
  try {
    const appRef = doc(db, 'apps', appId);
    
    // First check if the document exists
    const appDoc = await getDoc(appRef);
    
    if (!appDoc.exists()) {
      console.warn('App document does not exist:', appId);
      // Don't fail the entire operation - just skip likes counter update
      return true;
    }
    
    // If document exists, update the likes counter
    await updateDoc(appRef, {
      likes_count: firestoreIncrement(increment),
      updatedAt: new Date()
    });
    console.log('App likes counter updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating app likes counter:', error);
    // Don't fail the entire operation if likes counter fails
    return true;
  }
}

// Get app likes count
async function getAppLikesCount(appId) {
  const { db, storeMod } = await waitForFirebase();
  const { doc, getDoc } = storeMod;
  
  try {
    const appDoc = await getDoc(doc(db, 'apps', appId));
    if (appDoc.exists()) {
      const data = appDoc.data();
      return data.likesCount || 0;
    }
    console.warn('App document does not exist for likes count:', appId);
    return 0;
  } catch (error) {
    console.error('Error getting app likes count:', error);
    return 0;
  }
}

// Check if app is favorited (with cache)
async function isAppFavorited(appId) {
  if (!currentUser) return false;
  
  // Use cache if available
  if (favoritesCache && favoritesCache.includes(appId)) {
    return true;
  }
  
  try {
    const userData = await getUserData(currentUser.uid);
    const favorites = userData?.favorites || [];
    
    // Update cache
    favoritesCache = favorites;
    
    return favorites.includes(appId);
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}

// Add app to favorites (with optimistic updates)
async function addToFavorites(appId) {
  if (!currentUser) {
    alert('Please sign in to add favorites');
    return false;
  }
  
  console.log('Adding to favorites:', appId, 'for user:', currentUser.uid);
  
  try {
    // Optimistic update - update cache immediately
    if (favoritesCache && !favoritesCache.includes(appId)) {
      favoritesCache.push(appId);
      // Update UI immediately
      updateFavoriteButtons();
      updateLikesCountOptimistic(appId, 1);
    }
    
    const userData = await getUserData(currentUser.uid);
    const favorites = userData?.favorites || [];
    
    console.log('Current favorites:', favorites);
    
    if (!favorites.includes(appId)) {
      const updatedFavorites = [...favorites, appId];
      console.log('Updated favorites:', updatedFavorites);
      
      // Update user favorites
      const userSuccess = await updateUserData(currentUser.uid, { favorites: updatedFavorites });
      
      // Update global likes counter for the app
      const appSuccess = await incrementAppLikes(appId, 1);
      
      if (userSuccess && appSuccess) {
        console.log('Successfully added to favorites');
        // Update cache with server data
        favoritesCache = updatedFavorites;
        updateFavoriteButtons();
        updateLikesCounters();
        
        // Dispatch cross-page update event
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
          detail: { appId, action: 'added' } 
        }));
        
        // Cross-tab synchronization
        localStorage.setItem('vibestore_favorites_updated', Date.now().toString());
        
        return true;
      } else {
        console.error('Failed to update user data or app likes');
        // Revert optimistic update on failure
        if (favoritesCache) {
          favoritesCache = favoritesCache.filter(id => id !== appId);
          updateFavoriteButtons();
          updateLikesCountOptimistic(appId, -1);
        }
        return false;
      }
    }
    
    console.log('App already in favorites');
    return false;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    // Revert optimistic update on error
    if (favoritesCache) {
      favoritesCache = favoritesCache.filter(id => id !== appId);
      updateFavoriteButtons();
      updateLikesCountOptimistic(appId, -1);
    }
    alert('Error adding to favorites. Please try again.');
    return false;
  }
}

// Remove app from favorites (with optimistic updates)
async function removeFromFavorites(appId) {
  if (!currentUser) return false;
  
  try {
    // Optimistic update - update cache immediately
    if (favoritesCache && favoritesCache.includes(appId)) {
      favoritesCache = favoritesCache.filter(id => id !== appId);
      // Update UI immediately
      updateFavoriteButtons();
      updateLikesCountOptimistic(appId, -1);
    }
    
    const userData = await getUserData(currentUser.uid);
    const favorites = userData?.favorites || [];
    const updatedFavorites = favorites.filter(id => id !== appId);
    
    // Update user favorites
    const userSuccess = await updateUserData(currentUser.uid, { favorites: updatedFavorites });
    
    // Update global likes counter for the app
    const appSuccess = await incrementAppLikes(appId, -1);
    
    if (userSuccess && appSuccess) {
      // Update cache with server data
      favoritesCache = updatedFavorites;
      updateFavoriteButtons();
      updateLikesCounters();
      
      // Dispatch cross-page update event
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
        detail: { appId, action: 'removed' } 
      }));
      
      // Cross-tab synchronization
      localStorage.setItem('vibestore_favorites_updated', Date.now().toString());
      
      return true;
    } else {
      console.error('Failed to update user data or app likes');
      // Revert optimistic update on failure
      if (favoritesCache && !favoritesCache.includes(appId)) {
        favoritesCache.push(appId);
        updateFavoriteButtons();
        updateLikesCountOptimistic(appId, 1);
      }
      return false;
    }
  } catch (error) {
    console.error('Error removing from favorites:', error);
    // Revert optimistic update on error
    if (favoritesCache && !favoritesCache.includes(appId)) {
      favoritesCache.push(appId);
      updateFavoriteButtons();
      updateLikesCountOptimistic(appId, 1);
    }
    alert('Error removing from favorites. Please try again.');
    return false;
  }
}

// Toggle favorite status
async function toggleFavorite(appId) {
  console.log('Toggle favorite called for app:', appId);
  
  if (!currentUser) {
    console.log('No current user, showing sign in alert');
    alert('Please sign in to add favorites');
    return;
  }
  
  console.log('Current user:', currentUser.uid);
  
  const isFavorited = await isAppFavorited(appId);
  console.log('Is app favorited:', isFavorited);
  
  if (isFavorited) {
    console.log('Removing from favorites');
    await removeFromFavorites(appId);
  } else {
    console.log('Adding to favorites');
    await addToFavorites(appId);
  }
}

// Update all favorite buttons on the page (with cache)
async function updateFavoriteButtons() {
  if (!currentUser) {
    // Hide all favorite buttons for non-authenticated users
    const favoriteButtons = document.querySelectorAll('.heart-btn');
    favoriteButtons.forEach(btn => {
      btn.style.display = 'none';
    });
    return;
  }
  
  try {
    // Use cache if available, otherwise fetch from server
    let favorites = favoritesCache;
    if (!favorites) {
      const userData = await getUserData(currentUser.uid);
      favorites = userData?.favorites || [];
      // Update cache
      favoritesCache = favorites;
    }
    
    const favoriteButtons = document.querySelectorAll('.heart-btn');
    favoriteButtons.forEach(btn => {
      const appId = btn.dataset.appId;
      const isFavorited = favorites.includes(appId);
      
      // Show button for authenticated users
      btn.style.display = 'flex';
      
      // Update button appearance - handle both emoji and SVG buttons
      if (isFavorited) {
        btn.classList.add('favorited');
        // Check if button has SVG (new design) or emoji (old design)
        if (btn.querySelector('svg')) {
          btn.title = 'Remove from favorites';
        } else {
          btn.innerHTML = '❤️';
          btn.title = 'Remove from favorites';
        }
      } else {
        btn.classList.remove('favorited');
        // Check if button has SVG (new design) or emoji (old design)
        if (btn.querySelector('svg')) {
          btn.title = 'Add to favorites';
        } else {
          btn.innerHTML = '🤍';
          btn.title = 'Add to favorites';
        }
      }
    });
  } catch (error) {
    console.error('Error updating favorite buttons:', error);
  }
}

// Update likes counters on the page
async function updateLikesCounters() {
  try {
    const likeCounters = document.querySelectorAll('.likes-counter');
    
    for (const counter of likeCounters) {
      const appId = counter.dataset.appId;
      if (appId) {
        try {
          const likesCount = await getAppLikesCount(appId);
          counter.textContent = likesCount;
          // Update cache
          likesCountCache.set(appId, likesCount);
        } catch (error) {
          console.warn(`Failed to get likes count for app ${appId}:`, error);
          counter.textContent = '0';
          likesCountCache.set(appId, 0);
        }
      }
    }
  } catch (error) {
    console.error('Error updating likes counters:', error);
  }
}

// Optimistic update of likes count
function updateLikesCountOptimistic(appId, increment) {
  const currentCount = likesCountCache.get(appId) || 0;
  const newCount = Math.max(0, currentCount + increment);
  likesCountCache.set(appId, newCount);
  
  // Update UI immediately
  const likeCounters = document.querySelectorAll(`.likes-counter[data-app-id="${appId}"]`);
  likeCounters.forEach(counter => {
    counter.textContent = newCount;
  });
  
  // Also update likes count in app detail page
  const likesCountElement = document.getElementById('likes-count');
  if (likesCountElement) {
    likesCountElement.textContent = newCount;
  }
}

// Create favorite button HTML with likes counter
function createFavoriteButton(appId, likesCount = 0) {
  // Use cached likes count if available
  const cachedLikesCount = likesCountCache.get(appId);
  const displayLikesCount = cachedLikesCount !== undefined ? cachedLikesCount : likesCount;
  
  return `
    <div class="favorite-container" style="
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      z-index: 10;
    ">
      <button class="favorite-btn" data-app-id="${appId}" title="Add to favorites" style="
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      ">
        🤍
      </button>
      <span class="likes-counter" data-app-id="${appId}" style="
        background: rgba(255,255,255,0.9);
        padding: 0.125rem 0.375rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        color: #666;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
      ">${displayLikesCount}</span>
    </div>
  `;
}

// Add event listeners for favorite buttons
function initializeFavoriteButtons() {
  console.log('Initializing favorite button event listeners');
  
  document.addEventListener('click', async (e) => {
    if (e.target.closest('.heart-btn')) {
      console.log('Favorite button clicked:', e.target);
      e.preventDefault();
      e.stopPropagation();
      
      const btn = e.target.closest('.heart-btn');
      const appId = btn?.dataset.appId;
      console.log('App ID from button:', appId);
      
      if (appId) {
        await toggleFavorite(appId);
        // Trigger custom event to update profile if it exists
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { appId } }));
      } else {
        console.error('No app ID found on favorite button');
      }
    }
  });
  
  console.log('Favorite button event listeners initialized');
}

// Auto-initialize when loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ VibeStore Favorites system loaded');
  initializeFavorites();
  initializeFavoriteButtons();
  
  // Listen for cross-page favorites updates
  window.addEventListener('favoritesUpdated', (event) => {
    console.log('Favorites updated event received:', event.detail);
    updateFavoriteButtons();
  });
});
