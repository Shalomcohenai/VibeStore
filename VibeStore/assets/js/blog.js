// Blog functionality for VibeStore
class VibeStoreBlog {
  constructor() {
    this.posts = [];
    this.categories = [];
    this.currentCategory = null;
    this.init();
  }

  async init() {
    try {
      await this.loadCategories();
      await this.loadPosts();
      this.renderPosts();
      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing blog:', error);
      this.showError('Failed to load blog content. Please try again later.');
    }
  }

  async loadCategories() {
    try {
      const response = await fetch('/_data/blog-categories.yml');
      if (!response.ok) throw new Error('Failed to load categories');
      
      // For now, we'll use the static categories from the YAML file
      // In a real implementation, this would come from Firestore
      this.categories = [
        {
          id: "vibe-coding",
          name: "Vibe Coding",
          slug: "vibe-coding",
          description: "Discover the art of coding with good vibes and positive energy",
          color: "#6366f1",
          icon: "💻"
        },
        {
          id: "app-development",
          name: "App Development",
          slug: "app-development",
          description: "Tips and insights for building amazing mobile and web apps",
          color: "#8b5cf6",
          icon: "📱"
        },
        {
          id: "tech-trends",
          name: "Tech Trends",
          slug: "tech-trends",
          description: "Latest trends and innovations in technology",
          color: "#06b6d4",
          icon: "🚀"
        },
        {
          id: "developer-life",
          name: "Developer Life",
          slug: "developer-life",
          description: "Stories and experiences from the developer community",
          color: "#10b981",
          icon: "👨‍💻"
        },
        {
          id: "tools-reviews",
          name: "Tools & Reviews",
          slug: "tools-reviews",
          description: "Reviews of development tools and productivity apps",
          color: "#f59e0b",
          icon: "🛠️"
        }
      ];
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  async loadPosts() {
    try {
      // For now, we'll use static posts
      // In a real implementation, this would come from Firestore
      this.posts = [
        {
          id: "art-of-vibe-coding",
          title: "The Art of Vibe Coding: Programming with Positive Energy",
          slug: "art-of-vibe-coding",
          category: "vibe-coding",
          excerpt: "Learn how to transform your coding experience by embracing positive energy and mindful programming practices that lead to better code and happier developers.",
          author: "VibeStore Team",
          featured_image: "/img/blog/vibe-coding.jpg",
          published_at: "2025-01-27",
          tags: ["coding", "mindfulness", "productivity", "developer-wellness"],
          url: "/blog/art-of-vibe-coding/"
        },
        {
          id: "essential-apps-vibe-coder",
          title: "5 Essential Apps Every Vibe Coder Should Have",
          slug: "essential-apps-vibe-coder",
          category: "vibe-coding",
          excerpt: "From mindfulness apps to powerful development tools, here are the essential apps that every vibe coder needs in their toolkit.",
          author: "VibeStore Team",
          featured_image: "/img/blog/essential-apps.jpg",
          published_at: "2025-01-26",
          tags: ["productivity", "apps", "developer-tools", "mindfulness"],
          url: "/blog/essential-apps-vibe-coder/"
        },
        {
          id: "positive-developer-culture",
          title: "Building a Positive Developer Culture: Lessons from Vibe Coding",
          slug: "positive-developer-culture",
          category: "developer-life",
          excerpt: "Discover how vibe coding principles can transform your development team culture, creating an environment where everyone thrives.",
          author: "VibeStore Team",
          featured_image: "/img/blog/developer-culture.jpg",
          published_at: "2025-01-25",
          tags: ["team-culture", "leadership", "collaboration", "workplace-wellness"],
          url: "/blog/positive-developer-culture/"
        }
      ];
    } catch (error) {
      console.error('Error loading posts:', error);
    }
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
    const categoryColor = category ? category.color : '#6366f1';
    
    return `
      <article class="post-card">
        <a href="${post.url}" class="post-card-link">
          <img src="${post.featured_image}" alt="${post.title}" class="post-card-image" onerror="this.src='/img/placeholder.png'">
          <div class="post-card-content">
            <div class="post-card-meta">
              <span class="post-card-category" style="background-color: ${categoryColor}">
                ${category ? category.name : post.category}
              </span>
              <span class="post-card-date">${this.formatDate(post.published_at)}</span>
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
