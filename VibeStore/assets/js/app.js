// VibeStore — Main Application Entry Point
// Initializes all core modules and features

(function() {
  // Import modules will be loaded via script tags for now
  // (we maintain backward compatibility with non-module system)

  // Initialize core modules when DOM is ready
  function initializeApp() {
    // Wait for Firebase to be available
    const checkFirebase = setInterval(() => {
      if (window.$fb && window.$fb.auth && window.$fb.db) {
        clearInterval(checkFirebase);
        startInitialization();
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkFirebase);
      startInitialization();
    }, 5000);
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
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Auth state management
  function updateNavigation() {
    const guestNav = document.getElementById('nav-guest');
    const authNav = document.getElementById('nav-authenticated');
    const userName = document.getElementById('user-name');

    if (!window.$fb || !window.$fb.auth) {
      setTimeout(updateNavigation, 100);
      return;
    }

    const user = window.$fb.auth.currentUser;

    if (user && guestNav && authNav && userName) {
      guestNav.style.display = 'none';
      authNav.style.display = 'flex';

      let initials = 'US';
      if (user.displayName) {
        const firstName = user.displayName.split(' ')[0];
        const englishOnly = /^[A-Za-z]+$/;
        if (englishOnly.test(firstName)) {
          initials = firstName.substring(0, 2).toUpperCase();
        } else if (user.email) {
          initials = user.email.substring(0, 2).toUpperCase();
        }
      } else if (user.email) {
        initials = user.email.substring(0, 2).toUpperCase();
      }
      userName.textContent = initials;
    } else if (guestNav && authNav) {
      guestNav.style.display = 'flex';
      authNav.style.display = 'none';
    }
  }

  // User circle/avatar click handler
  document.addEventListener('click', (e) => {
    const guestCircle = e.target.closest('#guest-circle');
    const userCircle = e.target.closest('#user-circle');
    const userAvatar = e.target.closest('.user-avatar');

    if (guestCircle) {
      window.location.href = '/pages/auth';
    } else if (userCircle || userAvatar) {
      window.location.href = '/pages/profile/';
    }
  });

  // Initialize auth listener
  const initializeAuthListener = () => {
    if (window.$fb && window.$fb.authMod) {
      window.$fb.authMod.onAuthStateChanged(window.$fb.auth, (user) => {
        updateNavigation();
        const signBtn = document.querySelector('a[href$="/pages/auth"]');
        if (signBtn) {
          signBtn.textContent = 'Sign in';
        }
      });
    } else {
      setTimeout(initializeAuthListener, 100);
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
