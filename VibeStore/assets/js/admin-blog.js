/**
 * Admin Blog Post Editor
 * Allows admins to create, preview, and publish blog posts to Firestore
 */

import { 
  collection, 
  addDoc, 
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs 
} from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

// Wait for Firebase to initialize
const waitForFirebase = () => new Promise(resolve => {
  const check = () => {
    if (window.$fb && window.$fb.auth && window.$fb.db) {
      resolve(window.$fb);
    } else {
      setTimeout(check, 100);
    }
  };
  check();
});

let auth, db;

// DOM Elements
const adminCheckMsg = document.getElementById('adminCheckMsg');
const accessDenied = document.getElementById('accessDenied');
const editorForm = document.getElementById('editorForm');
const blogPostForm = document.getElementById('blogPostForm');

// Form fields
const titleInput = document.getElementById('title');
const slugInput = document.getElementById('slug');
const excerptInput = document.getElementById('excerpt');
const authorInput = document.getElementById('author');
const categorySelect = document.getElementById('category');
const tagsInput = document.getElementById('tags');
const metaDescInput = document.getElementById('metaDescription');
const metaKeywordsInput = document.getElementById('metaKeywords');
const featuredImageInput = document.getElementById('featuredImage');
const contentInput = document.getElementById('content');
const publishDateInput = document.getElementById('publishDate');
const publishedCheckbox = document.getElementById('published');
const featuredCheckbox = document.getElementById('featured');

// Buttons
const saveDraftBtn = document.getElementById('saveDraftBtn');
const previewBtn = document.getElementById('previewBtn');
const publishBtn = document.getElementById('publishBtn');

// Modals
const previewModal = document.getElementById('previewModal');
const successModal = document.getElementById('successModal');

let currentUser = null;
let isAdmin = false;
let currentPostId = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await checkAdminAccess();
  setupEventListeners();
  setDefaultPublishDate();
});

/**
 * Check if user is admin
 */
async function checkAdminAccess() {
  const { auth: fbAuth, db: fbDb } = await waitForFirebase();
  auth = fbAuth;
  db = fbDb;
  
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      isAdmin = await checkIfAdmin(user.uid);
      
      if (isAdmin) {
        adminCheckMsg.style.display = 'none';
        editorForm.style.display = 'block';
      } else {
        adminCheckMsg.style.display = 'none';
        accessDenied.style.display = 'block';
      }
    } else {
      adminCheckMsg.style.display = 'none';
      accessDenied.style.display = 'block';
    }
  });
}

/**
 * Check if user has admin role
 */
async function checkIfAdmin(userId) {
  try {
    // Simple email-based admin check
    const user = auth.currentUser;
    if (user && user.email === 'shalom.cohen.111@gmail.com') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Auto-generate slug from title
  titleInput.addEventListener('input', () => {
    if (!slugInput.dataset.manuallyEdited) {
      slugInput.value = generateSlug(titleInput.value);
    }
  });

  // Mark slug as manually edited
  slugInput.addEventListener('input', () => {
    slugInput.dataset.manuallyEdited = 'true';
  });

  // Meta description character counter
  metaDescInput.addEventListener('input', () => {
    const counter = document.getElementById('metaDescCounter');
    counter.textContent = metaDescInput.value.length;
    
    if (metaDescInput.value.length > 160) {
      counter.style.color = '#ef4444';
    } else if (metaDescInput.value.length > 150) {
      counter.style.color = '#f59e0b';
    } else {
      counter.style.color = '#6b7280';
    }
  });

  // Featured image preview
  featuredImageInput.addEventListener('input', () => {
    const imageUrl = featuredImageInput.value;
    const preview = document.getElementById('imagePreview');
    const container = document.getElementById('imagePreviewContainer');
    
    if (imageUrl) {
      preview.src = imageUrl;
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  });

  // Toolbar buttons
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      insertMarkdown(action);
    });
  });

  // Save Draft button
  saveDraftBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await savePost(false);
  });

  // Preview button
  previewBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showPreview();
  });

  // Publish button
  publishBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await savePost(true);
  });

  // Preview modal controls
  document.getElementById('closePreview').addEventListener('click', closePreview);
  document.getElementById('closePreviewBtn').addEventListener('click', closePreview);
  document.getElementById('publishFromPreview').addEventListener('click', async () => {
    closePreview();
    await savePost(true);
  });

  // Success modal controls
  document.getElementById('viewPost').addEventListener('click', () => {
    if (currentPostId) {
      window.location.href = `/blog/post/${currentPostId}`;
    }
  });

  document.getElementById('createAnother').addEventListener('click', () => {
    successModal.style.display = 'none';
    resetForm();
  });
}

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single
}

/**
 * Set default publish date to today
 */
function setDefaultPublishDate() {
  const today = new Date().toISOString().split('T')[0];
  publishDateInput.value = today;
}

/**
 * Insert markdown syntax at cursor position
 */
function insertMarkdown(action) {
  const textarea = contentInput;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);
  let replacement = '';

  switch (action) {
    case 'bold':
      replacement = `**${selectedText || 'bold text'}**`;
      break;
    case 'italic':
      replacement = `*${selectedText || 'italic text'}*`;
      break;
    case 'heading':
      replacement = `## ${selectedText || 'Heading'}`;
      break;
    case 'link':
      replacement = `[${selectedText || 'link text'}](url)`;
      break;
    case 'list':
      replacement = `- ${selectedText || 'list item'}`;
      break;
    case 'code':
      replacement = `\`${selectedText || 'code'}\``;
      break;
  }

  textarea.value = 
    textarea.value.substring(0, start) + 
    replacement + 
    textarea.value.substring(end);

  // Set cursor position
  const newPos = start + replacement.length;
  textarea.setSelectionRange(newPos, newPos);
  textarea.focus();
}

/**
 * Validate form data
 */
function validateForm() {
  const errors = [];

  if (!titleInput.value.trim()) {
    errors.push('Title is required');
  }

  if (!slugInput.value.trim()) {
    errors.push('Slug is required');
  }

  if (!excerptInput.value.trim()) {
    errors.push('Excerpt is required');
  }

  if (!categorySelect.value) {
    errors.push('Category is required');
  }

  if (!contentInput.value.trim()) {
    errors.push('Content is required');
  }

  if (!metaDescInput.value.trim()) {
    errors.push('Meta description is required');
  }

  if (metaDescInput.value.length > 160) {
    errors.push('Meta description should be 160 characters or less');
  }

  if (errors.length > 0) {
    alert('Please fix the following errors:\n\n' + errors.join('\n'));
    return false;
  }

  return true;
}

/**
 * Get form data
 */
function getFormData(isPublished) {
  // Parse tags
  const tagsArray = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  // Parse keywords
  const keywordsArray = metaKeywordsInput.value
    .split(',')
    .map(kw => kw.trim())
    .filter(kw => kw.length > 0);

  return {
    title: titleInput.value.trim(),
    slug: slugInput.value.trim(),
    excerpt: excerptInput.value.trim(),
    author: authorInput.value.trim(),
    category: categorySelect.value,
    tags: tagsArray,
    metaDescription: metaDescInput.value.trim(),
    metaKeywords: keywordsArray,
    featuredImage: featuredImageInput.value.trim() || null,
    content: contentInput.value.trim(),
    publishDate: publishDateInput.value,
    published: isPublished,
    featured: featuredCheckbox.checked,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    authorId: currentUser.uid,
    authorEmail: currentUser.email
  };
}

/**
 * Save blog post to Firestore
 */
async function savePost(publish) {
  if (!validateForm()) {
    return;
  }

  try {
    const button = publish ? publishBtn : saveDraftBtn;
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = publish ? '🚀 Publishing...' : '💾 Saving...';

    const postData = getFormData(publish);
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'blog_posts'), postData);
    currentPostId = docRef.id;

    button.disabled = false;
    button.textContent = originalText;

    // Show success message
    const message = publish 
      ? '✅ Blog post published successfully!'
      : '💾 Blog post saved as draft!';
    
    document.getElementById('successMessage').textContent = message;
    successModal.style.display = 'flex';

  } catch (error) {
    console.error('Error saving blog post:', error);
    alert('Error saving blog post: ' + error.message);
    
    const button = publish ? publishBtn : saveDraftBtn;
    button.disabled = false;
    button.textContent = publish ? '🚀 Publish' : '💾 Save Draft';
  }
}

/**
 * Show preview of blog post
 */
function showPreview() {
  if (!validateForm()) {
    return;
  }

  const previewContent = document.getElementById('previewContent');
  const postData = getFormData(false);

  // Build preview HTML
  let html = '';

  // Featured image
  if (postData.featuredImage) {
    html += `<img src="${postData.featuredImage}" alt="${postData.title}" style="width: 100%; border-radius: 8px; margin-bottom: 2rem;">`;
  }

  // Title
  html += `<h1>${postData.title}</h1>`;

  // Meta info
  html += `
    <div style="color: #6b7280; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
      <p>
        <strong>Author:</strong> ${postData.author}<br>
        <strong>Category:</strong> ${getCategoryName(postData.category)}<br>
        <strong>Published:</strong> ${postData.publishDate}<br>
        ${postData.tags.length > 0 ? `<strong>Tags:</strong> ${postData.tags.join(', ')}` : ''}
      </p>
    </div>
  `;

  // Content (convert markdown to HTML - basic conversion)
  html += `<div class="markdown-content">${convertMarkdownToHTML(postData.content)}</div>`;

  previewContent.innerHTML = html;
  previewModal.style.display = 'flex';
}

/**
 * Close preview modal
 */
function closePreview() {
  previewModal.style.display = 'none';
}

/**
 * Get category name by ID
 */
function getCategoryName(categoryId) {
  const categories = {
    'tools-platforms': '🛠️ Tools & Platforms',
    'use-cases-examples': '💡 Use Cases & Real-World Examples',
    'best-practices': '✅ Best Practices & Methodology',
    'challenges-risks': '⚠️ Challenges & Risks',
    'general': '📰 General'
  };
  return categories[categoryId] || categoryId;
}

/**
 * Basic Markdown to HTML converter
 */
function convertMarkdownToHTML(markdown) {
  let html = markdown;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr>');

  // Lists
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (!para.startsWith('<') && para.trim()) {
      return `<p>${para}</p>`;
    }
    return para;
  }).join('\n');

  // Line breaks
  html = html.replace(/\n/g, '<br>');

  return html;
}

/**
 * Reset form to initial state
 */
function resetForm() {
  blogPostForm.reset();
  setDefaultPublishDate();
  slugInput.dataset.manuallyEdited = '';
  document.getElementById('imagePreviewContainer').style.display = 'none';
  document.getElementById('metaDescCounter').textContent = '0';
  currentPostId = null;
}

// Export for use in other modules
export { checkIfAdmin };

