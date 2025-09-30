/**
 * VibeStore - Clean Lists Management System
 * Simplified and clean implementation
 */

class VibeStoreListsClean {
  constructor() {
    this.currentUser = null;
    this.userLists = [];
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      const { auth, authMod } = await this.waitForFirebase();
      
      authMod.onAuthStateChanged(auth, (user) => {
        this.currentUser = user;
        if (user) {
          this.loadUserLists();
        }
      });
      
      this.setupEventListeners();
      this.isInitialized = true;
      console.log('✅ Clean Lists system initialized');
    } catch (error) {
      console.error('❌ Error initializing clean lists:', error);
    }
  }

  async waitForFirebase() {
    return new Promise(resolve => {
      const check = () => {
        if (window.$fb && window.$fb.auth && window.$fb.db) {
          resolve(window.$fb);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  setupEventListeners() {
    // Create list button
    document.addEventListener('click', (e) => {
      if (e.target.id === 'create-list-btn') {
        e.preventDefault();
        this.showCreateListModal();
      }
    });

    // Plus button for adding to lists
    document.addEventListener('click', (e) => {
      if (e.target.closest('.plus-btn')) {
        e.preventDefault();
        e.stopPropagation();
        const btn = e.target.closest('.plus-btn');
        const appId = btn.dataset.appId;
        if (appId) {
          this.showAddToListModal(appId);
        }
      }
    });

    // List card actions
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-edit')) {
        const listId = e.target.closest('.list-card').dataset.listId;
        this.showEditListModal(listId);
      } else if (e.target.closest('.btn-view')) {
        const listId = e.target.closest('.list-card').dataset.listId;
        this.showListAppsModal(listId);
      }
    });
  }

  async loadUserLists() {
    if (!this.currentUser) return;

    try {
      const { db, storeMod } = await this.waitForFirebase();
      const { doc, getDoc } = storeMod;
      
      const userDoc = await getDoc(doc(db, 'users', this.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        this.userLists = userData.lists || [];
        this.renderLists();
      }
    } catch (error) {
      console.error('Error loading user lists:', error);
    }
  }

  renderLists() {
    const listsGrid = document.getElementById('lists-grid');
    if (!listsGrid) return;

    if (this.userLists.length === 0) {
      listsGrid.innerHTML = `
        <div class="empty-state">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📋</div>
          <h4>No lists created yet</h4>
          <p>Create your first app list to organize your favorite apps.</p>
        </div>
      `;
      return;
    }

    listsGrid.innerHTML = this.userLists.map(list => `
      <div class="list-card" data-list-id="${list.id}">
        <div class="list-card-header">
          <h4>${list.name}</h4>
          <div class="list-card-actions">
            <button class="btn-edit" title="Edit List">✏️</button>
            <button class="btn-view" title="View Apps">👁️</button>
          </div>
        </div>
        <div class="list-card-count">${list.apps?.length || 0} apps</div>
        <div class="list-card-description">${list.description || 'No description'}</div>
        <div class="list-actions">
          <button class="btn-edit">Edit</button>
          <button class="btn-view">View Apps</button>
        </div>
      </div>
    `).join('');
  }

  showCreateListModal() {
    this.showListModal();
  }

  showEditListModal(listId) {
    const list = this.userLists.find(l => l.id === listId);
    if (list) {
      this.showListModal(list);
    }
  }

  showListModal(list = null) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>${list ? 'Edit List' : 'Create New List'}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <form id="list-form">
            <div class="form-group">
              <label for="list-name">List Name</label>
              <input type="text" id="list-name" value="${list?.name || ''}" required>
            </div>
            <div class="form-group">
              <label for="list-description">Description</label>
              <textarea id="list-description" rows="3">${list?.description || ''}</textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" id="cancel-list">Cancel</button>
          ${list ? '<button class="btn-danger" id="delete-list">Delete</button>' : ''}
          <button class="btn-primary" id="save-list">${list ? 'Update' : 'Create'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupModalEvents(modal, list);
  }

  setupModalEvents(modal, list) {
    const closeModal = () => {
      modal.remove();
    };

    modal.querySelector('.modal-close').onclick = closeModal;
    modal.querySelector('#cancel-list').onclick = closeModal;
    
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    modal.querySelector('#save-list').onclick = async () => {
      const name = modal.querySelector('#list-name').value.trim();
      const description = modal.querySelector('#list-description').value.trim();
      
      if (!name) {
        alert('Please enter a list name');
        return;
      }

      if (list) {
        await this.updateList(list.id, name, description);
      } else {
        await this.createList(name, description);
      }
      
      closeModal();
    };

    if (list) {
      modal.querySelector('#delete-list').onclick = async () => {
        if (confirm('Are you sure you want to delete this list?')) {
          await this.deleteList(list.id);
          closeModal();
        }
      };
    }
  }

  async createList(name, description) {
    if (!this.currentUser) return;

    try {
      const { db, storeMod } = await this.waitForFirebase();
      const { doc, updateDoc, arrayUnion, serverTimestamp } = storeMod;
      
      const newList = {
        id: Date.now().toString(),
        name,
        description,
        apps: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        lists: arrayUnion(newList),
        updatedAt: serverTimestamp()
      });

      this.userLists.push(newList);
      this.renderLists();
      console.log('✅ List created successfully');
    } catch (error) {
      console.error('Error creating list:', error);
      alert('Error creating list. Please try again.');
    }
  }

  async updateList(listId, name, description) {
    if (!this.currentUser) return;

    try {
      const { db, storeMod } = await this.waitForFirebase();
      const { doc, updateDoc, serverTimestamp } = storeMod;
      
      const listIndex = this.userLists.findIndex(l => l.id === listId);
      if (listIndex === -1) return;

      this.userLists[listIndex] = {
        ...this.userLists[listIndex],
        name,
        description,
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        lists: this.userLists,
        updatedAt: serverTimestamp()
      });

      this.renderLists();
      console.log('✅ List updated successfully');
    } catch (error) {
      console.error('Error updating list:', error);
      alert('Error updating list. Please try again.');
    }
  }

  async deleteList(listId) {
    if (!this.currentUser) return;

    try {
      const { db, storeMod } = await this.waitForFirebase();
      const { doc, updateDoc, serverTimestamp } = storeMod;
      
      this.userLists = this.userLists.filter(l => l.id !== listId);

      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        lists: this.userLists,
        updatedAt: serverTimestamp()
      });

      this.renderLists();
      console.log('✅ List deleted successfully');
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Error deleting list. Please try again.');
    }
  }

  async showAddToListModal(appId) {
    if (!this.currentUser) {
      alert('Please sign in to add apps to lists');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>Add to List</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>Choose a list to add this app to:</p>
          <div class="list-selection">
            ${this.userLists.map(list => `
              <div class="list-selection-item" data-list-id="${list.id}">
                <div class="list-info">
                  <h4>${list.name}</h4>
                  <p>${list.apps?.length || 0} apps</p>
                </div>
                <button class="btn-add-to-list">Add</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupAddToListModalEvents(modal, appId);
  }

  setupAddToListModalEvents(modal, appId) {
    const closeModal = () => modal.remove();

    modal.querySelector('.modal-close').onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    modal.addEventListener('click', async (e) => {
      if (e.target.classList.contains('btn-add-to-list')) {
        const listId = e.target.closest('.list-selection-item').dataset.listId;
        await this.addAppToList(listId, appId);
        closeModal();
      }
    });
  }

  async addAppToList(listId, appId) {
    if (!this.currentUser) return;

    try {
      const { db, storeMod } = await this.waitForFirebase();
      const { doc, updateDoc, serverTimestamp } = storeMod;
      
      const listIndex = this.userLists.findIndex(l => l.id === listId);
      if (listIndex === -1) return;

      if (!this.userLists[listIndex].apps) {
        this.userLists[listIndex].apps = [];
      }

      if (this.userLists[listIndex].apps.includes(appId)) {
        alert('App is already in this list');
        return;
      }

      this.userLists[listIndex].apps.push(appId);
      this.userLists[listIndex].updatedAt = serverTimestamp();

      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        lists: this.userLists,
        updatedAt: serverTimestamp()
      });

      this.renderLists();
      console.log('✅ App added to list successfully');
    } catch (error) {
      console.error('Error adding app to list:', error);
      alert('Error adding app to list. Please try again.');
    }
  }

  async removeAppFromList(listId, appId) {
    if (!this.currentUser) return;

    try {
      const { db, storeMod } = await this.waitForFirebase();
      const { doc, updateDoc, serverTimestamp } = storeMod;
      
      const listIndex = this.userLists.findIndex(l => l.id === listId);
      if (listIndex === -1) return;

      this.userLists[listIndex].apps = this.userLists[listIndex].apps.filter(id => id !== appId);
      this.userLists[listIndex].updatedAt = serverTimestamp();

      await updateDoc(doc(db, 'users', this.currentUser.uid), {
        lists: this.userLists,
        updatedAt: serverTimestamp()
      });

      this.renderLists();
      console.log('✅ App removed from list successfully');
    } catch (error) {
      console.error('Error removing app from list:', error);
      alert('Error removing app from list. Please try again.');
    }
  }

  showListAppsModal(listId) {
    const list = this.userLists.find(l => l.id === listId);
    if (!list) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal modal-large">
        <div class="modal-header">
          <h3>${list.name}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <p>${list.description || 'No description'}</p>
          <div class="apps-in-list">
            ${list.apps?.length > 0 ? 
              '<div class="loading-state">Loading apps...</div>' : 
              '<div class="empty-state">No apps in this list yet</div>'
            }
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.setupListAppsModalEvents(modal, list);
    this.loadAppsInList(list, modal);
  }

  setupListAppsModalEvents(modal, list) {
    const closeModal = () => modal.remove();

    modal.querySelector('.modal-close').onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }

  async loadAppsInList(list, modal) {
    if (!list.apps || list.apps.length === 0) return;

    try {
      const { db, storeMod } = await this.waitForFirebase();
      const { doc, getDoc } = storeMod;
      
      const appsContainer = modal.querySelector('.apps-in-list');
      appsContainer.innerHTML = '';

      for (const appId of list.apps) {
        try {
          const appDoc = await getDoc(doc(db, 'apps', appId));
          if (appDoc.exists()) {
            const app = { id: appDoc.id, ...appDoc.data() };
            const appCard = this.createAppCard(app, list.id);
            appsContainer.insertAdjacentHTML('beforeend', appCard);
          }
        } catch (error) {
          console.error(`Error loading app ${appId}:`, error);
        }
      }
    } catch (error) {
      console.error('Error loading apps in list:', error);
    }
  }

  createAppCard(app, listId) {
    const rating = app.rating_avg || app.rating || 0;
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    
    let appIcon = '📱';
    if (app.niche === 'web') appIcon = '🌐';
    else if (app.niche === 'mobile') appIcon = '📱';
    else if (app.niche === 'whatsapp') appIcon = '💬';

    return `
      <div class="app-card-in-list">
        <div class="app-icon">${appIcon}</div>
        <div class="app-info">
          <h4>${app.title || 'Untitled App'}</h4>
          <p>${app.category || 'App'} • ${app.description?.substring(0, 60) || 'No description'}...</p>
          <div class="app-rating">${stars} ${rating.toFixed ? rating.toFixed(1) : rating}</div>
        </div>
        <div class="app-actions">
          <a href="/pages/app?id=${app.id}" class="btn-view">View</a>
          <button class="btn-remove" onclick="removeFromList('${app.id}', '${listId}')">Remove</button>
        </div>
      </div>
    `;
  }
}

// Global functions for backward compatibility
window.removeFromList = async (appId, listId) => {
  if (window.VibeStoreListsClean) {
    await window.VibeStoreListsClean.removeAppFromList(listId, appId);
  }
};

// Initialize the clean lists system
const cleanLists = new VibeStoreListsClean();
window.VibeStoreListsClean = cleanLists;

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    cleanLists.initialize();
  });
} else {
  cleanLists.initialize();
}

console.log('✅ Clean Lists system loaded');
