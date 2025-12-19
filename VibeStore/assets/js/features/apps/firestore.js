/**
 * VibeStore - Firestore Apps Integration
 * This module handles fetching real apps from Firestore
 */

// Helper function to normalize image URL from app data
function normalizeImageUrl(data) {
  return data.imageUrl || data.image || data.iconUrl || data.icon || data.logo || null;
}

// Wait for Firebase to initialize
const waitForFirebaseApps = async () => {
  if (window.waitForFirebase) {
    const fb = await window.waitForFirebase();
    return {
      db: fb.db,
      storeMod: fb.storeMod
    };
  } else {
    // Fallback: wait for $fb to be available
    return new Promise(resolve => {
      const check = () => {
        if (window.$fb && window.$fb.db && window.$fb.storeMod) {
          resolve({
            db: window.$fb.db,
            storeMod: window.$fb.storeMod
          });
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
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
    // Note: niche is stored as an array, so we use array-contains
    if (filters.niche && filters.niche !== 'all') {
      appsQuery = query(appsQuery, where('niche', 'array-contains', filters.niche));
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
        ...data,
        imageUrl: normalizeImageUrl(data) // Ensure imageUrl is normalized
      });
    });

    return apps;
  } catch (error) {
    if (window.ErrorHandler) {
      window.ErrorHandler.handle(error, 'fetchAppsFromFirestore', 'שגיאה בטעינת אפליקציות');
    } else {
      console.error('Error fetching apps from Firestore:', error);
    }
    return [];
  }
}

// Fetch featured apps for homepage
async function fetchFeaturedApps() {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { collection, query, where, orderBy, limit, getDocs } = storeMod;

    // Simplified query to avoid composite index requirement
    const fetchBuffer = window.APP_LIMITS?.FETCH_BUFFER || 20;
    const featuredLimit = window.APP_LIMITS?.FEATURED || 6;
    
    let appsQuery = collection(db, 'apps');
    appsQuery = query(appsQuery, where('status', '==', 'approved'));
    appsQuery = query(appsQuery, orderBy('createdAt', 'desc'));
    appsQuery = query(appsQuery, limit(fetchBuffer)); // Get more to filter client-side

    const snapshot = await getDocs(appsQuery);
    const apps = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filter for featured apps client-side
      if (data.featured && data.featured.active === true) {
        apps.push({
          firestoreId: doc.id,
          id: data.id || doc.id,
          ...data,
          imageUrl: normalizeImageUrl(data) // Ensure imageUrl is normalized
        });
      }
    });

    // Return only first N featured apps
    return apps.slice(0, featuredLimit);
  } catch (error) {
    if (window.ErrorHandler) {
      window.ErrorHandler.handle(error, 'fetchFeaturedApps', 'שגיאה בטעינת אפליקציות מומלצות');
    } else {
      console.error('Error fetching featured apps:', error);
    }
    return [];
  }
}

// Fetch popular apps (high ratings)
async function fetchPopularApps() {
  const popularLimit = window.APP_LIMITS?.POPULAR || 6;
  return await fetchAppsFromFirestore({
    sortBy: 'rating',
    limit: popularLimit
  });
}

// Fetch editor's choice apps
async function fetchEditorsChoice() {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { collection, query, where, orderBy, limit, getDocs } = storeMod;

    // Simplified query to avoid composite index requirement
    const fetchBuffer = window.APP_LIMITS?.FETCH_BUFFER || 20;
    const editorsChoiceLimit = window.APP_LIMITS?.EDITORS_CHOICE || 6;
    
    let appsQuery = collection(db, 'apps');
    appsQuery = query(appsQuery, where('status', '==', 'approved'));
    appsQuery = query(appsQuery, orderBy('createdAt', 'desc'));
    appsQuery = query(appsQuery, limit(fetchBuffer)); // Get more to filter client-side

    const snapshot = await getDocs(appsQuery);
    const apps = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filter for editor's choice apps client-side
      if (data.editor_pick === true) {
        apps.push({
          firestoreId: doc.id,
          id: data.id || doc.id,
          ...data,
          imageUrl: normalizeImageUrl(data) // Ensure imageUrl is normalized
        });
      }
    });

    // Return only first N editor's choice apps
    return apps.slice(0, editorsChoiceLimit);
  } catch (error) {
    if (window.ErrorHandler) {
      window.ErrorHandler.handle(error, 'fetchEditorsChoice', 'שגיאה בטעינת אפליקציות בחירת העורך');
    } else {
      console.error('Error fetching editor\'s choice apps:', error);
    }
    return [];
  }
}

// Search cache with TTL
const searchCache = new Map();
const getCacheTTL = () => window.TIME_WINDOWS?.CACHE_TTL_MS || (5 * 60 * 1000); // 5 minutes default

// Search apps by text query
async function searchApps(searchQuery, filters = {}) {
  try {
    // Create cache key
    const cacheKey = JSON.stringify({ searchQuery: searchQuery?.toLowerCase().trim(), filters });
    const cached = searchCache.get(cacheKey);
    
    // Check if cached result is still valid
    if (cached && Date.now() - cached.timestamp < getCacheTTL()) {
      return cached.data;
    }

    // For now, we'll fetch all apps and filter client-side
    // In production, you'd want to use Algolia or full-text search
    const allApps = await fetchAppsFromFirestore(filters);

    if (!searchQuery || searchQuery.trim() === '') {
      // Cache empty query results too
      searchCache.set(cacheKey, {
        data: allApps,
        timestamp: Date.now()
      });
      return allApps;
    }

    const query = searchQuery.toLowerCase().trim();

    const filteredApps = allApps.filter(app => {
      const title = (app.title || '').toLowerCase();
      const description = (app.description || '').toLowerCase();
      const category = (app.category || '').toLowerCase();
      const tags = (app.tags || []).join(' ').toLowerCase();

      return title.includes(query) ||
             description.includes(query) ||
             category.includes(query) ||
             tags.includes(query);
    });

    // Cache the results
    searchCache.set(cacheKey, {
      data: filteredApps,
      timestamp: Date.now()
    });

    // Clean old cache entries (keep only last 50 entries)
    if (searchCache.size > 50) {
      const entries = Array.from(searchCache.entries());
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
      searchCache.clear();
      entries.slice(0, 50).forEach(([key, value]) => {
        searchCache.set(key, value);
      });
    }

    return filteredApps;
  } catch (error) {
    if (window.ErrorHandler) {
      window.ErrorHandler.handle(error, 'searchApps', 'שגיאה בחיפוש אפליקציות');
    } else {
      console.error('Error searching apps:', error);
    }
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
      const data = appDoc.data();
      return {
        id: appDoc.id,
        ...data,
        imageUrl: normalizeImageUrl(data) // Ensure imageUrl is normalized
      };
    } else {
      return null;
    }
  } catch (error) {
    if (window.ErrorHandler) {
      window.ErrorHandler.handle(error, 'fetchAppById', 'שגיאה בטעינת פרטי האפליקציה');
    } else {
      console.error('Error fetching app:', error);
    }
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
    if (window.ErrorHandler) {
      window.ErrorHandler.handle(error, 'fetchAppReviews', 'שגיאה בטעינת ביקורות');
    } else {
      console.error('Error fetching reviews:', error);
    }
    return [];
  }
}

// Fetch all apps for search engine (raw data without filters)
async function fetchAllAppsForSearch() {
  try {
    const { db, storeMod } = await waitForFirebaseApps();
    const { collection, query, where, orderBy, limit, getDocs } = storeMod;

    // Get all approved apps without any filters
    const maxSearchResults = window.APP_LIMITS?.MAX_SEARCH_RESULTS || 1000;
    
    let appsQuery = collection(db, 'apps');
    appsQuery = query(appsQuery, where('status', '==', 'approved'));
    appsQuery = query(appsQuery, orderBy('createdAt', 'desc'));
    appsQuery = query(appsQuery, limit(maxSearchResults)); // Higher limit for search

    const snapshot = await getDocs(appsQuery);
    const apps = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      apps.push({
        firestoreId: doc.id,
        id: data.id || doc.id,
        ...data,
        imageUrl: normalizeImageUrl(data) // Ensure imageUrl is normalized
      });
    });

    return apps;
  } catch (error) {
    if (window.ErrorHandler) {
      window.ErrorHandler.handle(error, 'fetchAllAppsForSearch', 'שגיאה בטעינת אפליקציות לחיפוש');
    } else {
      console.error('Error fetching all apps for search:', error);
    }
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
  fetchAppReviews,
  fetchAllAppsForSearch
};

