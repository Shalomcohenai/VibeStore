---
title: My Profile
layout: page
permalink: /pages/profile/
---

<div class="profile-page">
  <!-- Profile Header -->
  <div class="profile-header">
    <div class="profile-avatar-large" id="profile-avatar-large">
      <span id="profile-initials-large">SC</span>
    </div>
    <div class="profile-info">
      <h1 id="profile-name">Loading...</h1>
      <p class="profile-email" id="profile-email">Loading...</p>
      <p class="profile-joined">Member since <span id="profile-joined">2024</span></p>
    </div>
    <div class="profile-actions">
      <button class="btn-logout" id="logout-btn">
        <span>🔓</span> Sign Out
      </button>
      <a class="btn-admin" id="admin-panel-btn" href="/pages/admin" style="display: none;">
        <span>🛠️</span> Admin Panel
      </a>
    </div>
  </div>

  <!-- Profile Tabs -->
  <div class="profile-tabs">
    <button class="tab-btn active" data-tab="apps">My Apps</button>
    <button class="tab-btn" data-tab="lists">App Lists</button>
    <button class="tab-btn" data-tab="settings">Settings</button>
  </div>

  <!-- Tab Content -->
  <div class="tab-content">
    
    <!-- My Apps Tab -->
    <div class="tab-panel active" id="apps-tab">
      <div class="stats-section">
        <h3>Your Stats</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number" id="stats-submitted">0</div>
            <div class="stat-label">Apps Submitted</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="stats-favorites">0</div>
            <div class="stat-label">Favorites</div>
          </div>
          <div class="stat-card">
            <div class="stat-number" id="stats-lists">0</div>
            <div class="stat-label">Lists Created</div>
          </div>
        </div>
      </div>
      <div class="apps-section">
        <div class="section-header">
          <h3>My Submitted Apps</h3>
          <a href="/pages/submit-form" class="btn-add">+ Submit New App</a>
        </div>
        
        <div class="apps-grid" id="submitted-apps-grid">
          <!-- Submitted apps will be loaded dynamically from Firebase -->
          <div class="empty-state" id="no-submitted-apps" style="text-align: center; padding: 3rem 1rem; color: var(--c-muted);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
            <h4>No apps submitted yet</h4>
            <p>Your submitted apps will appear here once you submit them for review.</p>
          </div>
        </div>
      </div>

      <div class="favorites-section">
        <h3>Favorite Apps</h3>
        <div class="favorites-grid" id="favorites-grid">
          <!-- Favorite apps will be loaded dynamically from Firebase -->
          <div class="empty-state" id="no-favorites" style="text-align: center; padding: 3rem 1rem; color: var(--c-muted);">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⭐</div>
            <h4>No favorite apps yet</h4>
            <p>Apps you mark as favorites will appear here.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- App Lists Tab -->
    <div class="tab-panel" id="lists-tab">
      <div class="lists-section">
        <div class="section-header">
          <h3>My App Lists</h3>
          <button class="btn-add" id="create-list-btn">+ Create New List</button>
        </div>
        
        <div class="lists-grid" id="lists-grid">
          <div class="loading-state">Loading your lists...</div>
        </div>
      </div>
    </div>

    <!-- Settings Tab -->
    <div class="tab-panel" id="settings-tab">
      <div class="settings-section">
        <h3>Account Settings</h3>
        
        <div class="setting-group">
          <h4>Notifications</h4>
          <div class="setting-item">
            <label class="toggle-label">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
              Email notifications for app approvals
            </label>
          </div>
          <div class="setting-item">
            <label class="toggle-label">
              <input type="checkbox" />
              <span class="toggle-slider"></span>
              Weekly newsletter
            </label>
          </div>
          <div class="setting-item">
            <label class="toggle-label">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
              New features announcements
            </label>
          </div>
        </div>

        <div class="setting-group">
          <h4>Privacy</h4>
          <div class="setting-item">
            <label class="toggle-label">
              <input type="checkbox" checked />
              <span class="toggle-slider"></span>
              Make my profile public
            </label>
          </div>
          <div class="setting-item">
            <label class="toggle-label">
              <input type="checkbox" />
              <span class="toggle-slider"></span>
              Show my submitted apps
            </label>
          </div>
        </div>

        <div class="setting-group danger">
          <h4>Danger Zone</h4>
          <button class="btn-danger">Delete Account</button>
          <p class="warning-text">This action cannot be undone. All your data will be permanently deleted.</p>
        </div>
      </div>
    </div>

  </div>
</div>

<style>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,.1);
  margin-bottom: 2rem;
}

.profile-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 2.5rem;
  flex-shrink: 0;
  border: 4px solid white;
  box-shadow: 0 8px 24px rgba(107,70,193,.3);
}

.profile-info {
  flex: 1;
}

.profile-info h1 {
  margin: 0 0 0.5rem;
  color: var(--c-text);
  font-size: 2rem;
  font-weight: 700;
}

.profile-email {
  margin: 0 0 0.5rem;
  color: var(--c-muted);
  font-size: 1.1rem;
}

.profile-joined {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.9rem;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-logout, .btn-admin {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-logout {
  background: #ef4444;
  color: white;
}

.btn-logout:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.btn-admin {
  background: #059669;
  color: white;
}

.btn-admin:hover {
  background: #047857;
  transform: translateY(-2px);
}

/* Tabs */
.profile-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
}

.tab-btn {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-weight: 600;
  color: var(--c-muted);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn.active {
  background: var(--c-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(107,70,193,.3);
}

.tab-btn:hover:not(.active) {
  background: var(--c-bg);
  color: var(--c-text);
}

/* Tab Content */
.tab-panel {
  display: none;
}

.tab-panel.active {
  display: block;
}

/* Personal Info */
.info-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
  margin-bottom: 2rem;
}

.info-section h3 {
  margin: 0 0 1.5rem;
  color: var(--c-text);
  font-size: 1.3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--c-text);
  font-weight: 600;
  font-size: 0.9rem;
}

.info-item input, .info-item select, .info-item textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--c-line);
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.info-item input:focus, .info-item select:focus, .info-item textarea:focus {
  outline: none;
  border-color: var(--c-primary);
}

.btn-save {
  padding: 0.75rem 2rem;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:hover {
  background: var(--c-accent);
  transform: translateY(-2px);
}

/* Stats */
.stats-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
}

.stats-section h3 {
  margin: 0 0 1.5rem;
  color: var(--c-text);
  font-size: 1.3rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem 1rem;
  background: white;
  border-radius: 16px;
  border: 2px solid var(--c-line);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
}

.stat-card:hover {
  border-color: var(--c-primary);
  transform: translateY(-4px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--c-primary);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--c-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

/* Apps Grid */
.apps-section, .lists-section, .settings-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  color: var(--c-text);
  font-size: 1.3rem;
}

.btn-add {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background: var(--c-accent);
  transform: translateY(-2px);
}

.apps-grid, .lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}


.app-card, .list-card {
  padding: 1.5rem;
  border: 2px solid var(--c-line);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.app-card:hover, .list-card:hover {
  border-color: var(--c-primary);
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(107,70,193,.15);
}

.app-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.app-status.pending {
  background: #fbbf24;
  color: #92400e;
}

.app-status.approved {
  background: #34d399;
  color: #065f46;
}

.app-status.rejected {
  background: #f87171;
  color: #991b1b;
}

.app-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.app-card h4, .list-card h4 {
  margin: 0 0 0.5rem;
  color: var(--c-text);
  font-size: 1.1rem;
}

.app-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 1rem 0;
  font-size: 0.8rem;
  color: var(--c-muted);
}

.app-actions, .list-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-edit, .btn-view, .btn-share {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--c-line);
  background: white;
  color: var(--c-text);
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit:hover, .btn-view:hover, .btn-share:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
}

.btn-disabled {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #9ca3af;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Lists specific */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.list-meta {
  font-size: 0.8rem;
  color: var(--c-muted);
}

.list-preview {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.app-dot {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.more {
  font-size: 0.8rem;
  color: var(--c-muted);
  font-weight: 500;
}

/* Enhanced list card design */
.list-card {
  background: white;
  border: 2px solid var(--c-line);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.list-card:hover {
  border-color: var(--c-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(107,70,193,.15);
}

/* New list card design */
.list-card-new {
  background: white;
  border: 2px solid var(--c-line);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.list-card-new:hover {
  border-color: var(--c-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(107,70,193,.15);
}

.list-card-content {
  width: 100%;
}

.list-card-creator {
  margin: 0 0 0.5rem;
  color: var(--c-muted);
  font-size: 0.85rem;
  font-weight: 500;
}

.list-actions-new {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-action {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--c-line);
  background: white;
  color: var(--c-text);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-action:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
  transform: translateY(-1px);
}

/* New app card design for list view */
.list-apps-grid-new {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.list-app-card-new {
  background: white;
  border: 2px solid var(--c-line);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.list-app-card-new:hover {
  border-color: var(--c-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107,70,193,.1);
}

.list-app-card-icon-new {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.list-app-card-content-new {
  flex: 1;
  min-width: 0;
}

.list-app-card-title-new {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.3;
}

.list-app-card-desc-new {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: var(--c-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-app-card-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.app-category, .app-platform {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--c-bg);
  color: var(--c-muted);
  border-radius: 4px;
  font-weight: 500;
}

.list-app-card-actions-new {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.btn-view-app-new {
  padding: 0.4rem 0.8rem;
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-view-app-new:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

.remove-from-list-btn-new {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-from-list-btn-new:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Clean Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

.modal-large {
  max-width: 800px;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--c-line);
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--c-text);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--c-muted);
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--c-bg);
  color: var(--c-text);
}

.btn-share-list {
  background: var(--c-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-share-list:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

.modal-body {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--c-line);
  background: #f8f9fa;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--c-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--c-line);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

/* Button Styles */
.btn-primary {
  background: var(--c-primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

.btn-secondary {
  background: white;
  color: var(--c-text);
  border: 1px solid var(--c-line);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: var(--c-bg);
  border-color: var(--c-primary);
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-1px);
}

/* List Selection Styles */
.list-selection {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-selection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--c-line);
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.list-selection-item:hover {
  border-color: var(--c-primary);
  box-shadow: 0 4px 12px rgba(107, 70, 193, 0.1);
}

.list-info h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
}

.list-info p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--c-muted);
}

.btn-add-to-list {
  background: var(--c-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add-to-list:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

/* Apps in List Styles */
.apps-in-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.app-card-in-list {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--c-line);
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
}

.app-card-in-list:hover {
  border-color: var(--c-primary);
  box-shadow: 0 4px 12px rgba(107, 70, 193, 0.1);
}

.app-card-in-list .app-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--c-primary);
  border-radius: 8px;
  color: white;
}

.app-card-in-list .app-info {
  flex: 1;
}

.app-card-in-list .app-info h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
}

.app-card-in-list .app-info p {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  color: var(--c-muted);
}

.app-rating {
  font-size: 0.8rem;
  color: var(--c-muted);
}

.app-card-in-list .app-actions {
  display: flex;
  gap: 0.5rem;
}

.app-card-in-list .btn-view {
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.app-card-in-list .btn-view:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

.app-card-in-list .btn-remove {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.app-card-in-list .btn-remove:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

.list-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.list-card-title {
  margin: 0;
  color: var(--c-text);
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.3;
}

.list-card-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-share-list {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  opacity: 0.7;
}

.btn-share-list:hover {
  background: rgba(107,70,193,0.1);
  opacity: 1;
  transform: scale(1.1);
}

.list-card-menu {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  opacity: 0.7;
}

.list-card-menu:hover {
  background: rgba(107,70,193,0.1);
  opacity: 1;
  transform: scale(1.1);
}

.list-card-count {
  margin: 0 0 0.5rem;
  color: var(--c-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.list-card-description {
  margin: 0 0 1rem;
  color: var(--c-muted);
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-edit, .btn-view {
  padding: 0.5rem 1rem;
  border: 1px solid var(--c-line);
  background: white;
  color: var(--c-text);
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-edit:hover, .btn-view:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
  transform: translateY(-1px);
}

/* Enhanced list app card design */
.list-app-card {
  background: white;
  border: 2px solid var(--c-line);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.list-app-card:hover {
  border-color: var(--c-primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(107,70,193,.1);
}

.list-app-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.list-app-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.list-app-card-info {
  flex: 1;
  min-width: 0;
}

.list-app-card-title {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--c-text);
  line-height: 1.3;
}

.list-app-card-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--c-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.remove-from-list-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-from-list-btn:hover {
  background: #fecaca;
  transform: scale(1.1);
}

.list-app-card-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-view-app {
  padding: 0.4rem 0.8rem;
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-view-app:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

/* Share modal styles */
.share-url-container {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.share-url-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--c-line);
  border-radius: 8px;
  font-size: 0.9rem;
  background: #f8f9fa;
}

.btn-copy-url {
  padding: 0.75rem 1rem;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-copy-url:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

.share-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Favorites */
.favorites-section {
  margin-top: 2rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Status and Action Top Layout */
.status-and-action-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.status-badge-container {
  display: flex;
  justify-content: flex-start;
}

.app-status {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.app-status.pending {
  background: #fbbf24;
  color: #92400e;
}

.app-status.approved {
  background: #34d399;
  color: #065f46;
}

.app-status.rejected {
  background: #f87171;
  color: #991b1b;
}

/* Action Buttons in Header */
.status-and-action-top .action-buttons {
  display: flex;
  gap: 0.5rem;
}

.status-and-action-top .action-btn-v2 {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.status-and-action-top .action-btn-v2[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.favorite-app {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--c-line);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.favorite-app:hover {
  border-color: var(--c-primary);
}

.favorite-app .app-icon {
  font-size: 1.5rem;
  margin: 0;
}

.favorite-app .app-info {
  flex: 1;
}

.favorite-app h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.favorite-app p {
  margin: 0;
  font-size: 0.8rem;
  color: var(--c-muted);
}

.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
  font-size: 1rem;
}

.btn-remove:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

/* Settings */
.setting-group {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--c-line);
}

.setting-group:last-child {
  border-bottom: none;
}

.setting-group h4 {
  margin: 0 0 1rem;
  color: var(--c-text);
  font-size: 1.1rem;
}

.setting-item {
  margin-bottom: 1rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--c-text);
}

.toggle-label input {
  display: none;
}

.toggle-slider {
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,.2);
}

.toggle-label input:checked + .toggle-slider {
  background: var(--c-primary);
}

.toggle-label input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.setting-group.danger {
  border-color: #fee2e2;
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.warning-text {
  margin: 1rem 0 0;
  font-size: 0.8rem;
  color: #991b1b;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .profile-actions {
    flex-direction: row;
    justify-content: center;
  }
  
  .profile-tabs {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    flex: 1 1 45%;
    min-width: 120px;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .apps-grid, .lists-grid, .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<!-- Load clean lists system -->
<script src="/assets/js/lists-clean.js"></script>

<script type="module">
// Wait for Firebase to initialize
const waitForFirebase = () => new Promise(resolve => {
  const check = () => {
    if (window.$fb && window.$fb.auth) {
      resolve(window.$fb);
    } else {
      setTimeout(check, 100);
    }
  };
  check();
});

try {
  const { auth, authMod } = await waitForFirebase();

  // Update profile info
  const updateProfile = async (user) => {
    if (user) {
      const email = user.email;
      const initials = email.substring(0, 2).toUpperCase();
      const username = email.split('@')[0];
      
      document.getElementById('profile-initials-large').textContent = initials;
      document.getElementById('profile-name').textContent = user.displayName || username;
      document.getElementById('profile-email').textContent = email;
      
      // Set join date (you could store this in Firestore)
      const joinDate = new Date(user.metadata?.creationTime || Date.now());
      document.getElementById('profile-joined').textContent = joinDate.getFullYear();
      
      // Check if user is admin and show/hide admin panel button
      try {
        const isAdmin = await window.isUserAdmin();
        const adminBtn = document.getElementById('admin-panel-btn');
        
        if (adminBtn) {
          adminBtn.style.display = isAdmin ? 'flex' : 'none';
          console.log('Admin panel access:', isAdmin ? 'granted' : 'denied', 'for', user.email);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        // Hide admin button by default if there's an error
        const adminBtn = document.getElementById('admin-panel-btn');
        if (adminBtn) {
          adminBtn.style.display = 'none';
        }
      }
    }
  };

  // Auth state is now handled below in loadFavoriteApps section

  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      
      // Remove active class from all tabs and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding panel
      button.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });

  // Logout functionality
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to sign out?')) {
      authMod.signOut(auth).then(() => {
        console.log('User signed out successfully');
        window.location.href = '/';
      }).catch((error) => {
        console.error('Sign out error:', error);
        alert('Error signing out. Please try again.');
      });
    }
  });

  // Save profile functionality
  document.querySelector('.btn-save')?.addEventListener('click', () => {
    // Here you would save to Firestore
    alert('Profile saved! (This would connect to Firestore in a real app)');
  });

  // Create list functionality - now handled by VibeStoreLists module

  // Load favorite apps
  const loadFavoriteApps = async () => {
    try {
      const { db, storeMod } = await waitForFirebase();
      const { doc, getDoc } = storeMod;
      
      const user = auth.currentUser;
      if (!user) return;
      
      // Get user data to find favorite app IDs
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        console.log('User document does not exist');
        return;
      }
      
      const userData = userDoc.data();
      const favoriteAppIds = userData.favorites || [];
      
      if (favoriteAppIds.length === 0) {
        document.getElementById('no-favorites').style.display = 'block';
        return;
      }
      
      // Load each favorite app using individual document reads
      // Note: Firestore doesn't support 'in' queries with document IDs directly
      // We'll fetch each app individually
      const favoriteApps = [];
      
      for (const appId of favoriteAppIds) {
        try {
          const appDoc = await getDoc(doc(db, 'apps', appId));
          if (appDoc.exists()) {
            const data = appDoc.data();
            favoriteApps.push({
              id: appDoc.id,
              ...data
            });
          }
        } catch (error) {
          console.error(`Error loading app ${appId}:`, error);
        }
      }
      
      // Update stats
      document.getElementById('stats-favorites').textContent = favoriteApps.length;
      
      // Render favorite apps
      const favoritesGrid = document.getElementById('favorites-grid');
      if (favoriteApps.length === 0) {
        document.getElementById('no-favorites').style.display = 'block';
        return;
      }
      
      document.getElementById('no-favorites').style.display = 'none';
      favoritesGrid.innerHTML = '';
      
      favoriteApps.forEach(app => {
        const favoriteAppHTML = `
          <div class="favorite-app">
            <div class="app-icon">📱</div>
            <div class="app-info">
              <h4>${app.title || 'Untitled App'}</h4>
              <p>${app.category || 'App'} • ${app.description?.substring(0, 60) || 'No description'}...</p>
            </div>
            <div class="app-actions">
              <a href="/pages/app?id=${app.id}" class="btn-view">View</a>
              <button class="btn-remove" onclick="removeFromFavorites('${app.id}')" title="Remove from favorites">❌</button>
            </div>
          </div>
        `;
        favoritesGrid.insertAdjacentHTML('beforeend', favoriteAppHTML);
      });
      
    } catch (error) {
      console.error('Error loading favorite apps:', error);
    }
  };

  // Remove from favorites function (using FavoritesManager)
  window.removeFromFavorites = async (appId) => {
    try {
      if (window.favoritesManager && window.favoritesManager.initialized) {
        await window.favoritesManager.removeFromFavorites(appId);
        // Reload favorite apps
        await loadFavoriteApps();
      } else {
        alert('Favorites system not initialized. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Error removing from favorites. Please try again.');
    }
  };

  // Wait for Firebase to initialize (using existing function if available)
  const waitForFirebaseProfile = () => new Promise(resolve => {
    const check = () => {
      if (window.$fb && window.$fb.auth && window.$fb.db) {
        console.log('✅ Firebase is ready for profile page');
        resolve(window.$fb);
      } else {
        console.log('⏳ Waiting for Firebase to initialize...');
        setTimeout(check, 100);
      }
    };
    check();
  });

  let currentUser = null;

  // User data management functions
  async function getUserData(uid) {
    console.log('🔍 Getting user data for UID:', uid);
    
    try {
      const { db, storeMod } = await waitForFirebaseProfile();
      const { doc, getDoc, setDoc } = storeMod;
      
      console.log('📡 Fetching user document from Firestore...');
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (userDoc.exists()) {
        console.log('✅ User document found');
        const data = userDoc.data();
        console.log('📄 User data:', data);
        return data;
      } else {
        console.log('📝 Creating new user document...');
        // Create user document if it doesn't exist
        const userData = {
          uid: uid,
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email.split('@')[0],
          favorites: [],
          lists: [],
          createdAt: new Date()
        };
        await setDoc(doc(db, 'users', uid), userData);
        console.log('✅ New user document created');
        return userData;
      }
    } catch (error) {
      console.error('❌ Error getting user data:', error);
      return { favorites: [], lists: [] }; // Return default structure on error
    }
  }

  async function updateUserData(uid, data) {
    console.log('💾 Updating user data for UID:', uid);
    console.log('📊 Data to update:', data);
    
    try {
      const { db, storeMod } = await waitForFirebaseProfile();
      const { doc, updateDoc } = storeMod;
      
      console.log('📡 Sending update to Firestore...');
      await updateDoc(doc(db, 'users', uid), data);
      console.log('✅ User data updated successfully');
      return true;
    } catch (error) {
      console.error('❌ Error updating user data:', error);
      return false;
    }
  }

  // Update user statistics
  async function updateUserStats() {
    if (!currentUser) return;
    
    try {
      const userData = await getUserData(currentUser.uid);
      const favorites = userData?.favorites || [];
      const lists = userData?.lists || [];
      
      // Update favorites count (multiple elements)
      const favoritesCountEl = document.getElementById('favorites-count');
      const statsFavoritesEl = document.getElementById('stats-favorites');
      if (favoritesCountEl) favoritesCountEl.textContent = favorites.length;
      if (statsFavoritesEl) statsFavoritesEl.textContent = favorites.length;
      
      // Update lists count (multiple elements)
      const listsCountEl = document.getElementById('lists-count');
      const statsListsEl = document.getElementById('stats-lists');
      if (listsCountEl) listsCountEl.textContent = lists.length;
      if (statsListsEl) statsListsEl.textContent = lists.length;
      
      // Update submissions count from database
      await updateSubmittedAppsCount();
      
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }

  // Update submitted apps count from database
  async function updateSubmittedAppsCount() {
    if (!currentUser) return;
    
    try {
      const { db, storeMod } = await waitForFirebaseProfile();
      const { collection, query, where, getDocs } = storeMod;
      
      console.log('🔍 Updating submitted apps count for user:', currentUser.uid);
      
      // Query apps submitted by this user
      const appsQuery = query(collection(db, 'apps'), where('submittedBy', '==', currentUser.uid));
      const querySnapshot = await getDocs(appsQuery);
      
      const submissionsCount = querySnapshot.size;
      console.log('📊 Submitted apps count:', submissionsCount);
      
      // Update submissions count in stats
      const statsSubmittedEl = document.getElementById('stats-submitted');
      if (statsSubmittedEl) {
        statsSubmittedEl.textContent = submissionsCount;
        console.log('✅ Updated stats submitted count to:', submissionsCount);
      } else {
        console.warn('⚠️ Stats submitted element not found');
      }
      
    } catch (error) {
      console.error('❌ Error updating submitted apps count:', error);
    }
  }

  // Favorites management
  async function loadFavorites() {
    if (!currentUser) return;
    
    const favoritesGrid = document.getElementById('favorites-grid');
    if (!favoritesGrid) return;
    
    favoritesGrid.innerHTML = '<div class="loading-state">Loading your favorites...</div>';
    
    try {
      // Add a small delay to ensure Firebase is fully initialized
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userData = await getUserData(currentUser.uid);
      const favorites = userData?.favorites || [];
      
      if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="empty-state">No favorites yet. Start exploring apps!</div>';
        return;
      }
      
      // Fetch app details for each favorite
      const { db, storeMod } = await waitForFirebaseProfile();
      const { doc, getDoc } = storeMod;
      
      favoritesGrid.innerHTML = '';
      
      for (const appId of favorites) {
        try {
          const appDoc = await getDoc(doc(db, 'apps', appId));
          if (appDoc.exists()) {
            const app = { id: appDoc.id, ...appDoc.data() };
            const appCard = createAppCard(app, true);
            favoritesGrid.insertAdjacentHTML('beforeend', appCard);
          }
        } catch (error) {
          console.error('Error loading favorite app:', error);
        }
      }
      
      if (favoritesGrid.innerHTML === '') {
        favoritesGrid.innerHTML = '<div class="empty-state">No favorites found.</div>';
      }
      
    } catch (error) {
      console.error('Error loading favorites:', error);
      favoritesGrid.innerHTML = '<div class="empty-state">Error loading favorites. Please refresh the page.</div>';
    }
  }

  // Lists management - using clean lists system
  function loadLists() {
    console.log('🔄 Loading lists using clean system...');
    // The clean lists system will handle loading automatically
  }

  // Submissions management
  async function loadSubmissions() {
    if (!currentUser) return;
    
    const submissionsGrid = document.getElementById('submitted-apps-grid');
    if (!submissionsGrid) return;
    
    submissionsGrid.innerHTML = '<div class="loading-state">Loading your submissions...</div>';
    
    try {
      // Add a small delay to ensure Firebase is fully initialized
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { db, storeMod } = await waitForFirebaseProfile();
      const { collection, query, where, getDocs } = storeMod;
      
      console.log('🔍 Loading submissions for user:', currentUser.uid);
      
      // Query apps submitted by this user (including all statuses: pending, approved, rejected)
      const appsQuery = query(collection(db, 'apps'), where('submittedBy', '==', currentUser.uid));
      const querySnapshot = await getDocs(appsQuery);
      
      const submissionsCount = querySnapshot.size;
      console.log('📊 Found submissions:', submissionsCount);
      
      // Update submissions count in stats
      const statsSubmittedEl = document.getElementById('stats-submitted');
      if (statsSubmittedEl) statsSubmittedEl.textContent = submissionsCount;
      
      if (querySnapshot.empty) {
        console.log('📭 No submissions found');
        const noAppsEl = document.getElementById('no-submitted-apps');
        if (noAppsEl) {
          noAppsEl.style.display = 'block';
        }
        submissionsGrid.innerHTML = '';
        return;
      }
      
      const noAppsEl = document.getElementById('no-submitted-apps');
      if (noAppsEl) {
        noAppsEl.style.display = 'none';
      }
      submissionsGrid.innerHTML = '';
      
      querySnapshot.forEach((doc) => {
        const app = { id: doc.id, ...doc.data() };
        console.log('📱 Found submitted app:', app.title, 'Status:', app.status);
        const appCard = createSubmittedAppCard(app);
        submissionsGrid.insertAdjacentHTML('beforeend', appCard);
      });
      
    } catch (error) {
      console.error('❌ Error loading submissions:', error);
      submissionsGrid.innerHTML = '<div class="empty-state">Error loading submissions. Please refresh the page.</div>';
    }
  }

  // Create app card HTML for favorites - using home page card design
  function createAppCard(app, isFavorite = false) {
    const rating = app.rating_avg || app.rating || 0;
    const category = app.category || 'App';
    const title = app.title || 'Untitled App';
    const description = app.description || 'No description available';
    const appId = app.id || app.firestoreId || 'demo';
    const usersCount = app.usersCount || 0;
    
    // Generate stars based on rating
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    
    // Get appropriate icon based on niche
    let appIcon = '📱';
    if (app.niche === 'web') appIcon = '🌐';
    else if (app.niche === 'mobile') appIcon = '📱';
    else if (app.niche === 'whatsapp') appIcon = '💬';
    
    return `
      <article class="card card-v2" data-app-id="${appId}" data-niche="${app.niche || 'web'}">
        <div class="card-header-v2">
          <div class="app-icon-v2">${appIcon}</div>
          <div class="header-info">
            <span class="category-tag">${category}</span>
            <div class="rating-v2">
              <span class="stars">${stars}</span>
              <span class="rating-number">${rating.toFixed ? rating.toFixed(1) : rating}</span>
            </div>
            <div class="users-count">${usersCount} users</div>
          </div>
        </div>
        
        <div class="card-body-v2">
          <h3 class="app-title-v2">${title}</h3>
          <p class="app-description-v2">${description}</p>
        </div>
        
        <div class="card-footer-v2">
          <button class="action-btn-v2 heart-btn favorited" data-app-id="${appId}" onclick="removeFromFavorites('${appId}')" title="Remove from favorites">
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
          <button class="action-btn-v2 more-btn" data-app-id="${appId}" onclick="window.location.href='/pages/app?id=${appId}'" title="View details">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  // Create submitted app card HTML with proper status display - using home page card design
  function createSubmittedAppCard(app) {
    const rating = app.rating_avg || app.rating || 0;
    const category = app.category || 'App';
    const title = app.title || 'Untitled App';
    const description = app.description || 'No description available';
    const appId = app.id || app.firestoreId || 'demo';
    const usersCount = app.usersCount || 0;
    
    // Generate stars based on rating
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    
    // Get appropriate icon based on niche
    let appIcon = '📱';
    if (app.niche === 'web') appIcon = '🌐';
    else if (app.niche === 'mobile') appIcon = '📱';
    else if (app.niche === 'whatsapp') appIcon = '💬';
    
    // Map status to proper labels and access control
    let statusLabel = 'Pending';
    let statusClass = 'pending';
    let allowAccess = false;
    
    if (app.status === 'approved') {
      statusLabel = 'Submitted';
      statusClass = 'approved';
      allowAccess = true;
    } else if (app.status === 'rejected') {
      statusLabel = 'Rejected';
      statusClass = 'rejected';
      allowAccess = false;
    } else if (app.status === 'pending') {
      statusLabel = 'Pending';
      statusClass = 'pending';
      allowAccess = false;
    }
    
    const statusBadge = `<span class="app-status ${statusClass}">${statusLabel}</span>`;
    
    // Only show View button for approved apps (status = 'approved')
    const viewButton = allowAccess 
      ? `<button class="action-btn-v2 more-btn" data-app-id="${appId}" onclick="window.location.href='/pages/app?id=${appId}'" title="View details">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
             <circle cx="12" cy="12" r="3"></circle>
           </svg>
         </button>`
      : `<button class="action-btn-v2" disabled title="Not Available" style="opacity: 0.5; cursor: not-allowed;">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="10"></circle>
             <line x1="15" y1="9" x2="9" y2="15"></line>
             <line x1="9" y1="9" x2="15" y2="15"></line>
           </svg>
         </button>`;
    
    return `
      <article class="card card-v2" data-app-id="${appId}" data-niche="${app.niche || 'web'}">
        <div class="card-header-v2">
          <div class="app-icon-v2">${appIcon}</div>
          <div class="header-info">
            <div class="status-and-action-top">
              <div class="status-badge-container">
                ${statusBadge}
              </div>
              <div class="action-buttons">
                ${viewButton}
              </div>
            </div>
            <span class="category-tag">${category}</span>
            <div class="rating-v2">
              <span class="stars">${stars}</span>
              <span class="rating-number">${rating.toFixed ? rating.toFixed(1) : rating}</span>
            </div>
            <div class="users-count">${usersCount} users</div>
          </div>
        </div>
        
        <div class="card-body-v2">
          <h3 class="app-title-v2">${title}</h3>
          <p class="app-description-v2">${description}</p>
        </div>
      </article>
    `;
  }

  // List functions are now handled by lists.js module

  // Add to favorites function (using FavoritesManager)
  window.addToFavorites = async (appId) => {
    try {
      if (window.favoritesManager && window.favoritesManager.initialized) {
        await window.favoritesManager.addToFavorites(appId);
        // Reload favorites
        await loadFavorites();
        await updateUserStats();
      } else {
        alert('Favorites system not initialized. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Error adding to favorites. Please try again.');
    }
  };

  // Remove from favorites function (using FavoritesManager)
  window.removeFromFavorites = async (appId) => {
    try {
      if (window.favoritesManager && window.favoritesManager.initialized) {
        await window.favoritesManager.removeFromFavorites(appId);
        // Reload favorites
        await loadFavorites();
        await updateUserStats();
      } else {
        alert('Favorites system not initialized. Please refresh the page.');
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Error removing from favorites. Please try again.');
    }
  };

  // Listen for lists updates
  window.addEventListener('listsUpdated', () => {
    loadLists();
    updateUserStats();
  });
  
  // Listen for lists loaded event to update stats
  window.addEventListener('listsLoaded', (event) => {
    const lists = event.detail.lists;
    const statsListsEl = document.getElementById('stats-lists');
    if (statsListsEl) {
      statsListsEl.textContent = lists.length;
    }
  });

  // Listen for favorites updates
  window.addEventListener('favoritesUpdated', () => {
    loadFavorites();
    updateUserStats();
  });

  // Add event listener for create list button (handled by lists.js)
  // This functionality is now handled by VibeStoreLists.initializeListEventListeners()

  // Load favorite apps when user is authenticated
  authMod.onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      updateProfile(user);
      await loadFavorites();
      await loadLists();
      await loadSubmissions();
      await updateUserStats();
    } else {
      window.location.href = '/pages/auth';
    }
  });

} catch (error) {
  console.log('Firebase not ready, redirecting to auth');
  window.location.href = '/pages/auth';
}
</script>
