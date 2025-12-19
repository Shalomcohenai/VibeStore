/**
 * VibeStore - Analytics Core
 * Centralized analytics tracking for Google Analytics and custom tracking
 */

class Analytics {
  constructor() {
    this.gaId = 'G-59FYNPQGEP'; // Google Analytics 4 ID
    this.isInitialized = false;
    this.pageViewQueue = [];
    this.eventQueue = [];
  }

  /**
   * Initialize analytics
   */
  init() {
    if (this.isInitialized) return;
    
    // Wait for gtag to be available
    if (typeof gtag !== 'undefined') {
      this.isInitialized = true;
      this.processQueues();
    } else {
      // Retry after a short delay
      setTimeout(() => this.init(), 100);
    }
  }

  /**
   * Process queued events
   */
  processQueues() {
    // Process page views
    this.pageViewQueue.forEach(page => {
      this.trackPageViewInternal(page.path, page.title);
    });
    this.pageViewQueue = [];

    // Process events
    this.eventQueue.forEach(event => {
      this.trackEventInternal(event.name, event.params);
    });
    this.eventQueue = [];
  }

  /**
   * Track page view
   * @param {string} path - Page path
   * @param {string} title - Page title (optional)
   */
  trackPageView(path, title = null) {
    const pageData = {
      path: path || window.location.pathname,
      title: title || document.title
    };

    if (this.isInitialized && typeof gtag !== 'undefined') {
      this.trackPageViewInternal(pageData.path, pageData.title);
    } else {
      this.pageViewQueue.push(pageData);
      this.init();
    }

    // Also track in Firestore for admin dashboard
    this.trackPageViewInFirestore(pageData.path, pageData.title);
  }

  /**
   * Internal page view tracking (Google Analytics)
   */
  trackPageViewInternal(path, title) {
    if (typeof gtag === 'undefined') return;

    gtag('config', this.gaId, {
      page_path: path,
      page_title: title
    });

    // Custom event for page view
    gtag('event', 'page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href
    });
  }

  /**
   * Track page view in Firestore for admin dashboard
   */
  async trackPageViewInFirestore(path, title) {
    try {
      if (!window.$fb || !window.$fb.db || !window.$fb.storeMod) {
        return;
      }

      const { collection, addDoc, serverTimestamp } = window.$fb.storeMod;
      const db = window.$fb.db;

      // Get user ID if authenticated
      const userId = window.$fb.auth?.currentUser?.uid || null;
      const sessionId = this.getSessionId();

      // Track page view
      await addDoc(collection(db, 'page_views'), {
        path: path,
        title: title,
        userId: userId,
        sessionId: sessionId,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        referrer: document.referrer || null,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      });
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'Analytics.trackPageViewInFirestore');
      }
    }
  }

  /**
   * Track custom event
   * @param {string} eventName - Event name
   * @param {Object} params - Event parameters
   */
  trackEvent(eventName, params = {}) {
    if (!eventName) return;

    const eventData = {
      name: eventName,
      params: {
        ...params,
        timestamp: new Date().toISOString()
      }
    };

    if (this.isInitialized && typeof gtag !== 'undefined') {
      this.trackEventInternal(eventName, eventData.params);
    } else {
      this.eventQueue.push(eventData);
      this.init();
    }

    // Also track in Firestore for admin dashboard
    this.trackEventInFirestore(eventName, eventData.params);
  }

  /**
   * Internal event tracking (Google Analytics)
   */
  trackEventInternal(eventName, params) {
    if (typeof gtag === 'undefined') return;

    gtag('event', eventName, params);
  }

  /**
   * Track event in Firestore for admin dashboard
   */
  async trackEventInFirestore(eventName, params) {
    try {
      if (!window.$fb || !window.$fb.db || !window.$fb.storeMod) {
        return;
      }

      const { collection, addDoc, serverTimestamp } = window.$fb.storeMod;
      const db = window.$fb.db;

      // Get user ID if authenticated
      const userId = window.$fb.auth?.currentUser?.uid || null;
      const sessionId = this.getSessionId();

      // Track event
      await addDoc(collection(db, 'analytics_events'), {
        event_name: eventName,
        params: params,
        userId: userId,
        sessionId: sessionId,
        timestamp: serverTimestamp(),
        path: window.location.pathname,
        userAgent: navigator.userAgent
      });
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'Analytics.trackEventInFirestore');
      }
    }
  }

  /**
   * Track app click
   * @param {string} appId - App ID
   * @param {string} appTitle - App title
   * @param {string} source - Source (e.g., 'home_card', 'search_results')
   */
  trackAppClick(appId, appTitle, source = 'unknown') {
    this.trackEvent('app_click', {
      app_id: appId,
      app_title: appTitle,
      source: source
    });
  }

  /**
   * Track search
   * @param {string} query - Search query
   * @param {number} resultsCount - Number of results
   */
  trackSearch(query, resultsCount = 0) {
    this.trackEvent('search', {
      search_term: query,
      results_count: resultsCount
    });
  }

  /**
   * Track favorite action
   * @param {string} appId - App ID
   * @param {boolean} isFavorite - Whether app is favorited
   */
  trackFavorite(appId, isFavorite) {
    this.trackEvent('favorite', {
      app_id: appId,
      action: isFavorite ? 'add' : 'remove'
    });
  }

  /**
   * Track list action
   * @param {string} action - Action type (create, add, remove, delete)
   * @param {string} listId - List ID (optional)
   */
  trackListAction(action, listId = null) {
    this.trackEvent('list_action', {
      action: action,
      list_id: listId
    });
  }

  /**
   * Track review submission
   * @param {string} appId - App ID
   * @param {number} rating - Rating (1-5)
   */
  trackReview(appId, rating) {
    this.trackEvent('review_submit', {
      app_id: appId,
      rating: rating
    });
  }

  /**
   * Track share action
   * @param {string} platform - Platform (facebook, twitter, whatsapp, etc.)
   * @param {string} contentType - Content type (app, blog_post, list)
   * @param {string} contentId - Content ID
   */
  trackShare(platform, contentType, contentId) {
    this.trackEvent('share', {
      platform: platform,
      content_type: contentType,
      content_id: contentId
    });
  }

  /**
   * Get or create session ID
   * @returns {string} Session ID
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('vibestore_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('vibestore_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * Track time on page
   */
  trackTimeOnPage() {
    const startTime = Date.now();
    
    // Track when user leaves page
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000); // seconds
      if (timeOnPage > 5) { // Only track if user spent more than 5 seconds
        this.trackEvent('time_on_page', {
          time_seconds: timeOnPage,
          path: window.location.pathname
        });
      }
    });

    // Also track on visibility change (tab switch)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        if (timeOnPage > 5) {
          this.trackEvent('time_on_page', {
            time_seconds: timeOnPage,
            path: window.location.pathname
          });
        }
      }
    });
  }
}

// Create singleton instance
const analytics = new Analytics();

// Auto-initialize
if (typeof window !== 'undefined') {
  window.Analytics = analytics;
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      analytics.init();
      
      // Track initial page view
      analytics.trackPageView();
      
      // Track time on page
      analytics.trackTimeOnPage();
    });
  } else {
    analytics.init();
    analytics.trackPageView();
    analytics.trackTimeOnPage();
  }

  // Track page views on navigation (for SPA-like behavior)
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      analytics.trackPageView();
    }
  }, 1000);
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Analytics, analytics };
}
