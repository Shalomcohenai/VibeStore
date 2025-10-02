---
layout: page
title: "Blog Post Editor - Admin"
permalink: /admin/blog-editor/
---

<div class="admin-blog-editor">
  <!-- Header -->
  <div class="editor-header">
    <h1>✍️ Create New Blog Post</h1>
    <div class="header-actions">
      <button id="saveDraftBtn" class="btn btn-secondary">💾 Save Draft</button>
      <button id="previewBtn" class="btn btn-primary">👁️ Preview</button>
      <button id="publishBtn" class="btn btn-success">🚀 Publish</button>
    </div>
  </div>

  <!-- Admin Check Message -->
  <div id="adminCheckMsg" class="loading-message">
    <div class="spinner"></div>
    <p>Checking admin permissions...</p>
  </div>

  <!-- Access Denied Message -->
  <div id="accessDenied" class="error-message" style="display: none;">
    <h2>⛔ Access Denied</h2>
    <p>You must be an admin to access this page.</p>
    <a href="/" class="btn btn-primary">Return to Home</a>
  </div>

  <!-- Editor Form -->
  <div id="editorForm" style="display: none;">
    <form id="blogPostForm">
      
      <!-- Basic Information -->
      <section class="editor-section">
        <h2>📝 Basic Information</h2>
        
        <div class="form-group">
          <label for="title">Title *</label>
          <input type="text" id="title" name="title" required 
                 placeholder="e.g., Cursor AI: A Complete Review for 2025">
          <small>The main title of your blog post</small>
        </div>

        <div class="form-group">
          <label for="slug">URL Slug *</label>
          <input type="text" id="slug" name="slug" required 
                 placeholder="e.g., cursor-ai-review-2025">
          <small>URL-friendly version (auto-generated from title)</small>
        </div>

        <div class="form-group">
          <label for="excerpt">Excerpt *</label>
          <textarea id="excerpt" name="excerpt" rows="3" required
                    placeholder="Short summary that appears in blog listings"></textarea>
          <small>Brief summary (1-2 sentences)</small>
        </div>

        <div class="form-group">
          <label for="author">Author *</label>
          <input type="text" id="author" name="author" value="VibeStore Team" required>
        </div>
      </section>

      <!-- Category & Tags -->
      <section class="editor-section">
        <h2>🏷️ Category & Tags</h2>
        
        <div class="form-group">
          <label for="category">Category *</label>
          <select id="category" name="category" required>
            <option value="">Select a category...</option>
            <option value="tools-platforms">🛠️ Tools & Platforms</option>
            <option value="use-cases-examples">💡 Use Cases & Real-World Examples</option>
            <option value="best-practices">✅ Best Practices & Methodology</option>
            <option value="challenges-risks">⚠️ Challenges & Risks</option>
            <option value="general">📰 General</option>
          </select>
        </div>

        <div class="form-group">
          <label for="tags">Tags</label>
          <input type="text" id="tags" name="tags" 
                 placeholder="e.g., cursor, ai-coding, ide, review (comma-separated)">
          <small>Separate tags with commas</small>
        </div>
      </section>

      <!-- SEO Settings -->
      <section class="editor-section">
        <h2>🔍 SEO Settings</h2>
        
        <div class="form-group">
          <label for="metaDescription">Meta Description *</label>
          <textarea id="metaDescription" name="metaDescription" rows="2" required
                    placeholder="SEO description for search engines (150-160 characters)"></textarea>
          <div class="char-counter">
            <span id="metaDescCounter">0</span> / 160 characters
          </div>
        </div>

        <div class="form-group">
          <label for="metaKeywords">Meta Keywords</label>
          <input type="text" id="metaKeywords" name="metaKeywords" 
                 placeholder="e.g., cursor ai, ai ide, coding assistant">
          <small>Comma-separated keywords for SEO</small>
        </div>
      </section>

      <!-- Featured Image -->
      <section class="editor-section">
        <h2>🖼️ Featured Image</h2>
        
        <div class="form-group">
          <label for="featuredImage">Image URL</label>
          <input type="url" id="featuredImage" name="featuredImage" 
                 placeholder="/img/blog/your-image.jpg or https://...">
          <small>Upload image to /img/blog/ or use external URL</small>
        </div>

        <div id="imagePreviewContainer" style="display: none;">
          <img id="imagePreview" src="" alt="Preview" style="max-width: 300px; border-radius: 8px;">
        </div>
      </section>

      <!-- Content Editor -->
      <section class="editor-section">
        <h2>📄 Content (Markdown)</h2>
        
        <div class="editor-toolbar">
          <button type="button" class="toolbar-btn" data-action="bold" title="Bold">
            <strong>B</strong>
          </button>
          <button type="button" class="toolbar-btn" data-action="italic" title="Italic">
            <em>I</em>
          </button>
          <button type="button" class="toolbar-btn" data-action="heading" title="Heading">
            H
          </button>
          <button type="button" class="toolbar-btn" data-action="link" title="Link">
            🔗
          </button>
          <button type="button" class="toolbar-btn" data-action="list" title="List">
            •
          </button>
          <button type="button" class="toolbar-btn" data-action="code" title="Code">
            &lt;/&gt;
          </button>
        </div>

        <div class="form-group">
          <textarea id="content" name="content" rows="20" required
                    placeholder="Write your blog post content here using Markdown...

# Main Heading

Introduction paragraph...

## Section 1

Your content here...

### Subsection

- Bullet point 1
- Bullet point 2

**Bold text** and *italic text*

[Link text](https://example.com)

---

*Closing thoughts*"></textarea>
          <small>Use Markdown syntax for formatting</small>
        </div>

        <div class="markdown-help">
          <details>
            <summary>📖 Markdown Quick Reference</summary>
            <div class="help-content">
              <code># Heading 1</code><br>
              <code>## Heading 2</code><br>
              <code>**bold**</code> → <strong>bold</strong><br>
              <code>*italic*</code> → <em>italic</em><br>
              <code>[link text](url)</code><br>
              <code>- list item</code><br>
              <code>---</code> → horizontal rule<br>
              <code>`code`</code> → inline code
            </div>
          </details>
        </div>
      </section>

      <!-- Publishing Options -->
      <section class="editor-section">
        <h2>⚙️ Publishing Options</h2>
        
        <div class="form-group">
          <label for="publishDate">Publish Date *</label>
          <input type="date" id="publishDate" name="publishDate" required>
          <small>Date when the post should be published</small>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" id="published" name="published" checked>
            <span>Publish immediately (uncheck to save as draft)</span>
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" id="featured" name="featured">
            <span>Mark as featured post</span>
          </label>
        </div>
      </section>

    </form>
  </div>

  <!-- Preview Modal -->
  <div id="previewModal" class="modal" style="display: none;">
    <div class="modal-content modal-large">
      <div class="modal-header">
        <h2>👁️ Blog Post Preview</h2>
        <button class="modal-close" id="closePreview">&times;</button>
      </div>
      <div class="modal-body">
        <article id="previewContent" class="blog-post-preview">
          <!-- Preview will be rendered here -->
        </article>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" id="closePreviewBtn">Close</button>
        <button class="btn btn-success" id="publishFromPreview">🚀 Publish</button>
      </div>
    </div>
  </div>

  <!-- Success Message -->
  <div id="successModal" class="modal" style="display: none;">
    <div class="modal-content">
      <div class="modal-header">
        <h2>✅ Success!</h2>
      </div>
      <div class="modal-body">
        <p id="successMessage"></p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" id="viewPost">View Post</button>
        <button class="btn btn-secondary" id="createAnother">Create Another</button>
      </div>
    </div>
  </div>

</div>

<style>
.admin-blog-editor {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.editor-header h1 {
  margin: 0;
  font-size: 2rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #6366f1;
  color: white;
}

.btn-primary:hover {
  background: #4f46e5;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  background: #d1d5db;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.loading-message, .error-message {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.editor-section {
  background: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.editor-section h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #111827;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input[type="text"],
.form-group input[type="url"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #6366f1;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.char-counter {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.editor-toolbar {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: #f9fafb;
  border-radius: 8px 8px 0 0;
}

.toolbar-btn {
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  border-color: #6366f1;
}

.markdown-help {
  margin-top: 1rem;
}

.markdown-help summary {
  cursor: pointer;
  color: #6366f1;
  font-weight: 500;
}

.help-content {
  margin-top: 0.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.8;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
}

.modal-large {
  max-width: 900px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
}

.modal-close:hover {
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.blog-post-preview {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.7;
}

.blog-post-preview h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.blog-post-preview h2 {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.blog-post-preview img {
  max-width: 100%;
  border-radius: 8px;
}

.blog-post-preview code {
  background: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .header-actions .btn {
    width: 100%;
  }
}
</style>

<script type="module" src="/assets/js/admin-blog.js"></script>

