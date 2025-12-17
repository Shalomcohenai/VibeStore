// Blog functionality for VibeStore
// Firebase imports are handled globally in firebaseConfig.js

class VibeStoreBlog {
  constructor() {
    this.posts = [];
    this.categories = [];
    this.currentCategory = null;
    this.init();
  }

  async init() {
    try {
      this.showLoadingSpinner();
      await this.loadCategories();
      await this.loadPosts();
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
          icon: "🛠️"
        },
        {
          id: "use-cases-examples",
          name: "Use Cases & Real-World Examples",
          slug: "use-cases-examples",
          description: "How people are actually using AI-assisted coding - rapid prototyping, team projects, integrations, success stories and failures",
          color: "#10b981",
          icon: "💡"
        },
        {
          id: "best-practices",
          name: "Best Practices & Methodology",
          slug: "best-practices",
          description: "Working effectively without compromising quality - code review, validation, testing, dependency management, and version control",
          color: "#4b5563",
          icon: "✅"
        },
        {
          id: "challenges-risks",
          name: "Challenges & Risks",
          slug: "challenges-risks",
          description: "Security risks, vendor lock-in, maintainability problems, and critical perspectives on AI-assisted coding",
          color: "#ef4444",
          icon: "⚠️"
        },
        {
          id: "general",
          name: "General",
          slug: "general",
          description: "News, announcements, community updates, and opinion pieces",
          color: "#06b6d4",
          icon: "📰"
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
    if (!container) return;

    const filteredPosts = this.currentCategory
      ? this.posts.filter(post => post.category === this.currentCategory)
      : this.posts;

    if (filteredPosts.length === 0) {
      container.innerHTML = `
        <div class="no-posts">
          <h3>No posts found</h3>
          <p>Try selecting a different category or check back later for new content.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
  }

  createPostCard(post) {
    const category = this.categories.find(cat => cat.id === post.category);
    const categoryColor = category ? category.color : '#1a1a1a';
    const publishDate = post.published_at || post.publishDate;

    return `
      <article class="post-card">
        <a href="${post.url}" class="post-card-link">
          <div class="post-card-content">
            <div class="post-card-meta">
              <span class="post-card-category" style="background-color: ${categoryColor}">
                ${category ? category.icon + ' ' + category.name : post.category}
              </span>
              <span class="post-card-date">${this.formatDate(publishDate)}</span>
            </div>
            <h2 class="post-card-title">${post.title}</h2>
            <p class="post-card-excerpt">${post.excerpt}</p>
            <div class="post-card-footer">
              <span class="post-card-author">By ${post.author}</span>
              <span class="read-more">Read more →</span>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  setupEventListeners() {
    // Category filtering
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const categorySlug = card.getAttribute('href').split('/').pop();
        this.filterByCategory(categorySlug);
      });
    });

    // Search functionality (if search input exists)
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchPosts(e.target.value);
      });
    }
  }

  filterByCategory(categorySlug) {
    const category = this.categories.find(cat => cat.slug === categorySlug);
    this.currentCategory = category ? category.id : null;
    this.renderPosts();
    this.updateActiveCategory(categorySlug);
  }

  updateActiveCategory(activeSlug) {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      const categorySlug = card.getAttribute('href').split('/').pop();
      if (categorySlug === activeSlug) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  searchPosts(query) {
    if (!query.trim()) {
      this.renderPosts();
      return;
    }

    const filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    const container = document.getElementById('blog-posts-container');
    if (!container) return;

    container.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
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
