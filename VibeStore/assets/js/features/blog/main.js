// Blog functionality for VibeStore
// Firebase imports are handled globally in firebaseConfig.js

class VibeStoreBlog {
  constructor() {
    this.posts = [];
    this.categories = [];
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.init();
  }

  async init() {
    try {
      this.showLoadingSpinner();
      await this.loadCategories();
      await this.loadPosts();
      this.renderCategoryFilters();
      this.renderPosts();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing blog:', error);
      this.showError('Failed to load blog content. Please try again later.');
    }
  }

  showLoadingSpinner() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    container.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    `;
  }

  async loadCategories() {
    try {
      // Updated categories for AI-assisted coding focus
      this.categories = [
        {
          id: "tools-platforms",
          name: "Tools & Platforms",
          slug: "tools-platforms",
          description: "Reviews of AI coding tools, platforms, and version updates (Replit, Cursor, GitHub Copilot, Cloudflare VibeSDK, etc.)",
          color: "#1a1a1a",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>`
        },
        {
          id: "use-cases-examples",
          name: "Use Cases & Real-World Examples",
          slug: "use-cases-examples",
          description: "How people are actually using AI-assisted coding - rapid prototyping, team projects, integrations, success stories and failures",
          color: "#10b981",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="2" x2="12" y2="6"></line>
            <line x1="12" y1="18" x2="12" y2="22"></line>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
          </svg>`
        },
        {
          id: "best-practices",
          name: "Best Practices & Methodology",
          slug: "best-practices",
          description: "Working effectively without compromising quality - code review, validation, testing, dependency management, and version control",
          color: "#4b5563",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
          </svg>`
        },
        {
          id: "challenges-risks",
          name: "Challenges & Risks",
          slug: "challenges-risks",
          description: "Security risks, vendor lock-in, maintainability problems, and critical perspectives on AI-assisted coding",
          color: "#ef4444",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>`
        },
        {
          id: "general",
          name: "General",
          slug: "general",
          description: "News, announcements, community updates, and opinion pieces",
          color: "#06b6d4",
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>`
        }
      ];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadPosts() {
    try {
      // Load both Firestore posts and static Jekyll posts
      const firestorePosts = await this.loadFirestorePosts();
      const staticPosts = this.getStaticPosts();

      // Combine and sort by date
      this.posts = [...firestorePosts, ...staticPosts].sort((a, b) => {
        const dateA = new Date(a.published_at || a.publishDate);
        const dateB = new Date(b.published_at || b.publishDate);
        return dateB - dateA;
      });

    } catch (error) {
      console.error('Error loading posts:', error);
      this.loadStaticPosts();
    }
  }

  async loadFirestorePosts() {
    try {
      // Wait for Firebase to be ready with fallback
      let fb;
      if (window.waitForFirebase) {
        fb = await window.waitForFirebase();
      } else {
        // Fallback: wait for window.$fb to be available
        fb = await this.waitForFirebaseFallback();
      }

      if (!fb || !fb.db || !fb.storeMod) {
        return [];
      }

      // Use Firebase v9+ modular API
      const { collection, query, where, getDocs, orderBy } = fb.storeMod;

      const postsRef = collection(fb.db, 'blog_posts');
      const q = query(
        postsRef,
        where('published', '==', true),
        orderBy('publishDate', 'desc')
      );

      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        url: `/blog/post/?id=${doc.id}`,
        source: 'firestore'
      }));
    } catch (error) {
      console.error('Error loading Firestore posts:', error);
      return [];
    }
  }

  waitForFirebaseFallback() {
    return new Promise((resolve) => {
      const check = () => {
        if (window.$fb && window.$fb.auth && window.$fb.db) {
          resolve(window.$fb);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  getStaticPosts() {
    // Static Jekyll posts
    return [
      {
        id: "art-of-vibe-coding",
        title: "The Art of Vibe Coding: Programming with Positive Energy",
        slug: "art-of-vibe-coding",
        category: "vibe-coding-fundamentals",
        excerpt: "Learn how to transform your coding experience by embracing positive energy and mindful programming practices that lead to better code and happier developers.",
        author: "VibeStore Team",
        published_at: "2025-01-27",
        tags: ["coding", "mindfulness", "productivity", "developer-wellness"],
        url: "/vibe-coding-fundamentals/2025/01/27/art-of-vibe-coding.html",
        source: 'jekyll'
      },
      {
        id: "essential-apps-vibe-coder",
        title: "5 Essential Apps Every Vibe Coder Should Have",
        slug: "essential-apps-vibe-coder",
        category: "vibe-tools-workflow",
        excerpt: "From mindfulness apps to powerful development tools, here are the essential apps that every vibe coder needs in their toolkit.",
        author: "VibeStore Team",
        published_at: "2025-01-26",
        tags: ["productivity", "apps", "developer-tools", "mindfulness"],
        url: "/vibe-tools-workflow/2025/01/26/essential-apps-vibe-coder.html",
        source: 'jekyll'
      },
      {
        id: "positive-developer-culture",
        title: "Building a Positive Developer Culture: Lessons from Vibe Coding",
        slug: "positive-developer-culture",
        category: "positive-tech-culture",
        excerpt: "Discover how vibe coding principles can transform your development team culture, creating an environment where everyone thrives.",
        author: "VibeStore Team",
        published_at: "2025-01-25",
        tags: ["team-culture", "leadership", "collaboration", "workplace-wellness"],
        url: "/positive-tech-culture/2025/01/25/positive-developer-culture.html",
        source: 'jekyll'
      }
    ];
  }

  generatePostUrl(post) {
    // Firestore posts use query parameter, Jekyll posts use static URLs
    if (post.source === 'firestore') {
      return `/blog/post/?id=${post.id}`;
    }

    // Generate URL based on Jekyll's structure
    const date = new Date(post.publishDate || post.published_at);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `/${post.category}/${year}/${month}/${day}/${post.slug}.html`;
  }

  loadStaticPosts() {
    // Fallback to static posts if Firestore is not available
    this.posts = [
      {
        id: "art-of-vibe-coding",
        title: "The Art of Vibe Coding: Programming with Positive Energy",
        slug: "art-of-vibe-coding",
        category: "vibe-coding-fundamentals",
        excerpt: "Learn how to transform your coding experience by embracing positive energy and mindful programming practices that lead to better code and happier developers.",
        author: "VibeStore Team",
        published_at: "2025-01-27",
        tags: ["coding", "mindfulness", "productivity", "developer-wellness"],
        url: "/vibe-coding-fundamentals/2025/01/27/art-of-vibe-coding.html"
      },
      {
        id: "essential-apps-vibe-coder",
        title: "5 Essential Apps Every Vibe Coder Should Have",
        slug: "essential-apps-vibe-coder",
        category: "vibe-tools-workflow",
        excerpt: "From mindfulness apps to powerful development tools, here are the essential apps that every vibe coder needs in their toolkit.",
        author: "VibeStore Team",
        published_at: "2025-01-26",
        tags: ["productivity", "apps", "developer-tools", "mindfulness"],
        url: "/vibe-tools-workflow/2025/01/26/essential-apps-vibe-coder.html"
      },
      {
        id: "positive-developer-culture",
        title: "Building a Positive Developer Culture: Lessons from Vibe Coding",
        slug: "positive-developer-culture",
        category: "positive-tech-culture",
        excerpt: "Discover how vibe coding principles can transform your development team culture, creating an environment where everyone thrives.",
        author: "VibeStore Team",
        published_at: "2025-01-25",
        tags: ["team-culture", "leadership", "collaboration", "workplace-wellness"],
        url: "/positive-tech-culture/2025/01/25/positive-developer-culture.html"
      }
    ];
  }

  renderPosts() {
    const container = document.getElementById('blog-posts-container');
    const noResults = document.getElementById('no-results');
    if (!container) return;

    // Filter posts by category and search
    let filteredPosts = this.posts;

    // Filter by category
    if (this.currentCategory && this.currentCategory !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === this.currentCategory);
    }

    // Filter by search query
    if (this.searchQuery && this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (post.author && post.author.toLowerCase().includes(query))
      );
    }

    // Show/hide no results message
    if (filteredPosts.length === 0) {
      container.style.display = 'none';
      if (noResults) noResults.style.display = 'block';
      return;
    } else {
      container.style.display = 'grid';
      if (noResults) noResults.style.display = 'none';
    }

    container.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
  }

  createPostCard(post) {
    const category = this.categories.find(cat => cat.id === post.category);
    const categoryColor = category ? category.color : '#1a1a1a';
    const categoryIcon = category ? category.icon : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="3" x2="9" y2="21"></line>
      <line x1="15" y1="3" x2="15" y2="21"></line>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="3" y1="15" x2="21" y2="15"></line>
    </svg>`;
    const publishDate = post.published_at || post.publishDate;
    const featuredImage = post.featuredImage || null;
    
    // Generate image or gradient background
    const imageSection = featuredImage 
      ? `<div class="post-card-image" style="background-image: url('${featuredImage}'); background-size: cover; background-position: center;"></div>`
      : `<div class="post-card-image" style="background: linear-gradient(135deg, ${categoryColor}, ${this.lightenColor(categoryColor, 20)});">
          <div class="post-card-icon-wrapper" style="color: white; opacity: 0.9;">${categoryIcon}</div>
        </div>`;

    return `
      <article class="post-card">
        <a href="${post.url}" class="post-card-link">
          ${imageSection}
          <div class="post-card-content">
            <div class="post-card-meta">
              <span class="post-card-category" style="background-color: ${categoryColor}">
                <span class="post-card-category-icon">${categoryIcon}</span>
                <span>${category ? category.name : post.category}</span>
              </span>
              <span class="post-card-date">${this.formatDate(publishDate)}</span>
            </div>
            <h2 class="post-card-title">${post.title}</h2>
            <p class="post-card-excerpt">${post.excerpt || ''}</p>
            <div class="post-card-footer">
              <span class="post-card-author">${post.author || 'VibeStore Team'}</span>
              <span class="read-more">Read more</span>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  lightenColor(color, percent) {
    // Simple color lightening function
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  renderCategoryFilters() {
    const filterContainer = document.querySelector('.blog-categories-filter');
    if (!filterContainer) return;

    // Add category filter buttons
    this.categories.forEach(category => {
      const btn = document.createElement('button');
      btn.className = 'category-filter-btn';
      btn.setAttribute('data-category', category.id);
      btn.innerHTML = `<span class="category-icon-svg">${category.icon}</span><span>${category.name}</span>`;
      btn.addEventListener('click', () => this.filterByCategory(category.id));
      filterContainer.appendChild(btn);
    });
  }

  filterByCategory(categoryId) {
    this.currentCategory = categoryId;
    this.updateActiveCategoryButtons();
    this.renderPosts();
  }

  updateActiveCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-filter-btn');
    categoryButtons.forEach(btn => {
      const categoryId = btn.getAttribute('data-category');
      if (categoryId === this.currentCategory) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  setupEventListeners() {
    // Category filter buttons
    const categoryButtons = document.querySelectorAll('.category-filter-btn');
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const categoryId = btn.getAttribute('data-category');
        this.filterByCategory(categoryId);
      });
    });

    // Search functionality
    const searchInput = document.getElementById('blog-search');
    const searchClear = document.getElementById('search-clear');
    
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        if (this.searchQuery.trim()) {
          if (searchClear) searchClear.style.display = 'flex';
        } else {
          if (searchClear) searchClear.style.display = 'none';
        }
        this.renderPosts();
      });

      // Clear search
      if (searchClear) {
        searchClear.addEventListener('click', () => {
          searchInput.value = '';
          this.searchQuery = '';
          searchClear.style.display = 'none';
          this.renderPosts();
        });
      }
    }
  }

  showError(message) {
    const container = document.getElementById('blog-posts-container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h3>Oops! Something went wrong</h3>
          <p>${message}</p>
          <button onclick="location.reload()" class="btn primary">Try Again</button>
        </div>
      `;
    }
  }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.blog-page')) {
    new VibeStoreBlog();
  }
});

// Export for use in other modules
window.VibeStoreBlog = VibeStoreBlog;
