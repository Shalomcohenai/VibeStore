/**
 * VibeStore - Navigation
 * Handles mobile navigation toggle and header scroll effects
 */

const SCROLL_THRESHOLD = 50;

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  // Header scroll effects
  const header = document.querySelector('.site-header');
  if (header) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      // Add scrolled class for styling
      if (currentScrollY > SCROLL_THRESHOLD) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    });
  }
}

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.initNavigation = initNavigation;
}

