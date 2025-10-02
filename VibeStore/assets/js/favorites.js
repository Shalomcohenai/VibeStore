/**
 * VibeStore - Favorites Management
 * This module handles adding/removing favorites across the site
 * New centralized FavoritesManager for consistent state management
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

/**
 * Centralized Favorites Manager
 * Manages favorites state with caching and cross-tab synchronization
 */
class FavoritesManager {
  constructor() {
    this.favoritesSet = new Set(); // Set of favorited app IDs
    this.initialized = false;
    this.currentUser = null;
    this.listeners = [];
    this.isLoading = false;
  }

  /**
   * Initialize the favorites manager for a user
   */
  async initialize(user) {
    if (!user) {
      this.favoritesSet.clear();
      this.currentUser = null;
      this.initialized = false;
      return;
    }

    this.currentUser = user;
    this.isLoading = true;

    try {
      const userData = await this.getUserData(user.uid);
      const favorites = userData?.favorites || [];
      
      // Update the Set
      this.favoritesSet.clear();
      favorites.forEach(appId => this.favoritesSet.add(appId));
      
      this.initialized = true;
      this.isLoading = false;
      
      console.log(`✅ FavoritesManager initialized with ${this.favoritesSet.size} favorites`);
      
      // Notify listeners
      this.notifyListeners();
      
    } catch (error) {
      console.error('Error initializing FavoritesManager:', error);
      this.isLoading = false;
    }
  }

  /**
   * Check if an app is favorited (synchronous after initialization)
   */
  isFavorited(appId) {
    if (!this.initialized || !this.currentUser) {
      return false;
    }
    return this.favoritesSet.has(appId);
  }

  /**
   * Get all favorited app IDs
   */
  getFavorites() {
    return Array.from(this.favoritesSet);
  }

  /**
   * Add app to favorites
   */
  async addToFavorites(appId) {
    if (!this.currentUser) {
      alert('Please sign in to add favorites');
      return false;
    }

    // Optimistic update
    const wasAlreadyFavorited = this.favoritesSet.has(appId);
    if (wasAlreadyFavorited) {
      console.log('App already favorited');
      return false;
    }

    this.favoritesSet.add(appId);
    this.notifyListeners();

    try {
      const favorites = this.getFavorites();
      await this.updateUserData(this.currentUser.uid, { favorites });
      await this.incrementAppLikes(appId, 1);
      
      // Cross-tab sync
      this.broadcastUpdate();
      
      console.log('✅ Added to favorites:', appId);
      return true;
      
    } catch (error) {
      console.error('Error adding to favorites:', error);
      // Rollback
      this.favoritesSet.delete(appId);
      this.notifyListeners();
      alert('Error adding to favorites. Please try again.');
      return false;
    }
  }

  /**
   * Remove app from favorites
   */
  async removeFromFavorites(appId) {
    if (!this.currentUser) {
      return false;
    }

    // Optimistic update
    const wasAlreadyFavorited = this.favoritesSet.has(appId);
    if (!wasAlreadyFavorited) {
      console.log('App was not favorited');
      return false;
    }

    this.favoritesSet.delete(appId);
    this.notifyListeners();

    try {
      const favorites = this.getFavorites();
      await this.updateUserData(this.currentUser.uid, { favorites });
      await this.incrementAppLikes(appId, -1);
      
      // Cross-tab sync
      this.broadcastUpdate();
      
      console.log('✅ Removed from favorites:', appId);
      return true;
      
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // Rollback
      this.favoritesSet.add(appId);
      this.notifyListeners();
      alert('Error removing from favorites. Please try again.');
      return false;
    }
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(appId) {
    const isFavorited = this.isFavorited(appId);
    
    if (isFavorited) {
      return await this.removeFromFavorites(appId);
    } else {
      return await this.addToFavorites(appId);
    }
  }

  /**
   * Add listener for favorites updates
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners of state change
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.getFavorites());
      } catch (error) {
        console.error('Error in favorites listener:', error);
      }
    });
  }

  /**
   * Broadcast update to other tabs
   */
  broadcastUpdate() {
    try {
      localStorage.setItem('vibestore_favorites_updated', Date.now().toString());
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
        detail: { favorites: this.getFavorites() } 
      }));
    } catch (error) {
      console.error('Error broadcasting favorites update:', error);
    }
  }

  /**
   * Refresh from server (for cross-tab sync)
   */
  async refresh() {
    if (!this.currentUser) return;
    
    try {
      const userData = await this.getUserData(this.currentUser.uid);
      const favorites = userData?.favorites || [];
      
      this.favoritesSet.clear();
      favorites.forEach(appId => this.favoritesSet.add(appId));
      
      this.notifyListeners();
      console.log('✅ Favorites refreshed from server');
      
    } catch (error) {
      console.error('Error refreshing favorites:', error);
    }
  }

  /**
   * Get user data from Firestore
   */
  async getUserData(uid) {
    const { db, storeMod } = await waitForFirebase();
    const { doc, getDoc, setDoc } = storeMod;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        // Create user document
        const userData = {
          uid: uid,
          email: this.currentUser.email,
          displayName: this.currentUser.displayName || this.currentUser.email.split('@')[0],
          favorites: [],
          lists: [],
          createdAt: new Date()
        };
        await setDoc(doc(db, 'users', uid), userData);
        return userData;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      return { favorites: [] };
    }
  }

  /**
   * Update user data in Firestore
   */
  async updateUserData(uid, data) {
    const { db, storeMod } = await waitForFirebase();
    const { doc, updateDoc } = storeMod;
    
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...data,
        updatedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  }

  /**
   * Increment app likes counter
   */
  async incrementAppLikes(appId, increment) {
    const { db, storeMod } = await waitForFirebase();
    const { doc, updateDoc, getDoc, increment: firestoreIncrement } = storeMod;
    
    try {
      const appRef = doc(db, 'apps', appId);
      const appDoc = await getDoc(appRef);
      
      if (!appDoc.exists()) {
        console.warn('App document does not exist:', appId);
        return true;
      }
      
      await updateDoc(appRef, {
        likes_count: firestoreIncrement(increment),
        updatedAt: new Date()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating app likes counter:', error);
      return true; // Don't fail the whole operation
    }
  }
}

// Create global instance
window.favoritesManager = new FavoritesManager();

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

// Export functions - using new FavoritesManager
window.VibeStoreFavorites = {
  initializeFavorites,
  addToFavorites: (appId) => window.favoritesManager.addToFavorites(appId),
  removeFromFavorites: (appId) => window.favoritesManager.removeFromFavorites(appId),
  toggleFavorite: (appId) => window.favoritesManager.toggleFavorite(appId),
  isAppFavorited: (appId) => window.favoritesManager.isFavorited(appId),
  updateFavoriteButtons,
  initializeFavoriteButtons,
  createReview,
  
  // Direct access to manager
  manager: () => window.favoritesManager,
  
  // For backwards compatibility with debug page
  getUserData: (uid) => window.favoritesManager.getUserData(uid),
  
  // Public API for checking if app exists
  appExists: async function(appId) {
    return await appExists(appId);
  }
};

// Initialize favorites system
async function initializeFavorites() {
  try {
    const { auth, authMod } = await waitForFirebase();
    
    authMod.onAuthStateChanged(auth, async (user) => {
      currentUser = user;
      
      // Initialize the FavoritesManager with the current user
      await window.favoritesManager.initialize(user);
      
      // Update all favorite buttons on the page
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

// Update all favorite buttons on the page (using FavoritesManager)
function updateFavoriteButtons() {
  const favoriteButtons = document.querySelectorAll('.heart-btn');
  
  if (!currentUser || !window.favoritesManager.initialized) {
    // Hide all favorite buttons for non-authenticated users
    favoriteButtons.forEach(btn => {
      btn.style.display = 'none';
    });
    return;
  }
  
  try {
    // Get favorites from manager (synchronous after initialization)
    favoriteButtons.forEach(btn => {
      const appId = btn.dataset.appId;
      const isFavorited = window.favoritesManager.isFavorited(appId);
      
      // Show button for authenticated users
      btn.style.display = 'flex';
      
      // Update button appearance - handle both SVG buttons
      if (isFavorited) {
        btn.classList.add('favorited');
        btn.title = 'Remove from favorites';
        
        // Update SVG fill if present
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', 'currentColor');
        }
      } else {
        btn.classList.remove('favorited');
        btn.title = 'Add to favorites';
        
        // Update SVG fill if present
        const svg = btn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', 'none');
        }
      }
    });
  } catch (error) {
    console.error('Error updating favorite buttons:', error);
  }
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
        await window.favoritesManager.toggleFavorite(appId);
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
  
  // Register listener for favorites changes
  window.favoritesManager.addListener(() => {
    updateFavoriteButtons();
  });
  
  // Listen for cross-page favorites updates
  window.addEventListener('favoritesUpdated', (event) => {
    console.log('Favorites updated event received:', event.detail);
    updateFavoriteButtons();
  });
  
  // Cross-tab synchronization via localStorage
  window.addEventListener('storage', async (e) => {
    if (e.key === 'vibestore_favorites_updated') {
      console.log('Favorites updated in another tab, refreshing...');
      await window.favoritesManager.refresh();
    }
  });
});
