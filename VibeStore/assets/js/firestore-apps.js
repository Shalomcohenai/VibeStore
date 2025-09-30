/**
 * VibeStore - Firestore Apps Integration
 * This module handles fetching real apps from Firestore
 */

// Wait for Firebase to initialize
const waitForFirebaseApps = () => {
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

// Fetch apps from Firestore
async function fetchAppsFromFirestore(filters = {}) {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { collection, query, where, orderBy, limit, getDocs } = storeMod;
    
    let appsQuery = collection(db, 'apps');
    
    // Only show approved apps to regular users
    appsQuery = query(appsQuery, where('status', '==', 'approved'));
    
    // Apply filters
    if (filters.niche && filters.niche !== 'all') {
      appsQuery = query(appsQuery, where('niche', '==', filters.niche));
    }
    
    if (filters.category && filters.category !== 'all') {
      appsQuery = query(appsQuery, where('category', '==', filters.category));
    }
    
    // Note: featured and editorPick filters are handled client-side to avoid composite index requirements
    // if (filters.featured) {
    //   appsQuery = query(appsQuery, where('featured.active', '==', true));
    // }
    // if (filters.editorPick) {
    //   appsQuery = query(appsQuery, where('editor_pick', '==', true));
    // }
    
    // Add ordering
    if (filters.sortBy === 'rating') {
      appsQuery = query(appsQuery, orderBy('rating_avg', 'desc'));
    } else if (filters.sortBy === 'newest') {
      appsQuery = query(appsQuery, orderBy('createdAt', 'desc'));
    } else {
      // Default: featured first, then by rating
      appsQuery = query(appsQuery, orderBy('createdAt', 'desc'));
    }
    
    // Limit results
    appsQuery = query(appsQuery, limit(filters.limit || 50));
    
    const snapshot = await getDocs(appsQuery);
    const apps = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // Apply client-side filtering for featured apps if needed
      if (filters.featured && (!data.featured || data.featured.active !== true)) {
        return; // Skip non-featured apps
      }
      
      // Apply client-side filtering for editor's choice apps if needed
      if (filters.editorPick && data.editor_pick !== true) {
        return; // Skip non-editor's choice apps
      }
      
      apps.push({
        firestoreId: doc.id,
        id: data.id || doc.id,
        ...data
      });
    });
    
    return apps;
  } catch (error) {
    console.error('Error fetching apps from Firestore:', error);
    return [];
  }
}

// Fetch featured apps for homepage
async function fetchFeaturedApps() {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { collection, query, where, orderBy, limit, getDocs } = storeMod;
    
    // Simplified query to avoid composite index requirement
    let appsQuery = collection(db, 'apps');
    appsQuery = query(appsQuery, where('status', '==', 'approved'));
    appsQuery = query(appsQuery, orderBy('createdAt', 'desc'));
    appsQuery = query(appsQuery, limit(20)); // Get more to filter client-side
    
    const snapshot = await getDocs(appsQuery);
    const apps = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filter for featured apps client-side
      if (data.featured && data.featured.active === true) {
        apps.push({
          firestoreId: doc.id,
          id: data.id || doc.id,
          ...data
        });
      }
    });
    
    // Return only first 6 featured apps
    return apps.slice(0, 6);
  } catch (error) {
    console.error('Error fetching featured apps:', error);
    return [];
  }
}

// Fetch popular apps (high ratings)
async function fetchPopularApps() {
  return await fetchAppsFromFirestore({ 
    sortBy: 'rating',
    limit: 6 
  });
}

// Fetch editor's choice apps
async function fetchEditorsChoice() {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { collection, query, where, orderBy, limit, getDocs } = storeMod;
    
    // Simplified query to avoid composite index requirement
    let appsQuery = collection(db, 'apps');
    appsQuery = query(appsQuery, where('status', '==', 'approved'));
    appsQuery = query(appsQuery, orderBy('createdAt', 'desc'));
    appsQuery = query(appsQuery, limit(20)); // Get more to filter client-side
    
    const snapshot = await getDocs(appsQuery);
    const apps = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filter for editor's choice apps client-side
      if (data.editor_pick === true) {
        apps.push({
          firestoreId: doc.id,
          id: data.id || doc.id,
          ...data
        });
      }
    });
    
    // Return only first 6 editor's choice apps
    return apps.slice(0, 6);
  } catch (error) {
    console.error('Error fetching editor\'s choice apps:', error);
    return [];
  }
}

// Search apps by text query
async function searchApps(searchQuery, filters = {}) {
  try {
    // For now, we'll fetch all apps and filter client-side
    // In production, you'd want to use Algolia or full-text search
    const allApps = await fetchAppsFromFirestore(filters);
    
    if (!searchQuery || searchQuery.trim() === '') {
      return allApps;
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    return allApps.filter(app => {
      const title = (app.title || '').toLowerCase();
      const description = (app.description || '').toLowerCase();
      const category = (app.category || '').toLowerCase();
      const tags = (app.tags || []).join(' ').toLowerCase();
      
      return title.includes(query) || 
             description.includes(query) || 
             category.includes(query) ||
             tags.includes(query);
    });
  } catch (error) {
    console.error('Error searching apps:', error);
    return [];
  }
}

// Fetch app by ID
async function fetchAppById(appId) {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { doc, getDoc } = storeMod;
    
    const appDoc = await getDoc(doc(db, 'apps', appId));
    
    if (appDoc.exists()) {
      return {
        id: appDoc.id,
        ...appDoc.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching app:', error);
    return null;
  }
}

// Fetch reviews for an app
async function fetchAppReviews(appId) {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { collection, query, where, orderBy, getDocs } = storeMod;
    
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('appId', '==', appId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(reviewsQuery);
    const reviews = [];
    
    snapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}


// Export functions
window.VibeStoreFirestore = {
  fetchAppsFromFirestore,
  fetchFeaturedApps,
  fetchPopularApps,
  fetchEditorsChoice,
  searchApps,
  fetchAppById,
  fetchAppReviews
};

console.log('✅ VibeStore Firestore integration loaded');
