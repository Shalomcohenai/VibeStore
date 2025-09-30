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

  async function renderApps(filter) {
    if (!marketplaceGrid) return;
    
    // Show loading state
    marketplaceGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted);">Loading apps...</div>';
    
    try {
      let apps = [];
      
      // Fetch apps from Firestore based on filter
      if (window.VibeStoreFirestore) {
        if (filter === 'featured') {
          apps = await window.VibeStoreFirestore.fetchFeaturedApps();
        } else if (filter === 'popular') {
          apps = await window.VibeStoreFirestore.fetchPopularApps();
        } else if (filter === 'editors-choice') {
          apps = await window.VibeStoreFirestore.fetchEditorsChoice();
        }
      } else {
        console.warn('VibeStoreFirestore not available - check Firebase connection');
      }
      
      // Clear loading and render apps
      marketplaceGrid.innerHTML = '';
      
      if (apps.length === 0) {
        marketplaceGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted);">No apps found for this category.</div>';
        return;
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
      
    } catch (error) {
      console.error('Error rendering apps:', error);
      marketplaceGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted);">Error loading apps. Please try again.</div>';
    }
  }

  // Make functions globally available
  window.createCardHTML = function(app) {
    const rating = app.rating_avg || app.rating || 0;
    const category = app.category || 'App';
    const title = app.title || 'Untitled App';
    const description = app.description || 'No description available';
    const appId = app.id || app.firestoreId || 'demo';
    
    // Generate stars based on rating
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    
    // Use only V2 design
    return createVersion2Card(app, appId, category, title, description, stars);
  }

  // Version 1: Minimal Clean Design
  function createVersion1Card(app, appId, category, title, description, stars, downloads) {
    return `
      <article class="card card-v1 reveal" data-app-id="${appId}">
        <div class="card-header">
          <span class="category-badge">${category}</span>
          <div class="rating">${stars}</div>
        </div>
        
        <div class="card-content">
          <h3 class="app-title">${title}</h3>
          <p class="app-description">${description}</p>
          <div class="user-count">👥 ${downloads} users</div>
        </div>
        
        <div class="card-actions-v1">
          <button class="action-btn heart-btn" data-app-id="${appId}" title="Add to Favorites">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </button>
          <button class="action-btn plus-btn" data-app-id="${appId}" title="Add to List">+</button>
          <button class="action-btn more-btn" data-app-id="${appId}" title="View Details">⋯</button>
        </div>
      </article>
    `;
  }

  // Version 2: Detailed Rich Design - Updated
  function createVersion2Card(app, appId, category, title, description, stars) {
    const rating = app.rating_avg || app.rating || 0;
    const usersCount = app.usersCount || '1K+';
    const downloadsCount = app.downloadsCount || '500+';
    
    // Get appropriate icon based on niche
    let appIcon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>';
    if (app.niche === 'web') appIcon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.75.75 0 0 1-1.224.87l-.604-.302a1.5 1.5 0 0 0-1.122 0l-.604.302a.75.75 0 0 1-1.224-.87l.165-.33-1.156-.578a4.5 4.5 0 0 1-1.318-1.357Z" clip-rule="evenodd" /></svg>';
    else if (app.niche === 'mobile') appIcon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>';
    else if (app.niche === 'whatsapp') appIcon = '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>';
    
    return `
      <article class="card card-v2 reveal" data-app-id="${appId}" data-niche="${app.niche || 'web'}">
        <div class="card-header-v2">
          <div class="app-icon-v2">${appIcon}</div>
          <div class="header-info">
            <span class="category-tag">${category}</span>
            <div class="rating-v2">
              <span class="stars">${stars}</span>
              <span class="rating-number">${rating.toFixed ? rating.toFixed(1) : rating}</span>
            </div>
          </div>
        </div>
        
        <div class="card-body-v2">
          <h3 class="app-title-v2">${title}</h3>
          <p class="app-description-v2">${description}</p>
          <div class="app-stats-v2">
            <div class="stat-item-v2">
              <span class="stat-icon"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128a9.375 9.375 0 0 0 6.75-1.003v-.003l-.001-.119a.75.75 0 0 0-.364-.63 13.067 13.067 0 0 0-6.761-1.873 13.067 13.067 0 0 0-6.76 1.873.75.75 0 0 0-.364.63l-.001.122a9.375 9.375 0 0 0 6.75 1.003v.003Z" /></svg></span>
              <span class="stat-text">${usersCount} users</span>
            </div>
            <div class="stat-item-v2">
              <span class="stat-icon"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75ZM6.75 15a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15.75a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V15.75a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" /></svg></span>
              <span class="stat-text">${downloadsCount} downloads</span>
            </div>
          </div>
        </div>
        
        <div class="card-footer-v2">
          <button class="action-btn-v2 heart-btn" data-app-id="${appId}" title="Add to favorites">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
          </button>
          <button class="action-btn-v2 plus-btn" data-app-id="${appId}" title="Add to list">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75V18a.75.75 0 0 1-1.5 0v-5.25H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
          </button>
          <button class="action-btn-v2 more-btn" data-app-id="${appId}" title="View details">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
              <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
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
          console.log('Opening app details:', appId);
          window.location.href = `/pages/app?id=${appId}`;
        }
      }
    });
    
    // Heart button - add to favorites (handled by favorites.js)
    // This functionality is now handled by VibeStoreFavorites.initializeFavoriteButtons()
    
    // Plus button - add to list (handled by lists.js)
    // This functionality is now handled by VibeStoreLists.initializeListEventListeners()
    
    // More button - view details
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.more-btn')) {
        e.preventDefault();
        e.stopPropagation();
        
        const btn = e.target.closest('.more-btn');
        const appId = btn.dataset.appId;
        
        if (appId) {
          console.log('Opening app details:', appId);
          window.location.href = `/pages/app?id=${appId}`;
        }
      }
    });
  }

  // Initialize with featured apps
  if (marketplaceGrid) {
    renderApps('featured');
  }

  // Check if current user is admin
  window.isUserAdmin = async function() {
    if (!window.$fb || !window.$fb.auth || !window.$fb.auth.currentUser) {
      return false;
    }
    
    try {
      const user = window.$fb.auth.currentUser;
      
      // Hardcoded admin check (same as admin page)
      if (user.email === 'shalom.cohen.111@gmail.com') {
        console.log('✅ Hardcoded admin user detected:', user.email);
        return true;
      }
      
      // Firebase claims check (for future admins)
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
      
      // Create 2-letter initials from user name or email
      let initials = 'US';
      if (user.displayName) {
        // If display name exists, use first 2 letters of first name
        const firstName = user.displayName.split(' ')[0];
        initials = firstName.substring(0, 2).toUpperCase();
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

  // User circle/avatar click handler (go to profile)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.user-circle') || e.target.closest('.user-avatar')) {
      // Navigate to profile page
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
})();
