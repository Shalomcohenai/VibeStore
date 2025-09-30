/**
 * VibeStore - Lists Management System
 * Complete lists functionality with Firebase integration
 * 
 * Features:
 * - Create, edit, delete lists
 * - Add/remove apps from lists
 * - Real-time updates
 * - Beautiful UI modals
 * - Error handling and validation
 */

// Wait for Firebase to initialize (using existing function if available)
const waitForFirebaseLists = () => {
  return new Promise(resolve => {
    const check = () => {
      if (window.waitForFirebase) {
        resolve(window.waitForFirebase());
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

// Get current user
let currentUserLists = null;

// Initialize lists system
async function initializeLists() {
  console.log('🔄 Initializing lists system...');
  try {
    const { auth, authMod } = await waitForFirebaseLists();
    console.log('✅ Firebase auth ready for lists');
    
    authMod.onAuthStateChanged(auth, (user) => {
      console.log('👤 Auth state changed for lists:', user ? user.email : 'No user');
      currentUserLists = user;
      if (user) {
        console.log('📋 Loading user lists...');
        loadUserLists();
      }
    });
    
  } catch (error) {
    console.error('❌ Error initializing lists:', error);
  }
}

// Get user data from Firestore
async function getUserData(uid) {
  const { db, storeMod } = await waitForFirebaseLists();
  const { doc, getDoc, setDoc, serverTimestamp } = storeMod;
  
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      // Create user document if it doesn't exist
      const userData = {
        uid: uid,
        email: currentUserLists.email,
        displayName: currentUserLists.displayName || currentUserLists.email.split('@')[0],
        favorites: [],
        lists: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'users', uid), userData);
      return userData;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
}

// Update user data in Firestore
async function updateUserData(uid, data) {
  const { db, storeMod } = await waitForFirebaseLists();
  const { doc, updateDoc, serverTimestamp } = storeMod;
  
  try {
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    await updateDoc(doc(db, 'users', uid), updateData);
    return true;
  } catch (error) {
    console.error('Error updating user data:', error);
    return false;
  }
}

// Create a new list
async function createList(listName, description = '', color = '#10b981') {
  if (!currentUserLists) {
    alert('Please sign in to create lists');
    return false;
  }
  
  if (!listName || listName.trim() === '') {
    alert('Please enter a list name');
    return false;
  }
  
  try {
    const userData = await getUserData(currentUserLists.uid);
    const lists = userData?.lists || [];
    
    // Check if list name already exists
    const existingList = lists.find(list => 
      list.name.toLowerCase() === listName.toLowerCase()
    );
    
    if (existingList) {
      alert('A list with this name already exists');
      return false;
    }
    
    const newList = {
      id: `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: listName.trim(),
      description: description.trim(),
      apps: [],
      color: color,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const updatedLists = [...lists, newList];
    await updateUserData(currentUserLists.uid, { lists: updatedLists });
    
    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('listsUpdated', { 
      detail: { action: 'created', list: newList } 
    }));
    
    console.log('✅ List created:', newList.name);
    return newList;
  } catch (error) {
    console.error('Error creating list:', error);
    alert('Error creating list. Please try again.');
    return false;
  }
}

// Update an existing list
async function updateList(listId, updates) {
  if (!currentUserLists) return false;
  
  try {
    const userData = await getUserData(currentUserLists.uid);
    const lists = userData?.lists || [];
    
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) {
      alert('List not found');
      return false;
    }
    
    // Check for duplicate names (excluding current list)
    if (updates.name) {
      const existingList = lists.find(list => 
        list.id !== listId && 
        list.name.toLowerCase() === updates.name.toLowerCase()
      );
      
      if (existingList) {
        alert('A list with this name already exists');
        return false;
      }
    }
    
    lists[listIndex] = {
      ...lists[listIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    await updateUserData(currentUserLists.uid, { lists });
    
    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('listsUpdated', { 
      detail: { action: 'updated', list: lists[listIndex] } 
    }));
    
    console.log('✅ List updated:', lists[listIndex].name);
    return lists[listIndex];
  } catch (error) {
    console.error('Error updating list:', error);
    alert('Error updating list. Please try again.');
    return false;
  }
}

// Delete a list
async function deleteList(listId) {
  if (!currentUserLists) return false;
  
  if (!confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
    return false;
  }
  
  try {
    const userData = await getUserData(currentUserLists.uid);
    const lists = userData?.lists || [];
    
    const updatedLists = lists.filter(list => list.id !== listId);
    await updateUserData(currentUserLists.uid, { lists: updatedLists });
    
    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('listsUpdated', { 
      detail: { action: 'deleted', listId } 
    }));
    
    console.log('✅ List deleted');
    return true;
  } catch (error) {
    console.error('Error deleting list:', error);
    alert('Error deleting list. Please try again.');
    return false;
  }
}

// Add app to list
async function addAppToList(listId, appId) {
  if (!currentUserLists) return false;
  
  try {
    const userData = await getUserData(currentUserLists.uid);
    const lists = userData?.lists || [];
    
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) {
      alert('List not found');
      return false;
    }
    
    const list = lists[listIndex];
    
    // Check if app is already in the list
    if (list.apps.includes(appId)) {
      alert('This app is already in the list');
      return false;
    }
    
    list.apps.push(appId);
    list.updatedAt = new Date();
    
    await updateUserData(currentUserLists.uid, { lists });
    
    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('listsUpdated', { 
      detail: { action: 'appAdded', listId, appId } 
    }));
    
    console.log('✅ App added to list');
    return true;
  } catch (error) {
    console.error('Error adding app to list:', error);
    alert('Error adding app to list. Please try again.');
    return false;
  }
}

// Remove app from list
async function removeAppFromList(listId, appId) {
  if (!currentUserLists) return false;
  
  try {
    const userData = await getUserData(currentUserLists.uid);
    const lists = userData?.lists || [];
    
    const listIndex = lists.findIndex(list => list.id === listId);
    if (listIndex === -1) {
      alert('List not found');
      return false;
    }
    
    const list = lists[listIndex];
    list.apps = list.apps.filter(id => id !== appId);
    list.updatedAt = new Date();
    
    await updateUserData(currentUserLists.uid, { lists });
    
    // Trigger custom event to update UI
    window.dispatchEvent(new CustomEvent('listsUpdated', { 
      detail: { action: 'appRemoved', listId, appId } 
    }));
    
    console.log('✅ App removed from list');
    return true;
  } catch (error) {
    console.error('Error removing app from list:', error);
    alert('Error removing app from list. Please try again.');
    return false;
  }
}

// Get all user lists
async function getUserLists() {
  if (!currentUserLists) {
    console.log('❌ No current user for getUserLists');
    return [];
  }
  
  try {
    console.log('🔍 Getting user lists for:', currentUserLists.email);
    const userData = await getUserData(currentUserLists.uid);
    const lists = userData?.lists || [];
    console.log('📋 Retrieved lists from getUserData:', lists.length, lists);
    return lists;
  } catch (error) {
    console.error('❌ Error getting user lists:', error);
    return [];
  }
}

// Load and display user lists
async function loadUserLists() {
  console.log('📋 loadUserLists called for user:', currentUserLists?.email);
  if (!currentUserLists) {
    console.log('❌ No current user, skipping lists load');
    return;
  }
  
  try {
    console.log('🔍 Getting user lists from Firestore...');
    const lists = await getUserLists();
    console.log('📊 Retrieved lists:', lists.length, lists);
    
    // Trigger custom event with lists data
    window.dispatchEvent(new CustomEvent('listsLoaded', { detail: { lists } }));
    
    return lists;
  } catch (error) {
    console.error('❌ Error loading user lists:', error);
    return [];
  }
}

// Get apps in a specific list
async function getListApps(listId) {
  if (!currentUserLists) return [];
  
  try {
    const userData = await getUserData(currentUserLists.uid);
    const lists = userData?.lists || [];
    
    const list = lists.find(l => l.id === listId);
    if (!list) return [];
    
    // Fetch app details for each app in the list
    const { db, storeMod } = await waitForFirebaseLists();
    const { doc, getDoc } = storeMod;
    
    const apps = [];
    for (const appId of list.apps) {
      try {
        const appDoc = await getDoc(doc(db, 'apps', appId));
        if (appDoc.exists()) {
          apps.push({ id: appDoc.id, ...appDoc.data() });
        }
      } catch (error) {
        console.error('Error loading app:', error);
      }
    }
    
    return apps;
  } catch (error) {
    console.error('Error getting list apps:', error);
    return [];
  }
}

// Show list management modal
function showListModal(list = null) {
  const modal = document.createElement('div');
  modal.className = 'list-modal-overlay';
  modal.innerHTML = `
    <div class="list-modal">
      <div class="list-modal-header">
        <h3>${list ? 'Edit List' : 'Create New List'}</h3>
        <button class="list-modal-close">&times;</button>
      </div>
      <div class="list-modal-body">
        <form id="list-form">
          <div class="form-group">
            <label for="list-name">List Name</label>
            <input type="text" id="list-name" name="name" value="${list?.name || ''}" required>
          </div>
          <div class="form-group">
            <label for="list-description">Description (optional)</label>
            <textarea id="list-description" name="description" rows="3">${list?.description || ''}</textarea>
          </div>
          <div class="form-group">
            <label for="list-color">Color</label>
            <div class="color-picker">
              <input type="color" id="list-color" name="color" value="${list?.color || '#10b981'}">
              <div class="color-presets">
                <div class="color-preset" data-color="#10b981" style="background: #10b981;"></div>
                <div class="color-preset" data-color="#3b82f6" style="background: #3b82f6;"></div>
                <div class="color-preset" data-color="#8b5cf6" style="background: #8b5cf6;"></div>
                <div class="color-preset" data-color="#f59e0b" style="background: #f59e0b;"></div>
                <div class="color-preset" data-color="#ef4444" style="background: #ef4444;"></div>
                <div class="color-preset" data-color="#06b6d4" style="background: #06b6d4;"></div>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn secondary" id="cancel-list">Cancel</button>
            ${list ? '<button type="button" class="btn danger" id="delete-list">Delete List</button>' : ''}
            <button type="submit" class="btn primary">${list ? 'Update List' : 'Create List'}</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add styles
  addListModalStyles();
  
  // Event listeners
  modal.querySelector('.list-modal-close').addEventListener('click', () => {
    closeModal(modal);
  });
  
  modal.querySelector('#cancel-list').addEventListener('click', () => {
    closeModal(modal);
  });
  
  // Delete button
  if (list) {
    modal.querySelector('#delete-list').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
        await deleteList(list.id);
        closeModal(modal);
      }
    });
  }
  
  // Color presets
  modal.querySelectorAll('.color-preset').forEach(preset => {
    preset.addEventListener('click', () => {
      const color = preset.dataset.color;
      modal.querySelector('#list-color').value = color;
    });
  });
  
  modal.querySelector('#list-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name').trim();
    const description = formData.get('description').trim();
    const color = formData.get('color');
    
    if (list) {
      await updateList(list.id, { name, description, color });
    } else {
      await createList(name, description, color);
    }
    
    closeModal(modal);
  });
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

// Show list apps modal
async function showListAppsModal(listId) {
  const lists = await getUserLists();
  const list = lists.find(l => l.id === listId);
  if (!list) return;
  
  const apps = await getListApps(listId);
  
  const modal = document.createElement('div');
  modal.className = 'list-modal-overlay';
  modal.innerHTML = `
    <div class="list-modal list-apps-modal">
      <div class="list-modal-header">
        <h3>${list.name}</h3>
        <button class="list-modal-close">&times;</button>
      </div>
      <div class="list-modal-body">
        <p class="list-description">${list.description || 'No description'}</p>
        <div class="list-apps-grid" id="list-apps-grid">
          ${apps.length === 0 ? '<div class="empty-state">No apps in this list yet</div>' : ''}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add styles
  addListModalStyles();
  
  // Add apps to grid
  const appsGrid = modal.querySelector('#list-apps-grid');
  if (apps.length > 0) {
    apps.forEach(app => {
      const appCard = createListAppCard(app, listId);
      appsGrid.insertAdjacentHTML('beforeend', appCard);
    });
  }
  
  // Event listeners
  modal.querySelector('.list-modal-close').addEventListener('click', () => {
    closeModal(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

// Create app card for list view
function createListAppCard(app, listId) {
  return `
    <div class="list-app-card">
      <div class="list-app-card-header">
        <div class="list-app-card-icon">
          ${app.title ? app.title.substring(0, 2).toUpperCase() : 'AP'}
        </div>
        <div class="list-app-card-info">
          <h4 class="list-app-card-title">${app.title || 'Untitled App'}</h4>
          <p class="list-app-card-desc">${app.description || 'No description available'}</p>
        </div>
        <button class="remove-from-list-btn" data-app-id="${app.id}" data-list-id="${listId}" title="Remove from list">×</button>
      </div>
      <div class="list-app-card-actions">
        <a href="/pages/app?id=${app.id}" class="btn-view-app">View App</a>
      </div>
    </div>
  `;
}

// Show list selection modal for adding apps
async function showListSelectionModal(appTitle, appId) {
  if (!currentUserLists) {
    alert('Please sign in to add apps to lists');
    return;
  }
  
  const lists = await getUserLists();
  
  if (lists.length === 0) {
    if (confirm('You don\'t have any lists yet. Would you like to create one?')) {
      showListModal();
    }
    return;
  }
  
  const modal = document.createElement('div');
  modal.className = 'list-modal-overlay';
  modal.innerHTML = `
    <div class="list-modal">
      <div class="list-modal-header">
        <h3>Add to List</h3>
        <button class="list-modal-close">&times;</button>
      </div>
      <div class="list-modal-body">
        <p>Choose a list to add "${appTitle}" to:</p>
        <div class="list-selection-grid">
          ${lists.map(list => `
            <div class="list-selection-card" data-list-id="${list.id}" style="border-left: 4px solid ${list.color || '#10b981'}">
              <h4>${list.name}</h4>
              <p>${list.apps?.length || 0} apps</p>
              ${list.description ? `<small>${list.description}</small>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="form-actions">
          <button type="button" class="btn secondary" id="cancel-list-selection">Cancel</button>
          <button type="button" class="btn primary" id="create-new-list-from-app">Create New List</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add styles
  addListModalStyles();
  
  // Event listeners
  modal.querySelector('.list-modal-close').addEventListener('click', () => {
    closeModal(modal);
  });
  
  modal.querySelector('#cancel-list-selection').addEventListener('click', () => {
    closeModal(modal);
  });
  
  modal.querySelector('#create-new-list-from-app').addEventListener('click', () => {
    closeModal(modal);
    showListModal();
  });
  
  // List selection
  modal.addEventListener('click', async (e) => {
    const listCard = e.target.closest('.list-selection-card');
    if (listCard) {
      const listId = listCard.dataset.listId;
      const success = await addAppToList(listId, appId);
      
      if (success) {
        alert(`Added "${appTitle}" to the list!`);
      }
      
      closeModal(modal);
    }
  });
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

// Add modal styles
function addListModalStyles() {
  if (document.getElementById('list-modal-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'list-modal-styles';
  style.textContent = `
    .list-modal-overlay {
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

    .list-modal {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .list-apps-modal {
      max-width: 800px;
    }

    .list-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--c-line);
    }

    .list-modal-header h3 {
      margin: 0;
      color: var(--c-text);
      font-size: 1.25rem;
    }

    .list-modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--c-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .list-modal-close:hover {
      background: var(--c-line);
      color: var(--c-text);
    }

    .list-modal-body {
      padding: 1.5rem;
      flex: 1;
      overflow-y: auto;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--c-text);
      font-weight: 600;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--c-line);
      border-radius: 8px;
      font-size: 0.9rem;
      transition: border-color 0.2s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: var(--c-primary);
    }

    .color-picker {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .color-picker input[type="color"] {
      width: 50px;
      height: 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .color-presets {
      display: flex;
      gap: 0.5rem;
    }

    .color-preset {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.2s ease;
    }

    .color-preset:hover {
      border-color: var(--c-text);
      transform: scale(1.1);
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }

    .btn.danger {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn.danger:hover {
      background: #dc2626;
    }

    .list-description {
      color: var(--c-muted);
      margin-bottom: 1rem;
      font-style: italic;
    }

    .list-apps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .list-app-card {
      background: var(--c-bg);
      border: 2px solid var(--c-line);
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.3s ease;
    }

    .list-app-card:hover {
      border-color: var(--c-primary);
      transform: translateY(-2px);
    }

    .list-app-card-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .list-app-card-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: var(--c-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.9rem;
      flex-shrink: 0;
    }

    .list-app-card-info {
      flex: 1;
    }

    .list-app-card-title {
      font-weight: 600;
      color: var(--c-text);
      margin: 0 0 0.25rem;
      font-size: 0.95rem;
    }

    .list-app-card-desc {
      color: var(--c-muted);
      font-size: 0.85rem;
      margin: 0;
      line-height: 1.4;
    }

    .remove-from-list-btn {
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
      font-size: 1rem;
      line-height: 1;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .remove-from-list-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }

    .list-selection-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .list-selection-card {
      background: var(--c-bg);
      border: 2px solid var(--c-line);
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .list-selection-card:hover {
      border-color: var(--c-primary);
      transform: translateY(-2px);
    }

    .list-selection-card h4 {
      margin: 0 0 0.5rem;
      color: var(--c-text);
      font-size: 1rem;
    }

    .list-selection-card p {
      margin: 0 0 0.25rem;
      color: var(--c-muted);
      font-size: 0.85rem;
    }

    .list-selection-card small {
      color: var(--c-muted);
      font-size: 0.75rem;
      font-style: italic;
    }

    .btn.secondary {
      background: #f3f4f6;
      color: var(--c-text);
      border: 1px solid #e5e7eb;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn.secondary:hover {
      background: #e5e7eb;
    }

    .btn.primary {
      background: var(--c-primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn.primary:hover {
      background: var(--c-accent);
    }
  `;
  document.head.appendChild(style);
}

// Close modal helper
function closeModal(modal) {
  document.body.removeChild(modal);
  const styles = document.getElementById('list-modal-styles');
  if (styles) {
    document.head.removeChild(styles);
  }
}

// Initialize event listeners
function initializeListEventListeners() {
  // Create list button (for profile page)
  document.addEventListener('click', (e) => {
    if (e.target.id === 'create-list-btn') {
      e.preventDefault();
      showListModal();
    }
  });
  
  // Listen for profile page requests to load lists
  window.addEventListener('loadProfileLists', async () => {
    console.log('📋 Profile page requested lists loading');
    await loadListsForProfile();
  });
  
  // Plus button - add to list (for app cards)
  document.addEventListener('click', async (e) => {
    if (e.target.closest('.plus-btn')) {
      e.preventDefault();
      e.stopPropagation();
      
      const btn = e.target.closest('.plus-btn');
      const appId = btn.dataset.appId;
      
      if (!currentUserLists) {
        alert('Please sign in to add apps to lists');
        return;
      }
      
      if (appId) {
        console.log('Adding to list:', appId);
        await showListSelectionModal('', appId);
        
        // Add visual feedback
        btn.style.transform = 'scale(1.1)';
        btn.style.background = 'var(--c-primary)';
        btn.style.color = 'white';
        setTimeout(() => {
          btn.style.transform = 'scale(1)';
          btn.style.background = 'white';
          btn.style.color = 'var(--c-text)';
        }, 300);
      }
    }
  });
  
  // List card clicks
  document.addEventListener('click', (e) => {
    const listCard = e.target.closest('.list-card');
    if (listCard) {
      const listId = listCard.dataset.listId;
      if (listId) {
        showListAppsModal(listId);
      }
    }
  });
  
  // List menu button
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('list-card-menu')) {
      e.preventDefault();
      e.stopPropagation();
      
      const listId = e.target.dataset.listId;
      getUserLists().then(userLists => {
        const list = userLists.find(l => l.id === listId);
        if (list) {
          showListModal(list);
        }
      });
    }
  });
  
  // Remove app from list
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-from-list-btn')) {
      e.preventDefault();
      e.stopPropagation();
      
      const appId = e.target.dataset.appId;
      const listId = e.target.dataset.listId;
      
      if (confirm('Remove this app from the list?')) {
        removeAppFromList(listId, appId);
      }
    }
  });
  
  // Listen for list updates
  window.addEventListener('listsUpdated', () => {
    loadUserLists();
  });
}

// Load lists for profile page
async function loadListsForProfile() {
  console.log('🔄 Loading lists for profile page...');
  
  if (!currentUserLists) {
    console.log('❌ No current user for profile lists');
    return;
  }
  
  const listsGrid = document.getElementById('lists-grid');
  if (!listsGrid) {
    console.log('❌ Lists grid element not found');
    return;
  }
  
  listsGrid.innerHTML = '<div class="loading-state">Loading your lists...</div>';
  
  try {
    console.log('🔍 Getting user lists from Firestore...');
    const lists = await getUserLists();
    console.log('📊 Retrieved lists:', lists.length, lists);
    
    if (lists.length === 0) {
      listsGrid.innerHTML = '<div class="empty-state">No lists yet. Create your first list!</div>';
      return;
    }
    
    listsGrid.innerHTML = '';
    
    lists.forEach(list => {
      const listCard = createListCard(list);
      listsGrid.insertAdjacentHTML('beforeend', listCard);
    });
    
    // Trigger event with lists data for profile page
    window.dispatchEvent(new CustomEvent('listsLoaded', { detail: { lists } }));
    
    console.log('✅ Lists loaded successfully for profile page');
    
  } catch (error) {
    console.error('❌ Error loading lists for profile page:', error);
    listsGrid.innerHTML = '<div class="empty-state">Error loading lists. Please refresh the page.</div>';
  }
}

// Create list card HTML for profile page
function createListCard(list) {
  const color = list.color || '#10b981';
  return `
    <div class="list-card" data-list-id="${list.id}" style="border-left: 4px solid ${color}">
      <div class="list-card-header">
        <h4 class="list-card-title">${list.name}</h4>
        <div class="list-card-actions">
          <button class="btn-share-list" onclick="shareList('${list.id}')" title="Share List">📤</button>
          <button class="list-card-menu" data-list-id="${list.id}">⋯</button>
        </div>
      </div>
      <p class="list-card-count">${list.apps?.length || 0} apps</p>
      ${list.description ? `<p class="list-card-description">${list.description}</p>` : ''}
      <div class="list-actions">
        <button class="btn-edit" onclick="editList('${list.id}')">Edit</button>
        <button class="btn-view" onclick="viewList('${list.id}')">View</button>
      </div>
    </div>
  `;
}

// Global functions for profile page
window.editList = async (listId) => {
  if (window.VibeStoreLists) {
    const lists = await window.VibeStoreLists.getUserLists();
    const list = lists.find(l => l.id === listId);
    if (list) {
      window.VibeStoreLists.showListModal(list);
    }
  }
};

window.viewList = async (listId) => {
  if (window.VibeStoreLists) {
    window.VibeStoreLists.showListAppsModal(listId);
  }
};

window.shareList = async (listId) => {
  if (window.VibeStoreLists) {
    const lists = await window.VibeStoreLists.getUserLists();
    const list = lists.find(l => l.id === listId);
    if (list) {
      const shareUrl = `${window.location.origin}/pages/profile?list=${listId}`;
      const shareText = `Check out my app list "${list.name}" on VibeStore!`;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: list.name,
            text: shareText,
            url: shareUrl
          });
        } catch (error) {
          console.log('Share cancelled or failed');
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
          alert('List link copied to clipboard!');
        } catch (error) {
          // Fallback: show share modal
          showShareModal(list, shareUrl);
        }
      }
    }
  }
};

// Show share modal for fallback
function showShareModal(list, shareUrl) {
  const modal = document.createElement('div');
  modal.className = 'list-modal-overlay';
  modal.innerHTML = `
    <div class="list-modal">
      <div class="list-modal-header">
        <h3>Share "${list.name}"</h3>
        <button class="list-modal-close">&times;</button>
      </div>
      <div class="list-modal-body">
        <p>Share this list with others:</p>
        <div class="share-url-container">
          <input type="text" value="${shareUrl}" readonly class="share-url-input">
          <button class="btn-copy-url" onclick="copyToClipboard('${shareUrl}')">Copy</button>
        </div>
        <div class="share-actions">
          <button type="button" class="btn secondary" onclick="closeModal(this.closest('.list-modal-overlay'))">Close</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add styles if not already added
  if (!document.getElementById('list-modal-styles')) {
    addListModalStyles();
  }
  
  // Event listeners
  modal.querySelector('.list-modal-close').addEventListener('click', () => {
    closeModal(modal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
}

// Copy to clipboard function
window.copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  } catch (error) {
    console.error('Failed to copy:', error);
    alert('Failed to copy link');
  }
};

// Export functions FIRST, before initialization
window.VibeStoreLists = {
  initializeLists,
  createList,
  updateList,
  deleteList,
  addAppToList,
  removeAppFromList,
  getUserLists,
  loadUserLists,
  getListApps,
  showListModal,
  showListAppsModal,
  showListSelectionModal,
  initializeListEventListeners,
  createListCard,
  loadListsForProfile,
  currentUserLists: () => currentUserLists
};

console.log('✅ VibeStore Lists system loaded');

// Auto-initialize when loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Lists.js DOMContentLoaded - Initializing lists system...');
    initializeLists();
    initializeListEventListeners();
  });
} else {
  // DOM is already ready, initialize immediately
  console.log('🚀 Lists.js DOM already ready - Initializing lists system...');
  setTimeout(() => {
    initializeLists();
    initializeListEventListeners();
  }, 100);
}