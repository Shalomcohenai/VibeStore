/**
 * VibeStore - Constants
 * Centralized constants for the application
 */

const APP_LIMITS = {
  FEATURED: 6,
  POPULAR: 6,
  EDITORS_CHOICE: 6,
  SEARCH_RESULTS: 50,
  FETCH_BUFFER: 20, // How many to fetch before client-side filtering
  MAX_SEARCH_RESULTS: 1000
};

const RATING = {
  MIN: 1,
  MAX: 5,
  DEFAULT: 0,
  STARS_COUNT: 5
};

const TIME_WINDOWS = {
  VERIFIED_INTERACTION_DAYS: 30,
  CACHE_TTL_MS: 5 * 60 * 1000, // 5 minutes
  FIREBASE_TIMEOUT_MS: 5000,
  ERROR_MESSAGE_DISPLAY_MS: 5000,
  FIREBASE_CHECK_INTERVAL_MS: 100
};

const VALIDATION = {
  REVIEW_TEXT_MIN: 10,
  REVIEW_TEXT_MAX: 500,
  COMMENT_TEXT_MIN: 1,
  COMMENT_TEXT_MAX: 1000,
  REPORT_MESSAGE_MIN: 1,
  REPORT_MESSAGE_MAX: 1000,
  TITLE_MIN: 1,
  TITLE_MAX: 200,
  DESCRIPTION_MIN: 10,
  DESCRIPTION_MAX: 2000
};

const RATE_LIMITS = {
  REVIEWS_PER_HOUR: 10,
  COMMENTS_PER_HOUR: 20,
  SUBMISSIONS_PER_DAY: 5
};

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.APP_LIMITS = APP_LIMITS;
  window.RATING = RATING;
  window.TIME_WINDOWS = TIME_WINDOWS;
  window.VALIDATION = VALIDATION;
  window.RATE_LIMITS = RATE_LIMITS;
}

