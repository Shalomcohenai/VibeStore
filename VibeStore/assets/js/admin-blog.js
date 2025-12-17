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
  setupAIEventListeners();
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
    if (user) {
      try {
        const idTokenResult = await user.getIdTokenResult();
        return idTokenResult.claims.admin === true;
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
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

/**
 * Setup AI generation event listeners
 */
function setupAIEventListeners() {
  const generateBtn = document.getElementById('generateWithAI');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateBlogPostWithAI);
  }
}

/**
 * Generate blog post with OpenAI
 */
async function generateBlogPostWithAI() {
  const topicInput = document.getElementById('aiTopic');
  const categoryInput = document.getElementById('aiCategory');
  const keywordsInput = document.getElementById('aiKeywords');
  const apiKeyInput = document.getElementById('openaiApiKey');
  const generateBtn = document.getElementById('generateWithAI');
  const generateBtnText = document.getElementById('generateBtnText');
  const generateBtnLoading = document.getElementById('generateBtnLoading');
  const aiError = document.getElementById('aiError');

  // Validate inputs
  if (!topicInput.value.trim()) {
    showAIError('אנא הכנס נושא לכתבה');
    return;
  }

  if (!apiKeyInput.value.trim()) {
    showAIError('אנא הכנס את OpenAI API Key שלך');
    return;
  }

  // Show loading state
  generateBtn.disabled = true;
  generateBtnText.style.display = 'none';
  generateBtnLoading.style.display = 'inline';
  aiError.style.display = 'none';

  try {
    // Build SEO-optimized prompt
    const prompt = buildSEOPrompt(
      topicInput.value.trim(),
      categoryInput.value,
      keywordsInput.value.trim()
    );

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyInput.value.trim()}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'אתה כותב בלוג מקצועי ומנוסה המתמחה ביצירת תוכן מנוע SEO. אתה יוצר כתבות מעמיקות, מעניינות וממוקדות SEO.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'שגיאה ב-OpenAI API');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Parse the generated content
    const parsedContent = parseGeneratedContent(generatedContent);

    // Fill form with generated content
    fillFormWithGeneratedContent(parsedContent, categoryInput.value);

    // Show success message
    showAISuccess('הכתבה נוצרה בהצלחה! אנא בדוק וערוך לפי הצורך.');

  } catch (error) {
    console.error('Error generating blog post:', error);
    showAIError(`שגיאה ביצירת הכתבה: ${error.message}`);
  } finally {
    // Reset button state
    generateBtn.disabled = false;
    generateBtnText.style.display = 'inline';
    generateBtnLoading.style.display = 'none';
  }
}

/**
 * Build SEO-optimized prompt for OpenAI
 */
function buildSEOPrompt(topic, category, keywords) {
  const categoryNames = {
    'tools-platforms': 'כלי פיתוח ופלטפורמות',
    'use-cases-examples': 'שימושיים ודוגמאות מהעולם האמיתי',
    'best-practices': 'שיטות עבודה מומלצות ומתודולוגיה',
    'challenges-risks': 'אתגרים וסיכונים',
    'general': 'כללי'
  };

  let prompt = `צור כתבת בלוג מנועת SEO בנושא: "${topic}"

קטגוריה: ${categoryNames[category] || 'כללי'}

דרישות:
1. הכתבה חייבת להיות באורך של לפחות 1500 מילים
2. הכתבה חייבת להיות מנועת SEO עם:
   - כותרת ראשית (H1) ממוקדת SEO
   - כותרות משנה (H2, H3) רלוונטיות
   - שימוש במילות מפתח בצורה טבעית
   - פסקאות קצרות וקריאות (3-4 משפטים)
   - רשימות עם bullet points
   - קישורים פנימיים וחיצוניים רלוונטיים
   - Meta description אופטימלי (150-160 תווים)
   - מילות מפתח רלוונטיות

3. מבנה הכתבה:
   - מבוא מעניין (2-3 פסקאות)
   - 4-6 סעיפים עיקריים עם כותרות H2
   - כל סעיף צריך לכלול 2-3 תת-סעיפים עם H3
   - סיכום ומסקנות
   - Call-to-action בסוף

4. פורמט התשובה (JSON):
{
  "title": "כותרת הכתבה (ממוקדת SEO)",
  "slug": "url-friendly-slug",
  "excerpt": "תקציר קצר של 1-2 משפטים",
  "metaDescription": "Meta description של 150-160 תווים",
  "metaKeywords": "מילת מפתח 1, מילת מפתח 2, מילת מפתח 3",
  "tags": ["תגית1", "תגית2", "תגית3", "תגית4"],
  "content": "תוכן הכתבה המלא בפורמט Markdown"
}`;

  if (keywords && keywords.trim()) {
    prompt += `\n\nמילות מפתח שצריכות להופיע בכתבה: ${keywords}`;
  }

  prompt += `\n\nהחזר רק את ה-JSON, ללא טקסט נוסף לפני או אחרי.`;

  return prompt;
}

/**
 * Parse generated content from OpenAI response
 */
function parseGeneratedContent(content) {
  try {
    // Try to extract JSON from the response
    let jsonStr = content.trim();
    
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Try to find JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (error) {
    console.error('Error parsing generated content:', error);
    
    // Fallback: try to extract information manually
    return {
      title: extractTitle(content),
      slug: generateSlug(extractTitle(content)),
      excerpt: extractExcerpt(content),
      metaDescription: extractMetaDescription(content),
      metaKeywords: extractKeywords(content),
      tags: extractTags(content),
      content: content
    };
  }
}

/**
 * Extract title from content
 */
function extractTitle(content) {
  const titleMatch = content.match(/title["\s:]+["']?([^"'\n]+)["']?/i);
  if (titleMatch) return titleMatch[1];
  
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1];
  
  return 'כותרת הכתבה';
}

/**
 * Extract excerpt from content
 */
function extractExcerpt(content) {
  const excerptMatch = content.match(/excerpt["\s:]+["']?([^"'\n]+)["']?/i);
  if (excerptMatch) return excerptMatch[1];
  
  // Get first paragraph
  const firstPara = content.split('\n\n').find(p => p.trim().length > 20);
  if (firstPara) {
    return firstPara.substring(0, 150).trim() + '...';
  }
  
  return 'תקציר הכתבה';
}

/**
 * Extract meta description
 */
function extractMetaDescription(content) {
  const metaMatch = content.match(/metaDescription["\s:]+["']?([^"'\n]+)["']?/i);
  if (metaMatch) return metaMatch[1];
  
  return extractExcerpt(content).substring(0, 160);
}

/**
 * Extract keywords
 */
function extractKeywords(content) {
  const keywordsMatch = content.match(/metaKeywords["\s:]+["']?([^"'\n]+)["']?/i);
  if (keywordsMatch) {
    return keywordsMatch[1].split(',').map(k => k.trim()).join(', ');
  }
  
  return '';
}

/**
 * Extract tags
 */
function extractTags(content) {
  const tagsMatch = content.match(/tags["\s:]+\[([^\]]+)\]/i);
  if (tagsMatch) {
    return tagsMatch[1].split(',').map(t => t.trim().replace(/["']/g, '')).join(', ');
  }
  
  return '';
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\u0590-\u05FF\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Fill form with generated content
 */
function fillFormWithGeneratedContent(parsedContent, category) {
  if (parsedContent.title) {
    titleInput.value = parsedContent.title;
    // Auto-generate slug if not manually edited
    if (!slugInput.dataset.manuallyEdited) {
      slugInput.value = parsedContent.slug || generateSlug(parsedContent.title);
    }
  }
  
  if (parsedContent.excerpt) {
    excerptInput.value = parsedContent.excerpt;
  }
  
  if (parsedContent.metaDescription) {
    metaDescInput.value = parsedContent.metaDescription;
    updateCharCounter();
  }
  
  if (parsedContent.metaKeywords) {
    metaKeywordsInput.value = parsedContent.metaKeywords;
  }
  
  if (parsedContent.tags) {
    tagsInput.value = parsedContent.tags;
  }
  
  if (category) {
    categorySelect.value = category;
  }
  
  if (parsedContent.content) {
    contentInput.value = parsedContent.content;
  }
  
  // Scroll to form
  document.querySelector('.editor-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Show AI error message
 */
function showAIError(message) {
  const aiError = document.getElementById('aiError');
  if (aiError) {
    aiError.textContent = message;
    aiError.style.display = 'block';
    setTimeout(() => {
      aiError.style.display = 'none';
    }, 5000);
  }
}

/**
 * Show AI success message
 */
function showAISuccess(message) {
  // Create temporary success message
  const successDiv = document.createElement('div');
  successDiv.style.cssText = 'margin-top: 1rem; padding: 1rem; background: rgba(16, 185, 129, 0.2); border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.5); color: white;';
  successDiv.textContent = message;
  
  const aiSection = document.querySelector('.ai-generator-section');
  if (aiSection) {
    aiSection.appendChild(successDiv);
    setTimeout(() => {
      successDiv.remove();
    }, 5000);
  }
}

/**
 * Update character counter for meta description
 */
function updateCharCounter() {
  const counter = document.getElementById('metaDescCounter');
  if (counter && metaDescInput) {
    counter.textContent = metaDescInput.value.length;

    if (metaDescInput.value.length > 160) {
      counter.style.color = '#ef4444';
    } else if (metaDescInput.value.length > 150) {
      counter.style.color = '#f59e0b';
    } else {
      counter.style.color = '#6b7280';
    }
  }
}

// Export for use in other modules
export { checkIfAdmin };

