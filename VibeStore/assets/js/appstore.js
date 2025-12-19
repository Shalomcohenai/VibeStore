/**
 * VibeStore - App Store Layout JavaScript
 * Handles filtering, searching, sorting, and rendering for the App Store layout
 */

(function() {
  'use strict';

  // State
  let allApps = [];
  let filteredApps = [];
  let currentCategory = 'all';
  let currentSort = 'trending';
  let currentSearch = '';
  let featuredCarouselInterval = null;
  let currentFeaturedIndex = 0;
  let featuredApps = [];

  // Initialize when DOM is ready
  function init() {
    // Wait for Firebase to be available
    const checkFirebase = setInterval(() => {
      if (window.$fb && window.$fb.auth && window.$fb.db) {
        clearInterval(checkFirebase);
        startAppStore();
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkFirebase);
      startAppStore();
    }, 5000);
  }

  function startAppStore() {
    setupEventListeners();
    loadApps();
  }

  // Setup event listeners
  function setupEventListeners() {
    // Category filters
    const categoryLinks = document.querySelectorAll('.vya-appstore-category-link');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        setActiveCategory(category);
        filterApps();
      });
    });

    // Search input
    const searchInput = document.getElementById('vya-appstore-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        filterApps();
      });
    }

    // Sort icons
    const sortIcons = document.querySelectorAll('.vya-appstore-sort-icon');
    sortIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        const sortValue = icon.dataset.sort;
        currentSort = sortValue;
        // Update active state
        sortIcons.forEach(i => i.classList.remove('active'));
        icon.classList.add('active');
        filterApps();
      });
    });
    
    // Set initial active state
    const initialSortIcon = document.querySelector(`.vya-appstore-sort-icon[data-sort="${currentSort}"]`);
    if (initialSortIcon) {
      initialSortIcon.classList.add('active');
    }

    // Mobile card tap to expand
    if (window.innerWidth <= 768) {
      document.addEventListener('click', (e) => {
        const card = e.target.closest('.vya-appstore-card');
        if (card && !e.target.closest('a')) {
          e.preventDefault();
          card.classList.toggle('expanded');
        }
      });
    }

    // Smooth scroll for hero CTA
    const heroCTA = document.querySelector('.vya-appstore-hero-cta-primary[href="#app-store"]');
    if (heroCTA) {
      heroCTA.addEventListener('click', (e) => {
        e.preventDefault();
        const appStore = document.getElementById('app-store');
        if (appStore) {
          appStore.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Pause carousel on hover
    const featuredGallery = document.getElementById('vya-appstore-featured-gallery');
    if (featuredGallery) {
      featuredGallery.addEventListener('mouseenter', stopFeaturedCarousel);
      featuredGallery.addEventListener('mouseleave', () => {
        if (featuredApps.length > 1) {
          startFeaturedCarousel();
        }
      });
    }
  }

  // Set active category
  function setActiveCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.vya-appstore-category-link').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.category === category) {
        link.classList.add('active');
      }
    });
  }

  // Load apps from Firestore
  async function loadApps() {
    try {
      let apps = [];

      // Try to fetch from Firestore
      if (window.VibeStoreFirestore) {
        try {
          // Fetch all approved apps
          apps = await window.VibeStoreFirestore.fetchAppsFromFirestore({ limit: 100 });
        } catch (error) {
          console.error('Error fetching apps:', error);
          apps = [];
        }
      }

      // If no apps, use demo data
      if (apps.length === 0) {
        apps = getDemoApps();
      }

      allApps = apps;
      filterApps();
    } catch (error) {
      console.error('Error loading apps:', error);
      allApps = getDemoApps();
      filterApps();
    }
  }

  // Get demo apps for fallback
  function getDemoApps() {
    return [
      {
        id: 'demo-1',
        firestoreId: 'demo-1',
        title: 'Work Attendance Reminder',
        description: 'Mini web app to remind employees to clock in/out on time. Perfect for small teams.',
        niche: 'web',
        category: 'Productivity',
        rating: 4.7,
        rating_avg: 4.7,
        usersCount: 32,
        imageUrl: null,
        featured: { active: true },
        isTrending: true,
        isNew: false,
        tags: ['Web', 'Productivity', 'HR'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-2',
        firestoreId: 'demo-2',
        title: 'Budget Buddy',
        description: 'Simple personal budget tracker for weekly expenses. Track your spending effortlessly.',
        niche: 'mobile',
        category: 'Finance',
        rating: 4.5,
        rating_avg: 4.5,
        usersCount: 48,
        imageUrl: null,
        featured: { active: false },
        isTrending: true,
        isNew: true,
        tags: ['Mobile', 'Finance', 'Personal'],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-3',
        firestoreId: 'demo-3',
        title: 'Support Agent on WhatsApp',
        description: 'AI assistant that answers common support requests in WhatsApp automatically.',
        niche: 'whatsapp',
        category: 'Support',
        rating: 4.2,
        rating_avg: 4.2,
        usersCount: 21,
        imageUrl: null,
        featured: { active: false },
        isTrending: false,
        isNew: false,
        tags: ['WhatsApp', 'AI', 'Support'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-4',
        firestoreId: 'demo-4',
        title: 'Task Manager Pro',
        description: 'Advanced task management with team collaboration features.',
        niche: 'web',
        category: 'Productivity',
        rating: 4.8,
        rating_avg: 4.8,
        usersCount: 156,
        imageUrl: null,
        featured: { active: true },
        isTrending: true,
        isNew: false,
        tags: ['Web', 'Productivity', 'Team'],
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-5',
        firestoreId: 'demo-5',
        title: 'Invoice Generator',
        description: 'Create professional invoices in seconds. Export to PDF.',
        niche: 'web',
        category: 'Finance',
        rating: 4.6,
        rating_avg: 4.6,
        usersCount: 89,
        imageUrl: null,
        featured: { active: false },
        isTrending: false,
        isNew: true,
        tags: ['Web', 'Finance', 'Business'],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-6',
        firestoreId: 'demo-6',
        title: 'WhatsApp Order Bot',
        description: 'Automated order processing via WhatsApp for small businesses.',
        niche: 'whatsapp',
        category: 'E-commerce',
        rating: 4.4,
        rating_avg: 4.4,
        usersCount: 67,
        imageUrl: null,
        featured: { active: false },
        isTrending: true,
        isNew: false,
        tags: ['WhatsApp', 'E-commerce', 'Automation'],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-7',
        firestoreId: 'demo-7',
        title: 'Code Snippet Manager',
        description: 'Organize and share your code snippets with your team.',
        niche: 'web',
        category: 'Dev-Tools',
        rating: 4.9,
        rating_avg: 4.9,
        usersCount: 234,
        imageUrl: null,
        featured: { active: false },
        isTrending: true,
        isNew: false,
        tags: ['Web', 'Developer Tools', 'Code'],
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-8',
        firestoreId: 'demo-8',
        title: 'Learning Tracker',
        description: 'Track your learning progress across different courses and skills.',
        niche: 'mobile',
        category: 'Education',
        rating: 4.3,
        rating_avg: 4.3,
        usersCount: 45,
        imageUrl: null,
        featured: { active: false },
        isTrending: false,
        isNew: true,
        tags: ['Mobile', 'Education', 'Learning'],
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-9',
        firestoreId: 'demo-9',
        title: 'Social Media Scheduler',
        description: 'Schedule posts across multiple social media platforms.',
        niche: 'web',
        category: 'Marketing',
        rating: 4.5,
        rating_avg: 4.5,
        usersCount: 123,
        imageUrl: null,
        featured: { active: false },
        isTrending: true,
        isNew: false,
        tags: ['Web', 'Marketing', 'Social Media'],
        createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-10',
        firestoreId: 'demo-10',
        title: 'Expense Report Generator',
        description: 'Automatically generate expense reports from receipts.',
        niche: 'web',
        category: 'Finance',
        rating: 4.7,
        rating_avg: 4.7,
        usersCount: 78,
        imageUrl: null,
        featured: { active: false },
        isTrending: false,
        isNew: false,
        tags: ['Web', 'Finance', 'Automation'],
        createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-11',
        firestoreId: 'demo-11',
        title: 'Customer Feedback Bot',
        description: 'Collect and analyze customer feedback via WhatsApp.',
        niche: 'whatsapp',
        category: 'Support',
        rating: 4.6,
        rating_avg: 4.6,
        usersCount: 92,
        imageUrl: null,
        featured: { active: false },
        isTrending: true,
        isNew: false,
        tags: ['WhatsApp', 'Support', 'Feedback'],
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'demo-12',
        firestoreId: 'demo-12',
        title: 'Team Standup Reminder',
        description: 'Automated reminders for daily team standups via WhatsApp.',
        niche: 'whatsapp',
        category: 'Productivity',
        rating: 4.4,
        rating_avg: 4.4,
        usersCount: 56,
        imageUrl: null,
        featured: { active: false },
        isTrending: false,
        isNew: true,
        tags: ['WhatsApp', 'Productivity', 'Team'],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  // Filter and sort apps
  function filterApps() {
    filteredApps = [...allApps];

    // Filter by category
    if (currentCategory !== 'all') {
      if (currentCategory === 'web' || currentCategory === 'mobile' || currentCategory === 'whatsapp') {
        filteredApps = filteredApps.filter(app => {
          // Handle niche as array or string
          const niche = app.niche;
          if (Array.isArray(niche)) {
            return niche.includes(currentCategory);
          }
          return niche === currentCategory;
        });
      } else {
        filteredApps = filteredApps.filter(app => app.category === currentCategory);
      }
    }

    // Filter by search
    if (currentSearch) {
      filteredApps = filteredApps.filter(app => {
        const title = (app.title || '').toLowerCase();
        const desc = (app.description || '').toLowerCase();
        const tags = Array.isArray(app.tags) 
          ? app.tags.join(' ').toLowerCase()
          : (app.tags || '').toLowerCase();
        const category = (app.category || '').toLowerCase();
        return title.includes(currentSearch) || 
               desc.includes(currentSearch) || 
               tags.includes(currentSearch) ||
               category.includes(currentSearch);
      });
    }

    // Sort apps
    filteredApps.sort((a, b) => {
      if (currentSort === 'trending') {
        const aTrending = (a.isTrending || a.featured?.active) ? 1 : 0;
        const bTrending = (b.isTrending || b.featured?.active) ? 1 : 0;
        if (aTrending !== bTrending) return bTrending - aTrending;
        return (b.usersCount || 0) - (a.usersCount || 0);
      } else if (currentSort === 'new') {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      } else if (currentSort === 'top-rated') {
        return (b.rating_avg || b.rating || 0) - (a.rating_avg || a.rating || 0);
      }
      return 0;
    });

    renderApps();
  }

  // Render all app sections
  function renderApps() {
    // Check if search is active
    if (currentSearch && currentSearch.trim()) {
      // Hide all existing galleries
      hideAllGalleries();
      // Show and render search results
      renderSearchResults();
    } else {
      // Show all existing galleries
      showAllGalleries();
      // Hide search results
      hideSearchResults();
      // Render normal galleries
      renderFeatured();
      renderPopular();
      renderTrending();
      renderNew();
      renderRecommended();
    }
    
    // Color icons after rendering
    setTimeout(colorIcons, 100);
  }

  // Render featured spotlight carousel
  function renderFeatured() {
    const gallery = document.getElementById('vya-appstore-featured-gallery');
    const indicators = document.getElementById('vya-appstore-featured-indicators');
    if (!gallery || !indicators) return;

    // Get featured apps (prioritize featured, then trending, then popular)
    featuredApps = [
      ...filteredApps.filter(app => app.featured?.active),
      ...filteredApps.filter(app => app.isTrending && !app.featured?.active),
      ...filteredApps.filter(app => !app.featured?.active && !app.isTrending)
    ].slice(0, 5); // Show up to 5 apps

    if (featuredApps.length === 0) {
      gallery.innerHTML = '';
      indicators.innerHTML = '';
      return;
    }

    // Reset carousel
    currentFeaturedIndex = 0;
    if (featuredCarouselInterval) {
      clearInterval(featuredCarouselInterval);
    }

    // Render gallery items
    gallery.innerHTML = featuredApps.map((app, index) => {
      const icon = getAppIcon(app);
      const tags = Array.isArray(app.tags) 
        ? app.tags.slice(0, 3)
        : (app.tags ? [app.tags] : [app.category || 'App']).slice(0, 3);
      const appId = app.id || app.firestoreId || 'demo';
      const isActive = index === 0 ? 'active' : '';

      return `
        <div class="vya-appstore-featured-slide ${isActive}" data-index="${index}">
          <div class="vya-appstore-featured-card">
            <div class="vya-appstore-featured-icon">${icon}</div>
            <div class="vya-appstore-featured-content">
              <h3 class="vya-appstore-featured-title">${escapeHtml(app.title || 'Featured App')}</h3>
              <p class="vya-appstore-featured-description">${escapeHtml(app.description || 'No description available.')}</p>
              <div class="vya-appstore-featured-tags">
                ${tags.map(tag => `<span class="vya-appstore-tag">${escapeHtml(tag)}</span>`).join('')}
              </div>
              <a href="/pages/app?id=${appId}" class="vya-appstore-featured-cta">Open</a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Render indicators
    indicators.innerHTML = featuredApps.map((app, index) => {
      const isActive = index === 0 ? 'active' : '';
      return `<button class="vya-appstore-featured-indicator ${isActive}" data-index="${index}" aria-label="Go to slide ${index + 1}"></button>`;
    }).join('');

    // Setup indicator clicks
    indicators.querySelectorAll('.vya-appstore-featured-indicator').forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToFeaturedSlide(index);
      });
    });

    // Start auto-rotation
    startFeaturedCarousel();
  }

  // Go to specific slide
  function goToFeaturedSlide(index) {
    if (index < 0 || index >= featuredApps.length) return;
    
    currentFeaturedIndex = index;
    updateFeaturedSlide();
  }

  // Update featured slide display
  function updateFeaturedSlide() {
    const slides = document.querySelectorAll('.vya-appstore-featured-slide');
    const indicators = document.querySelectorAll('.vya-appstore-featured-indicator');

    slides.forEach((slide, index) => {
      if (index === currentFeaturedIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    indicators.forEach((indicator, index) => {
      if (index === currentFeaturedIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Start carousel auto-rotation
  function startFeaturedCarousel() {
    if (featuredApps.length <= 1) return;

    featuredCarouselInterval = setInterval(() => {
      currentFeaturedIndex = (currentFeaturedIndex + 1) % featuredApps.length;
      updateFeaturedSlide();
    }, 5000); // 5 seconds
  }

  // Stop carousel (on hover)
  function stopFeaturedCarousel() {
    if (featuredCarouselInterval) {
      clearInterval(featuredCarouselInterval);
      featuredCarouselInterval = null;
    }
  }

  // Render popular apps grid
  function renderPopular() {
    const container = document.getElementById('vya-appstore-popular-grid');
    if (!container) return;

    const popular = filteredApps
      .filter(app => !app.featured?.active)
      .slice(0, 8);

    if (popular.length === 0) {
      container.innerHTML = '<p style="color: var(--c-muted); padding: 2rem; text-align: center;">No apps found.</p>';
      return;
    }

    container.innerHTML = popular.map(app => createCompactCard(app)).join('');
    attachCardClickHandlers(container);
  }

  // Render trending horizontal row with infinite scroll animation
  function renderTrending() {
    const container = document.getElementById('vya-appstore-trending-row');
    if (!container) return;

    const trending = filteredApps
      .filter(app => app.isTrending || app.featured?.active)
      .slice(0, 10);

    if (trending.length === 0) {
      container.innerHTML = '<p style="color: var(--c-muted); padding: 2rem; text-align: center;">No trending apps.</p>';
      return;
    }

    // Create duplicate cards for seamless infinite scroll
    const cardsHTML = trending.map(app => createTrendingCard(app)).join('');
    // Duplicate the cards to create seamless loop
    container.innerHTML = cardsHTML + cardsHTML;
    
    attachCardClickHandlers(container);
  }

  // Render new apps list
  function renderNew() {
    const container = document.getElementById('vya-appstore-new-list');
    if (!container) return;

    const newApps = filteredApps
      .filter(app => app.isNew || (app.createdAt && isNewApp(app.createdAt)))
      .slice(0, 6);

    if (newApps.length === 0) {
      container.innerHTML = '<li style="color: var(--c-muted); padding: 1rem; text-align: center;">No new apps.</li>';
      return;
    }

    container.innerHTML = newApps.map(app => createListItem(app)).join('');
    attachCardClickHandlers(container);
  }

  // Render recommended list
  function renderRecommended() {
    const container = document.getElementById('vya-appstore-recommended-list');
    if (!container) return;

    const recommended = filteredApps
      .filter(app => !app.isNew && !app.isTrending)
      .sort((a, b) => (b.rating_avg || b.rating || 0) - (a.rating_avg || a.rating || 0))
      .slice(0, 6);

    if (recommended.length === 0) {
      container.innerHTML = '<li style="color: var(--c-muted); padding: 1rem; text-align: center;">No recommendations.</li>';
      return;
    }

    container.innerHTML = recommended.map(app => createListItem(app)).join('');
    attachCardClickHandlers(container);
  }

  // Hide all existing galleries
  function hideAllGalleries() {
    const featured = document.querySelector('.vya-appstore-featured');
    const popularSection = document.querySelector('#vya-appstore-popular-grid')?.closest('.vya-appstore-section');
    const trendingSection = document.querySelector('#vya-appstore-trending-row')?.closest('.vya-appstore-section');
    const splitSection = document.querySelector('.vya-appstore-split');

    if (featured) featured.style.display = 'none';
    if (popularSection) popularSection.style.display = 'none';
    if (trendingSection) trendingSection.style.display = 'none';
    if (splitSection) splitSection.style.display = 'none';
  }

  // Show all existing galleries
  function showAllGalleries() {
    const featured = document.querySelector('.vya-appstore-featured');
    const popularSection = document.querySelector('#vya-appstore-popular-grid')?.closest('.vya-appstore-section');
    const trendingSection = document.querySelector('#vya-appstore-trending-row')?.closest('.vya-appstore-section');
    const splitSection = document.querySelector('.vya-appstore-split');

    if (featured) featured.style.display = '';
    if (popularSection) popularSection.style.display = '';
    if (trendingSection) trendingSection.style.display = '';
    if (splitSection) splitSection.style.display = '';
  }

  // Hide search results
  function hideSearchResults() {
    const searchResults = document.getElementById('vya-appstore-search-results');
    if (searchResults) searchResults.style.display = 'none';
  }

  // Render search results with square cards
  function renderSearchResults() {
    const container = document.getElementById('vya-appstore-search-grid');
    const searchResults = document.getElementById('vya-appstore-search-results');
    const searchTitle = document.getElementById('vya-appstore-search-results-title');
    
    if (!container || !searchResults) return;

    // Show search results section
    searchResults.style.display = 'block';

    // Update title with search query and count
    const count = filteredApps.length;
    if (searchTitle) {
      const countText = count === 1 ? '1 app found' : `${count} apps found`;
      searchTitle.textContent = `${countText} for "${currentSearch}"`;
    }

    if (filteredApps.length === 0) {
      container.innerHTML = '<p style="color: var(--c-muted); padding: 2rem; text-align: center; grid-column: 1 / -1;">No apps found. Try adjusting your search.</p>';
      return;
    }

    // Always show at least 8 results (2 rows) if available
    // If we have more than 8, show all results
    // If we have less than 8, still show what we have (will fill 2 rows partially)
    const minResults = 8; // 2 rows × 4 columns = 8 cards
    const appsToShow = filteredApps.length > minResults 
      ? filteredApps // Show all if we have more than 8
      : filteredApps.slice(0, minResults); // Show up to 8 if we have 8 or less
    
    container.innerHTML = appsToShow.map(app => createSquareCard(app)).join('');
    attachCardClickHandlers(container);
  }

  // Create square card HTML for search results
  function createSquareCard(app) {
    const icon = getAppIcon(app);
    const appId = app.id || app.firestoreId || 'demo';
    const title = escapeHtml(app.title || 'App');
    const category = escapeHtml(app.category || 'App');
    const rating = app.rating_avg || app.rating || 0;
    const usersCount = app.usersCount || 0;
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

    return `
      <div class="vya-appstore-search-card" data-app-id="${appId}">
        <div class="vya-appstore-search-card-icon">${icon}</div>
        <div class="vya-appstore-search-card-content">
          <h4 class="vya-appstore-search-card-title">${title}</h4>
          <p class="vya-appstore-search-card-category">${category}</p>
          <div class="vya-appstore-search-card-meta">
            <div class="vya-appstore-search-card-rating">
              <span class="vya-appstore-search-card-stars">${stars}</span>
              <span class="vya-appstore-search-card-rating-value">${rating.toFixed(1)}</span>
            </div>
            <div class="vya-appstore-search-card-clicks">${usersCount} clicks</div>
          </div>
        </div>
      </div>
    `;
  }

  // Check if app is new (within last 30 days)
  function isNewApp(createdAt) {
    const date = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }

  // Create compact card HTML
  function createCompactCard(app) {
    const icon = getAppIcon(app);
    const appId = app.id || app.firestoreId || 'demo';
    const description = (app.description || '').substring(0, 80);

    return `
      <div class="vya-appstore-card" data-app-id="${appId}">
        <div class="vya-appstore-card-icon">${icon}</div>
        <div class="vya-appstore-card-expanded">
          <h4 class="vya-appstore-card-title">${escapeHtml(app.title || 'App')}</h4>
          <p class="vya-appstore-card-description">${escapeHtml(description)}</p>
          <a href="/pages/app?id=${appId}" class="vya-appstore-card-cta">Read more</a>
        </div>
      </div>
    `;
  }

  // Create trending card HTML
  function createTrendingCard(app) {
    const icon = getAppIcon(app);
    const appId = app.id || app.firestoreId || 'demo';
    const subtitle = app.category || 'App';

    return `
      <div class="vya-appstore-trending-card" data-app-id="${appId}">
        <div class="vya-appstore-trending-icon">${icon}</div>
        <h4 class="vya-appstore-trending-title">${escapeHtml(app.title || 'App')}</h4>
        <p class="vya-appstore-trending-subtitle">${escapeHtml(subtitle)}</p>
      </div>
    `;
  }

  // Create list item HTML
  function createListItem(app) {
    const icon = getAppIcon(app);
    const appId = app.id || app.firestoreId || 'demo';
    const subtitle = app.category || 'App';

    return `
      <li class="vya-appstore-list-item" data-app-id="${appId}">
        <div class="vya-appstore-list-icon">${icon}</div>
        <div class="vya-appstore-list-content">
          <h4 class="vya-appstore-list-title">${escapeHtml(app.title || 'App')}</h4>
          <p class="vya-appstore-list-subtitle">${escapeHtml(subtitle)}</p>
        </div>
      </li>
    `;
  }

  // Get app icon - returns SVG icon with class for coloring
  function getAppIcon(app) {
    if (app.imageUrl && app.imageUrl.trim() !== '') {
      return `<img src="${escapeHtml(app.imageUrl)}" alt="${escapeHtml(app.title || 'App')}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;">`;
    }
    
    // Handle niche as array or string
    const niche = Array.isArray(app.niche) ? app.niche[0] : app.niche;
    
    if (niche === 'web') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
    }
    if (niche === 'mobile') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`;
    }
    if (niche === 'whatsapp') {
      return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;
  }

  // Attach click handlers to cards
  function attachCardClickHandlers(container) {
    if (!container) return;
    
    container.querySelectorAll('[data-app-id]').forEach(element => {
      element.addEventListener('click', (e) => {
        const appId = element.dataset.appId;
        if (appId && !e.target.closest('a')) {
          window.location.href = `/pages/app?id=${appId}`;
        }
      });
    });
  }

  // Color icons with random colors
  function colorIcons() {
    const colors = [
      '#3b82f6', '#4b5563', '#ec4899', '#f59e0b', '#10b981',
      '#ef4444', '#14b8a6', '#eab308', '#1a1a1a', '#f97316',
      '#06b6d4', '#a855f7', '#22c55e', '#f43f5e', '#0ea5e9',
      '#84cc16', '#64748b', '#f59e0b', '#4b5563', '#ec4899'
    ];

    // Color all SVG icons in app cards
    const selectors = [
      '.vya-appstore-card-icon svg',
      '.vya-appstore-trending-icon svg',
      '.vya-appstore-list-icon svg',
      '.vya-appstore-featured-icon svg',
      '.vya-appstore-search-card-icon svg',
      '.app-icon svg',
      '.app-icon .app-icon-svg',
      '.list-app-card-icon-new svg',
      '.app-icon-fallback svg'
    ];
    
    let colorIndex = 0;
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(svg => {
        if (!svg.style.stroke || svg.style.stroke === 'currentColor' || svg.style.stroke === 'white') {
          svg.style.stroke = colors[colorIndex % colors.length];
          colorIndex++;
        }
      });
    });
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Color icons on page load and after mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      colorIcons();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Color icons on initial load
  setTimeout(colorIcons, 500);
})();


