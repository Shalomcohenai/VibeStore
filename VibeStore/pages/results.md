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
            <circle cx="10" cy="10" r="3" stroke="white" stroke-width="1" fill="rgba(255,255,255,0.1)"/>
            <path d="m17 17l4 4" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="10" cy="10" r="1" fill="white" opacity="0.6"/>
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
      <button class="niche-filter" data-niche="web">🌐 Web Apps</button>
      <button class="niche-filter" data-niche="mobile">📱 Mobile Apps</button>
      <button class="niche-filter" data-niche="whatsapp">💬 WhatsApp Agents</button>
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
