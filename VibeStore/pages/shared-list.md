---
title: Shared App List
layout: page
permalink: /pages/shared-list
---

<div class="shared-list-page">
  <div class="shared-list-header">
    <h1 id="shared-list-title">Loading...</h1>
    <p id="shared-list-description" class="shared-list-desc"></p>
    <p id="shared-list-creator" class="shared-list-creator"></p>
  </div>

  <div class="shared-list-content">
    <div class="shared-list-apps" id="shared-list-apps">
      <div class="loading-state">Loading apps...</div>
    </div>
  </div>
</div>

<style>
.shared-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.shared-list-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.shared-list-header h1 {
  margin: 0 0 1rem;
  color: var(--c-text);
  font-size: 2.5rem;
  font-weight: 700;
}

.shared-list-desc {
  margin: 0 0 1rem;
  color: var(--c-muted);
  font-size: 1.1rem;
  line-height: 1.6;
}

.shared-list-creator {
  margin: 0;
  color: var(--c-muted);
  font-size: 0.9rem;
  font-weight: 500;
}

.shared-list-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.shared-list-apps {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.shared-app-card {
  background: white;
  border: 2px solid var(--c-line);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.shared-app-card:hover {
  border-color: var(--c-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(107,70,193,.15);
}

.shared-app-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(107,70,193,.3);
}

.shared-app-content {
  flex: 1;
  min-width: 0;
}

.shared-app-title {
  margin: 0 0 0.5rem;
  color: var(--c-text);
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.3;
}

.shared-app-desc {
  margin: 0 0 1rem;
  color: var(--c-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.shared-app-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.shared-app-category, .shared-app-platform {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
  background: var(--c-bg);
  color: var(--c-muted);
  border-radius: 20px;
  font-weight: 500;
}

.shared-app-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view-shared {
  padding: 0.6rem 1.2rem;
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-view-shared:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--c-muted);
}

.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--c-muted);
}

.error-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #ef4444;
}

@media (max-width: 768px) {
  .shared-list-header h1 {
    font-size: 2rem;
  }
  
  .shared-list-apps {
    grid-template-columns: 1fr;
  }
  
  .shared-app-card {
    flex-direction: column;
    text-align: center;
  }
  
  .shared-app-icon {
    align-self: center;
  }
}
</style>

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
  const { db, storeMod } = await waitForFirebase();
  const { doc, getDoc, collection, query, where, getDocs } = storeMod;

  // Get list ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const listId = urlParams.get('id');

  if (!listId) {
    document.getElementById('shared-list-apps').innerHTML = 
      '<div class="error-state">List not found</div>';
    throw new Error('No list ID provided');
  }

  // Find the list by searching through all users
  async function findSharedList(listId) {
    try {
      // Get all users
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      
      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const lists = userData.lists || [];
        
        const list = lists.find(l => l.id === listId);
        if (list) {
          return { list, userData };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error finding shared list:', error);
      return null;
    }
  }

  // Load shared list
  async function loadSharedList() {
    try {
      const result = await findSharedList(listId);
      
      if (!result) {
        document.getElementById('shared-list-apps').innerHTML = 
          '<div class="error-state">List not found or has been deleted</div>';
        return;
      }

      const { list, userData } = result;
      
      // Update header
      document.getElementById('shared-list-title').textContent = list.name;
      document.getElementById('shared-list-description').textContent = 
        list.description || 'No description available';
      document.getElementById('shared-list-creator').textContent = 
        `Created by ${userData.displayName || userData.email?.split('@')[0] || 'Unknown'}`;

      // Load apps
      const apps = [];
      for (const appId of list.apps || []) {
        try {
          const appDoc = await getDoc(doc(db, 'apps', appId));
          if (appDoc.exists()) {
            apps.push({ id: appDoc.id, ...appDoc.data() });
          }
        } catch (error) {
          console.error('Error loading app:', error);
        }
      }

      // Render apps
      const appsContainer = document.getElementById('shared-list-apps');
      
      if (apps.length === 0) {
        appsContainer.innerHTML = '<div class="empty-state">No apps in this list</div>';
        return;
      }

      appsContainer.innerHTML = '';
      
      apps.forEach(app => {
        // Get appropriate icon based on niche
        let appIcon = '📱';
        if (app.niche === 'web') appIcon = '🌐';
        else if (app.niche === 'mobile') appIcon = '📱';
        else if (app.niche === 'whatsapp') appIcon = '💬';

        const appCard = `
          <div class="shared-app-card">
            <div class="shared-app-icon">
              ${appIcon}
            </div>
            <div class="shared-app-content">
              <h3 class="shared-app-title">${app.title || 'Untitled App'}</h3>
              <p class="shared-app-desc">${app.description || 'No description available'}</p>
              <div class="shared-app-meta">
                <span class="shared-app-category">${app.category || 'App'}</span>
                <span class="shared-app-platform">${app.platform || 'Platform'}</span>
              </div>
              <div class="shared-app-actions">
                <a href="/pages/app?id=${app.id}" class="btn-view-shared">View App</a>
              </div>
            </div>
          </div>
        `;
        
        appsContainer.insertAdjacentHTML('beforeend', appCard);
      });

    } catch (error) {
      console.error('Error loading shared list:', error);
      document.getElementById('shared-list-apps').innerHTML = 
        '<div class="error-state">Error loading list. Please try again.</div>';
    }
  }

  // Load the shared list
  loadSharedList();

} catch (error) {
  console.log('Firebase not ready or error:', error);
  document.getElementById('shared-list-apps').innerHTML = 
    '<div class="error-state">Unable to load list. Please try again later.</div>';
}
</script>
