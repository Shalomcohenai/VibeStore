---
title: Shared List
layout: page
permalink: /pages/shared-list
---

<style>
.shared-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.shared-list-header {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 2rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0,0,0,0.05);
  text-align: center;
}

.shared-list-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--c-text);
}

.shared-list-description {
  color: var(--c-muted);
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.shared-list-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.meta-item {
  text-align: center;
}

.meta-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--c-primary);
  display: block;
}

.meta-label {
  font-size: 0.9rem;
  color: var(--c-muted);
  margin-top: 0.25rem;
}

.apps-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 2rem;
  border: 1px solid rgba(0,0,0,0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--c-text);
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.app-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 1.5rem;
  border: 1px solid rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.app-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.app-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.app-icon {
  width: 50px;
  height: 50px;
  background: var(--c-primary);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.app-info {
  flex: 1;
}

.app-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--c-text);
}

.app-category {
  font-size: 0.9rem;
  color: var(--c-muted);
}

.app-description {
  color: var(--c-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--c-muted);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--c-text);
}

.error-message {
  font-size: 1rem;
  margin: 0;
}

.loading-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--c-muted);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(107,70,193,0.1);
  border-top: 3px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .shared-list-page {
    padding: 1rem;
  }
  
  .shared-list-header {
    padding: 1.5rem;
  }
  
  .shared-list-title {
    font-size: 1.5rem;
  }
  
  .shared-list-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .apps-section {
    padding: 1.5rem;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .app-card {
    padding: 1rem;
  }
  
  .app-header {
    gap: 0.75rem;
  }
  
  .app-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}
</style>

<div class="shared-list-page">
  <!-- Loading State -->
  <div class="loading-state" id="loading-state">
    <div class="loading-spinner"></div>
    <p class="loading-text">Loading shared list...</p>
  </div>

  <!-- Error State -->
  <div class="error-state" id="error-state" style="display: none;">
    <div class="error-icon">📋</div>
    <h2 class="error-title">List Not Found</h2>
    <p class="error-message">This shared list doesn't exist or has been removed.</p>
  </div>

  <!-- Shared List Content -->
  <div id="shared-list-content" style="display: none;">
    <!-- List Header -->
    <div class="shared-list-header">
      <h1 class="shared-list-title" id="list-title">Loading...</h1>
      <p class="shared-list-description" id="list-description">Loading...</p>
      
      <div class="shared-list-meta">
        <div class="meta-item">
          <span class="meta-number" id="app-count">0</span>
          <span class="meta-label">Apps</span>
        </div>
        <div class="meta-item">
          <span class="meta-number" id="access-count">0</span>
          <span class="meta-label">Views</span>
        </div>
      </div>
    </div>

    <!-- Apps Section -->
    <div class="apps-section">
      <h2 class="section-title">Apps in this list</h2>
      <div class="apps-grid" id="apps-grid">
        <!-- Apps will be loaded dynamically -->
      </div>
    </div>
  </div>
</div>

<script type="module">
// Wait for Firebase to initialize
const waitForFirebaseShared = async () => {
  if (window.waitForFirebase) {
    const fb = await window.waitForFirebase();
    return {
      db: fb.db,
      storeMod: fb.storeMod
    };
  } else {
    // Fallback: wait for $fb to be available
    return new Promise(resolve => {
      const check = () => {
        if (window.$fb && window.$fb.db && window.$fb.storeMod) {
          resolve({
            db: window.$fb.db,
            storeMod: window.$fb.storeMod
          });
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }
};

// Load shared list
async function loadSharedList() {
  try {
    const { db, storeMod } = await waitForFirebaseShared();
    const { doc, getDoc, updateDoc, increment, serverTimestamp } = storeMod;
    
    // Get share token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const shareToken = urlParams.get('token');
    
    if (!shareToken) {
      showError();
      return;
    }
    
    // Get shared list document
    const sharedListRef = doc(db, 'shared_lists', shareToken);
    const sharedListDoc = await getDoc(sharedListRef);
    
    if (!sharedListDoc.exists()) {
      showError();
      return;
    }
    
    const sharedListData = sharedListDoc.data();
    
    // Update access count
    await updateDoc(sharedListRef, {
      accessCount: increment(1),
      lastAccessed: serverTimestamp()
    });
    
    // Display list information
    document.getElementById('list-title').textContent = sharedListData.name || 'Untitled List';
    document.getElementById('list-description').textContent = sharedListData.description || 'No description available';
    document.getElementById('app-count').textContent = (sharedListData.apps && sharedListData.apps.length) || 0;
    document.getElementById('access-count').textContent = (sharedListData.accessCount || 0) + 1;
    
    // Load and display apps
    await loadApps(sharedListData.apps || []);
    
    // Show content
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('shared-list-content').style.display = 'block';
    
  } catch (error) {
    console.error('Error loading shared list:', error);
    showError();
  }
}

// Load apps for the shared list
async function loadApps(apps) {
  const appsGrid = document.getElementById('apps-grid');
  if (!appsGrid) return;
  
  if (apps.length === 0) {
    appsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--c-muted);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
        <h3>No apps in this list</h3>
        <p>This list doesn't contain any apps yet.</p>
      </div>
    `;
    return;
  }
  
  appsGrid.innerHTML = '';
  
  apps.forEach(app => {
    const appCard = createAppCard(app);
    appsGrid.insertAdjacentHTML('beforeend', appCard);
  });
}

// Create app card HTML
function createAppCard(app) {
  const appIcon = app.appIcon || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 100%; height: 100%;"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>';
  const appTitle = app.appTitle || 'Unknown App';
  const appCategory = app.appCategory || 'App';
  const appId = app.appId || '';
  
  return `
    <div class="app-card" onclick="window.location.href='/pages/app?id=${appId}'">
      <div class="app-header">
        <div class="app-icon">${appIcon}</div>
        <div class="app-info">
          <h3 class="app-title">${escapeHtml(appTitle)}</h3>
          <p class="app-category">${escapeHtml(appCategory)}</p>
        </div>
      </div>
      <p class="app-description">Click to view app details</p>
    </div>
  `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show error state
function showError() {
  document.getElementById('loading-state').style.display = 'none';
  document.getElementById('error-state').style.display = 'block';
}

// Load shared list when page loads
document.addEventListener('DOMContentLoaded', loadSharedList);
</script>