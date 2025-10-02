// Blog comments functionality for VibeStore
class VibeStoreComments {
  constructor() {
    this.comments = [];
    this.blogId = this.extractBlogId();
    this.init();
  }

  extractBlogId() {
    // Extract blog ID from URL or page data
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    return segments[segments.length - 1] || 'unknown';
  }

  async init() {
    try {
      // Wait for Firebase to be ready with fallback
      if (typeof window.waitForFirebase === 'function') {
        await window.waitForFirebase();
      } else {
        // Fallback: wait for window.$fb to be available
        let attempts = 0;
        while (!window.$fb && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
      }
      
      this.blogId = this.extractBlogId();
      this.comments = [];
      
      await this.loadComments();
      this.renderComments();
      this.setupEventListeners();
      
      console.log('Blog comments initialized for:', this.blogId);
    } catch (error) {
      console.error('Error initializing comments:', error);
      this.showError('Failed to load comments. Please try again later.');
    }
  }

  async loadComments() {
    try {
      if (!window.$fb || !window.$fb.db) {
        console.log('Firebase not available, using static comments');
        this.loadStaticComments();
        return;
      }

      const db = window.$fb.db;
      const commentsSnapshot = await window.$fb.storeMod.getDocs(
        window.$fb.storeMod.query(
          window.$fb.storeMod.collection(db, 'blog_comments'),
          window.$fb.storeMod.where('blogId', '==', this.blogId),
          window.$fb.storeMod.where('approved', '==', true),
          window.$fb.storeMod.orderBy('createdAt', 'desc')
        )
      );

      this.comments = commentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          blogId: data.blogId,
          userId: data.userId,
          user_name: data.user_name,
          content: data.content,
          created_at: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          approved: data.approved
        };
      });

      console.log(`Loaded ${this.comments.length} comments for blog ${this.blogId}`);
    } catch (error) {
      console.error('Error loading comments from Firestore:', error);
      this.loadStaticComments();
    }
  }

  loadStaticComments() {
    // Fallback to static comments if Firestore is not available
    this.comments = [
      {
        id: "comment-1",
        blogId: this.blogId,
        userId: "user-1",
        user_name: "Sarah Chen",
        content: "This is exactly what I needed to read today! The concept of vibe coding really resonates with me. I've been struggling with burnout lately, and these mindfulness techniques seem like they could help.",
        created_at: "2025-01-27T10:30:00Z",
        approved: true
      },
      {
        id: "comment-2",
        blogId: this.blogId,
        userId: "user-2",
        user_name: "Mike Rodriguez",
        content: "Great article! I especially love the part about creating a positive coding environment. I've been using Forest app for a few months now and it's been a game-changer for my focus.",
        created_at: "2025-01-27T14:15:00Z",
        approved: true
      },
      {
        id: "comment-3",
        blogId: this.blogId,
        userId: "user-3",
        user_name: "Alex Kim",
        content: "The section on team culture really hit home. We've been working on improving our code review process, and the tips about focusing on the code rather than the person are spot on.",
        created_at: "2025-01-27T16:45:00Z",
        approved: true
      }
    ];
  }

  renderComments() {
    const container = document.getElementById('comments-container');
    if (!container) return;

    if (this.comments.length === 0) {
      container.innerHTML = `
        <div class="no-comments">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = this.comments
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .map(comment => this.createCommentElement(comment))
      .join('');
  }

  createCommentElement(comment) {
    return `
      <div class="comment" data-comment-id="${comment.id}">
        <div class="comment-header">
          <span class="comment-author">${comment.user_name}</span>
          <span class="comment-date">${this.formatDate(comment.created_at)}</span>
        </div>
        <div class="comment-content">${this.escapeHtml(comment.content)}</div>
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupEventListeners() {
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitComment();
      });
    }
  }

  async submitComment() {
    const contentTextarea = document.getElementById('comment-content');
    const content = contentTextarea.value.trim();

    if (!content) {
      this.showError('Please enter a comment.');
      return;
    }

    // Wait for Firebase to be ready with fallback
    if (typeof window.waitForFirebase === 'function') {
      await window.waitForFirebase();
    } else {
      // Fallback: wait for window.$fb to be available
      let attempts = 0;
      while (!window.$fb && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
    }

    // Check if user is authenticated
    if (!this.isUserAuthenticated()) {
      console.log('User not authenticated. Firebase auth state:', {
        $fb: !!window.$fb,
        auth: !!(window.$fb && window.$fb.auth),
        currentUser: window.$fb && window.$fb.auth ? window.$fb.auth.currentUser : null
      });
      this.showError('Please sign in to post a comment.');
      return;
    }

    try {
      // Show loading state
      const submitBtn = document.querySelector('#comment-form button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Posting...';
      submitBtn.disabled = true;

      if (window.$fb && window.$fb.db) {
        // Save to Firestore
        const db = window.$fb.db;
        const commentData = {
          blogId: this.blogId,
          userId: this.getCurrentUserId(),
          user_name: this.getCurrentUserName(),
          content: content,
          createdAt: window.$fb.storeMod.serverTimestamp(),
          approved: true // Auto-approve for now
        };

        const docRef = await window.$fb.storeMod.addDoc(window.$fb.storeMod.collection(db, 'blog_comments'), commentData);
        
        // Add to local comments array
        const newComment = {
          id: docRef.id,
          ...commentData,
          created_at: new Date().toISOString()
        };
        
        this.comments.unshift(newComment);
        this.renderComments();
        contentTextarea.value = '';
        this.showSuccess('Comment posted successfully!');
        
        console.log('Comment saved to Firestore:', docRef.id);
      } else {
        // Fallback to local storage if Firestore is not available
        const newComment = {
          id: `comment-${Date.now()}`,
          blogId: this.blogId,
          userId: this.getCurrentUserId(),
          user_name: this.getCurrentUserName(),
          content: content,
          created_at: new Date().toISOString(),
          approved: true
        };

        this.comments.unshift(newComment);
        this.renderComments();
        contentTextarea.value = '';
        this.showSuccess('Comment posted successfully!');
      }

    } catch (error) {
      console.error('Error submitting comment:', error);
      this.showError('Failed to post comment. Please try again.');
    } finally {
      // Reset button state
      const submitBtn = document.querySelector('#comment-form button[type="submit"]');
      submitBtn.textContent = 'Post Comment';
      submitBtn.disabled = false;
    }
  }

  isUserAuthenticated() {
    // Check if user is logged in
    try {
      return window.$fb && 
             window.$fb.auth && 
             window.$fb.auth.currentUser !== null;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  getCurrentUserId() {
    // Get current user ID from Firebase auth
    try {
      if (window.$fb && window.$fb.auth && window.$fb.auth.currentUser) {
        return window.$fb.auth.currentUser.uid;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    return 'anonymous';
  }

  getCurrentUserName() {
    // Get current user name from Firebase auth
    try {
      if (window.$fb && window.$fb.auth && window.$fb.auth.currentUser) {
        const user = window.$fb.auth.currentUser;
        return user.displayName || user.email || 'Anonymous User';
      }
    } catch (error) {
      console.error('Error getting user name:', error);
    }
    return 'Anonymous User';
  }

  showError(message) {
    this.showMessage(message, 'error');
  }

  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.comment-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `comment-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
      font-weight: 500;
      ${type === 'error' 
        ? 'background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;'
        : 'background: #d1fae5; color: #059669; border: 1px solid #a7f3d0;'
      }
    `;

    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      commentForm.parentNode.insertBefore(messageDiv, commentForm);
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 5000);
    }
  }
}

// Initialize comments when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.blog-comments')) {
    new VibeStoreComments();
  }
});

// Export for use in other modules
window.VibeStoreComments = VibeStoreComments;
