/**
 * VibeStore - App Renderer
 * Handles rendering apps to the page
 */

// Get IntersectionObserver from animations (we'll need to re-observe cards)
let ioInstance = null;

/**
 * Set IntersectionObserver instance for reveal animations
 * @param {IntersectionObserver} io - IntersectionObserver instance
 */
function setIntersectionObserver(io) {
  ioInstance = io;
}

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.setIntersectionObserver = setIntersectionObserver;
}

/**
 * Create app card fallback (if createCardHTML is not available)
 */
function createAppCardFallback(app) {
  return `<article class="app-card" data-app-id="${app.id || 'demo'}">${app.title || 'App'}</article>`;
}

/**
 * Render apps based on filter
 * @param {string} filter - Filter type: 'featured', 'popular', or 'editors-choice'
 */
async function renderApps(filter) {
  const marketplaceGrid = document.getElementById('marketplace-grid');
  if (!marketplaceGrid) return;

  // Show loading state
  marketplaceGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted);">Loading apps...</div>';

  try {
    let apps = [];

    // Fetch apps from Firestore based on filter
    if (window.VibeStoreFirestore) {
      try {
        if (filter === 'featured') {
          apps = await window.VibeStoreFirestore.fetchFeaturedApps();
        } else if (filter === 'popular') {
          apps = await window.VibeStoreFirestore.fetchPopularApps();
        } else if (filter === 'editors-choice') {
          apps = await window.VibeStoreFirestore.fetchEditorsChoice();
        }
      } catch (error) {
        console.error('Error fetching apps:', error);
        apps = [];
      }
    } else {
      apps = [];
    }

    // Clear loading and render apps
    marketplaceGrid.innerHTML = '';

    if (apps.length === 0) {
      // Show demo apps when no real apps are available
      const demoApps = [
        {
          id: 'demo-1',
          title: 'Work Attendance Reminder',
          description: 'Mini web app to remind employees to clock in/out on time.',
          niche: 'web',
          category: 'Productivity',
          rating: 4.7,
          usersCount: 32,
          imageUrl: null
        },
        {
          id: 'demo-2',
          title: 'Budget Buddy',
          description: 'Simple personal budget tracker for weekly expenses.',
          niche: 'mobile',
          category: 'Finance',
          rating: 4.5,
          usersCount: 48,
          imageUrl: null
        },
        {
          id: 'demo-3',
          title: 'Support Agent on WhatsApp',
          description: 'AI assistant that answers common support requests in WhatsApp.',
          niche: 'whatsapp',
          category: 'Support',
          rating: 4.2,
          usersCount: 21,
          imageUrl: null
        }
      ];

      apps = demoApps;
    }

    apps.forEach(app => {
      const cardHTML = window.createCardHTML ? window.createCardHTML(app) : createAppCardFallback(app);
      marketplaceGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // Re-observe new cards for reveal animation
    if (ioInstance) {
      const newCards = marketplaceGrid.querySelectorAll('.reveal');
      newCards.forEach(card => ioInstance.observe(card));
    }

    // Add click handlers for favorite functionality
    if (window.addCardClickHandlers) {
      window.addCardClickHandlers();
    }

    // Update favorite buttons if favorites manager is ready
    if (window.favoritesManager && window.favoritesManager.initialized) {
      if (window.updateFavoriteButtons) {
        // Only update buttons for newly created cards, not all buttons
        const newCards = marketplaceGrid.querySelectorAll('.app-card:not([data-initialized])');
        newCards.forEach(card => {
          card.setAttribute('data-initialized', 'true');
        });
        window.updateFavoriteButtons();
      }
    }

  } catch (error) {
    console.error('Error rendering apps:', error);
    marketplaceGrid.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted);">Error loading apps. Please try again.</div>';
  }
}

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.renderApps = renderApps;
}
