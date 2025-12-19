/**
 * VibeStore - Animations
 * Handles parallax effects and reveal-on-scroll animations
 */

const INTERSECTION_THRESHOLD = 0.12;
const PARALLAX_SPEED_BASE = 0.5;
const PARALLAX_SPEED_INCREMENT = 0.2;

/**
 * Initialize animations
 * @returns {IntersectionObserver} IntersectionObserver instance for reuse
 */
function initAnimations() {
  // Dynamic background parallax
  const shapes = document.querySelectorAll('.floating-shape');
  if (shapes.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shapes.forEach((shape, index) => {
        const speed = PARALLAX_SPEED_BASE + (index * PARALLAX_SPEED_INCREMENT);
        const yPos = -(scrollY * speed);
        shape.style.transform = `translateY(${yPos}px)`;
      });
    });
  }

  // Reveal cards on scroll
  const items = document.querySelectorAll('.reveal');
  if (items.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: INTERSECTION_THRESHOLD });
    
    items.forEach(el => io.observe(el));
    return io;
  }
  return null;
}

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.initAnimations = initAnimations;
}

