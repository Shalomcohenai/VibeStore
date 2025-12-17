/**
 * VibeStore - Search Engine
 * Pure search engine with scoring system
 * Independent of Firebase - receives data and returns scored results
 */

// Search apps with advanced scoring system
function searchApps(apps, searchQuery, options = {}) {
  try {
    if (!searchQuery || searchQuery.trim() === '') {
      return apps;
    }

    const query = searchQuery.toLowerCase().trim();
    const searchWords = query.split(/\s+/).filter(word => word.length > 0);

    if (searchWords.length === 0) {
      return apps;
    }

    // Score each app based on search matches
    const scoredApps = apps.map(app => {
      const score = calculateSearchScore(app, searchWords, options);
      return { ...app, searchScore: score };
    }).filter(app => app.searchScore > 0); // Only return apps with matches

    // Sort by score (highest first), then by rating
    scoredApps.sort((a, b) => {
      if (b.searchScore !== a.searchScore) {
        return b.searchScore - a.searchScore;
      }
      return (b.rating_avg || 0) - (a.rating_avg || 0);
    });

    return scoredApps;
  } catch (error) {
    console.error('Error in search engine:', error);
    return [];
  }
}

// Calculate search score for an app
function calculateSearchScore(app, searchWords, options = {}) {
  let totalScore = 0;

  const title = (app.title || '').toLowerCase();
  const description = (app.description || '').toLowerCase();
  const category = (app.category || '').toLowerCase();
  const tags = (app.tags || []).join(' ').toLowerCase();

  // Scoring weights (can be customized via options)
  const TITLE_WEIGHT = options.titleWeight || 10;
  const DESCRIPTION_WEIGHT = options.descriptionWeight || 5;
  const CATEGORY_WEIGHT = options.categoryWeight || 8;
  const TAGS_WEIGHT = options.tagsWeight || 6;
  const EXACT_MATCH_BONUS = options.exactMatchBonus || 2;

  searchWords.forEach(word => {
    // Title matches
    const titleMatches = countMatches(title, word);
    if (titleMatches > 0) {
      totalScore += titleMatches * TITLE_WEIGHT;
      // Bonus for exact word match
      if (isExactWordMatch(title, word)) {
        totalScore += EXACT_MATCH_BONUS;
      }
    }

    // Description matches
    const descMatches = countMatches(description, word);
    if (descMatches > 0) {
      totalScore += descMatches * DESCRIPTION_WEIGHT;
      if (isExactWordMatch(description, word)) {
        totalScore += EXACT_MATCH_BONUS;
      }
    }

    // Category matches
    const categoryMatches = countMatches(category, word);
    if (categoryMatches > 0) {
      totalScore += categoryMatches * CATEGORY_WEIGHT;
      if (isExactWordMatch(category, word)) {
        totalScore += EXACT_MATCH_BONUS;
      }
    }

    // Tags matches
    const tagsMatches = countMatches(tags, word);
    if (tagsMatches > 0) {
      totalScore += tagsMatches * TAGS_WEIGHT;
      if (isExactWordMatch(tags, word)) {
        totalScore += EXACT_MATCH_BONUS;
      }
    }
  });

  return totalScore;
}

// Count how many times a word appears in text
function countMatches(text, word) {
  if (!text || !word) return 0;

  // Simple word boundary matching
  const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

// Check if word appears as exact match (word boundaries)
function isExactWordMatch(text, word) {
  if (!text || !word) return false;

  return text.includes(` ${word} `) ||
         text.startsWith(`${word} `) ||
         text.endsWith(` ${word}`) ||
         text === word;
}

// Sort apps by relevance (score + rating)
function sortByRelevance(scoredApps) {
  return scoredApps.sort((a, b) => {
    if (b.searchScore !== a.searchScore) {
      return b.searchScore - a.searchScore;
    }
    return (b.rating_avg || 0) - (a.rating_avg || 0);
  });
}

// Filter apps by minimum score threshold
function filterByScore(scoredApps, minScore = 1) {
  return scoredApps.filter(app => app.searchScore >= minScore);
}

// Get search suggestions based on app data
function getSearchSuggestions(apps, partialQuery, maxSuggestions = 5) {
  if (!partialQuery || partialQuery.length < 2) return [];

  const query = partialQuery.toLowerCase();
  const suggestions = new Set();

  apps.forEach(app => {
    // Add title words that start with query
    const titleWords = (app.title || '').toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.startsWith(query) && word.length > 2) {
        suggestions.add(word);
      }
    });

    // Add category if it starts with query
    const category = (app.category || '').toLowerCase();
    if (category.startsWith(query)) {
      suggestions.add(category);
    }

    // Add tag words that start with query
    const tags = app.tags || [];
    tags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      if (tagLower.startsWith(query)) {
        suggestions.add(tagLower);
      }
    });
  });

  return Array.from(suggestions).slice(0, maxSuggestions);
}

// Export functions
window.VibeStoreSearchEngine = {
  searchApps,
  calculateSearchScore,
  countMatches,
  isExactWordMatch,
  sortByRelevance,
  filterByScore,
  getSearchSuggestions
};

