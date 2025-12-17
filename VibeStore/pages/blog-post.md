---
layout: page
title: "Blog Post"
permalink: /blog/post/
---

<div class="blog-post-container">
  <!-- Loading State -->
  <div id="loadingPost" class="loading-state">
    <div class="spinner"></div>
    <p>טוען כתבה...</p>
  </div>

  <!-- Error State -->
  <div id="postError" class="error-state" style="display: none;">
    <h2>⚠️ כתבה לא נמצאה</h2>
    <p>הכתבה שחיפשת לא קיימת או הוסרה.</p>
    <a href="/blog/" class="btn btn-primary">← חזרה לבלוג</a>
  </div>

  <!-- Blog Post Content -->
  <article id="blogPost" class="blog-post" style="display: none;">
    <!-- Featured Image -->
    <div id="featuredImageContainer" class="featured-image-container" style="display: none;">
      <img id="featuredImage" src="" alt="">
    </div>

    <!-- Post Header -->
    <header class="post-header">
      <div class="post-meta-top">
        <span id="postCategory" class="category-badge"></span>
        <span id="postDate" class="post-date"></span>
      </div>
      
      <h1 id="postTitle" class="post-title"></h1>
      
      <div class="post-meta">
        <span class="author">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
          </svg>
          <span id="postAuthor"></span>
        </span>
        
        <span id="tagsContainer" class="tags"></span>
      </div>
    </header>

    <!-- Post Content -->
    <div id="postContent" class="post-content markdown-body">
      <!-- Content will be rendered here -->
    </div>

    <!-- Post Footer -->
    <footer class="post-footer">
      <div class="share-section">
        <h3>שתף את הכתבה</h3>
        <div class="share-buttons">
          <button id="shareFacebook" class="share-btn facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          
          <button id="shareTwitter" class="share-btn twitter">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
            Twitter
          </button>
          
          <button id="shareLinkedIn" class="share-btn linkedin">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
          
          <button id="shareCopy" class="share-btn copy-link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            העתק קישור
          </button>
        </div>
      </div>

      <div class="navigation-section">
        <a href="/blog/" class="btn btn-secondary">← חזרה לבלוג</a>
      </div>
    </footer>
  </article>
</div>

<style>
.blog-post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid #1a1a1a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.featured-image-container {
  margin-bottom: 2rem;
}

.featured-image-container img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.post-header {
  margin-bottom: 3rem;
}

.post-meta-top {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #1a1a1a;
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.post-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.post-title {
  font-size: 2.5rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #111827;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 0.875rem;
}

.author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.75rem;
}

.post-content {
  line-height: 1.8;
  color: #374151;
  margin-bottom: 3rem;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4 {
  color: #111827;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.markdown-body h2 {
  font-size: 1.875rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.markdown-body h3 {
  font-size: 1.5rem;
}

.markdown-body p {
  margin-bottom: 1.5rem;
}

.markdown-body ul,
.markdown-body ol {
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
}

.markdown-body li {
  margin-bottom: 0.5rem;
}

.markdown-body a {
  color: #1a1a1a;
  text-decoration: none;
  border-bottom: 1px solid #1a1a1a;
}

.markdown-body a:hover {
  color: #4f46e5;
  border-color: #4f46e5;
}

.markdown-body code {
  background: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.875em;
}

.markdown-body pre {
  background: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.markdown-body pre code {
  background: none;
  padding: 0;
  color: inherit;
}

.markdown-body blockquote {
  border-left: 4px solid #1a1a1a;
  padding-left: 1rem;
  margin-left: 0;
  color: #6b7280;
  font-style: italic;
}

.markdown-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 2rem 0;
}

.markdown-body hr {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2rem 0;
}

.post-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.share-section {
  margin-bottom: 2rem;
}

.share-section h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #111827;
}

.share-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.share-btn:hover {
  border-color: #1a1a1a;
  background: #f3f4f6;
}

.share-btn svg {
  flex-shrink: 0;
}

.navigation-section {
  display: flex;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #1a1a1a;
  color: white;
}

.btn-primary:hover {
  background: #4f46e5;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
  border: none;
}

.btn-secondary:hover {
  background: #d1d5db;
}

@media (max-width: 768px) {
  .post-title {
    font-size: 2rem;
  }

  .markdown-body h2 {
    font-size: 1.5rem;
  }

  .markdown-body h3 {
    font-size: 1.25rem;
  }

  .share-buttons {
    flex-direction: column;
  }

  .share-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

<script type="module" src="/assets/js/blog-post.js"></script>

