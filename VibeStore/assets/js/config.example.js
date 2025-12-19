/**
 * Configuration file example
 * Copy this file to config.js and fill in your actual API keys
 * 
 * ⚠️ IMPORTANT: 
 * - Never commit config.js to version control
 * - Add config.js to .gitignore
 * - Keep your API keys secure
 */

// OpenAI API Key
const OPENAI_API_KEY = 'your-openai-api-key-here';

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OPENAI_API_KEY };
}

// Make available globally
window.OPENAI_API_KEY = OPENAI_API_KEY;
