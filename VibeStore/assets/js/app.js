// VibeStore — app.js (enhanced with dynamic features)
// - Mobile nav toggle
// - Reveal-on-scroll animations
// - Dynamic background parallax
// - Header scroll effects
// - Featured/Popular filter
// - Basic search param helper

(function(){
  // Mobile nav toggle
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('.menu-toggle');
  if (toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Header scroll effects
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Add scrolled class for styling
    if (currentScrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });

  // Dynamic background parallax
  const shapes = document.querySelectorAll('.floating-shape');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    shapes.forEach((shape, index) => {
      const speed = 0.5 + (index * 0.2);
      const yPos = -(scrollY * speed);
      shape.style.transform = `translateY(${yPos}px)`;
    });
  });

  // Reveal cards on scroll
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  items.forEach(el=> io.observe(el));

  // Featured/Popular filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const marketplaceGrid = document.getElementById('marketplace-grid');

  // All data now comes from Firestore - no more demo data!

  // Image loading functions removed - will be rebuilt

  async function renderApps(filter) {
    if (!marketplaceGrid) return;

    // Show loading state
    marketplaceGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted);">Loading apps...</div>';

    try {
      let apps = [];

      // Fetch apps from Firestore based on filter
      if (window.VibeStoreFirestore) {
        try {
          if (filter === 'featured') {
            apps = await window.VibeStoreFirestore.fetchFeaturedApps();
          } else if (filter === 'popular') {
            apps = await window.VibeStoreFirestore.fetchPopularApps();
          } else if (filter === 'editors-choice') {
            apps = await window.VibeStoreFirestore.fetchEditorsChoice();
          }
        } catch (error) {
          apps = [];
        }
      } else {
        apps = [];
      }

      // Clear loading and render apps
      marketplaceGrid.innerHTML = '';

      if (apps.length === 0) {
        // Show demo apps when no real apps are available
        const demoApps = [
          {
            id: 'demo-1',
            title: 'Work Attendance Reminder',
            description: 'Mini web app to remind employees to clock in/out on time.',
            niche: 'web',
            category: 'Productivity',
            rating: 4.7,
            usersCount: 32,
            imageUrl: null
          },
          {
            id: 'demo-2',
            title: 'Budget Buddy',
            description: 'Simple personal budget tracker for weekly expenses.',
            niche: 'mobile',
            category: 'Finance',
            rating: 4.5,
            usersCount: 48,
            imageUrl: null
          },
          {
            id: 'demo-3',
            title: 'Support Agent on WhatsApp',
            description: 'AI assistant that answers common support requests in WhatsApp.',
            niche: 'whatsapp',
            category: 'Support',
            rating: 4.2,
            usersCount: 21,
            imageUrl: null
          }
        ];

        apps = demoApps;
      }

      apps.forEach(app => {
        const cardHTML = createCardHTML(app);
        marketplaceGrid.insertAdjacentHTML('beforeend', cardHTML);
      });

      // Re-observe new cards for reveal animation
      const newCards = marketplaceGrid.querySelectorAll('.reveal');
      newCards.forEach(card => io.observe(card));

      // Add click handlers for favorite functionality
      addCardClickHandlers();

      // Update favorite buttons if favorites manager is ready
      if (window.favoritesManager && window.favoritesManager.initialized) {
        if (window.updateFavoriteButtons) {
          // Only update buttons for newly created cards, not all buttons
          const newCards = marketplaceGrid.querySelectorAll('.app-card:not([data-initialized])');
          newCards.forEach(card => {
            card.setAttribute('data-initialized', 'true');
          });
          window.updateFavoriteButtons();
        }
      } else {
        }

      // Image loading removed - will be rebuilt

    } catch (error) {
      console.error('Error rendering apps:', error);
      marketplaceGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted);">Error loading apps. Please try again.</div>';
    }
  }

  // Make functions globally available
  window.createCardHTML = function(app) {
    return createAppCard(app);
  }

  // Create app card with new design
  function createAppCard(app) {
    const rating = app.rating_avg || app.rating || 0;
    const category = app.category || 'App';
    const title = app.title || 'Untitled App';
    const description = app.description || 'No description available';
    const appId = app.id || app.firestoreId || 'demo';
    const usersCount = app.usersCount || 0;

    // Generate stars based on rating
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

    // Get appropriate icon based on niche or user uploaded image
    let appIcon = '📱';
    if (app.niche === 'web') appIcon = '🌐';
    else if (app.niche === 'mobile') appIcon = '📱';
    else if (app.niche === 'whatsapp') appIcon = '💬';

    // Check if user uploaded an image
    const appImageUrl = app.imageUrl || app.image;
    const hasCustomImage = appImageUrl && appImageUrl.trim() !== '';

    // Check if app is favorited
    const isFavorited = window.favoritesManager && window.favoritesManager.initialized
      ? window.favoritesManager.isFavorited(appId)
      : false;

    const heartClass = isFavorited ? 'action-btn heart-btn favorited' : 'action-btn heart-btn';
    const heartFill = isFavorited ? 'currentColor' : 'none';
    const heartTitle = isFavorited ? 'Remove from favorites' : 'Add to favorites';

    return `
      <article class="app-card" data-app-id="${appId}" data-niche="${app.niche || 'web'}" data-initialized="false">
        <div class="card-header" onclick="trackAppCardClick('${appId}', 'home_card_header'); window.location.href='/pages/app?id=${appId}'" style="cursor: pointer;">
          <div class="app-icon">
            ${hasCustomImage
              ? `<img src="${appImageUrl}" alt="${title} Icon" class="app-icon-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                 <div class="app-icon-fallback" style="display: none;">${appIcon}</div>`
              : appIcon
            }
          </div>
          <div class="app-info">
            <h3 class="app-title">${title}</h3>
            <div class="app-meta">
              <div class="app-meta-left">
                <span class="category-tag">${category}</span>
                <div class="rating">
                  <span class="stars">${stars}</span>
                  <span class="rating-value">${rating.toFixed ? rating.toFixed(1) : rating}</span>
                </div>
              </div>
              <div class="app-meta-right">
                <div class="users-count">
                  <div class="number">${usersCount}</div>
                  <div class="label">clicks</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-body" onclick="trackAppCardClick('${appId}', 'home_card_body'); window.location.href='/pages/app?id=${appId}'" style="cursor: pointer;">
          <p class="app-description">${description}</p>
        </div>

        <div class="card-footer">
          <button class="${heartClass}" data-app-id="${appId}" title="${heartTitle}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="${heartFill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  // Filter button event listeners
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      // Render apps for selected filter
      const filter = btn.dataset.filter;
      renderApps(filter);
    });
  });

  // Category button navigation
  const categoryButtons = document.querySelectorAll('.category-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      // Navigate to results page with category filter
      const resultsUrl = new URL(window.location.origin + '/pages/results');
      resultsUrl.searchParams.set('category', category);
      window.location.href = resultsUrl.toString();
    });
  });

  // Helper function to update URL parameters
  function updateURL(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
      if (params[key] && params[key] !== 'all') {
        url.searchParams.set(key, params[key]);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, '', url);
  }

  // Make functions globally available
  window.addCardClickHandlers = function() {
    // Card click to app details (excluding action buttons)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.card-v2') && !e.target.closest('.action-btn-v2')) {
        const card = e.target.closest('.card-v2');
        const appId = card.dataset.appId;

        if (appId) {
          window.location.href = `/pages/app?id=${appId}`;
        }
      }
    });

    // Heart button - add to favorites (handled by favorites.js)
    // This functionality is now handled by VibeStoreFavorites.initializeFavoriteButtons()

  }

  // Make renderApps globally available
  window.renderApps = renderApps;

  // Initialize with featured apps immediately
  if (marketplaceGrid) {
    // Load featured apps immediately without waiting for favorites manager
    renderApps('featured');

    // Set up favorites manager listener for when it becomes available
    const setupFavoritesListener = () => {
      if (window.favoritesManager) {
        // Add listener for future changes
        window.favoritesManager.addListener(() => {
          if (window.updateFavoriteButtons) {
            window.updateFavoriteButtons();
          }
        });
      } else {
        // Check again in 100ms
        setTimeout(setupFavoritesListener, 100);
      }
    };

    // Start setting up favorites listener
    setupFavoritesListener();
  }

  // Check if current user is admin
  window.isUserAdmin = async function() {
    if (!window.$fb || !window.$fb.auth || !window.$fb.auth.currentUser) {
      return false;
    }

    try {
      const user = window.$fb.auth.currentUser;

      // Check admin claims from Firebase Auth
      const idTokenResult = await user.getIdTokenResult();
      return idTokenResult.claims.admin === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  // Real Firebase Authentication state management
  function updateNavigation() {
    const guestNav = document.getElementById('nav-guest');
    const authNav = document.getElementById('nav-authenticated');
    const userName = document.getElementById('user-name');

    // Wait for Firebase to initialize
    if (!window.$fb || !window.$fb.auth) {
      setTimeout(updateNavigation, 100);
      return;
    }

    const user = window.$fb.auth.currentUser;

    if (user && guestNav && authNav && userName) {
      // User is authenticated - show authenticated nav
      guestNav.style.display = 'none';
      authNav.style.display = 'flex';

      // Create 2-letter initials from user name or email (English only)
      let initials = 'US';

      if (user.displayName) {
        const firstName = user.displayName.split(' ')[0];
        // Check if firstName contains only English letters
        const englishOnly = /^[A-Za-z]+$/;

        if (englishOnly.test(firstName)) {
          // Use first 2 letters of first name if it's English
          initials = firstName.substring(0, 2).toUpperCase();
        } else if (user.email) {
          // If name is not English (e.g., Hebrew), use email
          initials = user.email.substring(0, 2).toUpperCase();
        }
      } else if (user.email) {
        // Use first 2 characters of email
        initials = user.email.substring(0, 2).toUpperCase();
      }

      userName.textContent = initials;
    } else if (guestNav && authNav) {
      // User is not authenticated - show guest nav
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
      // Guest circle - go to auth page
      window.location.href = '/pages/auth';
    } else if (userCircle || userAvatar) {
      // Authenticated user circle - go to profile page
      window.location.href = '/pages/profile/';
    }
  });

  // Listen for Firebase auth state changes
  const initializeAuthListener = () => {
    if (window.$fb && window.$fb.authMod) {
      window.$fb.authMod.onAuthStateChanged(window.$fb.auth, (user) => {
        updateNavigation();

        // Keep sign in button text consistent
        const signBtn = document.querySelector('a[href$="/pages/auth"]');
        if (signBtn) {
          signBtn.textContent = 'Sign in';
        }
      });
    } else {
      setTimeout(initializeAuthListener, 100);
    }
  };

  // Initialize auth listener
  initializeAuthListener();

  // Helper: read query param
  window.getQueryParam = function(key){
    const url = new URL(window.location.href);
    return url.searchParams.get(key) || "";
  };

  // Firebase authentication is now fully integrated

  // Results page functionality
  if (window.location.pathname.includes('/pages/results')) {
    initResultsPage();
  }

  async function initResultsPage() {
    const resultsGrid = document.getElementById('results-grid');
    const nicheFilters = document.querySelectorAll('.niche-filter');
    const sortSelect = document.getElementById('sort-select');
    const searchInput = document.getElementById('search-input');
    const resultsCount = document.getElementById('results-count');

    // Initialize current filters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const currentQuery = urlParams.get('q') || '';
    const currentNiche = urlParams.get('niche') || 'all';
    const currentSort = urlParams.get('sort') || 'trending';

    // Set initial values
    if (searchInput) searchInput.value = currentQuery;
    if (sortSelect) sortSelect.value = currentSort;

    // Set active filters
    nicheFilters.forEach(f => {
      f.classList.toggle('active', f.dataset.niche === currentNiche);
    });

    // Load initial results
    await loadResultsPage(currentNiche, currentSort, currentQuery);

    // Niche filtering
    nicheFilters.forEach(filter => {
      filter.addEventListener('click', async () => {
        // Update active filter
        nicheFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');

        // Update URL and reload
        const newNiche = filter.dataset.niche;
        updateURL({ niche: newNiche });
        await loadResultsPage(newNiche, currentSort, currentQuery);
      });
    });

    // Sort change
    if (sortSelect) {
      sortSelect.addEventListener('change', async () => {
        const newSort = sortSelect.value;
        updateURL({ sort: newSort });
        await loadResultsPage(currentNiche, newSort, currentQuery);
      });
    }

    // Search form submission
    const searchForm = document.querySelector('.search');
    if (searchForm) {
      searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        updateURL({ q: query });
        await loadResultsPage(currentNiche, currentSort, query);
      });
    }
  }

  async function loadResultsPage(niche = 'all', sort = 'trending', query = '') {
    // Use the new search UI module if available
    if (window.VibeStoreSearchUI && window.VibeStoreSearchEngine) {
      const options = {
        niche: niche !== 'all' ? niche : null,
        sortBy: sort
      };

      await window.VibeStoreSearchUI.handleSearchInput(query, options);
      return;
    }

    // Fallback to old implementation if search modules not loaded
    const resultsGrid = document.getElementById('results-grid');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const resultsCount = document.getElementById('results-count');

    if (!resultsGrid) return;

    // Show loading state
    resultsGrid.style.display = 'none';
    if (loadingState) loadingState.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';

    try {
      let apps = [];

      // Fetch from Firestore
      if (window.VibeStoreFirestore) {
        const filters = {};
        if (niche !== 'all') filters.niche = niche;
        if (sort !== 'trending') filters.sortBy = sort;

        apps = await window.VibeStoreFirestore.fetchAppsFromFirestore(filters);

        // Apply search query if provided
        if (query && query.trim()) {
          apps = await window.VibeStoreFirestore.searchApps(query, filters);
        }
      }

      // Hide loading state
      if (loadingState) loadingState.style.display = 'none';
      resultsGrid.style.display = 'grid';

      // Update results count
      if (resultsCount) {
        const countText = apps.length === 1 ? '1 app found' : `${apps.length} apps found`;
        if (query && query.trim()) {
          resultsCount.textContent = `${countText} for "${query}"`;
        } else {
          resultsCount.textContent = countText;
        }
      }

      // Clear and render
      resultsGrid.innerHTML = '';

      if (apps.length === 0) {
        resultsGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      apps.forEach(app => {
        const cardHTML = createCardHTML(app);
        resultsGrid.insertAdjacentHTML('beforeend', cardHTML);
      });

      // Re-observe new cards for reveal animation
      const newCards = resultsGrid.querySelectorAll('.reveal');
      newCards.forEach(card => io.observe(card));

      // Add click handlers for card interactions
      addCardClickHandlers();

      // Image loading removed - will be rebuilt

    } catch (error) {
      console.error('Error loading results:', error);
      if (loadingState) loadingState.style.display = 'none';
      resultsGrid.style.display = 'none';
      if (emptyState) {
        emptyState.style.display = 'block';
        emptyState.querySelector('h3').textContent = 'Error loading apps';
        emptyState.querySelector('p').textContent = 'Please try again later.';
      }
    }
  }

  function createSquareHTML(app) {
    const rating = app.rating_avg || app.rating || 0;
    const niche = Array.isArray(app.niche) ? app.niche[0] : app.niche; // Use first niche for stats
    const usersCount = niche === 'mobile' ? '1M+' : niche === 'whatsapp' ? '70K+' : '900K+';
    const reviewCount = app.rating_count || app.reviews || 0;
    const likesCount = app.likesCount || 0;

    return `
      <div class="app-square" data-niche="${Array.isArray(app.niche) ? app.niche.join(',') : app.niche}" data-app-id="${app.id}">
        <div class="square-content">
          <div class="app-header">
            <h3 class="app-title">${app.title}</h3>
            <div class="app-rating">
              <span>${rating.toFixed ? rating.toFixed(1) : rating}</span>
              <span>★</span>
            </div>
          </div>
          <p class="app-category">${app.category}</p>
          <div class="app-stats">
            <span class="users-count">${usersCount}</span>
            <span class="downloads">Downloads</span>
            <span class="likes-count">❤️ ${likesCount}</span>
          </div>
        </div>

        <!-- Expanded content (hidden by default) -->
        <div class="expanded-content">
          <p class="app-description">${app.description}</p>
          <div class="app-details">
            <div class="detail-item">
              <span class="label">Platform:</span>
              <span class="value">${app.platform}</span>
            </div>
            <div class="detail-item">
              <span class="label">Reviews:</span>
              <span class="value">${reviewCount} reviews</span>
            </div>
            <div class="detail-item">
              <span class="label">Likes:</span>
              <span class="value">${likesCount} likes</span>
            </div>
          </div>
          <div class="app-actions">
            <a href="/pages/app?id=${app.id}" class="btn-view">View Details</a>
            <a href="${app.link}" class="btn-open" target="_blank">Open App</a>
          </div>
        </div>
      </div>
    `;
  }

  // Initialize filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      // Render apps with selected filter
      const filter = btn.dataset.filter;
      renderApps(filter);
    });
  });

  // Initialize category buttons (duplicate - already initialized above)
  // const categoryButtons = document.querySelectorAll('.category-btn');
  // categoryButtons.forEach(btn => {
  //   btn.addEventListener('click', () => {
  //     const category = btn.dataset.category;
  //     // For now, just show featured apps when category is clicked
  //     // Later this can be enhanced to filter by category
  //     renderApps('featured');
  //   });
  // });

})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Re-initialize if elements weren't found earlier
  const marketplaceGrid = document.getElementById('marketplace-grid');
  if (marketplaceGrid && marketplaceGrid.innerHTML.trim() === '') {
    if (window.renderApps) {
      // Load featured apps immediately without waiting for favorites manager
      window.renderApps('featured');

      // Set up favorites manager listener for when it becomes available
      const setupFavoritesListener = () => {
        if (window.favoritesManager) {
          // Add listener for future changes
          window.favoritesManager.addListener(() => {
            updateFavoriteButtons();
          });
        } else {
          // Check again in 100ms
          setTimeout(setupFavoritesListener, 100);
        }
      };

      // Start setting up favorites listener
      setupFavoritesListener();
    } else {
      // Fallback: render demo apps directly
      const demoApps = [
        {
          id: 'demo-1',
          title: 'Work Attendance Reminder',
          description: 'Mini web app to remind employees to clock in/out on time.',
          niche: 'web',
          category: 'Productivity',
          rating: 4.7,
          usersCount: 32,
          imageUrl: null
        },
        {
          id: 'demo-2',
          title: 'Budget Buddy',
          description: 'Simple personal budget tracker for weekly expenses.',
          niche: 'mobile',
          category: 'Finance',
          rating: 4.5,
          usersCount: 48,
          imageUrl: null
        },
        {
          id: 'demo-3',
          title: 'Support Agent on WhatsApp',
          description: 'AI assistant that answers common support requests in WhatsApp.',
          niche: 'whatsapp',
          category: 'Support',
          rating: 4.2,
          usersCount: 21,
          imageUrl: null
        }
      ];

      demoApps.forEach(app => {
        if (window.createCardHTML) {
          const cardHTML = window.createCardHTML(app);
          marketplaceGrid.insertAdjacentHTML('beforeend', cardHTML);
        }
      });
    }
  }

  // Track app card clicks
  function trackAppCardClick(appId, source) {
    if (window.trackAppClick) {
      const canTrack = window.trackAppClick(appId, source);
      if (canTrack) {
        } else {
        }
    } else {
      }
  }

  // Export tracking function globally
  window.trackAppCardClick = trackAppCardClick;
});
