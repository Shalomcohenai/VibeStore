/**
 * VibeStore - App Filters
 * Handles filter button functionality
 */

/**
 * Initialize filter buttons
 */
function initFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      // Render apps for selected filter
      const filter = btn.dataset.filter;
      if (window.renderApps) {
        window.renderApps(filter);
      }
    });
  });
}

// Export for backward compatibility
if (typeof window !== 'undefined') {
  window.initFilters = initFilters;
}
