/**
 * VibeStore - Results Page
 * Handles results page functionality
 */

// Get IntersectionObserver from animations (we'll need to re-observe cards)
let ioInstance = null;

/**
 * Set IntersectionObserver instance for reveal animations
 * @param {IntersectionObserver} io - IntersectionObserver instance
 */
function setIntersectionObserver(io) {
  ioInstance = io;
}

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.setIntersectionObserver = setIntersectionObserver;
}

/**
 * Helper: read query param
 */
function getQueryParam(key) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key) || "";
}

/**
 * Helper: update URL parameters
 */
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

/**
 * Load results page
 */
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
      const cardHTML = window.createCardHTML ? window.createCardHTML(app) : createAppCardFallback(app);
      resultsGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Re-observe new cards for reveal animation
    if (ioInstance) {
      const newCards = resultsGrid.querySelectorAll('.reveal');
      newCards.forEach(card => ioInstance.observe(card));
    }

    // Add click handlers for card interactions
    if (window.addCardClickHandlers) {
      window.addCardClickHandlers();
    }

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

/**
 * Create app card fallback (if createCardHTML is not available)
 */
function createAppCardFallback(app) {
  return `<article class="app-card" data-app-id="${app.id || 'demo'}">${app.title || 'App'}</article>`;
}

/**
 * Initialize results page
 */
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

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.initResultsPage = initResultsPage;
  window.getQueryParam = getQueryParam;
  window.updateURL = updateURL;
}
