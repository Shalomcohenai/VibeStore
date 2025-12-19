/**
 * VibeStore - Error Handler
 * Centralized error handling and logging
 */

class ErrorHandler {
  constructor() {
    this.isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('127.0.0.1');
  }

  /**
   * Handle an error with context
   * @param {Error} error - The error object
   * @param {string} context - Where the error occurred (e.g., 'fetchApps', 'createReview')
   * @param {string|null} userMessage - User-friendly message to display (optional)
   * @param {Object} metadata - Additional metadata (optional)
   */
  handle(error, context, userMessage = null, metadata = {}) {
    // Log to console in development
    if (!this.isProduction) {
      console.error(`[${context}]`, error, metadata);
    }

    // Send to Firebase Crashlytics in production (if available)
    if (this.isProduction && window.firebase?.crashlytics) {
      try {
        window.firebase.crashlytics().recordError(error, {
          context,
          ...metadata
        });
      } catch (e) {
        // Fallback if crashlytics fails
        console.error('Failed to log to Crashlytics:', e);
      }
    }

    // Show user-friendly message
    if (userMessage) {
      this.showUserMessage(userMessage, error);
    }

    // Return error info for further handling
    return {
      context,
      message: error.message || 'An unknown error occurred',
      code: error.code || 'unknown',
      userMessage: userMessage || this.getDefaultUserMessage(error)
    };
  }

  /**
   * Get default user message based on error code
   * @param {Error} error - The error object
   * @returns {string} User-friendly message
   */
  getDefaultUserMessage(error) {
    const code = error.code || '';
    
    const messages = {
      'permission-denied': 'אין הרשאה לבצע פעולה זו. אנא התחבר מחדש.',
      'unavailable': 'השירות לא זמין כרגע. אנא נסה שוב בעוד כמה רגעים.',
      'deadline-exceeded': 'הפעולה לוקחת יותר מדי זמן. אנא נסה לרענן את הדף.',
      'not-found': 'הפריט המבוקש לא נמצא.',
      'already-exists': 'הפריט כבר קיים.',
      'failed-precondition': 'התנאים הנדרשים לא מתקיימים.',
      'aborted': 'הפעולה בוטלה.',
      'out-of-range': 'הערך שהוזן לא תקין.',
      'unimplemented': 'הפיצ\'ר הזה עדיין לא זמין.',
      'internal': 'שגיאה פנימית. אנא נסה שוב מאוחר יותר.',
      'unauthenticated': 'אנא התחבר כדי לבצע פעולה זו.',
      'network-error': 'בעיית רשת. אנא בדוק את החיבור לאינטרנט.'
    };

    return messages[code] || 'אירעה שגיאה. אנא נסה שוב.';
  }

  /**
   * Show user-friendly error message
   * @param {string} message - Message to display
   * @param {Error} error - Error object (for logging)
   */
  showUserMessage(message, error = null) {
    // Try to find existing error container
    let errorContainer = document.getElementById('error-message-container');
    
    if (!errorContainer) {
      // Create error container
      errorContainer = document.createElement('div');
      errorContainer.id = 'error-message-container';
      errorContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
      `;
      document.body.appendChild(errorContainer);
    }

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = `
      background: #fee;
      border: 1px solid #fcc;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideIn 0.3s ease-out;
    `;
    
    errorElement.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div style="flex: 1;">
          <strong style="color: #c33; display: block; margin-bottom: 8px;">שגיאה</strong>
          <p style="margin: 0; color: #333;">${message}</p>
        </div>
        <button 
          onclick="this.parentElement.parentElement.remove()" 
          style="
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
            padding: 0;
            margin-left: 12px;
          "
        >×</button>
      </div>
    `;

    // Add animation
    const style = document.createElement('style');
    if (!document.getElementById('error-animations')) {
      style.id = 'error-animations';
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    errorContainer.appendChild(errorElement);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorElement.parentElement) {
        errorElement.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => errorElement.remove(), 300);
      }
    }, 5000);
  }

  /**
   * Handle async errors in promises
   * @param {Promise} promise - Promise that might reject
   * @param {string} context - Context for error
   * @param {string|null} userMessage - User message (optional)
   * @returns {Promise} Promise that never rejects
   */
  async handleAsync(promise, context, userMessage = null) {
    try {
      return await promise;
    } catch (error) {
      return this.handle(error, context, userMessage);
    }
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

// Export for use in modules
if (typeof window !== 'undefined') {
  window.ErrorHandler = errorHandler;
  
  // Global error handler for uncaught errors
  window.addEventListener('error', (event) => {
    errorHandler.handle(event.error || new Error(event.message), 'uncaught', 
      'אירעה שגיאה לא צפויה. אנא רענן את הדף.');
  });

  // Global handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handle(event.reason || new Error('Unhandled promise rejection'), 
      'unhandledPromise', 
      'אירעה שגיאה בטעינת הנתונים. אנא נסה שוב.');
  });
}

// Export for ES6 modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ErrorHandler, errorHandler };
}
