// VibeStore — Main Application Entry Point
// Initializes all core modules and features

(function() {
  // Import modules will be loaded via script tags for now
  // (we maintain backward compatibility with non-module system)

  // Initialize core modules when DOM is ready
  async function initializeApp() {
    try {
      // Wait for Firebase with timeout using Promise.race
      const timeout = window.TIME_WINDOWS?.FIREBASE_TIMEOUT_MS || 5000;
      const checkInterval = window.TIME_WINDOWS?.FIREBASE_CHECK_INTERVAL_MS || 100;
      
      const fbPromise = new Promise((resolve) => {
        const check = () => {
          if (window.$fb && window.$fb.auth && window.$fb.db) {
            resolve(window.$fb);
          } else {
            setTimeout(check, checkInterval);
          }
        };
        check();
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Firebase initialization timeout'));
        }, timeout);
      });

      // Wait for Firebase or timeout
      await Promise.race([fbPromise, timeoutPromise]);
      
      // Firebase is ready, start initialization
      startInitialization();
    } catch (error) {
      // Handle timeout or other errors
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'initializeApp', 
          'שגיאה באתחול האפליקציה. אנא רענן את הדף.');
      } else {
        console.error('Error initializing app:', error);
      }
      
      // Try to start anyway (graceful degradation)
      startInitialization();
    }
  }

  function startInitialization() {
    // Initialize core features (these are loaded via script tags)
    if (typeof initNavigation === 'function') {
      initNavigation();
    }
    if (typeof initAnimations === 'function') {
      const io = initAnimations();
      // Share IntersectionObserver with renderer and results
      if (io && window.setIntersectionObserver) {
        window.setIntersectionObserver(io);
      }
    }
    if (typeof initFilters === 'function') {
      initFilters();
    }

    // Initialize results page if on results page
    if (window.location.pathname.includes('/pages/results')) {
      if (typeof initResultsPage === 'function') {
        initResultsPage();
      }
    }

    // Initialize marketplace grid on homepage
    const marketplaceGrid = document.getElementById('marketplace-grid');
    if (marketplaceGrid && marketplaceGrid.innerHTML.trim() === '') {
      if (window.renderApps) {
        window.renderApps('featured');
      }
    }
  }

  // Check if user is admin (for backward compatibility)
  window.isUserAdmin = async function() {
    if (!window.$fb || !window.$fb.auth || !window.$fb.auth.currentUser) {
      return false;
    }

    try {
      const user = window.$fb.auth.currentUser;
      const idTokenResult = await user.getIdTokenResult();
      return idTokenResult.claims.admin === true;
    } catch (error) {
      if (window.ErrorHandler) {
        window.ErrorHandler.handle(error, 'isUserAdmin');
      } else {
        console.error('Error checking admin status:', error);
      }
      return false;
    }
  };

  // Auth state management
  function updateNavigation() {
    const guestNav = document.getElementById('nav-guest');
    const authNav = document.getElementById('nav-authenticated');
    const userIcon = document.getElementById('user-icon');
    const userName = document.getElementById('user-name');

    if (!window.$fb || !window.$fb.auth) {
      const checkInterval = window.TIME_WINDOWS?.FIREBASE_CHECK_INTERVAL_MS || 100;
      setTimeout(updateNavigation, checkInterval);
      return;
    }

    const user = window.$fb.auth.currentUser;

    if (user && guestNav && authNav && userIcon && userName) {
      guestNav.style.display = 'none';
      authNav.style.display = 'flex';

      // Get username from displayName or email
      let username = 'User';
      if (user.displayName) {
        username = user.displayName.split(' ')[0]; // Take first name only
      } else if (user.email) {
        username = user.email.split('@')[0]; // Take part before @
      }
      userName.textContent = username;
    } else if (guestNav && authNav) {
      guestNav.style.display = 'flex';
      authNav.style.display = 'none';
    }
  }

  // User icon/avatar click handler
  document.addEventListener('click', (e) => {
    const guestCircle = e.target.closest('#guest-circle');
    const userIcon = e.target.closest('#user-icon');
    const userAvatar = e.target.closest('.user-avatar');

    if (guestCircle) {
      window.location.href = '/pages/auth';
    } else if (userIcon || userAvatar) {
      window.location.href = '/pages/profile/';
    }
  });

  // Initialize auth listener
  const initializeAuthListener = () => {
    if (window.$fb && window.$fb.authMod) {
      window.$fb.authMod.onAuthStateChanged(window.$fb.auth, async (user) => {
        updateNavigation();
        const signBtn = document.querySelector('a[href$="/pages/auth"]');
        if (signBtn) {
          signBtn.textContent = 'Sign in';
        }

        // Initialize lists manager automatically when user logs in/out
        if (window.listsManager) {
          try {
            await window.listsManager.initialize(user);
          } catch (error) {
            if (window.ErrorHandler) {
              window.ErrorHandler.handle(error, 'initializeAuthListener.listsManager');
            } else {
              console.error('Error initializing lists manager:', error);
            }
          }
        }
      });
    } else {
      const checkInterval = window.TIME_WINDOWS?.FIREBASE_CHECK_INTERVAL_MS || 100;
      setTimeout(initializeAuthListener, checkInterval);
    }
  };

  // Track app card clicks
  window.trackAppCardClick = function(appId, source) {
    if (window.trackAppClick) {
      window.trackAppClick(appId, source);
    }
  };

  // Add card click handlers (for backward compatibility)
  window.addCardClickHandlers = function() {
    // This is handled by favorites.js or other modules
    // Just a placeholder for now
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeAuthListener();
      initializeApp();
    });
  } else {
    initializeAuthListener();
    initializeApp();
  }

})();
