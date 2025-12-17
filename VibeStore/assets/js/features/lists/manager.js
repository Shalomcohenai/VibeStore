/**
 * VibeStore - Lists Management
 * This module handles creating and managing user lists
 * Integrates with existing Firebase architecture
 */

// Wait for Firebase to initialize
const waitForFirebaseLists = () => {
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
 * Centralized Lists Manager
 * Manages user lists with caching and real-time updates
 */
class ListsManager {
  constructor() {
    this.userLists = []; // Array of user's lists
    this.initialized = false;
    this.currentUser = null;
    this.listeners = [];
    this.isLoading = false;
  }

  /**
   * Initialize the lists manager for a user
   */
  async initialize(user) {
    if (!user) {
      this.userLists = [];
      this.currentUser = null;
      this.initialized = false;
      return;
    }

    this.currentUser = user;
    this.isLoading = true;

    try {
      await this.loadUserLists();
      this.initialized = true;
      this.isLoading = false;

      // Notify listeners
      this.notifyListeners();

    } catch (error) {
      console.error('Error initializing ListsManager:', error);
      this.isLoading = false;
    }
  }

  /**
   * Load user's lists from Firestore
   */
  async loadUserLists() {
    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { collection, query, where, getDocs } = storeMod;

      const listsQuery = query(
        collection(db, 'user_lists'),
        where('userId', '==', this.currentUser.uid)
      );

      const snapshot = await getDocs(listsQuery);
      this.userLists = [];

      snapshot.forEach((doc) => {
        this.userLists.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Sort by creation date (newest first)
      this.userLists.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
      });

      } catch (error) {
      console.error('Error loading user lists:', error);
      this.userLists = [];
    }
  }

  /**
   * Get all user lists
   */
  getLists() {
    return this.userLists;
  }

  /**
   * Get list by ID
   */
  getList(listId) {
    return this.userLists.find(list => list.id === listId);
  }

  /**
   * Check if app is in any list
   */
  isAppInLists(appId) {
    const listIds = [];
    this.userLists.forEach(list => {
      if (list.apps && list.apps.some(app => app.appId === appId)) {
        listIds.push(list.id);
      }
    });
    return listIds;
  }

  /**
   * Get apps in a specific list with full app data
   */
  async getAppsInList(listId) {
    const list = this.getList(listId);
    if (!list || !list.apps) {
      return [];
    }

    const appsWithData = [];
    for (const appEntry of list.apps) {
      try {
        const appData = await this.getAppData(appEntry.appId);
        if (appData) {
          appsWithData.push({
            appId: appEntry.appId,
            appTitle: appData.title,
            appIcon: this.getAppIcon(appData),
            appCategory: appData.category,
            appDescription: appData.description,
            appPlatform: appData.niche,
            addedAt: appEntry.addedAt,
            addedBy: appEntry.addedBy
          });
        }
      } catch (error) {
        console.error('Error getting app data for list:', error);
      }
    }

    return appsWithData;
  }

  /**
   * Create a new list
   */
  async createList(name, description = '', isPublic = false) {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to create lists');
    }

    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { collection, addDoc } = storeMod;

      const shareToken = this.generateShareToken();

      const listData = {
        userId: this.currentUser.uid,
        name: name.trim(),
        description: description.trim(),
        isPublic,
        shareToken,
        apps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        appCount: 0
      };

      const docRef = await addDoc(collection(db, 'user_lists'), listData);

      // Add to local cache
      const newList = {
        id: docRef.id,
        ...listData
      };
      this.userLists.unshift(newList); // Add to beginning

      // Create shared list if public
      if (isPublic) {
        try {
          await this.createSharedList(newList);
        } catch (error) {
          console.error('Error creating shared list:', error);
        }
      }

      // Notify listeners
      this.notifyListeners();

      return docRef.id;

    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  }

  /**
   * Add app to list
   */
  async addAppToList(listId, appId) {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to add apps to lists');
    }

    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, updateDoc, arrayUnion, increment } = storeMod;

      // Check if app is already in list
      const list = this.getList(listId);
      if (list && list.apps && list.apps.some(app => app.appId === appId)) {
        return false;
      }

      // Update user_lists
      await updateDoc(doc(db, 'user_lists', listId), {
        apps: arrayUnion({
          appId,
          addedAt: new Date(),
          addedBy: this.currentUser.uid
        }),
        appCount: increment(1),
        updatedAt: new Date()
      });

      // Update shared_lists if public
      if (list && list.isPublic) {
        await this.updateSharedList(listId, appId);
      }

      // Update local cache
      const listIndex = this.userLists.findIndex(l => l.id === listId);
      if (listIndex !== -1) {
        this.userLists[listIndex].apps.push({
          appId,
          addedAt: new Date(),
          addedBy: this.currentUser.uid
        });
        this.userLists[listIndex].appCount++;
        this.userLists[listIndex].updatedAt = new Date();
      }

      // Notify listeners
      this.notifyListeners();

      return true;

    } catch (error) {
      console.error('Error adding app to list:', error);
      throw error;
    }
  }

  /**
   * Remove app from list
   */
  async removeAppFromList(listId, appId) {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to remove apps from lists');
    }

    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, updateDoc, arrayRemove, increment } = storeMod;

      // Find the app entry to remove
      const list = this.getList(listId);
      const appEntry = list && list.apps ? list.apps.find(app => app.appId === appId) : null;

      if (!appEntry) {
        return false;
      }

      // Update user_lists
      await updateDoc(doc(db, 'user_lists', listId), {
        apps: arrayRemove(appEntry),
        appCount: increment(-1),
        updatedAt: new Date()
      });

      // Update shared_lists if public
      if (list && list.isPublic) {
        await this.updateSharedList(listId, appId, true); // true = remove
      }

      // Update local cache
      const listIndex = this.userLists.findIndex(l => l.id === listId);
      if (listIndex !== -1) {
        this.userLists[listIndex].apps = this.userLists[listIndex].apps.filter(app => app.appId !== appId);
        this.userLists[listIndex].appCount = Math.max(0, this.userLists[listIndex].appCount - 1);
        this.userLists[listIndex].updatedAt = new Date();
      }

      // Notify listeners
      this.notifyListeners();

      return true;

    } catch (error) {
      console.error('Error removing app from list:', error);
      throw error;
    }
  }

  /**
   * Update list details
   */
  async updateList(listId, updates) {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to update lists');
    }

    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, updateDoc } = storeMod;

      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, 'user_lists', listId), updateData);

      // Update local cache
      const listIndex = this.userLists.findIndex(l => l.id === listId);
      if (listIndex !== -1) {
        this.userLists[listIndex] = {
          ...this.userLists[listIndex],
          ...updateData
        };
      }

      // Handle shared list creation/removal based on privacy change
      if (updates.hasOwnProperty('isPublic')) {
        const list = this.getList(listId);
        if (list) {
          if (updates.isPublic) {
            // List became public - create shared list
            try {
              await this.createSharedList(list);
            } catch (error) {
              console.error('Error creating shared list:', error);
            }
          } else {
            // List became private - remove shared list
            try {
              const { db, storeMod } = await waitForFirebaseLists();
              const { doc, deleteDoc } = storeMod;
              await deleteDoc(doc(db, 'shared_lists', list.shareToken));
            } catch (error) {
              console.error('Error removing shared list:', error);
            }
          }
        }
      }

      // Notify listeners
      this.notifyListeners();

      return true;

    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  }

  /**
   * Delete list
   */
  async deleteList(listId) {
    if (!this.currentUser) {
      throw new Error('User must be authenticated to delete lists');
    }

    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, deleteDoc } = storeMod;

      // Delete from user_lists
      await deleteDoc(doc(db, 'user_lists', listId));

      // Delete from shared_lists if exists
      const list = this.getList(listId);
      if (list && list.isPublic) {
        await this.deleteSharedList(list.shareToken);
      }

      // Update local cache
      this.userLists = this.userLists.filter(l => l.id !== listId);

      // Notify listeners
      this.notifyListeners();

      return true;

    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  }

  /**
   * Generate share token
   */
  generateShareToken() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Update shared list (for public lists)
   */
  async updateSharedList(listId, appId, isRemove = false) {
    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } = storeMod;

      const list = this.getList(listId);
      if (!list) return;

      const sharedListRef = doc(db, 'shared_lists', list.shareToken);
      const sharedListDoc = await getDoc(sharedListRef);

      if (isRemove) {
        // Remove app from shared list
        if (sharedListDoc.exists()) {
          const sharedData = sharedListDoc.data();
          const appToRemove = sharedData.apps.find(app => app.appId === appId);
          if (appToRemove) {
            await updateDoc(sharedListRef, {
              apps: arrayRemove(appToRemove),
              updatedAt: new Date()
            });
          }
        }
      } else {
        // Add app to shared list
        if (sharedListDoc.exists()) {
          // Update existing shared list
          const appData = await this.getAppData(appId);
          if (appData) {
            await updateDoc(sharedListRef, {
              apps: arrayUnion({
                appId,
                appTitle: appData.title,
                appIcon: this.getAppIcon(appData),
                appCategory: appData.category
              }),
              updatedAt: new Date()
            });
          }
        } else {
          // Create new shared list
          await this.createSharedList(list);
        }
      }

    } catch (error) {
      console.error('Error updating shared list:', error);
    }
  }

  /**
   * Create shared list
   */
  async createSharedList(list) {
    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, setDoc } = storeMod;

      // Get app data for all apps in list
      const appsData = [];
      for (const app of list.apps) {
        const appData = await this.getAppData(app.appId);
        if (appData) {
          appsData.push({
            appId: app.appId,
            appTitle: appData.title,
            appIcon: this.getAppIcon(appData),
            appCategory: appData.category
          });
        }
      }

      const sharedListData = {
        listId: list.id,
        userId: list.userId,
        name: list.name,
        description: list.description,
        apps: appsData,
        createdAt: list.createdAt,
        updatedAt: new Date(),
        lastAccessed: new Date(),
        accessCount: 0
      };

      await setDoc(doc(db, 'shared_lists', list.shareToken), sharedListData);

    } catch (error) {
      console.error('Error creating shared list:', error);
    }
  }

  /**
   * Delete shared list
   */
  async deleteSharedList(shareToken) {
    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, deleteDoc } = storeMod;

      await deleteDoc(doc(db, 'shared_lists', shareToken));

    } catch (error) {
      console.error('Error deleting shared list:', error);
    }
  }

  /**
   * Get app data from Firestore
   */
  async getAppData(appId) {
    try {
      const { db, storeMod } = await waitForFirebaseLists();
      const { doc, getDoc } = storeMod;

      const appDoc = await getDoc(doc(db, 'apps', appId));
      if (appDoc.exists()) {
        return {
          id: appDoc.id,
          ...appDoc.data()
        };
      }
      return null;

    } catch (error) {
      console.error('Error getting app data:', error);
      return null;
    }
  }

  /**
   * Get app icon based on niche
   */
  getAppIcon(appData) {
    const niche = Array.isArray(appData.niche) ? appData.niche[0] : appData.niche;
    if (niche === 'web') {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
    }
    if (niche === 'mobile') {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
    }
    if (niche === 'whatsapp') {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
  }

  /**
   * Add listener for changes
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.userLists);
      } catch (error) {
        console.error('Error in lists listener:', error);
      }
    });
  }
}

// Create global instance
window.listsManager = new ListsManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ListsManager;
}
