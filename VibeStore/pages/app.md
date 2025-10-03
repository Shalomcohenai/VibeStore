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
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: 0 8px 24px rgba(107,70,193,0.3);
  overflow: hidden;
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
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
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

.app-actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
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

/* Action buttons */
.action-btn {
  padding: 0.75rem 1.5rem;
  min-width: 140px;
  font-size: 0.95rem;
}

/* Pressed/Active states */
.action-btn.pressed {
  transform: scale(0.95);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

/* Save button and Add to List button active/saved state */
#save-btn.saved,
#save-btn.active,
#add-to-list-btn.saved,
#add-to-list-btn.active {
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent)) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(107, 70, 193, 0.3);
  font-weight: 600;
}

#save-btn.saved:hover,
#save-btn.active:hover,
#add-to-list-btn.saved:hover,
#add-to-list-btn.active:hover {
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent)) !important;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(107, 70, 193, 0.3);
}

/* Social Share Inline */
.social-share-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.share-label {
  font-size: 0.85rem;
  color: var(--c-muted);
  font-weight: 500;
  margin-right: 0.25rem;
}

.social-btn-flat {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  opacity: 0.5;
}

.social-btn-flat svg {
  width: 24px;
  height: 24px;
  color: var(--c-primary);
  fill: var(--c-primary);
}

.social-btn-flat:hover {
  opacity: 1;
  transform: scale(1.15);
}

.social-btn-flat:active {
  transform: scale(0.95);
}

.social-btn-flat.copied {
  opacity: 1;
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
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

#app-full-description {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  white-space: pre-wrap;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition: border-color 0.3s ease;
}

.form-group textarea::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.95rem;
  color: #94a3b8;
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

/* Image Gallery */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-image {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gallery-image:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.gallery-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

/* Lazy Loading Styles */
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image.loaded {
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e0e7ff;
  border-top: 2px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* App Icon Container */
.app-icon-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
}

.app-icon-img {
  transition: opacity 0.3s ease;
}

/* Responsive Images */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
  
  .gallery-image {
    padding-bottom: 75%;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
}

/* Lightbox for full-size images */
.lightbox {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 10000;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox.active {
  display: flex;
}

.lightbox img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.lightbox-close:hover {
  transform: scale(1.1);
}

/* Report Button */
.btn-report {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-report:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.btn-report:active {
  transform: translateY(0);
}

/* Report Modal */
.report-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.report-modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.report-modal h3 {
  margin: 0 0 1rem 0;
  color: var(--c-text);
  font-size: 1.25rem;
  font-weight: 600;
}

.report-options {
  margin-bottom: 1.5rem;
}

.report-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-option:hover {
  background: #f8fafc;
  border-color: var(--c-primary);
}

.report-option.selected {
  background: rgba(107, 70, 193, 0.05);
  border-color: var(--c-primary);
}

.report-option input[type="radio"] {
  margin: 0;
  margin-top: 0.1rem;
}

.report-option label {
  margin: 0;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--c-text);
}

.report-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  margin-top: 0.5rem;
}

.report-textarea:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.report-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel {
  background: #f8fafc;
  color: var(--c-text);
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-submit-report {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-submit-report:hover {
  background: #dc2626;
}

.btn-submit-report:disabled {
  background: #9ca3af;
  cursor: not-allowed;
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
  
  .app-actions-wrapper {
    align-items: stretch;
  }
  
  .app-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn {
    width: 100%;
    min-width: auto;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .social-share-inline {
    justify-content: center;
    flex-wrap: wrap;
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
        
        <div class="app-actions-wrapper">
          <div class="app-actions">
            <a id="app-cta" href="#" target="_blank" class="btn primary action-btn">
              <span>Open App</span>
            </a>
            <button class="btn secondary action-btn" id="save-btn">
              <span>Save</span>
            </button>
            <button class="btn secondary action-btn" id="add-to-list-btn">
              <span>Add to List</span>
            </button>
          </div>
          
          <!-- Social Share Buttons - Below action buttons -->
          <div class="social-share-inline">
            <span class="share-label">Share:</span>
            <button class="social-btn-flat facebook" id="share-facebook" title="Share on Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            <button class="social-btn-flat twitter" id="share-twitter" title="Share on Twitter/X">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </button>
            <button class="social-btn-flat linkedin" id="share-linkedin" title="Share on LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </button>
            <button class="social-btn-flat whatsapp" id="share-whatsapp" title="Share on WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
            <button class="social-btn-flat copy-link" id="share-copy" title="Copy link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- App Description -->
    <div class="card">
      <h2>About this app</h2>
      <p id="app-full-description">Loading detailed description...</p>
      
      <!-- Image Gallery -->
      <div id="image-gallery" style="display: none; margin-top: 2rem;">
        <h3 style="font-size: 1.2rem; font-weight: 600; margin: 0 0 1rem 0; color: var(--c-text);">Screenshots</h3>
        <div id="gallery-images" class="gallery-grid"></div>
      </div>
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
  
  <!-- Report Button -->
  <div class="report-section" style="text-align: center; margin-top: 3rem; padding: 2rem;">
    <button id="report-btn" class="btn-report" title="Report this app">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      Report App
    </button>
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
  
  // Use long description for SEO if available, otherwise fall back to short description
  const seoDescription = app.longDescription || app.description || 'Discover this app on VibeStore';
  // Truncate to 160 characters for SEO
  const truncatedDescription = seoDescription.length > 160 ? seoDescription.substring(0, 157) + '...' : seoDescription;
  
  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = truncatedDescription;
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = `${app.title || 'Untitled App'} - VibeStore`;
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = truncatedDescription;
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.content = app.imageUrl || app.image || '/img/placeholder.svg';
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
  // Use longDescription if available, otherwise fall back to description
  const longDescription = app.longDescription || app.description || 'No detailed description available';
  // Preserve line breaks and formatting
  if (fullDescEl) {
    fullDescEl.innerHTML = longDescription.replace(/\n/g, '<br>');
    fullDescEl.style.whiteSpace = 'pre-wrap';
  }
  if (categoryEl) categoryEl.textContent = app.category || 'Uncategorized';
  if (platformEl) platformEl.textContent = app.platform || 'Not specified';
  if (nicheEl) nicheEl.textContent = app.niche || 'Not specified';
  
  // Render image gallery if screenshots exist
  renderImageGallery(app.screenshots || app.images || []);
  
  // Image with lazy loading
  const appImage = document.getElementById('app-icon');
  if (appImage) {
    const imageUrl = app.imageUrl || app.image || '/img/placeholder.svg';
    appImage.innerHTML = `
      <div class="app-icon-container">
        <img 
          data-src="${imageUrl}" 
          alt="${app.title} Icon" 
          class="lazy-image app-icon-img"
          loading="lazy"
          onerror="this.src='/img/placeholder.svg'"
          style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;"
        >
        <div class="image-placeholder">
          <div class="loading-spinner"></div>
        </div>
      </div>
    `;
    
    // Initialize lazy loading for app icon
    initializeLazyLoading();
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
    ctaButton.innerHTML = `<span>${getNicheCTA(app.niche)}</span>`;
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

// Render image gallery
function renderImageGallery(images) {
  const galleryContainer = document.getElementById('image-gallery');
  const galleryImages = document.getElementById('gallery-images');
  
  if (!galleryContainer || !galleryImages) return;
  
  // Always show gallery
  galleryContainer.style.display = 'block';
  
  // Filter and limit to 5 images
  const validImages = (images || []).filter(img => img && typeof img === 'string').slice(0, 5);
  
  if (validImages.length === 0) {
    // Show empty state
    galleryImages.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted); font-style: italic;">No screenshots available</div>';
    return;
  }
  
  // Render images with lazy loading and responsive images
  galleryImages.innerHTML = validImages.map((imageUrl, index) => `
    <div class="gallery-image" onclick="openLightbox('${imageUrl}')">
      <div class="image-container">
        <img 
          data-src="${imageUrl}" 
          alt="Screenshot ${index + 1}" 
          class="lazy-image"
          loading="lazy"
          onerror="this.src='/img/placeholder.png'"
        >
        <div class="image-placeholder">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Initialize lazy loading for gallery images
  initializeLazyLoading();
}

// Lightbox functionality
window.openLightbox = function(imageUrl) {
  // Create lightbox if it doesn't exist
  let lightbox = document.getElementById('image-lightbox');
  
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" onclick="closeLightbox()">×</button>
      <img src="" alt="Full size image">
    `;
    document.body.appendChild(lightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    });
  }
  
  const img = lightbox.querySelector('img');
  img.src = imageUrl;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeLightbox = function() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Lazy Loading Implementation
function initializeLazyLoading() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    const lazyImages = document.querySelectorAll('.lazy-image[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy-image');
    });
    return;
  }

  // Create intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before image comes into view
    threshold: 0.01
  });

  // Observe all lazy images
  const lazyImages = document.querySelectorAll('.lazy-image[data-src]');
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

// Load image with progressive enhancement
function loadImage(img) {
  const src = img.dataset.src;
  if (!src) return;

  // Show loading state
  const placeholder = img.parentElement.querySelector('.image-placeholder');
  if (placeholder) {
    placeholder.style.display = 'flex';
  }

  // Create new image to preload
  const newImg = new Image();
  
  newImg.onload = () => {
    // Image loaded successfully
    img.src = src;
    img.classList.remove('lazy-image');
    img.classList.add('loaded');
    
    // Hide loading placeholder
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    // Add fade-in effect
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      img.style.opacity = '1';
    }, 10);
  };
  
  newImg.onerror = () => {
    // Image failed to load
    img.src = '/img/placeholder.png';
    img.classList.remove('lazy-image');
    img.classList.add('error');
    
    // Hide loading placeholder
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    console.warn('Failed to load image:', src);
  };
  
  // Start loading
  newImg.src = src;
}

// Responsive Images Helper
function getResponsiveImageSrc(imageUrl, size = 'medium') {
  // Check if image has processed versions
  if (imageUrl.includes('processed/')) {
    // Extract base URL and add size parameter
    const baseUrl = imageUrl.split('_')[0];
    return `${baseUrl}_${size}.jpg`;
  }
  
  // Fallback to original image
  return imageUrl;
}

// Progressive Loading for Gallery
function enableProgressiveLoading() {
  const galleryImages = document.querySelectorAll('.gallery-image img');
  
  galleryImages.forEach((img, index) => {
    // Add delay for progressive loading
    setTimeout(() => {
      if (img.dataset.src) {
        loadImage(img);
      }
    }, index * 100); // 100ms delay between each image
  });
}

// Report functionality
function initializeReportButton() {
  const reportBtn = document.getElementById('report-btn');
  if (!reportBtn) return;
  
  reportBtn.addEventListener('click', () => {
    showReportModal();
  });
}

function showReportModal() {
  const modal = document.createElement('div');
  modal.className = 'report-modal';
  modal.innerHTML = `
    <div class="report-modal-content">
      <h3>Report App</h3>
      <p style="color: var(--c-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">
        Help us keep VibeStore safe by reporting issues with this app.
      </p>
      
      <div class="report-options">
        <div class="report-option" data-type="not-working">
          <input type="radio" id="not-working" name="report-type" value="not-working">
          <label for="not-working">
            <strong>App doesn't work or doesn't match description</strong><br>
            <span style="color: var(--c-muted); font-size: 0.85rem;">The app is broken, doesn't load, or the description is misleading</span>
          </label>
        </div>
        
        <div class="report-option" data-type="scam">
          <input type="radio" id="scam" name="report-type" value="scam">
          <label for="scam">
            <strong>App contains fraud or scam</strong><br>
            <span style="color: var(--c-muted); font-size: 0.85rem;">The app is fraudulent, contains malware, or is a scam</span>
          </label>
        </div>
        
        <div class="report-option" data-type="other">
          <input type="radio" id="other" name="report-type" value="other">
          <label for="other">
            <strong>Other</strong><br>
            <span style="color: var(--c-muted); font-size: 0.85rem;">Something else that violates our guidelines</span>
          </label>
        </div>
      </div>
      
      <div id="other-details" style="display: none;">
        <label for="report-details" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--c-text);">
          Please provide more details:
        </label>
        <textarea 
          id="report-details" 
          class="report-textarea" 
          placeholder="Describe the issue in detail..."
          maxlength="1000"
        ></textarea>
        <div style="text-align: right; margin-top: 0.25rem; font-size: 0.8rem; color: var(--c-muted);">
          <span id="char-count">0</span>/1000 characters
        </div>
      </div>
      
      <div class="report-actions">
        <button class="btn-cancel" onclick="closeReportModal()">Cancel</button>
        <button class="btn-submit-report" id="submit-report-btn" onclick="submitReport()" disabled>
          Submit Report
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Add event listeners
  const reportOptions = modal.querySelectorAll('.report-option');
  const otherDetails = modal.querySelector('#other-details');
  const reportDetails = modal.querySelector('#report-details');
  const charCount = modal.querySelector('#char-count');
  const submitBtn = modal.querySelector('#submit-report-btn');
  
  reportOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from all options
      reportOptions.forEach(opt => opt.classList.remove('selected'));
      // Add selected class to clicked option
      option.classList.add('selected');
      
      // Check the radio button
      const radio = option.querySelector('input[type="radio"]');
      radio.checked = true;
      
      // Show/hide other details
      if (radio.value === 'other') {
        otherDetails.style.display = 'block';
        reportDetails.required = true;
      } else {
        otherDetails.style.display = 'none';
        reportDetails.required = false;
        reportDetails.value = '';
        charCount.textContent = '0';
      }
      
      // Enable submit button
      submitBtn.disabled = false;
    });
  });
  
  // Character counter for textarea
  reportDetails.addEventListener('input', () => {
    const count = reportDetails.value.length;
    charCount.textContent = count;
    
    if (count > 1000) {
      reportDetails.value = reportDetails.value.substring(0, 1000);
      charCount.textContent = '1000';
    }
  });
  
  // Close modal on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeReportModal();
    }
  });
  
  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReportModal();
    }
  });
}

function closeReportModal() {
  const modal = document.querySelector('.report-modal');
  if (modal) {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  }
}

// Make functions globally available
window.closeReportModal = closeReportModal;
window.submitReport = submitReport;

async function submitReport() {
  const modal = document.querySelector('.report-modal');
  if (!modal) return;
  
  const selectedType = modal.querySelector('input[name="report-type"]:checked');
  const details = modal.querySelector('#report-details').value.trim();
  
  if (!selectedType) {
    alert('Please select a report type');
    return;
  }
  
  if (selectedType.value === 'other' && !details) {
    alert('Please provide details for your report');
    return;
  }
  
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) {
    alert('Error: No app selected');
    return;
  }
  
  try {
    const { db, storeMod } = await waitForFirebase();
    const { collection, addDoc, serverTimestamp } = storeMod;
    
    const reportData = {
      appId: appId,
      appTitle: currentApp?.title || 'Unknown App',
      reportType: selectedType.value,
      details: details || null,
      reportedBy: currentUser?.uid || 'anonymous',
      reportedByEmail: currentUser?.email || null,
      status: 'pending',
      createdAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: null
    };
    
    await addDoc(collection(db, 'reports'), reportData);
    
    // Close modal and show success message
    closeReportModal();
    alert('Thank you for your report. We will review it and take appropriate action.');
    
  } catch (error) {
    console.error('Error submitting report:', error);
    alert('Failed to submit report. Please try again.');
  }
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
      
      // Wait for FavoritesManager to initialize
      if (window.favoritesManager) {
        // Add listener for favorites changes
        window.favoritesManager.addListener(() => {
          updateButtonStates();
        });
      }
      
      // Update button states
      updateButtonStates();
    }
  });
}

// Update button states based on current user data (using FavoritesManager)
async function updateButtonStates() {
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId || !currentUser) return;

  try {
    // Update save button state
    const saveButton = document.getElementById('save-btn');
    if (saveButton && window.favoritesManager && window.favoritesManager.initialized) {
      const isFavorited = window.favoritesManager.isFavorited(appId);
      
      // Update button classes only (keep text the same)
      if (isFavorited) {
        saveButton.classList.add('saved', 'active');
      } else {
        saveButton.classList.remove('saved', 'active');
      }
      
      console.log('Save button updated - Favorited:', isFavorited);
    }
    
    // Update "Add to List" button state
    const addToListButton = document.getElementById('add-to-list-btn');
    if (addToListButton) {
      const isInList = await checkIfAppInUserLists(appId);
      
      // Update button classes only (keep text the same)
      if (isInList) {
        addToListButton.classList.add('saved', 'active');
      } else {
        addToListButton.classList.remove('saved', 'active');
      }
    }
  } catch (error) {
    console.error('Error updating button states:', error);
  }
}

// Check if app is in any of user's lists
async function checkIfAppInUserLists(appId) {
  try {
    const { db, storeMod } = await waitForFirebase();
    const { doc, getDoc } = storeMod;
    
    const userRef = doc(db, 'users', currentUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) return false;
    
    const userData = userSnap.data();
    const lists = userData.lists || [];
    
    // Check if app is in any list
    return lists.some(list => list.apps && list.apps.includes(appId));
  } catch (error) {
    console.error('Error checking lists:', error);
    return false;
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
  initializeReportButton(); // Initialize report button
  
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
          
          // Update user count locally (without Cloud Functions)
          try {
            const { db, storeMod } = await waitForFirebase();
            const { doc, getDoc, updateDoc, increment } = storeMod;
            
            const appRef = doc(db, 'apps', appId);
            await updateDoc(appRef, {
              usersCount: increment(1),
              updatedAt: new Date()
            });
            
            console.log('User count updated successfully via client-side update');
            
            // Reload app details to show updated count
            await loadAppDetails();
          } catch (error) {
            console.warn('Failed to update user count:', error);
          }
          
        } catch (error) {
          console.warn('Failed to log interaction:', error);
        }
      }
      // Let the default link behavior happen
    });
  }

  // Save button - add to favorites (using FavoritesManager)
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
        // Use the FavoritesManager
        if (window.favoritesManager && window.favoritesManager.initialized) {
          await window.favoritesManager.toggleFavorite(appId);
          // Update button state (will be called automatically via listener, but we can do it immediately too)
          updateButtonStates();
        } else {
          alert('Favorites system not initialized. Please refresh the page.');
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
  try {
    const { db, storeMod } = await waitForFirebase();
    const { doc, getDoc, updateDoc, arrayUnion } = storeMod;
    
    // Get user's lists with offline support
    const userRef = doc(db, 'users', currentUser.uid);
    let userSnap;
    
    try {
      userSnap = await getDoc(userRef);
    } catch (error) {
      if (error.code === 'unavailable' || error.message.includes('offline')) {
        alert('You are currently offline. Please check your internet connection and try again.');
        return;
      }
      throw error;
    }
    
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
        
        // Update button state after adding to list
        await updateButtonStates();
        
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
  } catch (error) {
    console.error('Error showing list modal:', error);
    if (error.code === 'unavailable' || error.message.includes('offline')) {
      alert('You are currently offline. Please check your internet connection and try again.');
    } else {
      alert('Error loading lists. Please try again.');
    }
  }
}

// Helper function to check if app is favorited (using FavoritesManager)
function checkIfFavorited(appId) {
  if (window.favoritesManager && window.favoritesManager.initialized) {
    return window.favoritesManager.isFavorited(appId);
  }
  return false;
}

// Social sharing functionality
function initializeSocialSharing() {
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) return;
  
  // Get app data for sharing
  const getShareData = () => {
    const title = currentApp?.title || 'Check out this app';
    const description = currentApp?.description || '';
    const url = window.location.href;
    
    return { title, description, url };
  };
  
  // Facebook share
  document.getElementById('share-facebook')?.addEventListener('click', () => {
    const { url } = getShareData();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
  
  // Twitter/X share
  document.getElementById('share-twitter')?.addEventListener('click', () => {
    const { title, url } = getShareData();
    const text = `${title} - Check it out on VibeStore`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
  
  // LinkedIn share
  document.getElementById('share-linkedin')?.addEventListener('click', () => {
    const { url } = getShareData();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
  
  // WhatsApp share
  document.getElementById('share-whatsapp')?.addEventListener('click', () => {
    const { title, url } = getShareData();
    const text = `${title} - ${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  });
  
  // Copy link
  document.getElementById('share-copy')?.addEventListener('click', async () => {
    const { url } = getShareData();
    const btn = document.getElementById('share-copy');
    
    try {
      await navigator.clipboard.writeText(url);
      
      // Visual feedback
      btn.classList.add('copied');
      const originalTitle = btn.title;
      btn.title = 'Copied!';
      
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.title = originalTitle;
      }, 2000);
      
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      } catch (err) {
        alert('Failed to copy link. Please copy manually: ' + url);
      }
      document.body.removeChild(textArea);
    }
  });
}

// Initialize social sharing when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for app data to load
  setTimeout(() => {
    initializeSocialSharing();
  }, 1000);
});
</script>