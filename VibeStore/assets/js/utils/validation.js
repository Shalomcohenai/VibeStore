/**
 * VibeStore - Input Validation
 * Centralized validation utilities
 */

class Validator {
  /**
   * Validate review data
   * @param {Object} data - Review data
   * @param {number} data.stars - Rating (1-5)
   * @param {string} data.text - Review text
   * @returns {{isValid: boolean, errors: string[]}}
   */
  static validateReview(data) {
    const errors = [];
    const ratingMin = window.RATING?.MIN || 1;
    const ratingMax = window.RATING?.MAX || 5;
    const textMin = window.VALIDATION?.REVIEW_TEXT_MIN || 10;
    const textMax = window.VALIDATION?.REVIEW_TEXT_MAX || 500;

    if (!data.stars || typeof data.stars !== 'number') {
      errors.push('דירוג הוא שדה חובה');
    } else if (data.stars < ratingMin || data.stars > ratingMax) {
      errors.push(`דירוג חייב להיות בין ${ratingMin} ל-${ratingMax}`);
    }

    if (!data.text || typeof data.text !== 'string') {
      errors.push('תגובה היא שדה חובה');
    } else {
      const trimmedText = data.text.trim();
      if (trimmedText.length < textMin) {
        errors.push(`תגובה חייבת להכיל לפחות ${textMin} תווים`);
      }
      if (trimmedText.length > textMax) {
        errors.push(`תגובה לא יכולה להכיל יותר מ-${textMax} תווים`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate comment data
   * @param {Object} data - Comment data
   * @param {string} data.content - Comment content
   * @returns {{isValid: boolean, errors: string[]}}
   */
  static validateComment(data) {
    const errors = [];
    const textMin = window.VALIDATION?.COMMENT_TEXT_MIN || 1;
    const textMax = window.VALIDATION?.COMMENT_TEXT_MAX || 1000;

    if (!data.content || typeof data.content !== 'string') {
      errors.push('תגובה היא שדה חובה');
    } else {
      const trimmedContent = data.content.trim();
      if (trimmedContent.length < textMin) {
        errors.push(`תגובה חייבת להכיל לפחות ${textMin} תווים`);
      }
      if (trimmedContent.length > textMax) {
        errors.push(`תגובה לא יכולה להכיל יותר מ-${textMax} תווים`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate list data
   * @param {Object} data - List data
   * @param {string} data.name - List name
   * @returns {{isValid: boolean, errors: string[]}}
   */
  static validateList(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string') {
      errors.push('שם הרשימה הוא שדה חובה');
    } else {
      const trimmedName = data.name.trim();
      if (trimmedName.length < 1) {
        errors.push('שם הרשימה לא יכול להיות ריק');
      }
      if (trimmedName.length > 100) {
        errors.push('שם הרשימה לא יכול להכיל יותר מ-100 תווים');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate report data
   * @param {Object} data - Report data
   * @param {string} data.email - Email address
   * @param {string} data.message - Report message
   * @returns {{isValid: boolean, errors: string[]}}
   */
  static validateReport(data) {
    const errors = [];
    const messageMin = window.VALIDATION?.REPORT_MESSAGE_MIN || 1;
    const messageMax = window.VALIDATION?.REPORT_MESSAGE_MAX || 1000;

    if (!data.email || typeof data.email !== 'string') {
      errors.push('כתובת אימייל היא שדה חובה');
    } else if (!this.isValidEmail(data.email)) {
      errors.push('כתובת אימייל לא תקינה');
    }

    if (!data.message || typeof data.message !== 'string') {
      errors.push('הודעה היא שדה חובה');
    } else {
      const trimmedMessage = data.message.trim();
      if (trimmedMessage.length < messageMin) {
        errors.push(`הודעה חייבת להכיל לפחות ${messageMin} תווים`);
      }
      if (trimmedMessage.length > messageMax) {
        errors.push(`הודעה לא יכולה להכיל יותר מ-${messageMax} תווים`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate app submission data
   * @param {Object} data - App data
   * @returns {{isValid: boolean, errors: string[]}}
   */
  static validateAppSubmission(data) {
    const errors = [];
    const titleMin = window.VALIDATION?.TITLE_MIN || 1;
    const titleMax = window.VALIDATION?.TITLE_MAX || 200;
    const descMin = window.VALIDATION?.DESCRIPTION_MIN || 10;
    const descMax = window.VALIDATION?.DESCRIPTION_MAX || 2000;

    if (!data.title || typeof data.title !== 'string') {
      errors.push('כותרת היא שדה חובה');
    } else {
      const trimmedTitle = data.title.trim();
      if (trimmedTitle.length < titleMin) {
        errors.push(`כותרת חייבת להכיל לפחות ${titleMin} תווים`);
      }
      if (trimmedTitle.length > titleMax) {
        errors.push(`כותרת לא יכולה להכיל יותר מ-${titleMax} תווים`);
      }
    }

    if (!data.description || typeof data.description !== 'string') {
      errors.push('תיאור הוא שדה חובה');
    } else {
      const trimmedDesc = data.description.trim();
      if (trimmedDesc.length < descMin) {
        errors.push(`תיאור חייב להכיל לפחות ${descMin} תווים`);
      }
      if (trimmedDesc.length > descMax) {
        errors.push(`תיאור לא יכול להכיל יותר מ-${descMax} תווים`);
      }
    }

    if (!data.link || typeof data.link !== 'string') {
      errors.push('קישור הוא שדה חובה');
    } else if (!this.isValidUrl(data.link)) {
      errors.push('קישור לא תקין');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email address
   * @returns {boolean}
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate URL format
   * @param {string} url - URL address
   * @returns {boolean}
   */
  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Sanitize text input (remove HTML tags)
   * @param {string} text - Text to sanitize
   * @returns {string} Sanitized text
   */
  static sanitizeText(text) {
    if (typeof text !== 'string') {
      return '';
    }
    
    // Remove HTML tags
    const div = document.createElement('div');
    div.textContent = text;
    return div.textContent || div.innerText || '';
  }
}

// Export for use in modules
if (typeof window !== 'undefined') {
  window.Validator = Validator;
}

// Export for ES6 modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Validator };
}
