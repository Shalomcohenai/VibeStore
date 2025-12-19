/**
 * Advanced lazy loading for images with intersection observer
 * Includes WebP support and error handling
 */

class LazyImageLoader {
  constructor() {
    this.imageObserver = null;
    this.init();
  }

  init() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      this.fallbackLoading();
      return;
    }

    // Create intersection observer
    this.imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    this.observeImages();
  }

  observeImages() {
    const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"], img.lazy-load');
    lazyImages.forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  loadImage(img) {
    const src = img.dataset.src || img.src;
    const webpSrc = img.dataset.webp;

    // If no data-src, skip
    if (!img.dataset.src) {
      return;
    }

    // Create new image to test loading
    const newImg = new Image();

    newImg.onload = () => {
      // Image loaded successfully
      img.src = src;
      img.classList.add('loaded');
      img.classList.remove('loading', 'lazy-load');
    };

    newImg.onerror = () => {
      // Image failed to load, try fallback
      this.handleImageError(img);
    };

    // Try WebP first if supported
    if (webpSrc && this.supportsWebP()) {
      newImg.src = webpSrc;
    } else {
      newImg.src = src;
    }

    // Add loading class
    img.classList.add('loading');
  }

  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  handleImageError(img) {
    // Try fallback image or show placeholder
    const fallbackSrc = img.dataset.fallback || '/img/placeholder.svg';
    img.src = fallbackSrc;
    img.classList.add('error');
    img.classList.remove('loading');

    // Hide broken image and show placeholder
    if (img.parentElement) {
      const placeholder = img.parentElement.querySelector('.image-placeholder');
      if (placeholder) {
        placeholder.style.display = 'block';
      }
    }
  }

  fallbackLoading() {
    // Fallback for browsers without IntersectionObserver
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  }

  // Method to add new images to observation
  addImages(images) {
    if (this.imageObserver) {
      images.forEach(img => {
        this.imageObserver.observe(img);
      });
    }
  }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.lazyImageLoader = new LazyImageLoader();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyImageLoader;
}
