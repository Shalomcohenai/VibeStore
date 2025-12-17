---
title: Results
layout: page
permalink: /pages/results
---

<div class="results-page">
  <!-- Search Header -->
  <div class="results-header">
    <h1 class="results-title">Search Results</h1>
    <div class="search-stats" id="search-stats">
      <span id="results-count">Loading...</span>
    </div>
  </div>

  <!-- Search Bar -->
  <div class="results-search-container">
    <form class="search" action="{{ '/pages/results' | relative_url }}" method="get">
      <div class="search-container" style="position: relative;">
        <input class="input" type="text" name="q" placeholder="What problem do you need a solution for?" aria-label="Search apps" id="search-input" />
        <button type="submit" class="search-btn" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); padding: 0.8rem 1.8rem; border-radius: 25px; border: none; background: var(--c-primary); color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="search-icon">
            <circle cx="10" cy="10" r="7" stroke="white" stroke-width="2.5" fill="none"/>
            <path d="m17 17l4 4" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </form>
  </div>

  <!-- Filters Section -->
  <div class="filters-section">
    <!-- Niche Filters -->
    <div class="niche-filters">
      <button class="niche-filter active" data-niche="all">All Apps</button>
      <button class="niche-filter" data-niche="web">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 6px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
        </svg>
        Web Apps
      </button>
      <button class="niche-filter" data-niche="mobile">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 6px;">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        Mobile Apps
      </button>
      <button class="niche-filter" data-niche="whatsapp">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle; margin-right: 6px;">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        WhatsApp Agents
      </button>
    </div>

    <!-- Sort Options -->
    <div class="sort-section">
      <label for="sort-select">Sort by:</label>
      <select id="sort-select" class="sort-select">
        <option value="trending">Trending</option>
        <option value="newest">Newest</option>
        <option value="rating">Top Rated</option>
        <option value="popular">Most Popular</option>
      </select>
    </div>
  </div>

  <!-- Results Grid -->
  <div class="results-grid" id="results-grid">
    <!-- Apps will be loaded here dynamically -->
  </div>

  <!-- Loading State -->
  <div class="loading-state" id="loading-state" style="display: none;">
    <div class="loading-spinner"></div>
    <p>Loading apps...</p>
  </div>

  <!-- Empty State -->
  <div class="empty-state" id="empty-state" style="display: none;">
    <div class="empty-icon">🔍</div>
    <h3>No apps found</h3>
    <p>Try adjusting your search or filters to find what you're looking for.</p>
  </div>
</div>
