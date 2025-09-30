/**
 * VibeStore - Search UI Module
 * Handles search user interface, events, and display
 */

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.getElementById('search-input');
  const searchForm = document.querySelector('.search');
  
  if (!searchForm || !searchInput) {
    console.warn('Search elements not found');
    return;
  }
  
  // Handle search form submission
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query) {
      return;
    }
    
    // Navigate to results page with query
    const resultsUrl = new URL(window.location.origin + '/pages/results');
    resultsUrl.searchParams.set('q', query);
    window.location.href = resultsUrl.toString();
  });
}

// Handle search input events (for results page)
async function handleSearchInput(query, options = {}) {
  try {
    showSearchLoading();
    
    // Fetch all apps from Firestore
    const apps = await window.VibeStoreFirestore.fetchAllAppsForSearch();
    
    // Use search engine to score and filter
    let results = [];
    if (query && query.trim()) {
      results = window.VibeStoreSearchEngine.searchApps(apps, query, options);
    } else {
      results = apps;
    }
    
    // Apply additional filters if provided
    if (options.niche && options.niche !== 'all') {
      results = results.filter(app => app.niche === options.niche);
    }
    
    if (options.category && options.category !== 'all') {
      results = results.filter(app => app.category === options.category);
    }
    
    // Display results
    displaySearchResults(results, query);
    
    return results;
  } catch (error) {
    console.error('Error handling search input:', error);
    showSearchError();
    return [];
  }
}

// Display search results
function displaySearchResults(results, query = '') {
  const resultsGrid = document.getElementById('results-grid');
  const resultsCount = document.getElementById('results-count');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  
  if (!resultsGrid) return;
  
  // Hide loading state
  if (loadingState) loadingState.style.display = 'none';
  
  // Update results count
  if (resultsCount) {
    const countText = results.length === 1 ? '1 app found' : `${results.length} apps found`;
    if (query && query.trim()) {
      resultsCount.textContent = `${countText} for "${query}"`;
    } else {
      resultsCount.textContent = countText;
    }
  }
  
  // Clear and render
  resultsGrid.innerHTML = '';
  
  if (results.length === 0) {
    resultsGrid.style.display = 'none';
    if (emptyState) {
      emptyState.style.display = 'block';
      const emptyTitle = emptyState.querySelector('h3');
      const emptyText = emptyState.querySelector('p');
      if (emptyTitle) emptyTitle.textContent = 'No apps found';
      if (emptyText) emptyText.textContent = 'Try adjusting your search or filters to find what you\'re looking for.';
    }
    return;
  }
  
  resultsGrid.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';
  
  // Render each app card
  results.forEach((app, index) => {
    const cardHTML = window.createCardHTML ? window.createCardHTML(app) : createDefaultCardHTML(app);
    resultsGrid.insertAdjacentHTML('beforeend', cardHTML);
  });
  
  // Re-observe new cards for reveal animation if available
  if (window.IntersectionObserver) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    
    const newCards = resultsGrid.querySelectorAll('.reveal');
    newCards.forEach(card => io.observe(card));
  }
  
  // Add click handlers for card interactions
  if (window.addCardClickHandlers) {
    window.addCardClickHandlers();
  }
}

// Show loading state
function showSearchLoading() {
  const resultsGrid = document.getElementById('results-grid');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  
  if (resultsGrid) resultsGrid.style.display = 'none';
  if (emptyState) emptyState.style.display = 'none';
  if (loadingState) loadingState.style.display = 'block';
}

// Show error state
function showSearchError() {
  const resultsGrid = document.getElementById('results-grid');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  
  if (loadingState) loadingState.style.display = 'none';
  if (resultsGrid) resultsGrid.style.display = 'none';
  
  if (emptyState) {
    emptyState.style.display = 'block';
    const emptyTitle = emptyState.querySelector('h3');
    const emptyText = emptyState.querySelector('p');
    if (emptyTitle) emptyTitle.textContent = 'Error loading apps';
    if (emptyText) emptyText.textContent = 'Please try again later.';
  }
}

// Default card HTML (fallback if createCardHTML is not available)
function createDefaultCardHTML(app) {
  const rating = app.rating_avg || app.rating || 0;
  const category = app.category || 'App';
  const title = app.title || 'Untitled App';
  const description = app.description || 'No description available';
  const appId = app.id || app.firestoreId || 'unknown';
  
  // Generate stars based on rating
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  
  // Get appropriate icon based on niche
  let appIcon = '📱';
  if (app.niche === 'web') appIcon = '🌐';
  else if (app.niche === 'mobile') appIcon = '📱';
  else if (app.niche === 'whatsapp') appIcon = '💬';
  
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
          <div class="users-count">${app.usersCount || 0} users</div>
        </div>
      </div>
      
      <div class="card-body-v2">
        <h3 class="app-title-v2">${title}</h3>
        <p class="app-description-v2">${description}</p>
        ${app.searchScore ? `<div class="search-score" style="font-size: 0.75rem; color: var(--c-muted); margin-top: 0.5rem;">Relevance: ${Math.round(app.searchScore)}</div>` : ''}
      </div>
      
      <div class="card-footer-v2">
        <button class="action-btn-v2 heart-btn" data-app-id="${appId}" title="Add to favorites">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <button class="action-btn-v2 plus-btn" data-app-id="${appId}" title="Add to list">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button class="action-btn-v2 more-btn" data-app-id="${appId}" title="View details">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
      </div>
    </article>
  `;
}

// Export functions
window.VibeStoreSearchUI = {
  initializeSearch,
  handleSearchInput,
  displaySearchResults,
  showSearchLoading,
  showSearchError
};

console.log('✅ VibeStore Search UI loaded');
