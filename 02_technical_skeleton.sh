#!/usr/bin/env bash
# =====================================================================
# File #2 — technical_skeleton.sh
# Purpose: Generate a complete static Jekyll skeleton for **VibeStore**
#          with clean, mobile-first design, a 3-color palette, and
#          subtle animations. Ready for later Firebase integrations.
#
# Usage:
#   1) Save this file as: technical_skeleton.sh
#   2) Run: bash technical_skeleton.sh
#   3) Install deps: bundle install
#   4) Run dev server: bundle exec jekyll serve
#
# Notes:
# - Everything is in ENGLISH.
# - Fully responsive. Subtle, accessible animations (reduced for users
#   who prefer reduced motion).
# - Palette (3 colors):
#       --c-bg:      #0f172a  (slate-900)
#       --c-primary: #6366f1  (indigo-500)
#       --c-accent:  #22d3ee  (cyan-400)
#   Neutral whites/grays are used for readability (allowed).
# - This is a STATIC skeleton. All external integrations (Firebase,
#   Stripe, Algolia, etc.) will be added later (File #3).
# =====================================================================

set -e

PROJECT_DIR="VibeStore"
echo ">> Creating project directory: $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo ">> Creating folders..."
mkdir -p _includes _layouts assets/css assets/js pages functions security _data img

# -------------------------------------------
# Root config files
# -------------------------------------------
echo ">> Writing _config.yml"
cat > _config.yml <<'YML'
title: VibeStore
tagline: Find a ready-made app for your problem
description: Search across Web apps, Mobile apps, and WhatsApp agents built by the no-code community.
baseurl: ""
url: ""
theme: minima
markdown: kramdown
plugins:
  - jekyll-feed
  - jekyll-seo-tag
defaults:
  - scope:
      path: ""
    values:
      layout: page
collections:
  # Reserved for future content types if needed
  # guides:
  #   output: true
YML

echo ">> Writing Gemfile"
cat > Gemfile <<'RUBY'
source "https://rubygems.org"

ruby ">= 3.0.0"
gem "jekyll", "~> 4.3"
gem "minima", "~> 2.5"
gem "jekyll-feed", "~> 0.17"
gem "jekyll-seo-tag", "~> 2.8"
RUBY

echo ">> Writing .gitignore"
cat > .gitignore <<'IGN'
_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata
.DS_Store
node_modules/
.env
.env.*
firebase.json
.firebaserc
functions/node_modules/
IGN

echo ">> Writing README.md"
cat > README.md <<'MD'
# VibeStore (Static Skeleton)

This is the static Jekyll skeleton for **VibeStore**, a problem-first catalog for:
- Web Apps
- Mobile Apps
- WhatsApp AI Agents

> Design: clean, mobile-first, subtle animations, 3-color palette (bg/primary/accent).  
> Language: English.  
> Integrations (Firebase/Stripe/Algolia) come later.

## Dev
1) Install Ruby & Bundler.  
2) `bundle install`  
3) `bundle exec jekyll serve` → http://127.0.0.1:4000

## Next (later)
- Firebase Auth/Firestore, Redirect & Verified Interaction, Reviews, Favorites & Lists.
- Stripe for Featured, GA4, Newsletter, Anti-spam, Duplicates.
MD

# -------------------------------------------
# Includes & Layouts
# -------------------------------------------
echo ">> Writing _includes/head.html"
cat > _includes/head.html <<'HTML'
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{{ page.title | default: site.title }}</title>
<meta name="description" content="{{ page.excerpt | strip_html | default: site.description }}"/>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

<link rel="icon" href="{{ '/img/favicon.ico' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
HTML

echo ">> Writing _includes/header.html"
cat > _includes/header.html <<'HTML'
<header class="site-header">
  <div class="wrap">
    <a class="site-title hover-lift" href="{{ '/' | relative_url }}">
      <span class="logo-dot" aria-hidden="true"></span>
      {{ site.title }}
    </a>
    <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
      <span class="bar"></span><span class="bar"></span><span class="bar"></span>
    </button>
    <nav class="site-nav" data-nav>
      <a href="{{ '/pages/results'   | relative_url }}">Results</a>
      <a href="{{ '/pages/submit'    | relative_url }}">Submit</a>
      <a href="{{ '/pages/pricing'   | relative_url }}">Promote</a>
      <a href="{{ '/pages/newsletter'| relative_url }}">Newsletter</a>
      <a href="{{ '/pages/guidelines'| relative_url }}">Guidelines</a>
      <a class="btn small" href="{{ '/pages/auth' | relative_url }}">Sign in</a>
    </nav>
  </div>
</header>
HTML

echo ">> Writing _includes/footer.html"
cat > _includes/footer.html <<'HTML'
<footer class="site-footer">
  <div class="wrap">
    <p class="muted">© {{ site.title }} — {{ site.tagline }}</p>
    <nav class="foot-nav">
      <a href="{{ '/pages/terms'   | relative_url }}">Terms</a>
      <a href="{{ '/pages/privacy' | relative_url }}">Privacy</a>
      <a href="mailto:contact@example.com">Report</a>
    </nav>
  </div>
</footer>
HTML

echo ">> Writing _includes/analytics.html"
cat > _includes/analytics.html <<'HTML'
<!-- TODO: Insert GA4 (G-XXXXXXX) when available -->
HTML

echo ">> Writing _includes/card.html"
cat > _includes/card.html <<'HTML'
{%- comment -%}
Reusable app card include.
Inputs (via include.*):
- title, desc, niche (web|mobile|whatsapp), category, platform, image, href, featured (bool), editor (bool), rating (float), reviews (int)
{%- endcomment -%}
<article class="card reveal">
  <div class="thumb">
    <img src="{{ include.image | default: '/img/placeholder.png' | relative_url }}" alt="" loading="lazy" />
  </div>
  <div class="meta">
    <div class="badges">
      <span class="badge {{ include.niche | default: 'web' }}">
        {%- if include.niche == 'mobile' -%}📱 Mobile
        {%- elsif include.niche == 'whatsapp' -%}💬 WhatsApp
        {%- else -%}🌐 Web
        {%- endif -%}
      </span>
      {%- if include.featured -%}<span class="badge featured">Featured</span>{%- endif -%}
      {%- if include.editor -%}<span class="badge editor">Editor's Choice</span>{%- endif -%}
    </div>
    <h3 class="title">{{ include.title | escape }}</h3>
    <p class="desc">{{ include.desc | default: 'App description...' }}</p>
    <p class="tags"><span class="chip">{{ include.category | default: 'Productivity' }}</span><span class="chip">{{ include.platform | default: 'Platform' }}</span></p>
    <p class="rating">
      <span class="stars" aria-label="Rating {{ include.rating | default: 0 }}/5">
        ★★★★★
      </span>
      <span class="score">{{ include.rating | default: 0 }}/5</span>
      <span class="reviews">({{ include.reviews | default: 0 }} reviews)</span>
    </p>
  </div>
  <div class="cta">
    <a class="btn" href="{{ include.href | default: '#' }}">Open</a>
  </div>
</article>
HTML

echo ">> Writing _includes/searchform.html"
cat > _includes/searchform.html <<'HTML'
<form class="search" action="{{ '/pages/results' | relative_url }}" method="get">
  <input class="input" type="text" name="q" placeholder="What problem do you need a solution for?" aria-label="Search problems" />
  <div class="quick-filters">
    <a class="badge" href="{{ '/pages/results?niche=web'      | relative_url }}">🌐 Web</a>
    <a class="badge" href="{{ '/pages/results?niche=mobile'   | relative_url }}">📱 Mobile</a>
    <a class="badge" href="{{ '/pages/results?niche=whatsapp' | relative_url }}">💬 WhatsApp</a>
  </div>
  <button class="btn primary" type="submit">Search</button>
</form>
HTML

echo ">> Writing _layouts/default.html"
cat > _layouts/default.html <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    {% include head.html %}
    {% seo %}
  </head>
  <body class="body">
    <div class="bg-blob" aria-hidden="true"></div>
    {% include header.html %}
    <main class="container">
      {{ content }}
    </main>
    {% include footer.html %}
    {% include analytics.html %}
    <script src="{{ '/assets/js/app.js' | relative_url }}" defer></script>
  </body>
</html>
HTML

echo ">> Writing _layouts/page.html"
cat > _layouts/page.html <<'HTML'
---
layout: default
---
<section class="page">
  <h1 class="page-title">{{ page.title }}</h1>
  <div class="page-content">
    {{ content }}
  </div>
</section>
HTML

# -------------------------------------------
# CSS (design, animations, responsive)
# -------------------------------------------
echo ">> Writing assets/css/main.css"
cat > assets/css/main.css <<'CSS'
/* =========================================================
   VibeStore — main.css
   - Clean, mobile-first UI
   - 3-color palette + neutral whites for readability
   - Subtle, accessible animations
   ========================================================= */

/* Color system (3-core palette) */
:root{
  --c-bg:#0f172a;        /* slate-900 */
  --c-primary:#6366f1;   /* indigo-500 */
  --c-accent:#22d3ee;    /* cyan-400 */
  --c-white:#ffffff;
  --c-text:#0b1220;
  --c-muted:#6b7280;     /* gray-500 */
  --c-line:#e5e7eb;      /* gray-200 */

  --radius:14px;
  --shadow:0 10px 24px rgba(15,23,42,.12);
  --shadow-sm:0 6px 16px rgba(15,23,42,.10);

  --container:1100px;
}

/* Reset + base */
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0;
  font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
  color:var(--c-text);
  background:linear-gradient(180deg, #0f172a 0%, #111827 100%);
  background-attachment: fixed;
}
a{color:inherit}
img{max-width:100%;height:auto;display:block}

/* Motion preferences */
@media (prefers-reduced-motion: reduce){
  *{animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important;}
}

/* Container */
.container{max-width:var(--container);margin:2rem auto;padding:0 1rem}

/* Header */
.site-header{
  position:sticky; top:0; z-index:50;
  background:rgba(15,23,42,.8);
  backdrop-filter: blur(8px);
  border-bottom:1px solid rgba(255,255,255,.06);
}
.site-header .wrap{
  display:flex; align-items:center; justify-content:space-between;
  max-width:var(--container); margin:0 auto; padding:.8rem 1rem;
}
.site-title{color:var(--c-white); text-decoration:none; font-weight:700; display:flex; align-items:center; gap:.5rem}
.logo-dot{width:10px;height:10px;border-radius:999px;background:linear-gradient(45deg,var(--c-primary),var(--c-accent)); display:inline-block; box-shadow:0 0 12px rgba(34,211,238,.5)}
.site-nav{display:flex; gap:1rem; align-items:center}
.site-nav a{color:#e5e7eb; text-decoration:none}
.site-nav a:hover{color:var(--c-white)}
.btn.small{padding:.45rem .8rem; font-size:.9rem}

/* Mobile nav */
.menu-toggle{display:none; background:none; border:0; cursor:pointer}
.menu-toggle .bar{display:block;width:22px;height:2px;background:#e5e7eb;margin:4px 0;border-radius:2px}
@media (max-width: 860px){
  .menu-toggle{display:block}
  .site-nav{position:absolute; top:56px; right:1rem; background:#0b1329; border:1px solid rgba(255,255,255,.06); border-radius:12px; padding:.75rem; display:none; flex-direction:column; min-width:200px; box-shadow: var(--shadow)}
  .site-nav.open{display:flex}
}

/* Footer */
.site-footer{border-top:1px solid rgba(255,255,255,.06); padding:1rem 0; color:#cbd5e1}
.site-footer .wrap{max-width:var(--container); margin:0 auto; padding:0 1rem; display:flex; align-items:center; justify-content:space-between}
.foot-nav a{color:#cbd5e1; margin-left:1rem; text-decoration:none}
.foot-nav a:hover{color:#fff}
.muted{opacity:.8}

/* Hero / Home */
.hero{
  color:#e5e7eb;
  text-align:center;
  padding:5rem 0 3rem;
}
.hero h1{font-size:clamp(1.8rem, 4vw, 3rem); margin:0 0 1rem}
.hero p{opacity:.9; max-width:720px; margin:0 auto 1.5rem}
.bg-blob{
  position:fixed; inset: -20% -10% auto -10%;
  height:60vh; z-index:-1;
  background: radial-gradient(45% 45% at 50% 35%, rgba(99,102,241,.28), transparent 60%),
              radial-gradient(35% 35% at 70% 10%, rgba(34,211,238,.22), transparent 60%);
  filter: blur(44px);
  animation: float 16s ease-in-out infinite alternate;
}
@keyframes float{
  0%{ transform: translateY(0) }
  100%{ transform: translateY(20px) }
}

/* Cards */
.grid{
  display:grid; gap:1rem;
  grid-template-columns: repeat(12, 1fr);
}
.grid-3{
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 960px){
  .grid-3{ grid-template-columns: repeat(2, 1fr) }
}
@media (max-width: 640px){
  .grid-3{ grid-template-columns: 1fr }
}
.card{
  background: #ffffff;
  border:1px solid var(--c-line);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  display:flex; flex-direction:column;
  overflow:hidden;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}
.card:hover{ transform:translateY(-2px); box-shadow: var(--shadow) }

.card .thumb{ aspect-ratio: 16/9; background:#f6f7fb; overflow:hidden}
.card .thumb img{ width:100%; height:100%; object-fit:cover; transform:scale(1.003); transition: transform .6s ease }
.card:hover .thumb img{ transform: scale(1.02) }

.card .meta{ padding:1rem 1rem .5rem }
.card .title{ margin:.2rem 0 .2rem; font-size:1.05rem }
.card .desc{ color:#374151; line-height:1.45 }
.badges{ display:flex; gap:.5rem; margin:.25rem 0 .5rem; flex-wrap:wrap }
.badge{
  display:inline-flex; align-items:center; gap:.35rem;
  padding:.25rem .6rem; border-radius:999px; font-size:.78rem; font-weight:600;
  background:#eef2ff; color:#3730a3; border:1px solid #e0e7ff;
}
.badge.mobile{ background:#ecfeff; color:#155e75; border-color:#cffafe }
.badge.whatsapp{ background:#effdf5; color:#065f46; border-color:#bbf7d0 }
.badge.featured{ background: #f5f3ff; color: #5b21b6; border-color:#ddd6fe }
.badge.editor{ background: #fff7ed; color:#9a3412; border-color:#fed7aa }

.chip{
  display:inline-block; background:#f3f4f6; color:#374151; border:1px solid #e5e7eb;
  border-radius:999px; padding:.2rem .5rem; font-size:.75rem; margin-right:.35rem
}
.rating{ color:#6b7280; font-size:.9rem; display:flex; gap:.35rem; align-items:center; margin:.5rem 0 }
.stars{ color:#f59e0b; letter-spacing:2px }
.card .cta{ padding:0 1rem 1rem; margin-top:auto }

/* Buttons & Inputs */
.btn{
  display:inline-block; text-decoration:none; text-align:center;
  padding:.75rem 1rem; border-radius:12px; border:1px solid transparent;
  background: linear-gradient(90deg, var(--c-primary), var(--c-accent));
  color:white; font-weight:600;
  transition: filter .25s ease, transform .12s ease;
}
.btn:hover{ filter:brightness(1.05) }
.btn:active{ transform: translateY(1px) }
.btn.primary{ background: linear-gradient(90deg, var(--c-primary), var(--c-accent)) }

.input{
  width:100%; padding:1rem 1.1rem; font-size:1rem;
  border-radius:12px; border:1px solid #cbd5e1; outline:0;
  transition:border-color .2s ease, box-shadow .2s ease;
}
.input:focus{ border-color: var(--c-primary); box-shadow:0 0 0 4px rgba(99,102,241,.15) }

.search{
  display:grid; gap:.75rem; max-width: 820px; margin:1rem auto 0;
}
.quick-filters{ display:flex; gap:.5rem; flex-wrap:wrap }
.badge:hover{ filter:brightness(1.05) }

/* Page */
.page-title{ color:#e2e8f0 }
.page-content{ background:#ffffff; border-radius: var(--radius); padding:1rem; border:1px solid var(--c-line) }

/* Animations helpers */
.hover-lift{ transition: transform .2s ease }
.hover-lift:hover{ transform: translateY(-1px) }

.reveal{ opacity:0; transform: translateY(8px); transition: opacity .5s ease, transform .5s ease }
.reveal.visible{ opacity:1; transform: translateY(0) }

/* Utility */
.section{ margin: 2rem 0 }
.center{ text-align:center }
.help{ color:#6b7280; font-size:.9rem }
.hidden{ display:none !important }
CSS

# -------------------------------------------
# JavaScript (UX helpers, nav, reveal on scroll)
# -------------------------------------------
echo ">> Writing assets/js/app.js"
cat > assets/js/app.js <<'JS'
// VibeStore — app.js (static UX helpers)
// - Mobile nav toggle
// - Reveal-on-scroll animations
// - Basic search param helper

(function(){
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('.menu-toggle');
  if (toggle && nav){
    toggle.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Reveal cards on scroll
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12});
  items.forEach(el=> io.observe(el));

  // Helper: read query param
  window.getQueryParam = function(key){
    const url = new URL(window.location.href);
    return url.searchParams.get(key) || "";
  };
})();
JS

# -------------------------------------------
# Data (sample apps for static Results preview)
# -------------------------------------------
echo ">> Writing _data/sample_apps.json"
cat > _data/sample_apps.json <<'JSON'
[
  {
    "title": "Work Attendance Reminder",
    "desc": "Mini web app to remind employees to clock in/out on time.",
    "niche": "web",
    "category": "Productivity",
    "platform": "Bubble",
    "image": "/img/sample-1.jpg",
    "href": "#",
    "featured": true,
    "editor": false,
    "rating": 4.7,
    "reviews": 32
  },
  {
    "title": "Budget Buddy",
    "desc": "Simple personal budget tracker for weekly expenses.",
    "niche": "mobile",
    "category": "Finance",
    "platform": "FlutterFlow",
    "image": "/img/sample-2.jpg",
    "href": "#",
    "featured": false,
    "editor": true,
    "rating": 4.5,
    "reviews": 48
  },
  {
    "title": "Support Agent on WhatsApp",
    "desc": "AI assistant that answers common support requests in WhatsApp.",
    "niche": "whatsapp",
    "category": "Support",
    "platform": "WhatsApp Business API",
    "image": "/img/sample-3.jpg",
    "href": "#",
    "featured": false,
    "editor": false,
    "rating": 4.2,
    "reviews": 21
  }
]
JSON

# -------------------------------------------
# Pages
# -------------------------------------------
echo ">> Writing index.md (Home)"
cat > index.md <<'MD'
---
title: Home
layout: page
permalink: /
---

<section class="hero">
  <h1>Find a ready-made app for your problem</h1>
  <p>Search across Web apps, Mobile apps, and WhatsApp agents built by the no-code community.</p>
  {% include searchform.html %}
</section>

<section class="section">
  <div class="center">
    <p class="help">Try: "attendance reminder", "task management", "budget planner"</p>
  </div>
</section>
MD

echo ">> Writing pages/results.md"
cat > pages/results.md <<'MD'
---
title: Results
layout: page
permalink: /pages/results
---

<div class="section">
  <h2>Results</h2>
  <p class="help">This is a static preview. Later this page will query your database (e.g., Firestore/Algolia) using <code>q</code> and filters.</p>

  <!-- Filter bar (static, visual only for now) -->
  <div class="card" style="padding:1rem; display:flex; gap:.5rem; flex-wrap:wrap; align-items:center">
    <strong>Filters:</strong>
    <a class="badge" href="?niche=web">🌐 Web</a>
    <a class="badge" href="?niche=mobile">📱 Mobile</a>
    <a class="badge" href="?niche=whatsapp">💬 WhatsApp</a>
    <span class="chip">Category ▼</span>
    <span class="chip">Platform ▼</span>
    <span class="chip">Min Rating ▼</span>
    <a class="btn small" href="#">Apply</a>
  </div>

  <!-- Static grid from sample data -->
  <div class="grid grid-3" style="margin-top:1rem">
    {% assign items = site.data.sample_apps %}
    {% for i in items %}
      {% include card.html
        title=i.title desc=i.desc niche=i.niche category=i.category
        platform=i.platform image=i.image href=i.href featured=i.featured
        editor=i.editor rating=i.rating reviews=i.reviews %}
    {% endfor %}
  </div>
</div>
MD

echo ">> Writing pages/app.md"
cat > pages/app.md <<'MD'
---
title: App Detail
layout: page
permalink: /pages/app
---

> Static placeholder. This page will later render a single app with all fields and a primary CTA (Open / Install / Open in WhatsApp), plus ratings & reviews for verified users.

- Title
- Description
- Niche / Category / Platform
- Image/Logo
- CTA
- Average rating & reviews
- Save / Add to List
MD

echo ">> Writing pages/submit.md"
cat > pages/submit.md <<'MD'
---
title: Submit an App
layout: page
permalink: /pages/submit
---

> Static placeholder. In MVP this becomes an authenticated form that creates a `pending` submission for admin review.

**Required fields:**
- Title
- Short Description (≤ 300 chars)
- Niche (web | mobile | whatsapp)
- Category (one of 10)
- Platform (free text)
- Link (URL / App Store / wa.me)
- Image/Logo URL

**Optional:**
- Demo video URL
- Languages
- Notes

**Guidelines (summary):** Be accurate, no spam/illegal content, working links only. Duplicates may be rejected or merged.
MD

echo ">> Writing pages/auth.md"
cat > pages/auth.md <<'MD'
---
title: Sign in / Sign up
layout: page
permalink: /pages/auth
---

> Static placeholder. Later: Email + Password, Google OAuth, Forgot password.

- Sign in
- Sign up
- Forgot password
MD

echo ">> Writing pages/my-tools.md"
cat > pages/my-tools.md <<'MD'
---
title: My Tools
layout: page
permalink: /pages/my-tools
---

> Static placeholder for Favorites & private Lists (create, edit, delete).
MD

echo ">> Writing pages/admin.md"
cat > pages/admin.md <<'MD'
---
title: Admin Review
layout: page
permalink: /pages/admin
---

> Static placeholder for admin moderation (pending/approved/rejected), Featured, Editor's Choice, duplicate flags.
MD

echo ">> Writing pages/pricing.md"
cat > pages/pricing.md <<'MD'
---
title: Promote (Featured)
layout: page
permalink: /pages/pricing
---

**Featured (Monthly):** Get prioritized exposure across search & listings.
- **Featured** badge
- Higher placement in Results
- Visibility in "Trending"
- Optional inclusion in the weekly newsletter

> Billing via Stripe (to be added later).
MD

echo ">> Writing pages/newsletter.md"
cat > pages/newsletter.md <<'MD'
---
title: Newsletter
layout: page
permalink: /pages/newsletter
---

Subscribe to our weekly newsletter: **New, Trending, Editor's Picks**  
<!-- TODO: integrate Buttondown/Mailchimp form -->
MD

echo ">> Writing pages/guidelines.md"
cat > pages/guidelines.md <<'MD'
---
title: Submission Guidelines
layout: page
permalink: /pages/guidelines
---

- List your app for free (Web/Mobile/WhatsApp agents).
- Provide an accurate description and a working link.
- No spam, illegal, or harmful content.
- Duplicates may be rejected or merged.
- We manually review and may edit for clarity.
MD

echo ">> Writing pages/terms.md"
cat > pages/terms.md <<'MD'
---
title: Terms of Service
layout: page
permalink: /pages/terms
---

_Standard Terms placeholder. Replace with your legal text._
MD

echo ">> Writing pages/privacy.md"
cat > pages/privacy.md <<'MD'
---
title: Privacy Policy
layout: page
permalink: /pages/privacy
---

_Privacy Policy placeholder. Replace with your legal text._
MD

# -------------------------------------------
# Placeholder images & extras
# -------------------------------------------
echo ">> Adding placeholder images"
cat > img/placeholder.png <<'PNG'
iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsSAAALEgHS3X78AAAA
B3RJTUUH5AQcEDY8d/Q4bAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggbG92ZSBieSBBSQAA
AABJRU5ErkJggg==
PNG

# -------------------------------------------
# Functions & Security placeholders (for future)
# -------------------------------------------
echo ">> Writing functions/README.md"
cat > functions/README.md <<'MD'
# Cloud Functions (placeholder — to be implemented later)

Planned:
- redirectAndLogClick (logs verified interaction, then 302 to external link)
- approveApp (admin callable)
- createReview (verifies interaction window, then writes review)
- stripeWebhook (activate/deactivate Featured)
- weeklyNewsletterJob (compose & send)
MD

echo ">> Writing security/firestore.rules"
cat > security/firestore.rules <<'RULES'
// Firestore Security Rules (placeholder)
// To be implemented later when Firebase is connected.
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TODO: add rules for apps, reviews, users, lists, promotions, interactions
  }
}
RULES

# -------------------------------------------
# Final tip
# -------------------------------------------
echo
echo "================================================================="
echo " VibeStore static skeleton created."
echo " Next steps:"
echo "   1) bundle install"
echo "   2) bundle exec jekyll serve  # http://127.0.0.1:4000"
echo "   3) Commit & push to GitHub:"
echo "      git init && git add . && git commit -m 'Static skeleton'"
echo "      git remote add origin https://github.com/Shalomcohenai/VibeStore.git"
echo "      git branch -M main && git push -u origin main"
echo "================================================================="