# VibeStore — Product Requirements Document (PRD)

---

## 0) Executive Summary
**VibeStore** is a problem-first discovery hub for the **Vibe/No-Code ecosystem**.  
It centralizes small niche tools and full-fledged applications into one searchable catalog.  

**Niches supported:**
- 🌐 **Web Apps**
- 📱 **Mobile Apps**
- 💬 **WhatsApp AI Agents**

**User entry point:** a single search bar — “What problem do you need a solution for?”  
The system returns relevant apps across all three niches.  

**Monetization:** Free submissions + optional **Featured listing** (monthly subscription) + **Editor’s Choice** (curated).  
No financial transactions or payments occur inside VibeStore for the end-user apps themselves; all app transactions remain external.  

Entire site language: **English**.  

---

## 1) Vision & Objectives
**Vision:**  
To become the primary **search-first app directory** for the exploding Vibe/No-Code ecosystem, enabling anyone to find a ready-made solution for their problem, whether it’s a micro-utility or a complete product.

**Business/Product Objectives (12–18 months):**
- Build a high-quality, trusted library of ≥ 2,000 approved apps.
- Achieve ≥ 25% CTR from search results to external links.
- Generate stable recurring revenue with ≥ 100 active Featured subscriptions.
- Cultivate a vibrant community: ≥ 5,000 registered users and ≥ 1,000 newsletter subscribers.

**Guiding Principles:**
- **Open access:** guests can freely search, filter, and click through.
- **Curated quality:** every submission goes through manual admin approval.
- **Transparency:** clearly label Featured (paid) and Editor’s Choice (curated).
- **Neutrality:** no third-party ads; only community-submitted apps.

---

## 2) Target Users & Personas
1. **End-User / Problem Solver**  
   - Profile: Small business owner, freelancer, student, hobbyist.  
   - Motivation: Find fast, affordable, lightweight tools to solve immediate problems (attendance reminders, budget tracking, task management).  
   - Needs: Simple search, clear descriptions, ratings/reviews, quick external link.

2. **Maker / No-Code Developer**  
   - Profile: Indie hacker, solopreneur, startup team, hobby developer.  
   - Motivation: Showcase projects, attract users, gather feedback, gain exposure, optionally monetize externally.  
   - Needs: Easy submission form, approval process, fair exposure, ability to promote (Featured).

3. **Admin / Curator**  
   - Profile: Site operator or moderator.  
   - Motivation: Maintain quality, enforce guidelines, promote the best apps.  
   - Needs: Admin dashboard for approvals, duplicate detection, abuse reports, ability to assign badges (Featured, Editor’s Choice).

---

## 3) Scope of MVP
**Included (MVP):**
- Home page with central search bar.
- Unified results from all three niches (Web, Mobile, WhatsApp).
- Filtering and sorting options.
- App detail page with ratings, reviews, and click-through CTA.
- Submission form for registered users → pending → admin approval.
- Ratings (stars 1–5) + text reviews (verified users only).
- Favorites & private Lists.
- Featured (monthly paid promotion).
- Editor’s Choice (curated by admin).
- Weekly newsletter with curated highlights.
- Analytics (Google Analytics 4).
- Anti-spam, duplicate detection.
- Entire interface in English.

**Excluded (Post-MVP / Future):**
- Automatic semantic tagging and insights.
- Public API access.
- Public/shared lists.
- Third-party ads.
- Maker profiles/portfolios.

---

## 4) Taxonomy
- **Niches:** `web`, `mobile`, `whatsapp`  
- **Categories (10 high-level):**  
  - Productivity  
  - Finance  
  - Support  
  - E-commerce  
  - Education  
  - Personal  
  - Analytics  
  - Operations  
  - Marketing  
  - Dev-Tools  
- **Platform:** free text (Bubble, Glide, Adalo, FlutterFlow, etc.)  

---

## 5) Core Pages
1. **Home**
   - Single prominent search bar: “What problem do you need a solution for?”  
   - Quick niche buttons: 🌐 Web / 📱 Mobile / 💬 WhatsApp  
   - Leads to Results page with query.

2. **Results**
   - Unified results list.  
   - Filters: niche, category, platform, rating.  
   - Sorting: Trending, New, Top-rated.  
   - Each card shows title, description snippet, badges (Featured, Editor’s Choice), image/logo.

3. **App Detail**
   - Title, full description, category, platform, image/logo.  
   - CTA button depending on niche:  
     - Web: “Open App” → URL  
     - Mobile: “Install App” → App Store/Google Play link  
     - WhatsApp: “Open in WhatsApp” → wa.me link  
   - Ratings (average stars), reviews, add review (registered users only).  
   - Save/Favorite, Add to List.

4. **Submit App**
   - Only registered users.  
   - Required fields: title, short description, niche, category, platform, link, image/logo.  
   - Optional: demo video, languages, notes.  
   - Submissions default to `pending` status.

5. **Auth**
   - Email + password registration/login.  
   - Google OAuth.  
   - Password reset.

6. **My Tools**
   - Saved favorites.  
   - Private lists (create, edit, delete, rename).

7. **Admin Dashboard**
   - Manage pending submissions.  
   - Approve, reject, edit apps.  
   - Assign Featured or Editor’s Choice badges.  
   - Duplicate detection and resolution.  
   - View flagged apps (reports).

8. **Pricing/Promote**
   - Explains Featured subscription.  
   - Benefits, terms, and pricing.  
   - CTA to purchase.

9. **Newsletter**
   - Weekly curated digest.  
   - Signup form.

10. **Static Pages**
    - Guidelines for submissions.  
    - Terms of Service.  
    - Privacy Policy.  
    - Report Abuse (mailto link).

---

## 6) Core Features
### 6.1 Search & Discovery
- Problem-first search.  
- Unified results with multi-niche filtering.  
- Sorting options.  

### 6.2 App Submission & Approval
- Maker submits via form.  
- Defaults to `pending`.  
- Admin reviews, edits if necessary, approves/rejects.  

### 6.3 Ratings & Reviews
- 1–5 star ratings + optional comment.  
- Only users with **Verified Interaction** (clicked out to app in last 30 days) can review.  
- Spam protection (captcha, daily limits).  

### 6.4 Favorites & Lists
- Save apps.  
- Organize into private lists.  

### 6.5 Featured & Editor’s Choice
- **Featured**: Paid promotion, badge + boosted ranking, expires monthly.  
- **Editor’s Choice**: Curated selection by admins.  

### 6.6 WhatsApp Agents
- Same data model as other apps.  
- CTA: “Open in WhatsApp” via wa.me.  
- No phone number exposure in plain text.

---

## 7) Roles & Permissions
- **Guest**: search, filter, view apps, click out.  
- **Registered**: all guest actions + submit apps, rate, review, save favorites, create lists.  
- **Admin**: approve/reject/edit apps, assign badges, resolve duplicates, manage reports.  

---

## 8) Data Model (Simplified)
**Collections:**
- `apps`  
  - id  
  - title  
  - description  
  - niche  
  - category  
  - platform  
  - link  
  - imageUrl  
  - status (`pending`, `approved`, `rejected`)  
  - featured (boolean + expiry date)  
  - editorChoice (boolean)  
  - createdAt  
  - updatedAt  
- `reviews`  
  - appId  
  - userId  
  - stars (1–5)  
  - text  
  - createdAt  
- `users`  
  - uid  
  - email  
  - displayName  
  - role (`user`, `admin`)  
  - favorites (array)  

---

## 9) Analytics & KPIs
- **GA4 Events:** search, filter, app_view, click_out, review_create, submit_app, login, featured_purchase.  
- **MVP KPIs (90 days):**  
  - 300 approved apps.  
  - 25% CTR from search results → click out.  
  - 20 active Featured apps.  
  - 1,000 newsletter subscribers.  

---

## 10) Anti-Spam & Trust
- Email verification required.  
- Captcha/AppCheck on submissions and reviews.  
- Duplicate detection (hash title+link).  
- Abuse reporting (Report button → admin email).  

---

## 11) Roadmap
**Phase 0 — Skeleton (static):**  
- Build Jekyll skeleton with all pages as placeholders.  

**Phase 1 — MVP:**  
- Firebase Auth, Firestore for apps, basic search/filter.  
- Submit form with admin approval.  
- App detail with ratings/reviews.  
- Favorites & Lists.  
- Featured & Editor’s Choice badges.  
- Weekly newsletter sign-up.  
- Analytics & anti-spam basics.  

**Phase 2 — Monetization & Growth:**  
- Stripe integration for Featured listings.  
- Trending algorithm (CTR, reviews, recency).  
- Automated newsletter generation.  

**Phase 3 — Expansion:**  
- Public/shared lists.  
- Maker profiles & portfolios.  
- Semantic/AI search (Algolia).  
- Public API.  
- Automatic tags/insights layer.  

---

## 12) Risks
- Low-quality submissions → mitigated with manual approval.  
- Spam/fake apps → captchas, rate limits.  
- Poor search results → later solved by semantic search.  
- Reliance on third-party platforms (wa.me, App Stores).  

---

## 13) Glossary
- **Problem-first:** user searches by describing their need/problem, not the app name.  
- **Verified Interaction:** only users who clicked out to the app can leave reviews.  
- **Featured:** paid promotional listing.  
- **Editor’s Choice:** curated badge given by admins.  
- **Niche:** app type (web, mobile, WhatsApp).  

---

## 14) Definition of Done (MVP)
- All core pages implemented and navigable.  
- Search returns unified results with filters.  
- Submission → admin approval → visible in catalog.  
- Click-out tracking works.  
- Ratings/reviews limited to verified users.  
- Favorites & private lists functional.  
- Featured & Editor’s Choice badges visible.  
- GA4 events firing.  
- Newsletter signup working.  
- Anti-spam measures in place.  
- Site fully in English.  
- Accessible, mobile-friendly, performant.  

---
