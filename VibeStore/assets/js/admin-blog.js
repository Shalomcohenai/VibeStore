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

// Utility function: Create URL-friendly slug from title
function createBlogPostSlug(title) {
  if (!title) return '';
  return String(title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

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
  if (titleInput && slugInput) {
    titleInput.addEventListener('input', () => {
      if (!slugInput.dataset.manuallyEdited) {
        slugInput.value = createBlogPostSlug(titleInput.value);
      }
    });

    // Mark slug as manually edited
    slugInput.addEventListener('input', () => {
      slugInput.dataset.manuallyEdited = 'true';
    });
  }

  // Meta description character counter
  if (metaDescInput) {
    metaDescInput.addEventListener('input', () => {
      const counter = document.getElementById('metaDescCounter');
      if (counter) {
        counter.textContent = metaDescInput.value.length;

        if (metaDescInput.value.length > 160) {
          counter.style.color = '#ef4444';
        } else if (metaDescInput.value.length > 150) {
          counter.style.color = '#f59e0b';
        } else {
          counter.style.color = '#6b7280';
        }
      }
    });
  }

  // Featured image preview
  if (featuredImageInput) {
    featuredImageInput.addEventListener('input', () => {
      const imageUrl = featuredImageInput.value;
      const preview = document.getElementById('imagePreview');
      const container = document.getElementById('imagePreviewContainer');

      if (imageUrl && preview && container) {
        preview.src = imageUrl;
        container.style.display = 'block';
      } else if (container) {
        container.style.display = 'none';
      }
    });
  }

  // Toolbar buttons
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const action = btn.dataset.action;
      insertMarkdown(action);
    });
  });

  // Save Draft button
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await savePost(false);
    });
  }

  // Preview button
  if (previewBtn) {
    previewBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showPreview();
    });
  }

  // Publish button
  if (publishBtn) {
    publishBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await savePost(true);
    });
  }

  // Preview modal controls
  const closePreview = document.getElementById('closePreview');
  const closePreviewBtn = document.getElementById('closePreviewBtn');
  const publishFromPreview = document.getElementById('publishFromPreview');
  
  if (closePreview) closePreview.addEventListener('click', closePreviewModal);
  if (closePreviewBtn) closePreviewBtn.addEventListener('click', closePreviewModal);
  if (publishFromPreview) {
    publishFromPreview.addEventListener('click', async () => {
      closePreviewModal();
      await savePost(true);
    });
  }

  // Success modal controls
  const viewPost = document.getElementById('viewPost');
  const createAnother = document.getElementById('createAnother');
  
  if (viewPost) {
    viewPost.addEventListener('click', () => {
      if (currentPostId) {
        window.location.href = `/blog/post/?id=${currentPostId}`;
      }
    });
  }

  if (createAnother) {
    createAnother.addEventListener('click', () => {
      if (successModal) successModal.style.display = 'none';
      resetForm();
    });
  }
}

/**
 * Set default publish date to today
 */
function setDefaultPublishDate() {
  if (publishDateInput) {
    const today = new Date().toISOString().split('T')[0];
    publishDateInput.value = today;
  }
}

/**
 * Insert markdown syntax at cursor position
 */
function insertMarkdown(action) {
  if (!contentInput) return;
  
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

  if (!titleInput || !titleInput.value.trim()) {
    errors.push('Title is required');
  }

  if (!slugInput || !slugInput.value.trim()) {
    errors.push('Slug is required');
  }

  if (!excerptInput || !excerptInput.value.trim()) {
    errors.push('Excerpt is required');
  }

  if (!categorySelect || !categorySelect.value) {
    errors.push('Category is required');
  }

  if (!contentInput || !contentInput.value.trim()) {
    errors.push('Content is required');
  }

  if (!metaDescInput || !metaDescInput.value.trim()) {
    errors.push('Meta description is required');
  }

  if (metaDescInput && metaDescInput.value.length > 160) {
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
  const tagsArray = tagsInput && tagsInput.value
    ? tagsInput.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
    : [];

  // Parse keywords
  const keywordsArray = metaKeywordsInput && metaKeywordsInput.value
    ? metaKeywordsInput.value
        .split(',')
        .map(kw => kw.trim())
        .filter(kw => kw.length > 0)
    : [];

  return {
    title: titleInput ? titleInput.value.trim() : '',
    slug: slugInput ? slugInput.value.trim() : '',
    excerpt: excerptInput ? excerptInput.value.trim() : '',
    author: authorInput ? authorInput.value.trim() : '',
    category: categorySelect ? categorySelect.value : '',
    tags: tagsArray,
    metaDescription: metaDescInput ? metaDescInput.value.trim() : '',
    metaKeywords: keywordsArray,
    featuredImage: featuredImageInput ? (featuredImageInput.value.trim() || null) : null,
    content: contentInput ? contentInput.value.trim() : '',
    publishDate: publishDateInput ? publishDateInput.value : '',
    published: isPublished,
    featured: featuredCheckbox ? featuredCheckbox.checked : false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    authorId: currentUser ? currentUser.uid : '',
    authorEmail: currentUser ? currentUser.email : ''
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
    if (!button) return;
    
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

    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
      successMessage.textContent = message;
    }
    if (successModal) {
      successModal.style.display = 'flex';
    }

  } catch (error) {
    console.error('Error saving blog post:', error);
    alert('Error saving blog post: ' + error.message);

    const button = publish ? publishBtn : saveDraftBtn;
    if (button) {
      button.disabled = false;
      button.textContent = publish ? '🚀 Publish' : '💾 Save Draft';
    }
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
  if (!previewContent) return;
  
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
  if (previewModal) {
    previewModal.style.display = 'flex';
  }
}

/**
 * Close preview modal
 */
function closePreviewModal() {
  if (previewModal) {
    previewModal.style.display = 'none';
  }
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
  if (!markdown) return '';
  
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
  if (blogPostForm) {
    blogPostForm.reset();
  }
  setDefaultPublishDate();
  if (slugInput) {
    slugInput.dataset.manuallyEdited = '';
  }
  const imagePreviewContainer = document.getElementById('imagePreviewContainer');
  if (imagePreviewContainer) {
    imagePreviewContainer.style.display = 'none';
  }
  const metaDescCounter = document.getElementById('metaDescCounter');
  if (metaDescCounter) {
    metaDescCounter.textContent = '0';
  }
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
  
  // Check if API key is available from config.js
  checkAPIKeyFromConfig();
}

/**
 * Check if API key is available from config.js and update UI
 */
function checkAPIKeyFromConfig() {
  const apiKeyInput = document.getElementById('openaiApiKey');
  const apiKeyGroup = document.getElementById('apiKeyGroup');
  const apiKeyInfo = document.getElementById('apiKeyInfo');
  
  // Check if API key is available from config.js
  if (window.OPENAI_API_KEY && window.OPENAI_API_KEY !== 'your-openai-api-key-here') {
    // API key is loaded from config.js
    if (apiKeyGroup) apiKeyGroup.style.display = 'none';
    if (apiKeyInfo) {
      apiKeyInfo.style.display = 'block';
      const infoText = apiKeyInfo.querySelector('small');
      if (infoText) infoText.textContent = '✅ API Key loaded from config.js';
    }
    if (apiKeyInput) {
      // Set the value but keep it hidden
      apiKeyInput.value = window.OPENAI_API_KEY;
    }
  } else {
    // API key not found in config, show input field
    if (apiKeyGroup) apiKeyGroup.style.display = 'block';
    if (apiKeyInfo) apiKeyInfo.style.display = 'none';
  }
}

/**
 * Generate blog post with OpenAI - Advanced version
 */
async function generateBlogPostWithAI() {
  const titleInput = document.getElementById('aiTitle') || document.getElementById('aiTopic');
  const categoryInput = document.getElementById('aiCategory');
  const keywordsInput = document.getElementById('aiKeywords');
  const toneInput = document.getElementById('aiTone');
  const lengthInput = document.getElementById('aiLength');
  const apiKeyInput = document.getElementById('openaiApiKey');
  const generateBtn = document.getElementById('generateWithAI');
  const generateBtnText = document.getElementById('generateBtnText');
  const generateBtnLoading = document.getElementById('generateBtnLoading');
  const aiError = document.getElementById('aiError');
  const progressDiv = document.getElementById('generationProgress');
  const progressText = document.getElementById('progressText');
  const progressBar = document.getElementById('progressBar');

  // Validate inputs
  if (!titleInput || !titleInput.value.trim()) {
    showAIError('Please enter a title for the blog post');
    return;
  }

  // Get API key from config.js or input field
  let apiKey = window.OPENAI_API_KEY && window.OPENAI_API_KEY !== 'your-openai-api-key-here' 
    ? window.OPENAI_API_KEY 
    : (apiKeyInput ? apiKeyInput.value.trim() : '');
  
  if (!apiKey) {
    showAIError('Please enter your OpenAI API Key or add it to config.js file');
    return;
  }

  // Show loading state
  if (generateBtn) {
    generateBtn.disabled = true;
  }
  if (generateBtnText) generateBtnText.style.display = 'none';
  if (generateBtnLoading) generateBtnLoading.style.display = 'inline';
  if (aiError) aiError.style.display = 'none';
  if (progressDiv) progressDiv.style.display = 'block';
  if (progressBar) progressBar.style.width = '10%';
  if (progressText) progressText.textContent = 'Preparing advanced prompt...';

  try {
    // Get options
    const title = titleInput.value.trim();
    const category = categoryInput ? categoryInput.value : 'general';
    const keywords = keywordsInput ? keywordsInput.value.trim() : '';
    const tone = toneInput ? toneInput.value : 'friendly';
    const length = lengthInput ? lengthInput.value : 'long';

    // Update progress
    if (progressBar) progressBar.style.width = '30%';
    if (progressText) progressText.textContent = 'Building professional SEO-optimized prompt...';

    // Build advanced SEO-optimized prompt
    const prompt = buildAdvancedSEOPrompt(title, category, keywords, tone, length);

    // Update progress
    if (progressBar) progressBar.style.width = '50%';
    if (progressText) progressText.textContent = 'Sending request to OpenAI...';

    // Call OpenAI API with token limit (model supports max 4096 completion tokens)
    const maxTokens = length === 'long' ? 4000 : length === 'medium' ? 3000 : 2000;
    
    if (progressBar) progressBar.style.width = '60%';
    if (progressText) progressText.textContent = 'Generating comprehensive article... This may take a minute or two...';

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(tone)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    if (progressBar) progressBar.style.width = '80%';
    if (progressText) progressText.textContent = 'Processing response...';

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'OpenAI API Error');
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    if (progressBar) progressBar.style.width = '90%';
    if (progressText) progressText.textContent = 'Parsing content...';

    // Parse the generated content
    const parsedContent = parseGeneratedContent(generatedContent);

    if (progressBar) progressBar.style.width = '95%';
    if (progressText) progressText.textContent = 'Filling form...';

    // Fill form with generated content
    fillFormWithGeneratedContent(parsedContent, category);

    if (progressBar) progressBar.style.width = '100%';
    if (progressText) progressText.textContent = 'Article created successfully!';

    // Show success message
    showAISuccess('Article created successfully! Please review and edit before publishing.');

    // Hide progress after 2 seconds
    setTimeout(() => {
      if (progressDiv) progressDiv.style.display = 'none';
    }, 2000);

  } catch (error) {
    console.error('Error generating blog post:', error);
    showAIError(`Error creating article: ${error.message}`);
    if (progressDiv) progressDiv.style.display = 'none';
  } finally {
    // Reset button state
    if (generateBtn) {
      generateBtn.disabled = false;
    }
    if (generateBtnText) generateBtnText.style.display = 'inline';
    if (generateBtnLoading) generateBtnLoading.style.display = 'none';
  }
}

/**
 * Get system prompt based on tone
 */
function getSystemPrompt(tone) {
  const tonePrompts = {
    'professional': 'You are an expert professional blog writer specializing in creating SEO-optimized, high-quality content. You write in a formal, authoritative, and professional tone. Your articles are well-researched, comprehensive, and provide valuable insights.',
    'friendly': 'You are an expert blog writer specializing in creating SEO-optimized, engaging content. You write in a friendly, accessible, and conversational tone that makes complex topics easy to understand. Your articles are engaging, well-structured, and reader-friendly.',
    'technical': 'You are an expert technical blog writer specializing in creating detailed, SEO-optimized technical content. You write in a precise, technical, and comprehensive tone. Your articles are thorough, well-documented, and provide in-depth technical insights.',
    'casual': 'You are an expert blog writer specializing in creating SEO-optimized, engaging content. You write in a casual, relaxed, and approachable tone. Your articles are easy to read, entertaining, and maintain high quality while being accessible.'
  };
  
  return tonePrompts[tone] || tonePrompts['friendly'];
}

/**
 * Build advanced SEO-optimized prompt for OpenAI (English only)
 */
function buildAdvancedSEOPrompt(title, category, keywords, tone, length) {
  const categoryNames = {
    'tools-platforms': 'Tools & Platforms',
    'use-cases-examples': 'Use Cases & Real-World Examples',
    'best-practices': 'Best Practices & Methodology',
    'challenges-risks': 'Challenges & Risks',
    'general': 'General'
  };

  const wordCounts = {
    'long': '2500-3500 words',
    'medium': '1500-2500 words',
    'short': '1000-1500 words'
  };

  const wordCount = wordCounts[length] || wordCounts['long'];

  let prompt = `Create a comprehensive SEO-optimized blog post.

Title: "${title}"
Category: ${categoryNames[category] || 'General'}
Length: ${wordCount}

REQUIREMENTS:
1. Length: Minimum ${wordCount}, substantial and valuable
2. SEO: Primary keyword in title, semantic keywords throughout, proper H2/H3 hierarchy, meta description 150-160 chars
3. Structure: Introduction (2-3 paragraphs), Main Body (6-8 H2 sections with 2-4 H3 each), Conclusion (2-3 paragraphs with CTA)
4. Quality: Clear English, active voice, examples, actionable insights, short paragraphs, proper Markdown formatting

RESPONSE FORMAT (JSON only):
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "excerpt": "Compelling 1-2 sentence summary",
  "metaDescription": "150-160 character SEO description",
  "metaKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "content": "Full article in Markdown with headings, formatting, lists"
}`;

  if (keywords && keywords.trim()) {
    prompt += `\nKeywords to include: ${keywords}`;
  }

  prompt += `\n\nWrite ONLY in English. Use Markdown. Return ONLY valid JSON, no additional text.`;

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
      slug: createBlogPostSlug(extractTitle(content)),
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
  
  return 'Article Title';
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
  
  return 'Article excerpt';
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
 * Fill form with generated content
 */
function fillFormWithGeneratedContent(parsedContent, category) {
  if (parsedContent.title && titleInput) {
    titleInput.value = parsedContent.title;
    // Auto-generate slug if not manually edited
    if (slugInput && !slugInput.dataset.manuallyEdited) {
      slugInput.value = parsedContent.slug || createBlogPostSlug(parsedContent.title);
    }
  }
  
  if (parsedContent.excerpt && excerptInput) {
    excerptInput.value = parsedContent.excerpt;
  }
  
  if (parsedContent.metaDescription && metaDescInput) {
    metaDescInput.value = parsedContent.metaDescription;
    updateCharCounter();
  }
  
  if (parsedContent.metaKeywords && metaKeywordsInput) {
    metaKeywordsInput.value = parsedContent.metaKeywords;
  }
  
  if (parsedContent.tags && tagsInput) {
    tagsInput.value = parsedContent.tags;
  }
  
  if (category && categorySelect) {
    categorySelect.value = category;
  }
  
  if (parsedContent.content && contentInput) {
    contentInput.value = parsedContent.content;
  }
  
  // Scroll to form
  const editorSection = document.querySelector('.editor-section');
  if (editorSection) {
    editorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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
    }, 8000);
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
