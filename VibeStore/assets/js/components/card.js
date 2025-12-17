/**
 * VibeStore - Card Component
 * Creates app card HTML
 */

/**
 * Create app card HTML
 * @param {Object} app - App object with title, description, etc.
 * @returns {string} HTML string for the card
 */
function createAppCard(app) {
  const rating = app.rating_avg || app.rating || 0;
  const category = app.category || 'App';
  const title = app.title || 'Untitled App';
  const description = app.description || 'No description available';
  const appId = app.id || app.firestoreId || 'demo';
  const usersCount = app.usersCount || 0;

  // Generate stars based on rating
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));

  // Get appropriate icon based on niche or user uploaded image - returns SVG with class for coloring
  let appIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
  if (app.niche === 'web') {
    appIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
  } else if (app.niche === 'mobile') {
    appIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
  } else if (app.niche === 'whatsapp') {
    appIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="app-icon-svg" style="width: 100%; height: 100%;"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
  }

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

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.createCardHTML = function(app) {
    return createAppCard(app);
  };
}

