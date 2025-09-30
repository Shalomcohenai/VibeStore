---
title: App Detail
layout: page
permalink: /pages/app
---

<style>
.app-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.app-header {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0,0,0,0.05);
}

.app-meta {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  align-items: start;
}

.app-icon {
  width: 120px;
  height: 120px;
  background: var(--c-primary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 8px 24px rgba(107,70,193,0.3);
}

.app-info {
  flex: 1;
}

.badges {
  margin-bottom: 0.75rem;
}

.badge {
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  color: var(--c-text);
  line-height: 1.2;
}

.app-description {
  color: var(--c-muted);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
}

.app-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(107,70,193,0.1);
  color: var(--c-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
}

.rating-stars {
  color: #f59e0b;
  font-size: 1.2rem;
}

.score {
  font-weight: 600;
  color: var(--c-text);
}

.reviews {
  color: var(--c-muted);
}

.app-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 160px;
}

/* Action buttons with smaller icons */
.action-btn {
  padding: 0.6rem 1.2rem;
  min-width: 140px;
  font-size: 0.9rem;
  gap: 0.4rem;
}

.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.action-btn .btn-icon {
  transition: all 0.2s ease;
}

.action-btn:hover .btn-icon {
  transform: scale(1.1);
}

/* Pressed/Active states */
.action-btn.pressed {
  transform: scale(0.95);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.action-btn.saved {
  background: #f0f9ff !important;
  border: 1px solid #0ea5e9 !important;
  color: #0ea5e9 !important;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2);
}

.action-btn.saved .btn-icon {
  fill: #0ea5e9 !important;
  stroke: #0ea5e9 !important;
}

.action-btn.saved:hover {
  background: #e0f2fe !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.btn.primary {
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
  color: white;
}

.btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(107,70,193,0.3);
}

.btn.secondary {
  background: rgba(107,70,193,0.1);
  color: var(--c-primary);
  border: 1px solid rgba(107,70,193,0.2);
}

.btn.secondary:hover {
  background: var(--c-primary);
  color: white;
  transform: scale(1.05);
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0,0,0,0.05);
}

.card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--c-text);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  padding: 0.75rem;
  background: rgba(248,250,252,0.5);
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.05);
}

.detail-item strong {
  display: block;
  color: var(--c-text);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.detail-item span {
  color: var(--c-muted);
}

.review-form {
  background: rgba(248,250,252,0.5);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--c-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--c-primary);
}

.star-rating {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.star {
  font-size: 1.5rem;
  color: #e2e8f0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star.active {
  color: #f59e0b;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--c-line);
  border-top: 4px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .app-detail {
    padding: 1rem 0.5rem;
  }
  
  .app-meta {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1rem;
  }
  
  .app-icon {
    width: 80px;
    height: 80px;
    font-size: 2rem;
    margin: 0 auto;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .app-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .btn {
    min-width: 120px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<div class="app-detail" id="app-detail">
  <!-- Loading State -->
  <div class="loading-state" id="loading-state">
    <div style="text-align: center; padding: 4rem;">
      <div class="spinner"></div>
      <p>Loading app details...</p>
    </div>
  </div>

  <!-- Error State -->
  <div class="error-state" id="error-state" style="display: none;">
    <div style="text-align: center; padding: 4rem;">
      <h2>App Not Found</h2>
      <p>The app you're looking for doesn't exist or has been removed.</p>
      <a href="/" class="btn primary">Back to Home</a>
    </div>
  </div>

  <!-- App Content (populated dynamically) -->
  <div class="app-content" id="app-content" style="display: none;">
    
    <!-- App Header -->
    <div class="app-header">
      <div class="app-meta">
        <div class="app-icon" id="app-icon">
          📱
        </div>
        
        <div class="app-info">
          <div class="badges" id="app-badges">
            <!-- Badges will be populated by JS -->
          </div>
          <h1 class="app-title" id="app-title">Loading...</h1>
          <p class="app-description" id="app-description">Loading app description...</p>
          
          <div class="app-tags" id="app-tags">
            <!-- Tags will be populated by JS -->
          </div>
          
          <div class="rating" id="app-rating">
            <span class="rating-stars" id="rating-stars">★★★★★</span>
            <span class="score" id="rating-score">0/5</span>
            <span class="reviews" id="rating-count">(0 reviews)</span>
          </div>
        </div>
        
        <div class="app-actions">
          <a id="app-cta" href="#" target="_blank" class="btn primary action-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15,3 21,3 21,9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            <span>Open App</span>
          </a>
          <button class="btn secondary action-btn" id="save-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Save</span>
          </button>
          <button class="btn secondary action-btn" id="add-to-list-btn">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
            <span>Add to List</span>
          </button>
        </div>
      </div>
    </div>

    <!-- App Description -->
    <div class="card">
      <h2>About this app</h2>
      <p id="app-full-description">Loading detailed description...</p>
    </div>

    <!-- App Details -->
    <div class="card">
      <h2>App Information</h2>
      <div class="details-grid">
        <div class="detail-item">
          <strong>Category:</strong>
          <span id="app-category">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Platform:</strong>
          <span id="app-platform">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Niche:</strong>
          <span id="app-niche">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Submitted:</strong>
          <span id="app-created">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Users:</strong>
          <span id="app-users-count">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="card">
      <h2>Reviews & Ratings</h2>
      <div id="reviews-content">
        <p>Reviews will be loaded here...</p>
      </div>
      
      <!-- Add Review (for authenticated users) -->
      <div id="add-review-section" style="margin-top: 2rem; display: none;">
        <h3>Add Your Review</h3>
        <form id="review-form" class="review-form">
          <div class="form-group">
            <label>Rating:</label>
            <div class="star-rating" id="star-rating">
              <span class="star" data-rating="1">★</span>
              <span class="star" data-rating="2">★</span>
              <span class="star" data-rating="3">★</span>
              <span class="star" data-rating="4">★</span>
              <span class="star" data-rating="5">★</span>
            </div>
          </div>
          <div class="form-group">
            <label for="review-text">Your Review:</label>
            <textarea id="review-text" rows="4" placeholder="Share your experience with this app..."></textarea>
          </div>
          <button type="submit" class="btn primary">Submit Review</button>
        </form>
      </div>
    </div>

  </div>
</div>

<style>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--c-line);
  border-top: 4px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-detail .card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge.web {
  background: #dbeafe;
  color: #1e40af;
}

.badge.mobile {
  background: #dcfce7;
  color: #166534;
}

.badge.whatsapp {
  background: #fef3c7;
  color: #92400e;
}

.badge.featured {
  background: #fbbf24;
  color: #92400e;
}

.badge.editor {
  background: #34d399;
  color: #065f46;
}

.chip {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
  color: #d1d5db;
  cursor: pointer;
}

.star-rating span:hover,
.star-rating span.active {
  color: #fbbf24;
}

@media (max-width: 768px) {
  .app-meta {
    grid-template-columns: 1fr !important;
    text-align: center;
  }
  
  .app-actions {
    flex-direction: row !important;
    justify-content: center;
  }
}
</style>

<script type="module">
// Wait for Firebase to initialize
const waitForFirebase = () => new Promise(resolve => {
  const check = () => {
    if (window.$fb && window.$fb.auth && window.$fb.storeMod && window.$fb.db) {
      resolve(window.$fb);
    } else {
      setTimeout(check, 100);
    }
  };
  check();
});

// Get app ID from URL
const urlParams = new URLSearchParams(window.location.search);
const appId = urlParams.get('id');

// App data
let currentApp = null;
let currentUser = null;

async function loadAppDetails() {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const appContent = document.getElementById('app-content');

  if (!appId) {
    showError('No app ID provided');
    return;
  }

  try {
    const { db, storeMod } = await waitForFirebase();
    const { doc, getDoc, collection, query, where, getDocs } = storeMod;

    // First try to fetch by document ID
    let appRef = doc(db, 'apps', appId);
    let appDoc = await getDoc(appRef);

    // If not found by ID, try to find by custom ID field
    if (!appDoc.exists()) {
      const appsQuery = query(collection(db, 'apps'), where('id', '==', appId));
      const appsSnapshot = await getDocs(appsQuery);
      
      if (!appsSnapshot.empty) {
        appDoc = appsSnapshot.docs[0];
      }
    }

    if (!appDoc.exists()) {
      showError('App not found');
      return;
    }

    currentApp = { id: appDoc.id, ...appDoc.data() };
    
    // Update page SEO dynamically
    updatePageSEO(currentApp);
    
    // Render app content
    renderAppContent(currentApp);
    
    // Show content, hide loading
    if (loadingState) loadingState.style.display = 'none';
    if (appContent) appContent.style.display = 'block';

    // Load reviews
    loadReviews();

  } catch (error) {
    console.error('Error loading app:', error);
    showError('Failed to load app details');
  }
}

function showError(message) {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  
  if (loadingState) loadingState.style.display = 'none';
  if (errorState) {
    errorState.style.display = 'block';
    
    if (message !== 'App not found') {
      const h2 = errorState.querySelector('h2');
      const p = errorState.querySelector('p');
      if (h2) h2.textContent = 'Error Loading App';
      if (p) p.textContent = message;
    }
  }
}

function updatePageSEO(app) {
  // Update document title
  document.title = `${app.title || 'Untitled App'} - VibeStore`;
  
  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = app.description || 'Discover this app on VibeStore';
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = `${app.title || 'Untitled App'} - VibeStore`;
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = app.description || 'Discover this app on VibeStore';
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.content = app.image || '/img/placeholder.svg';
}

function renderAppContent(app) {
  // Basic info
  const titleEl = document.getElementById('app-title');
  const descEl = document.getElementById('app-description');
  const fullDescEl = document.getElementById('app-full-description');
  const categoryEl = document.getElementById('app-category');
  const platformEl = document.getElementById('app-platform');
  const nicheEl = document.getElementById('app-niche');
  
  if (titleEl) titleEl.textContent = app.title || 'Untitled App';
  if (descEl) descEl.textContent = app.description || 'No description available';
  if (fullDescEl) fullDescEl.textContent = app.description || 'No description available';
  if (categoryEl) categoryEl.textContent = app.category || 'Uncategorized';
  if (platformEl) platformEl.textContent = app.platform || 'Not specified';
  if (nicheEl) nicheEl.textContent = app.niche || 'Not specified';
  
  // Image
  const appImage = document.getElementById('app-icon');
  if (appImage) {
    appImage.innerHTML = `<img src="${app.image || '/img/placeholder.svg'}" alt="${app.title} Icon" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
  }
  
  // Created date
  const createdDate = app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Unknown';
  const createdEl = document.getElementById('app-created');
  if (createdEl) createdEl.textContent = createdDate;
  
  // Users count
  const usersCount = app.usersCount || 0;
  const usersCountEl = document.getElementById('app-users-count');
  if (usersCountEl) usersCountEl.textContent = `${usersCount} users`;
  
  // Badges
  const badgesContainer = document.getElementById('app-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    
    // Niche badge
    if (app.niche && typeof app.niche === 'string') {
      const nicheBadge = document.createElement('span');
      nicheBadge.className = `badge ${app.niche}`;
      nicheBadge.textContent = `${getNicheIcon(app.niche)} ${app.niche.charAt(0).toUpperCase() + app.niche.slice(1)}`;
      badgesContainer.appendChild(nicheBadge);
    }
    
    // Featured badge
    if (app.featured?.active) {
      const featuredBadge = document.createElement('span');
      featuredBadge.className = 'badge featured';
      featuredBadge.textContent = 'Featured';
      badgesContainer.appendChild(featuredBadge);
    }
    
    // Editor's Choice badge
    if (app.editor_pick) {
      const editorBadge = document.createElement('span');
      editorBadge.className = 'badge editor';
      editorBadge.textContent = "Editor's Choice";
      badgesContainer.appendChild(editorBadge);
    }
  }
  
  // Tags
  const tagsContainer = document.getElementById('app-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    if (app.tags && app.tags.length > 0) {
      app.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'chip';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
      });
    } else {
      const categoryChip = document.createElement('span');
      categoryChip.className = 'chip';
      categoryChip.textContent = app.category;
      tagsContainer.appendChild(categoryChip);
    }
  }
  
  // Rating
  const rating = app.rating_avg || 0;
  const ratingCount = app.rating_count || 0;
  
  const starsEl = document.getElementById('rating-stars');
  const scoreEl = document.getElementById('rating-score');
  const countEl = document.getElementById('rating-count');
  
  if (starsEl) starsEl.textContent = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  if (scoreEl) scoreEl.textContent = `${rating.toFixed(1)}/5`;
  if (countEl) countEl.textContent = `(${ratingCount} reviews)`;
  
  // Update users count in rating section if it exists
  const usersCountInRating = app.usersCount || 0;
  const usersCountElInRating = document.querySelector('.users-count');
  if (usersCountElInRating) {
    usersCountElInRating.textContent = `${usersCountInRating} users`;
  }
  
  // CTA Button
  const ctaButton = document.getElementById('app-cta');
  if (ctaButton) {
    ctaButton.href = app.link || '#';
    ctaButton.innerHTML = `${getNicheIcon(app.niche)} ${getNicheCTA(app.niche)}`;
  }
}

function getNicheIcon(niche) {
  if (!niche || typeof niche !== 'string') return '🔗';
  
  const icons = {
    web: '🌐',
    mobile: '📱',
    whatsapp: '💬'
  };
  return icons[niche] || '🔗';
}

function getNicheCTA(niche) {
  if (!niche || typeof niche !== 'string') return 'Open';
  
  const ctas = {
    web: 'Open App',
    mobile: 'Install App',
    whatsapp: 'Open in WhatsApp'
  };
  return ctas[niche] || 'Open';
}

async function loadReviews() {
  const reviewsContent = document.getElementById('reviews-content');
  if (!reviewsContent) return;
  
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) {
    reviewsContent.innerHTML = '<p style="color: var(--c-muted);">No app selected.</p>';
    return;
  }
  
  try {
    const { db, storeMod } = await waitForFirebase();
    const { collection, query, where, orderBy, getDocs, limit } = storeMod;
    
    // Load reviews for this app
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('appId', '==', appId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    if (reviewsSnapshot.empty) {
      reviewsContent.innerHTML = '<p style="color: var(--c-muted); text-align: center; padding: 2rem;">No reviews yet. Be the first to review this app!</p>';
      return;
    }
    
    let reviewsHTML = '<div class="reviews-list">';
    
    reviewsSnapshot.forEach((doc) => {
      const review = doc.data();
      const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
      const date = review.createdAt?.toDate?.() || new Date();
      const dateStr = date.toLocaleDateString();
      
      reviewsHTML += `
        <div class="review-item" style="border-bottom: 1px solid #e2e8f0; padding: 1rem 0; margin-bottom: 1rem;">
          <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div class="review-stars" style="color: #f59e0b; font-size: 1.1rem;">${stars}</div>
            <div class="review-date" style="color: var(--c-muted); font-size: 0.9rem;">${dateStr}</div>
          </div>
          ${review.text ? `<div class="review-text" style="color: var(--c-text); line-height: 1.5;">${review.text}</div>` : ''}
        </div>
      `;
    });
    
    reviewsHTML += '</div>';
    reviewsContent.innerHTML = reviewsHTML;
    
  } catch (error) {
    console.error('Error loading reviews:', error);
    reviewsContent.innerHTML = '<p style="color: #ef4444;">Error loading reviews. Please try again later.</p>';
  }
}

// Check authentication state
async function checkAuthState() {
  const { auth } = await waitForFirebase();
  
  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    
    if (user) {
      // Show add review section for authenticated users
      const addReviewSection = document.getElementById('add-review-section');
      if (addReviewSection) {
        addReviewSection.style.display = 'block';
      }
      
      // Update button states
      await updateButtonStates();
    }
  });
}

// Update button states based on current user data
async function updateButtonStates() {
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId || !currentUser) return;

  try {
    // Update save button state
    const saveButton = document.getElementById('save-btn');
    if (saveButton) {
      const isFavorited = await checkIfFavorited(appId);
      const heartIcon = isFavorited ? 
        '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' :
        '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
      
      saveButton.innerHTML = `${heartIcon}<span>${isFavorited ? 'Saved' : 'Save'}</span>`;
      saveButton.classList.toggle('active', isFavorited);
      saveButton.classList.toggle('saved', isFavorited);
    }
  } catch (error) {
    console.error('Error updating button states:', error);
  }
}

// Initialize star rating (global variable to persist rating)
let selectedRating = 0;

function initializeStarRating() {
  console.log('Initializing star rating...');
  const stars = document.querySelectorAll('.star-rating .star');
  console.log('Found stars:', stars.length);
  
  // Clear existing event listeners by cloning the elements
  stars.forEach(star => {
    const newStar = star.cloneNode(true);
    star.parentNode.replaceChild(newStar, star);
  });
  
  // Get the new stars after cloning
  const newStars = document.querySelectorAll('.star-rating .star');
  console.log('New stars after cloning:', newStars.length);
  
  newStars.forEach((star, index) => {
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      updateStarDisplay();
      console.log('Selected rating:', selectedRating); // Debug log
    });
    
    star.addEventListener('mouseenter', () => {
      highlightStars(index + 1);
    });
  });
  
  const starContainer = document.querySelector('.star-rating');
  if (starContainer) {
    // Remove existing event listener
    starContainer.removeEventListener('mouseleave', updateStarDisplay);
    // Add new event listener
    starContainer.addEventListener('mouseleave', () => {
      updateStarDisplay();
    });
  }
  
  function highlightStars(rating) {
    newStars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
  
  function updateStarDisplay() {
    highlightStars(selectedRating);
  }
  
  // Initialize display
  updateStarDisplay();
  
  return () => selectedRating;
}

// Reset star rating
function resetStarRating() {
  selectedRating = 0;
  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach(star => {
    star.classList.remove('active');
  });
}

// Submit review
async function submitReview() {
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) {
    alert('No app selected');
    return;
  }
  
  if (!currentUser) {
    alert('Please sign in to submit a review');
    return;
  }
  
  const rating = selectedRating; // Use global variable
  const text = document.getElementById('review-text')?.value?.trim() || '';
  
  console.log('Submitting review with rating:', rating); // Debug log
  
  if (rating === 0) {
    alert('Please select a rating');
    return;
  }
  
        try {
          const { db, storeMod } = await waitForFirebase();
          const { doc, getDoc, setDoc, collection, addDoc, runTransaction, serverTimestamp } = storeMod;

          // Check if user has verified interaction
          const interactionRef = doc(db, 'interactions', `${currentUser.uid}_${appId}`);
          const interactionSnap = await getDoc(interactionRef);
          
          if (!interactionSnap.exists()) {
            throw new Error('No verified interaction');
          }

          const interactionData = interactionSnap.data();
          const lastClickAt = interactionData.lastClickAt?.toDate?.() || new Date(0);
          const daysSinceClick = (Date.now() - lastClickAt.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceClick > 30) {
            throw new Error('Verification expired');
          }

          // Check if user already reviewed this app
          const { query, where, getDocs } = storeMod;
          const existingReviewQuery = query(
            collection(db, 'reviews'),
            where('appId', '==', appId),
            where('userId', '==', currentUser.uid)
          );
          const existingReviews = await getDocs(existingReviewQuery);

          if (!existingReviews.empty) {
            alert('You have already reviewed this app.');
            return;
          }

          // Add review to Firestore
          const reviewData = {
            appId,
            userId: currentUser.uid,
            stars: rating,
            text: text,
            createdAt: serverTimestamp()
          };

          await addDoc(collection(db, 'reviews'), reviewData);

          // Update app rating aggregates using transaction
          const appRef = doc(db, 'apps', appId);
          await runTransaction(db, async (transaction) => {
            const appSnap = await transaction.get(appRef);
            if (!appSnap.exists()) {
              throw new Error('App not found');
            }

            const appData = appSnap.data();
            const currentRatingCount = appData.rating_count || 0;
            const currentRatingSum = appData.rating_sum || 0;
            
            const newRatingCount = currentRatingCount + 1;
            const newRatingSum = currentRatingSum + rating;
            const newRatingAvg = Math.round((newRatingSum / newRatingCount) * 10) / 10;

            transaction.update(appRef, {
              rating_count: newRatingCount,
              rating_sum: newRatingSum,
              rating_avg: newRatingAvg
            });
          });

          // Reload reviews and app data
          await loadReviews();
          await loadAppDetails();

          // Clear form
          document.getElementById('review-text').value = '';
          resetStarRating();

          alert('Review submitted successfully!');

        } catch (error) {
          console.error('Error submitting review:', error);

          // Handle specific error messages
          if (error.message.includes('No verified interaction')) {
            alert('You must click "Open" on this app first before you can review it. Please try the app and then come back to review it.');
          } else if (error.message.includes('Verification expired')) {
            alert('Your verification has expired. Please click "Open" on this app again and then try to review it.');
          } else {
            alert('Error submitting review. Please try again.');
          }
        }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadAppDetails();
  checkAuthState();
  initializeButtons();
  initializeStarRating(); // Initialize star rating system
  
  // Initialize review form
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitReview();
    });
  }
});

// Initialize button event listeners
function initializeButtons() {
  // Open button - redirect to app link with logging
  const openButton = document.getElementById('app-cta');
  if (openButton) {
    openButton.addEventListener('click', async (e) => {
      // Add pressed state
      openButton.classList.add('pressed');
      setTimeout(() => openButton.classList.remove('pressed'), 150);
      const appId = new URLSearchParams(window.location.search).get('id');
      if (appId && currentUser) {
        // Log the interaction for review validation
        try {
          const { db, storeMod } = await waitForFirebase();
          const { doc, setDoc, serverTimestamp } = storeMod;
          
          // Create interaction record
          const interactionRef = doc(db, 'interactions', `${currentUser.uid}_${appId}`);
          await setDoc(interactionRef, {
            userId: currentUser.uid,
            appId: appId,
            lastClickAt: serverTimestamp(),
            clickCount: 1
          }, { merge: true });
          
          console.log('Interaction logged successfully');
          
          // Update app users count
          try {
            const { functions, functionsMod } = await waitForFirebase();
            const { httpsCallable } = functionsMod;
            
            const updateAppUsersCount = httpsCallable(functions, 'updateAppUsersCount');
            await updateAppUsersCount({ appId: appId });
            console.log('App users count updated successfully');
            
            // Reload app details to show updated count
            await loadAppDetails();
          } catch (error) {
            console.warn('Failed to update app users count:', error);
          }
          
        } catch (error) {
          console.warn('Failed to log interaction:', error);
        }
      }
      // Let the default link behavior happen
    });
  }

  // Save button - add to favorites
  const saveButton = document.getElementById('save-btn');
  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      // Add pressed state
      saveButton.classList.add('pressed');
      setTimeout(() => saveButton.classList.remove('pressed'), 150);
      if (!currentUser) {
        alert('Please sign in to save apps to favorites');
        return;
      }

      const appId = new URLSearchParams(window.location.search).get('id');
      if (!appId) {
        alert('No app selected');
        return;
      }

      try {
        // Use the favorites system directly from window object
        if (window.VibeStoreFavorites && window.VibeStoreFavorites.toggleFavorite) {
          const success = await window.VibeStoreFavorites.toggleFavorite(appId);
          
          if (success) {
            // Update button text
            const isFavorited = await checkIfFavorited(appId);
            saveButton.innerHTML = isFavorited ? '❤️ Saved' : '❤️ Save';
            saveButton.classList.toggle('active', isFavorited);
          }
        } else {
          // Fallback: direct Firebase operation
          const { db, storeMod } = await waitForFirebase();
          const { doc, getDoc, updateDoc, arrayUnion, arrayRemove } = storeMod;
          
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userData = userSnap.data();
            const favorites = userData.favorites || [];
            const isCurrentlyFavorited = favorites.includes(appId);
            
            if (isCurrentlyFavorited) {
              await updateDoc(userRef, {
                favorites: arrayRemove(appId),
                updatedAt: new Date()
              });
              const heartIcon = '<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
              saveButton.innerHTML = `${heartIcon}<span>Save</span>`;
              saveButton.classList.remove('active', 'saved');
            } else {
              await updateDoc(userRef, {
                favorites: arrayUnion(appId),
                updatedAt: new Date()
              });
              const heartIcon = '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
              saveButton.innerHTML = `${heartIcon}<span>Saved</span>`;
              saveButton.classList.add('active', 'saved');
            }
          } else {
            // Create user document
            await updateDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              favorites: [appId],
              lists: [],
              createdAt: new Date(),
              updatedAt: new Date()
            });
            const heartIcon = '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
            saveButton.innerHTML = `${heartIcon}<span>Saved</span>`;
            saveButton.classList.add('active', 'saved');
          }
        }
      } catch (error) {
        console.error('Error saving to favorites:', error);
        alert('Error saving to favorites. Please try again.');
      }
    });
  }

  // Add to List button
  const addToListButton = document.getElementById('add-to-list-btn');
  if (addToListButton) {
    addToListButton.addEventListener('click', async () => {
      // Add pressed state
      addToListButton.classList.add('pressed');
      setTimeout(() => addToListButton.classList.remove('pressed'), 150);
      if (!currentUser) {
        alert('Please sign in to add apps to lists');
        return;
      }

      const appId = new URLSearchParams(window.location.search).get('id');
      if (!appId) {
        alert('No app selected');
        return;
      }

      try {
        // Show list selection modal
        await showListSelectionModal(appId);
      } catch (error) {
        console.error('Error adding to list:', error);
        alert('Error adding to list. Please try again.');
      }
    });
  }
}

// Show list selection modal
async function showListSelectionModal(appId) {
  const { db, storeMod } = await waitForFirebase();
  const { doc, getDoc, updateDoc, arrayUnion } = storeMod;
  
  // Get user's lists
  const userRef = doc(db, 'users', currentUser.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    alert('Please create a list first in your profile');
    window.location.href = '/pages/profile';
    return;
  }
  
  const userData = userSnap.data();
  const lists = userData.lists || [];
  
  if (lists.length === 0) {
    alert('You have no lists yet. Please create a list first in your profile.');
    window.location.href = '/pages/profile';
    return;
  }
  
  // Create modal
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;
  
  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    ">
      <h3 style="margin: 0 0 1rem 0; color: var(--c-text);">Add to List</h3>
      <p style="margin: 0 0 1.5rem 0; color: var(--c-muted);">Choose a list to add this app to:</p>
      <div id="lists-container" style="margin-bottom: 1.5rem;">
        ${lists.map(list => `
          <div class="list-item" style="
            padding: 0.75rem;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            margin-bottom: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
          " data-list-id="${list.id}">
            <div style="font-weight: 600; color: var(--c-text);">${list.name}</div>
            <div style="font-size: 0.9rem; color: var(--c-muted);">${list.apps ? list.apps.length : 0} apps</div>
          </div>
        `).join('')}
      </div>
      <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
        <button id="cancel-btn" style="
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 8px;
          cursor: pointer;
        ">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  const listItems = modal.querySelectorAll('.list-item');
  const cancelBtn = modal.querySelector('#cancel-btn');
  
  listItems.forEach(item => {
    item.addEventListener('click', async () => {
      const listId = item.dataset.listId;
      const list = lists.find(l => l.id === listId);
      
      if (list && !list.apps.includes(appId)) {
        list.apps.push(appId);
        
        await updateDoc(userRef, {
          lists: lists,
          updatedAt: new Date()
        });
        
        alert(`Added to "${list.name}" successfully!`);
      } else if (list && list.apps.includes(appId)) {
        alert(`This app is already in "${list.name}"`);
      }
      
      document.body.removeChild(modal);
    });
    
    item.addEventListener('mouseenter', () => {
      item.style.background = '#f8fafc';
      item.style.borderColor = 'var(--c-primary)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.background = 'white';
      item.style.borderColor = '#e2e8f0';
    });
  });
  
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Helper function to check if app is favorited
async function checkIfFavorited(appId) {
  try {
    if (window.VibeStoreFavorites && window.VibeStoreFavorites.isAppFavorited) {
      return await window.VibeStoreFavorites.isAppFavorited(appId);
    } else {
      // Fallback: direct Firebase check
      const { db, storeMod } = await waitForFirebase();
      const { doc, getDoc } = storeMod;
      
      if (!currentUser) return false;
      
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const favorites = userData.favorites || [];
        return favorites.includes(appId);
      }
      return false;
    }
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}
</script>