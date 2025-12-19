/**
 * VibeStore - List UI Management
 * This module handles the user interface for lists functionality
 * Integrates with ListsManager for data operations
 */

/**
 * ListUI class for managing list user interface
 */
class ListUI {
  constructor(listsManager) {
    this.listsManager = listsManager;
    this.currentAppId = null;
  }

  /**
   * Render lists container in profile page
   */
  async renderListsContainer() {
    const container = document.getElementById('lists-container');
    if (!container) return;

    const lists = this.listsManager.getLists();

    if (lists.length === 0) {
      const noListsEl = document.getElementById('no-lists');
      if (noListsEl) {
        noListsEl.style.display = 'block';
      }
      container.innerHTML = '';
      return;
    }

    const noListsEl = document.getElementById('no-lists');
    if (noListsEl) {
      noListsEl.style.display = 'none';
    }

    container.innerHTML = '';
    lists.forEach(list => {
      const listCard = this.createListCard(list);
      container.insertAdjacentHTML('beforeend', listCard);
    });
  }

  /**
   * Create list card HTML
   */
  createListCard(list) {
    return `
      <article class="list-card" data-list-id="${list.id}">
        <div class="list-header" onclick="window.openList('${list.id}')" style="cursor: pointer;">
          <div class="list-icon">📋</div>
          <div class="list-info">
            <h3 class="list-title">${list.name}</h3>
            <p class="list-description">${list.description || 'No description'}</p>
            <div class="list-meta">
              <span class="app-count">${list.appCount} apps</span>
              <div class="privacy-toggle">
                <label class="toggle-label">
                  <input type="checkbox" ${list.isPublic ? 'checked' : ''} data-list-id="${list.id}" class="privacy-checkbox">
                  <span class="toggle-slider"></span>
                  <span class="toggle-text">${list.isPublic ? 'Public' : 'Private'}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="list-actions">
          <button class="action-btn edit-btn" data-list-id="${list.id}" title="Edit list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn share-btn" data-list-id="${list.id}" title="Share list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16,6 12,2 8,6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
          <button class="action-btn delete-btn" data-list-id="${list.id}" title="Delete list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            </svg>
          </button>
        </div>
      </article>
    `;
  }

  /**
   * Show add to list modal
   */
  showAddToListModal(appId) {
    this.currentAppId = appId;
    const lists = this.listsManager.getLists();

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add to List</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="lists-selection">
            ${lists.length === 0 ?
              '<p style="text-align: center; color: var(--c-muted); margin: 2rem 0;">No lists yet. Create your first list in your profile.</p>' :
              lists.map(list => `
                <label class="list-option">
                  <input type="radio" name="selectedList" value="${list.id}">
                  <div class="list-option-content">
                    <span class="list-name">${list.name}</span>
                    <span class="list-count">${list.appCount} apps</span>
                  </div>
                </label>
              `).join('')
            }
          </div>
          <div style="text-align: center; margin-top: 1rem;">
            <button class="btn-create-new" id="create-new-list-in-modal" style="display: inline-block; padding: 0.5rem 1rem; background: var(--c-primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">Create New List</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel">Cancel</button>
          <button class="btn-confirm" id="confirm-add-to-list" ${lists.length === 0 ? 'disabled' : ''}>Add to List</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.btn-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Create new list button - opens create list modal
    const createNewListBtn = modal.querySelector('#create-new-list-in-modal');
    if (createNewListBtn) {
      createNewListBtn.addEventListener('click', () => {
        // Close the add-to-list modal
        document.body.removeChild(modal);
        // Open create list modal
        this.showCreateListModal(appId); // Pass appId so we can add it after creation
      });
    }

    modal.querySelector('#confirm-add-to-list').addEventListener('click', async () => {
      const selectedList = modal.querySelector('input[name="selectedList"]:checked');
      if (selectedList) {
        try {
          await this.listsManager.addAppToList(selectedList.value, appId);
          this.updateAddToListButton(appId);
          document.body.removeChild(modal);
        } catch (error) {
          console.error('Error adding app to list:', error);
          alert('Error adding app to list. Please try again.');
        }
      }
    });
  }

  /**
   * Update add to list button state
   */
  updateAddToListButton(appId) {
    const addToListButton = document.getElementById('add-to-list-btn');
    if (!addToListButton || !this.listsManager || !this.listsManager.initialized) return;

    const listIds = this.listsManager.isAppInLists(appId);
    const spanElement = addToListButton.querySelector('span');
    const textElement = spanElement || addToListButton;

    if (listIds.length > 0) {
      addToListButton.classList.add('added');
      textElement.textContent = 'Added to List';
    } else {
      addToListButton.classList.remove('added');
      textElement.textContent = 'Add to List';
    }
  }

  /**
   * Show create list modal
   * @param {string} appId - Optional app ID to add to the new list after creation
   */
  showCreateListModal(appId = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Create New List</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="list-name" class="form-label">List Name *</label>
            <input type="text" id="list-name" class="form-input" placeholder="Enter list name" maxlength="60" required>
          </div>
          <div class="form-group">
            <label for="list-description" class="form-label">Description</label>
            <textarea id="list-description" class="form-input form-textarea" placeholder="Describe your list (optional)" maxlength="300" style="font-family: inherit; font-size: 1rem;"></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel">Cancel</button>
          <button class="btn-confirm" id="create-list-confirm">Create List</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.btn-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('#create-list-confirm').addEventListener('click', async () => {
      const name = modal.querySelector('#list-name').value.trim();
      const description = modal.querySelector('#list-description').value.trim();

      if (!name) {
        alert('Please enter a list name');
        return;
      }

      try {
        const listId = await this.listsManager.createList(name, description, false); // Default to private
        
        // If appId was provided, add the app to the newly created list
        if (appId && listId) {
          try {
            await this.listsManager.addAppToList(listId, appId);
            this.updateAddToListButton(appId);
            alert(`✅ List "${name}" created and app added successfully!`);
          } catch (error) {
            console.error('Error adding app to new list:', error);
            alert(`✅ List "${name}" created, but failed to add app. You can add it manually.`);
          }
        } else {
          // Update lists container if we're on profile page
          await this.renderListsContainer();
        }
        
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error creating list:', error);
        alert('Error creating list. Please try again.');
      }
    });
  }

  /**
   * Show edit list modal
   */
  showEditListModal(listId) {
    const list = this.listsManager.getList(listId);
    if (!list) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Edit List</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="edit-list-name" class="form-label">List Name *</label>
            <input type="text" id="edit-list-name" class="form-input" value="${list.name}" maxlength="60" required>
          </div>
          <div class="form-group">
            <label for="edit-list-description" class="form-label">Description</label>
            <textarea id="edit-list-description" class="form-input form-textarea" maxlength="300">${list.description || ''}</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel">Cancel</button>
          <button class="btn-confirm" id="edit-list-confirm">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('.btn-cancel').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    modal.querySelector('#edit-list-confirm').addEventListener('click', async () => {
      const name = modal.querySelector('#edit-list-name').value.trim();
      const description = modal.querySelector('#edit-list-description').value.trim();

      if (!name) {
        alert('Please enter a list name');
        return;
      }

      try {
        await this.listsManager.updateList(listId, {
          name,
          description
        });
        await this.renderListsContainer();
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error updating list:', error);
        alert('Error updating list. Please try again.');
      }
    });
  }

  /**
   * Share list
   */
  shareList(listId) {
    const list = this.listsManager.getList(listId);
    if (!list) return;

    const shareUrl = `${window.location.origin}/pages/shared-list?token=${list.shareToken}`;

    if (navigator.share) {
      navigator.share({
        title: list.name,
        text: list.description || 'Check out this app list',
        url: shareUrl
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Share link copied to clipboard!');
      }).catch(() => {
        // Fallback: show URL in prompt
        prompt('Share this link:', shareUrl);
      });
    }
  }

  /**
   * Delete list
   */
  async deleteList(listId) {
    const list = this.listsManager.getList(listId);
    if (!list) return;

    if (confirm(`Are you sure you want to delete "${list.name}"? This action cannot be undone.`)) {
      try {
        await this.listsManager.deleteList(listId);
        await this.renderListsContainer();
      } catch (error) {
        console.error('Error deleting list:', error);
        alert('Error deleting list. Please try again.');
      }
    }
  }

  /**
   * Toggle list privacy
   */
  async toggleListPrivacy(listId, isPublic) {
    try {
      await this.listsManager.updateList(listId, { isPublic });

      // Update the toggle text
      const toggle = document.querySelector(`input[data-list-id="${listId}"]`);
      if (toggle) {
        const toggleText = toggle.parentElement.querySelector('.toggle-text');
        if (toggleText) {
          toggleText.textContent = isPublic ? 'Public' : 'Private';
        }
      }
    } catch (error) {
      console.error('Error toggling list privacy:', error);
      alert('Error updating list privacy. Please try again.');

      // Revert the toggle
      const toggle = document.querySelector(`input[data-list-id="${listId}"]`);
      if (toggle) {
        toggle.checked = !isPublic;
      }
    }
  }

  /**
   * Show list detail modal
   */
  async showListDetailModal(list) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    // Get apps for this list
    const apps = await this.listsManager.getAppsInList(list.id);

    modal.innerHTML = `
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>${list.name}</h3>
          <div class="modal-header-actions">
            ${list.shareToken ?
              `<button class="btn-share-list" onclick="navigator.clipboard.writeText('${window.location.origin}/pages/shared-list?token=${list.shareToken}'); alert('Share link copied to clipboard!');">📤 Share</button>` :
              `<button class="btn-share-list" onclick="alert('Make this list public first to share it.');" style="opacity: 0.6; cursor: not-allowed;">📤 Share</button>`
            }
            <button class="modal-close">&times;</button>
          </div>
        </div>
        <div class="modal-body">
          ${list.description ? `<p style="color: var(--c-muted); margin-bottom: 1.5rem;">${list.description}</p>` : ''}

          <div class="list-apps-grid-new">
            ${apps.length === 0 ?
              '<div style="text-align: center; padding: 2rem; color: var(--c-muted);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 48px; height: 48px; margin: 0 auto 1rem; color: var(--c-muted);"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg><h4>No apps in this list</h4><p>Add some apps to get started!</p></div>' :
              apps.map(app => `
                <div class="list-app-card-new" onclick="window.location.href='/pages/app?id=${app.appId}'">
                  <div class="list-app-card-icon-new">${app.appIcon || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 100%; height: 100%;"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>'}</div>
                  <div class="list-app-card-content-new">
                    <h4 class="list-app-card-title-new">${app.appTitle}</h4>
                    <p class="list-app-card-desc-new">${app.appDescription || 'Click to view app details'}</p>
                    <div class="list-app-card-meta">
                      <span class="app-category">${app.appCategory || 'App'}</span>
                      <span class="app-platform">${app.appPlatform || 'Web'}</span>
                    </div>
                  </div>
                  <div class="list-app-card-actions-new">
                    <a href="/pages/app?id=${app.appId}" class="btn-view-app-new">View</a>
                    <button class="remove-from-list-btn-new" onclick="event.stopPropagation(); removeAppFromList('${list.id}', '${app.appId}')" title="Remove from list">×</button>
                  </div>
                </div>
              `).join('')
            }
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
          <button class="btn-primary" onclick="window.location.href='/pages/profile'">Manage Lists</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', () => {
      document.body.removeChild(modal);
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    // Global function to remove app from list
    window.removeAppFromList = async (listId, appId) => {
      try {
        await this.listsManager.removeAppFromList(listId, appId);
        // Update the list object
        const updatedList = this.listsManager.getList(listId);
        if (updatedList) {
          // Refresh the modal
          document.body.removeChild(modal);
          this.showListDetailModal(updatedList);
        }
      } catch (error) {
        console.error('Error removing app from list:', error);
        alert('Error removing app from list. Please try again.');
      }
    };
  }

  /**
   * Setup event listeners for list actions
   */
  setupEventListeners() {
    // Create list button
    const createListBtn = document.getElementById('create-list-btn');
    if (createListBtn) {
      createListBtn.addEventListener('click', () => {
        this.showCreateListModal();
      });
    }

    // Delegate events for list actions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.edit-btn')) {
        const listId = e.target.closest('.edit-btn').dataset.listId;
        this.showEditListModal(listId);
      } else if (e.target.closest('.share-btn')) {
        const listId = e.target.closest('.share-btn').dataset.listId;
        this.shareList(listId);
      } else if (e.target.closest('.delete-btn')) {
        const listId = e.target.closest('.delete-btn').dataset.listId;
        this.deleteList(listId);
      }
    });

    // Handle privacy toggle
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('privacy-checkbox')) {
        const listId = e.target.dataset.listId;
        const isPublic = e.target.checked;
        this.toggleListPrivacy(listId, isPublic);
      }
    });

    // Global function to open a list
    window.openList = (listId) => {
      const list = this.listsManager.getList(listId);
      if (list) {
        // If list is public and has share token, open in shared-list page
        // Otherwise, show in modal (for private lists or if user wants to see it directly)
        if (list.isPublic && list.shareToken) {
          // Open in same window for better UX (user can go back)
          window.location.href = `/pages/shared-list?token=${list.shareToken}`;
        } else {
          // Show the list in a modal for private lists
          this.showListDetailModal(list);
        }
      }
    };
  }
}

// Export for global usage
window.ListUI = ListUI;
