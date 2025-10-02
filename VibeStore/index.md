---
title: Home
layout: page
permalink: /
---

<section class="hero">
  <h1>Discover the Perfect <span style="position:relative;">App<span style="position:absolute; top:-8px; right:-12px; font-size:0.4em;">⚡</span></span> for Every Problem</h1>
  <p>Search across thousands of no-code solutions built by the community</p>
  {% include searchform.html %}
  
  <!-- Category buttons -->
  <div class="category-buttons">
    <button class="category-btn" data-category="Productivity">Productivity</button>
    <button class="category-btn" data-category="Finance">Finance</button>
    <button class="category-btn" data-category="Support">Support</button>
    <button class="category-btn" data-category="E-commerce">E-commerce</button>
    <button class="category-btn" data-category="Education">Education</button>
    <button class="category-btn" data-category="Personal">Personal</button>
    <button class="category-btn" data-category="Analytics">Analytics</button>
    <button class="category-btn" data-category="Operations">Operations</button>
    <button class="category-btn" data-category="Marketing">Marketing</button>
    <button class="category-btn" data-category="Dev-Tools">Dev-Tools</button>
  </div>
</section>

<!-- More spacing before marketplace -->
<div style="height: 4rem;"></div>

<section class="section">
  <!-- Filter buttons for home page -->
  <div class="marketplace-filters" style="text-align: center; margin-bottom: 3rem;">
    <button class="filter-btn active" data-filter="featured">Featured</button>
    <button class="filter-btn" data-filter="popular">Popular</button>
    <button class="filter-btn" data-filter="editors-choice">Editor's Choice</button>
  </div>
  
  <!-- Sample apps grid -->
  <div class="grid grid-3" id="marketplace-grid">
    <!-- Content will be loaded by JavaScript -->
  </div>
</section>
