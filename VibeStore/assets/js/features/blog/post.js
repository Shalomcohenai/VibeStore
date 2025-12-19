/**
 * Blog Post Display
 * Displays individual blog post from Firestore
 */

import { db } from './firebaseConfig.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Get post ID from URL
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// DOM Elements
const loadingPost = document.getElementById('loadingPost');
const postError = document.getElementById('postError');
const blogPost = document.getElementById('blogPost');

// Category configuration
const categories = {
  'tools-platforms': {
    name: 'Tools & Platforms',
    icon: '🛠️',
    color: '#1a1a1a'
  },
  'use-cases-examples': {
    name: 'Use Cases & Real-World Examples',
    icon: '💡',
    color: '#10b981'
  },
  'best-practices': {
    name: 'Best Practices & Methodology',
    icon: '✅',
    color: '#4b5563'
  },
  'challenges-risks': {
    name: 'Challenges & Risks',
    icon: '⚠️',
    color: '#ef4444'
  },
  'general': {
    name: 'General',
    icon: '📰',
    color: '#06b6d4'
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  if (!postId) {
    showError();
    return;
  }

  await loadPost(postId);
  setupShareButtons();
});

/**
 * Load blog post from Firestore
 */
async function loadPost(id) {
  try {
    const docRef = doc(db, 'blog_posts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const post = { id: docSnap.id, ...docSnap.data() };

      // Only show published posts (or show drafts if admin)
      if (!post.published) {
        showError();
        return;
      }

      renderPost(post);
      loadingPost.style.display = 'none';
      blogPost.style.display = 'block';
    } else {
      showError();
    }
  } catch (error) {
    console.error('Error loading blog post:', error);
    showError();
  }
}

/**
 * Render blog post to page
 */
function renderPost(post) {
  // Set page title
  document.title = `${post.title} - VibeStore Blog`;

  // Set meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = post.metaDescription;
  }

  // Featured image
  if (post.featuredImage) {
    const container = document.getElementById('featuredImageContainer');
    const img = document.getElementById('featuredImage');
    img.src = post.featuredImage;
    img.alt = post.title;
    container.style.display = 'block';
  }

  // Category
  const categoryInfo = categories[post.category] || categories['general'];
  const categoryEl = document.getElementById('postCategory');
  categoryEl.textContent = `${categoryInfo.icon} ${categoryInfo.name}`;
  categoryEl.style.background = categoryInfo.color;

  // Date
  const dateEl = document.getElementById('postDate');
  dateEl.textContent = formatDate(post.publishDate);

  // Title
  document.getElementById('postTitle').textContent = post.title;

  // Author
  document.getElementById('postAuthor').textContent = post.author;

  // Tags
  if (post.tags && post.tags.length > 0) {
    const tagsContainer = document.getElementById('tagsContainer');
    tagsContainer.innerHTML = post.tags.map(tag =>
      `<span class="tag">${tag}</span>`
    ).join('');
  }

  // Content
  const contentEl = document.getElementById('postContent');
  contentEl.innerHTML = convertMarkdownToHTML(post.content);
}

/**
 * Format date for display
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Convert Markdown to HTML
 * Using marked.js library for better conversion
 */
function convertMarkdownToHTML(markdown) {
  let html = markdown;

  // Code blocks (must come before other replacements)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'text'}">${escapeHtml(code.trim())}</code></pre>`;
  });

  // Headers
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Inline code (after code blocks)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr>');

  // Blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Unordered lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');

  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    // Only wrap if not already wrapped in ul
    if (!match.includes('<ul>')) {
      return `<ol>${match}</ol>`;
    }
    return match;
  });

  // Paragraphs
  const lines = html.split('\n');
  const paragraphs = [];
  let currentParagraph = '';

  lines.forEach(line => {
    const trimmed = line.trim();

    // Skip if it's already a tag
    if (trimmed.startsWith('<') || trimmed === '') {
      if (currentParagraph) {
        paragraphs.push(`<p>${currentParagraph}</p>`);
        currentParagraph = '';
      }
      if (trimmed) {
        paragraphs.push(trimmed);
      }
    } else {
      currentParagraph += (currentParagraph ? ' ' : '') + trimmed;
    }
  });

  if (currentParagraph) {
    paragraphs.push(`<p>${currentParagraph}</p>`);
  }

  return paragraphs.join('\n');
}

/**
 * Escape HTML characters
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Setup share buttons
 */
function setupShareButtons() {
  const currentUrl = window.location.href;
  const title = document.getElementById('postTitle').textContent;

  // Twitter share
  const twitterBtn = document.getElementById('shareTwitter');
  if (twitterBtn) {
    twitterBtn.addEventListener('click', () => {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`;
      window.open(twitterUrl, '_blank', 'width=550,height=420');
    });
  }

  // LinkedIn share
  const linkedInBtn = document.getElementById('shareLinkedIn');
  if (linkedInBtn) {
    linkedInBtn.addEventListener('click', () => {
      const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
      window.open(linkedInUrl, '_blank', 'width=550,height=420');
    });
  }

  // Facebook share
  const facebookBtn = document.getElementById('shareFacebook');
  if (facebookBtn) {
    facebookBtn.addEventListener('click', () => {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
      window.open(facebookUrl, '_blank', 'width=550,height=420');
    });
  }

  // Copy link
  const copyBtn = document.getElementById('shareCopy');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Copied!';
        copyBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.background = '';
        }, 2000);
      } catch (error) {
        console.error('Failed to copy link:', error);
        alert('Failed to copy link. Please copy manually: ' + currentUrl);
      }
    });
  }
}

/**
 * Show error message
 */
function showError() {
  loadingPost.style.display = 'none';
  postError.style.display = 'block';
}

