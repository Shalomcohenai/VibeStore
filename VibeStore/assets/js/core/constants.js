/**
 * VibeStore - Constants
 * Centralized constants for the application
 */

const APP_LIMITS = {
  FEATURED: 6,
  POPULAR: 6,
  SEARCH_RESULTS: 50
};

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.APP_LIMITS = APP_LIMITS;
}
