/**
 * VibeStore - Navigation
 * Handles mobile navigation toggle and header scroll effects
 */

const SCROLL_THRESHOLD = 50;

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  // Mobile nav toggle
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('.menu-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

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
