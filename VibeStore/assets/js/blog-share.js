// Blog sharing functionality for VibeStore
class VibeStoreShare {
  constructor() {
    this.blogId = this.getBlogId();
    this.blogTitle = this.getBlogTitle();
    this.blogUrl = window.location.href;
    this.init();
  }

  getBlogId() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    return segments[segments.length - 1] || 'unknown';
  }

  getBlogTitle() {
    const titleElement = document.querySelector('h1.post-title, .post-title');
    return titleElement ? titleElement.textContent.trim() : document.title;
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = button.getAttribute('data-platform');
        this.shareToPlatform(platform);
      });
    });
  }

  shareToPlatform(platform) {
    const encodedUrl = encodeURIComponent(this.blogUrl);
    const encodedTitle = encodeURIComponent(this.blogTitle);
    const encodedDescription = encodeURIComponent(this.getBlogDescription());

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'copy':
        this.copyToClipboard();
        return;
      default:
        console.error('Unknown sharing platform:', platform);
        return;
    }

    this.openShareWindow(shareUrl);
    this.trackShare(platform);
  }

  getBlogDescription() {
    const excerptElement = document.querySelector('.post-excerpt');
    if (excerptElement) {
      return excerptElement.textContent.trim();
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      return metaDescription.getAttribute('content');
    }
    
    return 'Check out this article on VibeStore!';
  }

  openShareWindow(url) {
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const shareWindow = window.open(
      url,
      'share',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (shareWindow) {
      shareWindow.focus();
    }
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.blogUrl);
      this.showCopySuccess();
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.fallbackCopyToClipboard();
    }
  }

  fallbackCopyToClipboard() {
    const textArea = document.createElement('textarea');
    textArea.value = this.blogUrl;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.showCopySuccess();
    } catch (error) {
      console.error('Fallback copy failed:', error);
      this.showCopyError();
    } finally {
      document.body.removeChild(textArea);
    }
  }

  showCopySuccess() {
    this.showMessage('Link copied to clipboard!', 'success');
  }

  showCopyError() {
    this.showMessage('Failed to copy link. Please try again.', 'error');
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.share-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `share-message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      ${type === 'error' 
        ? 'background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;'
        : 'background: #d1fae5; color: #059669; border: 1px solid #a7f3d0;'
      }
    `;

    document.body.appendChild(messageDiv);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
          if (messageDiv.parentNode) {
            messageDiv.remove();
          }
        }, 300);
      }
    }, 3000);
  }

  async trackShare(platform) {
    try {
      // In a real implementation, this would save to Firestore
      const shareData = {
        blogId: this.blogId,
        platform: platform,
        url: this.blogUrl,
        timestamp: new Date().toISOString(),
        userId: this.getCurrentUserId() || 'anonymous'
      };

      console.log('Share tracked:', shareData);
      
      // Here you would send the data to your analytics service
      // await this.saveShareToFirestore(shareData);
      
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  }

  getCurrentUserId() {
    // Get current user ID from Firebase auth
    if (window.firebase && window.firebase.auth().currentUser) {
      return window.firebase.auth().currentUser.uid;
    }
    return null;
  }

  // Method to get share statistics (for future use)
  async getShareStats() {
    try {
      // This would query Firestore for share statistics
      // const shares = await firestore.collection('blog_shares')
      //   .where('blogId', '==', this.blogId)
      //   .get();
      
      // return shares.docs.map(doc => doc.data());
      return [];
    } catch (error) {
      console.error('Error getting share stats:', error);
      return [];
    }
  }
}

// Add CSS animations for messages
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize sharing when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.blog-share')) {
    new VibeStoreShare();
  }
});

// Export for use in other modules
window.VibeStoreShare = VibeStoreShare;
