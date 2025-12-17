---
title: App Detail
layout: page
permalink: /pages/app
---

<style>
.app-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.app-header {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  padding: 0;
  margin-bottom: 1.5rem;
  border: 1px solid var(--c-line);
  overflow: hidden;
  position: relative;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  pointer-events: none;
}

.app-meta {
  display: grid;
  grid-template-columns: 140px 1fr auto;
  gap: 2rem;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
  background: var(--c-primary);
  color: white;
}

.app-icon-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.app-icon {
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: white;
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  overflow: hidden;
  border: 2px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.app-icon:hover {
  transform: scale(1.05) translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.2);
}

.app-info {
  flex: 1;
  color: white;
}

.badges {
  margin-bottom: 1rem;
  animation: fadeInLeft 0.8s ease-out 0.2s both;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.badge {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  margin-bottom: 0.5rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.app-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: white;
  line-height: 1.2;
  text-shadow: 0 2px 8px rgba(0,0,0,0.2);
  animation: fadeInLeft 0.8s ease-out 0.4s both;
}

.app-description {
  color: rgba(255,255,255,0.9);
  font-size: 1.15rem;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  animation: fadeInLeft 0.8s ease-out 0.6s both;
}

.app-tags {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  animation: fadeInLeft 0.8s ease-out 0.8s both;
}

.tag {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.tag:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
}

.rating {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  animation: fadeInLeft 0.8s ease-out 1s both;
}

.rating-stars {
  color: white;
  font-size: 1.4rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.score {
  font-weight: 700;
  color: white;
  font-size: 1.2rem;
}

.reviews {
  color: rgba(255,255,255,0.8);
  font-size: 1rem;
}

.app-actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  animation: fadeInRight 0.8s ease-out 1.2s both;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.users-count-prominent {
  background: rgba(255,255,255,0.95);
  color: var(--c-primary);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  min-width: 80px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.8);
  transition: all 0.3s ease;
  margin-top: 1rem;
  animation: usersCountFloat 3s ease-in-out infinite;
}

@keyframes usersCountFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}

.users-count-prominent:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
}

.users-number {
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.2rem;
}

.users-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
}

.app-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  min-width: 180px;
  width: 100%;
}

.btn {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 180px;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.btn:hover::before {
  left: 100%;
}

/* Action buttons */
.action-btn {
  padding: 1rem 1.5rem;
  min-width: 180px;
  font-size: 0.95rem;
}

/* Pressed/Active states */
.action-btn.pressed {
  transform: translateY(1px) scale(0.98);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  opacity: 0.9;
}

/* Save button active/saved state */
#save-btn.saved,
#save-btn.active {
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent)) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(107, 70, 193, 0.3);
  font-weight: 600;
}

#save-btn.saved:hover,
#save-btn.active:hover {
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent)) !important;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(107, 70, 193, 0.3);
}

/* Add to List button states */
#add-to-list-btn.added {
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent)) !important;
  border: none !important;
  color: white !important;
  box-shadow: 0 4px 16px rgba(107, 70, 193, 0.3);
  font-weight: 600;
}

#add-to-list-btn.added:hover {
  background: linear-gradient(135deg, var(--c-primary), var(--c-accent)) !important;
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(107, 70, 193, 0.3);
}

#add-to-list-btn.added span {
  content: "✅ Added to List";
}

/* Modal styles for Add to List */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--c-text);
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--c-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(0,0,0,0.1);
  color: var(--c-text);
}

.modal-body {
  padding: 0 1.5rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  margin-top: 1rem;
}

.btn-cancel {
  background: #f8fafc;
  color: var(--c-text);
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.btn-confirm {
  background: var(--c-primary);
  color: white;
  border: 1px solid var(--c-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm:hover {
  background: var(--c-accent);
  border-color: var(--c-accent);
}

.btn-confirm:disabled {
  background: #cbd5e1;
  border-color: #cbd5e1;
  cursor: not-allowed;
}

.lists-selection {
  max-height: 300px;
  overflow-y: auto;
}

.list-option {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-option:hover {
  background: #f8fafc;
  border-color: var(--c-primary);
}

.list-option input[type="radio"] {
  margin-right: 0.75rem;
  accent-color: var(--c-primary);
}

.list-option-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-name {
  font-weight: 500;
  color: var(--c-text);
}

.list-count {
  font-size: 0.85rem;
  color: var(--c-muted);
}

.btn-create-new {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-create-new:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

/* Add to List Modal Styles */
.lists-selection {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.list-option {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.list-option:hover {
  background: rgba(107,70,193,0.05);
  border-color: var(--c-primary);
}

.list-option input[type="radio"] {
  margin-right: 0.75rem;
  accent-color: var(--c-primary);
}

.list-option-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-name {
  font-weight: 500;
  color: var(--c-text);
}

.list-count {
  font-size: 0.8rem;
  color: var(--c-muted);
  background: rgba(107,70,193,0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.btn-create-new {
  background: var(--c-primary);
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-create-new:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

/* Social Share Inline */
.social-share-inline {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  animation: fadeInRight 0.8s ease-out 1.4s both;
}

.share-label {
  font-size: 0.9rem;
  color: white;
  font-weight: 600;
  margin-right: 0.5rem;
}

.social-btn-flat {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255,255,255,0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
}

.social-btn-flat svg {
  width: 20px;
  height: 20px;
  color: white;
  stroke: currentColor;
  fill: none;
}

.social-btn-flat:hover {
  background: rgba(255,255,255,0.25);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
}

.social-btn-flat:active {
  transform: translateY(0) scale(0.95);
}

.social-btn-flat.copied {
  background: rgba(34, 197, 94, 0.8);
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.btn.primary {
  background: white;
  color: var(--c-primary);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  font-weight: 700;
}

.btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.2);
  background: #f8f9ff;
}

.btn.secondary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 6px 20px rgba(0,0,0,0.15);
  font-weight: 700;
}

.btn.secondary:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.2);
}

.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0,0,0,0.05);
}

.card h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--c-text);
}

#app-full-description {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  white-space: pre-wrap;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  padding: 0.75rem;
  background: rgba(248,250,252,0.5);
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.05);
}

.detail-item strong {
  display: block;
  color: var(--c-text);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.detail-item span {
  color: var(--c-muted);
}

.review-form {
  background: rgba(248,250,252,0.5);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.05);
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--c-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  transition: border-color 0.3s ease;
}

.form-group textarea::placeholder {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 0.95rem;
  color: #94a3b8;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--c-primary);
}

.star-rating {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.star {
  font-size: 1.5rem;
  color: #e2e8f0;
  cursor: pointer;
  transition: color 0.2s ease;
}

.star.active {
  color: #f59e0b;
}

/* Image Gallery */
.gallery-container {
  position: relative;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

/* Gallery Navigation Buttons */
.gallery-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-nav:hover {
  background: #1a1a1a;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(26, 26, 26, 0.3);
}

.gallery-nav:hover svg {
  color: white;
}

.gallery-nav svg {
  width: 24px;
  height: 24px;
  color: #1a1a1a;
  transition: color 0.3s ease;
}

.gallery-nav.prev {
  left: -24px;
}

.gallery-nav.next {
  right: -24px;
}

.gallery-nav:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.gallery-nav:disabled:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.gallery-nav:disabled:hover svg {
  color: #1a1a1a;
}

.gallery-image {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 aspect ratio */
  overflow: hidden;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gallery-image:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.gallery-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  transition: opacity 0.3s ease;
}

/* Lazy Loading Styles */
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image.loaded {
  opacity: 1;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e0e7ff;
  border-top: 2px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* App Icon Container */
.app-icon-container {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  overflow: hidden;
  border: 1.5px solid #1a1a1a; /* Black stroke for image icons - reduced by half */
}

.app-icon-img {
  transition: opacity 0.3s ease;
}

/* Responsive Images */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.75rem;
  }
  
  .gallery-image {
    padding-bottom: 75%;
  }
  
  .gallery-nav {
    width: 40px;
    height: 40px;
  }
  
  .gallery-nav svg {
    width: 20px;
    height: 20px;
  }
  
  .gallery-nav.prev {
    left: -20px;
  }
  
  .gallery-nav.next {
    right: -20px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.5rem;
  }
}

/* Lightbox for full-size images */
.lightbox {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 10000;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox.active {
  display: flex;
}

.lightbox img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.lightbox-close:hover {
  transform: scale(1.1);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #1a1a1a;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.lightbox-nav:hover {
  background: #1a1a1a;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(26, 26, 26, 0.3);
}

.lightbox-nav:hover svg {
  color: white;
}

.lightbox-nav svg {
  width: 24px;
  height: 24px;
  color: #1a1a1a;
  transition: color 0.3s ease;
}

.lightbox-prev {
  left: 2rem;
}

.lightbox-next {
  right: 2rem;
}

/* Report Button */
.btn-report {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-report:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-1px);
}

.btn-report:active {
  transform: translateY(0);
}

/* Report Modal */
.report-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.report-modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.report-modal h3 {
  margin: 0 0 1rem 0;
  color: var(--c-text);
  font-size: 1.25rem;
  font-weight: 600;
}

.report-options {
  margin-bottom: 1.5rem;
}

.report-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.report-option:hover {
  background: #f8fafc;
  border-color: var(--c-primary);
}

.report-option.selected {
  background: rgba(107, 70, 193, 0.05);
  border-color: var(--c-primary);
}

.report-option input[type="radio"] {
  margin: 0;
  margin-top: 0.1rem;
}

.report-option label {
  margin: 0;
  cursor: pointer;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--c-text);
}

.report-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  margin-top: 0.5rem;
}

.report-textarea:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1);
}

.report-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.btn-cancel {
  background: #f8fafc;
  color: var(--c-text);
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-submit-report {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-submit-report:hover {
  background: #dc2626;
}

.btn-submit-report:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--c-line);
  border-top: 4px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .app-detail {
    padding: 1rem 0.5rem;
  }
  
  .app-header {
    border-radius: 20px;
    margin-bottom: 1rem;
  }
  
  .app-meta {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .app-icon {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
    margin: 0 auto;
  }
  
  .app-icon-section {
    align-items: center;
  }
  
  .app-title {
    font-size: 1.8rem;
  }
  
  .app-description {
    font-size: 1rem;
  }
  
  .app-actions-wrapper {
    align-items: center;
    gap: 1rem;
  }
  
  .app-actions {
    flex-direction: column;
    align-items: stretch;
    min-width: auto;
    width: 100%;
  }
  
  .btn {
    width: 100%;
    min-width: auto;
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }
  
  .users-count-prominent {
    min-width: 80px;
    padding: 0.75rem 1rem;
    margin-top: 0.75rem;
  }
  
  .users-number {
    font-size: 1.2rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .social-share-inline {
    justify-content: center;
    flex-wrap: wrap;
    padding: 0.75rem;
    gap: 0.5rem;
  }
  
  .social-btn-flat {
    width: 36px;
    height: 36px;
  }
  
  .social-btn-flat svg {
    width: 18px;
    height: 18px;
  }
}
</style>

<div class="app-detail" id="app-detail">
  <!-- Loading State -->
  <div class="loading-state" id="loading-state">
    <div style="text-align: center; padding: 4rem;">
      <div class="spinner"></div>
      <p>Loading app details...</p>
    </div>
  </div>

  <!-- Error State -->
  <div class="error-state" id="error-state" style="display: none;">
    <div style="text-align: center; padding: 4rem;">
      <h2>App Not Found</h2>
      <p>The app you're looking for doesn't exist or has been removed.</p>
      <a href="/" class="btn primary">Back to Home</a>
    </div>
  </div>

  <!-- App Content (populated dynamically) -->
  <div class="app-content" id="app-content" style="display: none;">
    
    <!-- App Header -->
    <div class="app-header">
      <div class="app-meta">
        <div class="app-icon-section">
          <div class="app-icon" id="app-icon">
            📱
          </div>
          <!-- Users Count - Below Icon -->
          <div class="users-count-prominent" id="users-count-prominent">
            <div class="users-number" id="users-number">0</div>
            <div class="users-label">clicks</div>
          </div>
        </div>
        
        <div class="app-info">
          <div class="badges" id="app-badges">
            <!-- Badges will be populated by JS -->
          </div>
          <h1 class="app-title" id="app-title">Loading...</h1>
          <p class="app-description" id="app-description">Loading app description...</p>
          
          <div class="app-tags" id="app-tags">
            <!-- Tags will be populated by JS -->
          </div>
          
          <div class="rating" id="app-rating">
            <span class="rating-stars" id="rating-stars">★★★★★</span>
            <span class="score" id="rating-score">0/5</span>
            <span class="reviews" id="rating-count">(0 reviews)</span>
          </div>
        </div>
        
        <div class="app-actions-wrapper">
          <div class="app-actions">
            <a id="app-cta" href="#" target="_blank" class="btn primary action-btn">
              <span>Open App</span>
            </a>
            <button class="btn secondary action-btn" id="save-btn">
              <span>Save</span>
            </button>
            <button class="btn secondary action-btn" id="add-to-list-btn">
              <span>Add to List</span>
            </button>
          </div>
          
          <!-- Social Share Buttons - Below action buttons -->
          <div class="social-share-inline">
            <span class="share-label">Share:</span>
            <button class="social-btn-flat facebook" id="share-facebook" title="Share on Facebook">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </button>
            <button class="social-btn-flat twitter" id="share-twitter" title="Share on Twitter/X">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </button>
            <button class="social-btn-flat linkedin" id="share-linkedin" title="Share on LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </button>
            <button class="social-btn-flat whatsapp" id="share-whatsapp" title="Share on WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
            </button>
            <button class="social-btn-flat copy-link" id="share-copy" title="Copy link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- App Description -->
    <div class="card">
      <h2>About this app</h2>
      <p id="app-full-description">Loading detailed description...</p>
      
      <!-- Image Gallery -->
      <div id="image-gallery" style="display: none; margin-top: 2rem;">
        <h3 style="font-size: 1.2rem; font-weight: 600; margin: 0 0 1rem 0; color: var(--c-text);">Screenshots</h3>
        <div class="gallery-container">
          <button class="gallery-nav prev" id="gallery-prev" style="display: none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <div id="gallery-images" class="gallery-grid"></div>
          <button class="gallery-nav next" id="gallery-next" style="display: none;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- App Details -->
    <div class="card">
      <h2>App Information</h2>
      <div class="details-grid">
        <div class="detail-item">
          <strong>Category:</strong>
          <span id="app-category">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Platform:</strong>
          <span id="app-platform">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Niche:</strong>
          <span id="app-niche">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Submitted:</strong>
          <span id="app-created">Loading...</span>
        </div>
        <div class="detail-item">
          <strong>Clicks:</strong>
          <span id="app-users-count">Loading...</span>
        </div>
        <div class="detail-item" id="demo-item" style="display: none;">
          <strong>Demo Video:</strong>
          <span id="app-demo">Loading...</span>
        </div>
        <div class="detail-item" id="languages-item" style="display: none;">
          <strong>Languages:</strong>
          <span id="app-languages">Loading...</span>
        </div>
        <div class="detail-item" id="notes-item" style="display: none;">
          <strong>Additional Notes:</strong>
          <span id="app-notes">Loading...</span>
        </div>
        <div class="detail-item" id="pricing-item" style="display: none;">
          <strong>Pricing:</strong>
          <span id="app-pricing">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="card">
      <h2>Reviews & Ratings</h2>
      <div id="reviews-content">
        <p>Reviews will be loaded here...</p>
      </div>
      
      <!-- Add Review (for authenticated users) -->
      <div id="add-review-section" style="margin-top: 2rem; display: none;">
        <h3>Add Your Review</h3>
        <form id="review-form" class="review-form">
          <div class="form-group">
            <label>Rating:</label>
            <div class="star-rating" id="star-rating">
              <span class="star" data-rating="1">★</span>
              <span class="star" data-rating="2">★</span>
              <span class="star" data-rating="3">★</span>
              <span class="star" data-rating="4">★</span>
              <span class="star" data-rating="5">★</span>
            </div>
          </div>
          <div class="form-group">
            <label for="review-text">Your Review:</label>
            <textarea id="review-text" rows="4" placeholder="Share your experience with this app..."></textarea>
          </div>
          <button type="submit" class="btn primary">Submit Review</button>
        </form>
      </div>
    </div>

  </div>
  
  <!-- Report Button -->
  <div class="report-section" style="text-align: center; margin-top: 3rem; padding: 2rem;">
    <button id="report-btn" class="btn-report" title="Report this app">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      Report App
    </button>
  </div>
</div>

<style>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--c-line);
  border-top: 4px solid var(--c-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-detail .card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,.05);
}

.badges {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.badge.web {
  background: rgba(59, 130, 246, 0.2);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge.mobile {
  background: rgba(16, 185, 129, 0.2);
  color: white;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge.whatsapp {
  background: rgba(37, 211, 102, 0.2);
  color: white;
  border: 1px solid rgba(37, 211, 102, 0.3);
}

.badge.featured {
  background: rgba(245, 158, 11, 0.2);
  color: white;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.badge.editor {
  background: rgba(26, 26, 26, 0.2);
  color: white;
  border: 1px solid rgba(26, 26, 26, 0.3);
}

.chip {
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #374151;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
  font-size: 1.5rem;
  color: #d1d5db;
  cursor: pointer;
}

.star-rating span:hover,
.star-rating span.active {
  color: #fbbf24;
}

@media (max-width: 768px) {
  .app-meta {
    grid-template-columns: 1fr !important;
    text-align: center;
    gap: 1.5rem;
    padding: 1.5rem;
  }
  
  .app-actions {
    flex-direction: column !important;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .users-count-prominent {
    min-width: 80px;
    padding: 0.75rem 1rem;
    margin-top: 0.75rem;
  }
  
  .users-number {
    font-size: 1.2rem;
  }
  
  .social-share-inline {
    justify-content: center;
    flex-wrap: wrap;
    padding: 0.75rem;
    gap: 0.5rem;
  }
}
</style>

<script type="module">
// Wait for Firebase to initialize
const waitForFirebase = () => new Promise(resolve => {
  const check = () => {
    if (window.$fb && window.$fb.auth && window.$fb.storeMod && window.$fb.db) {
      resolve(window.$fb);
    } else {
      setTimeout(check, 100);
    }
  };
  check();
});

// Get app ID from URL
const urlParams = new URLSearchParams(window.location.search);
const appId = urlParams.get('id');

// App data
let currentApp = null;
let currentUser = null;

async function loadAppDetails() {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const appContent = document.getElementById('app-content');

  if (!appId) {
    // Show demo content if no app ID provided
    showDemoContent();
    return;
  }

  try {
    const { db, storeMod } = await waitForFirebase();
    const { doc, getDoc, collection, query, where, getDocs } = storeMod;

    // First try to fetch by document ID
    let appRef = doc(db, 'apps', appId);
    let appDoc = await getDoc(appRef);

    // If not found by ID, try to find by custom ID field
    if (!appDoc.exists()) {
      const appsQuery = query(collection(db, 'apps'), where('id', '==', appId));
      const appsSnapshot = await getDocs(appsQuery);
      
      if (!appsSnapshot.empty) {
        appDoc = appsSnapshot.docs[0];
      }
    }

    if (!appDoc.exists()) {
      showError('App not found');
      return;
    }

    currentApp = { id: appDoc.id, ...appDoc.data() };
    
    // Update page SEO dynamically
    updatePageSEO(currentApp);
    
    // Render app content
    renderAppContent(currentApp);
    
    // Show content, hide loading
    if (loadingState) loadingState.style.display = 'none';
    if (appContent) appContent.style.display = 'block';

    // Load reviews
    loadReviews();

  } catch (error) {
    console.error('Error loading app:', error);
    showError('Failed to load app details');
  }
}

function showError(message) {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  
  if (loadingState) loadingState.style.display = 'none';
  if (errorState) {
    errorState.style.display = 'block';
    
    if (message !== 'App not found') {
      const h2 = errorState.querySelector('h2');
      const p = errorState.querySelector('p');
      if (h2) h2.textContent = 'Error Loading App';
      if (p) p.textContent = message;
    }
  }
}

function showDemoContent() {
  const loadingState = document.getElementById('loading-state');
  const appContent = document.getElementById('app-content');
  
  if (loadingState) loadingState.style.display = 'none';
  if (appContent) {
    appContent.style.display = 'block';
    
    // Show demo app content
    renderAppContent({
      title: 'Demo App',
      description: 'This is a demo app to show the interface',
      longDescription: 'This is a demo app to show the interface. The buttons should be visible below.',
      category: 'Demo',
      platform: 'Web',
      niche: 'web',
      rating_avg: 4.5,
      rating_count: 10,
      usersCount: 100,
      createdAt: { toDate: () => new Date() },
      tags: ['demo', 'example'],
      link: '#'
    });
  }
}

function updatePageSEO(app) {
  // Update document title
  document.title = `${app.title || 'Untitled App'} - VibeStore`;
  
  // Use long description for SEO if available, otherwise fall back to short description
  const seoDescription = app.longDescription || app.description || 'Discover this app on VibeStore';
  // Truncate to 160 characters for SEO
  const truncatedDescription = seoDescription.length > 160 ? seoDescription.substring(0, 157) + '...' : seoDescription;
  
  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = truncatedDescription;
  }
  
  // Update Open Graph tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = `${app.title || 'Untitled App'} - VibeStore`;
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = truncatedDescription;
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) ogImage.content = app.imageUrl || app.image || '/img/placeholder.svg';
}

function renderAppContent(app) {
  // Basic info
  const titleEl = document.getElementById('app-title');
  const descEl = document.getElementById('app-description');
  const fullDescEl = document.getElementById('app-full-description');
  const categoryEl = document.getElementById('app-category');
  const platformEl = document.getElementById('app-platform');
  const nicheEl = document.getElementById('app-niche');
  
  if (titleEl) titleEl.textContent = app.title || 'Untitled App';
  if (descEl) descEl.textContent = app.description || 'No description available';
  // Use longDescription if available, otherwise fall back to description
  const longDescription = app.longDescription || app.description || 'No detailed description available';
  // Preserve line breaks and formatting
  if (fullDescEl) {
    fullDescEl.innerHTML = longDescription.replace(/\n/g, '<br>');
    fullDescEl.style.whiteSpace = 'pre-wrap';
  }
  if (categoryEl) categoryEl.textContent = app.category || 'Uncategorized';
  if (platformEl) platformEl.textContent = app.platform || 'Not specified';
  if (nicheEl) nicheEl.textContent = app.niche || 'Not specified';
  
  // Additional information fields
  const demoEl = document.getElementById('app-demo');
  const demoItem = document.getElementById('demo-item');
  if (app.demo && app.demo.trim()) {
    if (demoEl) {
      // Check if it's a YouTube, Vimeo, or Loom URL and create appropriate link
      const demoUrl = app.demo.trim();
      if (demoUrl.includes('youtube.com') || demoUrl.includes('youtu.be')) {
        demoEl.innerHTML = `<a href="${demoUrl}" target="_blank" rel="noopener">Watch Demo Video</a>`;
      } else if (demoUrl.includes('vimeo.com')) {
        demoEl.innerHTML = `<a href="${demoUrl}" target="_blank" rel="noopener">Watch Demo Video</a>`;
      } else if (demoUrl.includes('loom.com')) {
        demoEl.innerHTML = `<a href="${demoUrl}" target="_blank" rel="noopener">Watch Demo Video</a>`;
      } else {
        demoEl.innerHTML = `<a href="${demoUrl}" target="_blank" rel="noopener">View Demo</a>`;
      }
    }
    if (demoItem) demoItem.style.display = 'block';
  }
  
  const languagesEl = document.getElementById('app-languages');
  const languagesItem = document.getElementById('languages-item');
  if (app.languages && app.languages.trim()) {
    if (languagesEl) languagesEl.textContent = app.languages.trim();
    if (languagesItem) languagesItem.style.display = 'block';
  }
  
  const notesEl = document.getElementById('app-notes');
  const notesItem = document.getElementById('notes-item');
  if (app.notes && app.notes.trim()) {
    if (notesEl) {
      // Preserve line breaks in notes
      notesEl.innerHTML = app.notes.trim().replace(/\n/g, '<br>');
    }
    if (notesItem) notesItem.style.display = 'block';
  }
  
  // Pricing information
  const pricingEl = document.getElementById('app-pricing');
  const pricingItem = document.getElementById('pricing-item');
  if (app.pricingAmount && app.pricingAmount > 0) {
    if (pricingEl) {
      const amount = app.pricingAmount;
      const type = app.pricingType || 'one-time';
      const typeLabels = {
        'monthly': '/month',
        'yearly': '/year',
        'one-time': 'one-time',
        'per-use': '/use'
      };
      const typeLabel = typeLabels[type] || '';
      pricingEl.textContent = `$${amount.toFixed(2)} ${typeLabel}`;
    }
    if (pricingItem) pricingItem.style.display = 'block';
  } else if (app.pricingAmount === 0 || (app.pricingAmount === null && app.pricingType)) {
    // Free app
    if (pricingEl) {
      pricingEl.textContent = 'Free';
    }
    if (pricingItem) pricingItem.style.display = 'block';
  }
  
  // Render image gallery if screenshots exist
  renderImageGallery(app.screenshots || app.images || []);
  
  // Image with lazy loading
  const appImage = document.getElementById('app-icon');
  if (appImage) {
    const imageUrl = app.imageUrl || app.image || '/img/placeholder.svg';
    appImage.innerHTML = `
      <div class="app-icon-container">
        <img 
          data-src="${imageUrl}" 
          alt="${app.title} Icon" 
          class="lazy-image app-icon-img"
          loading="lazy"
          onerror="this.src='/img/placeholder.svg'"
          style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;"
        >
        <div class="image-placeholder">
          <div class="loading-spinner"></div>
        </div>
      </div>
    `;
    
    // Initialize lazy loading for app icon
    initializeLazyLoading();
  }
  
  // Created date
  const createdDate = app.createdAt?.toDate ? app.createdAt.toDate().toLocaleDateString() : 'Unknown';
  const createdEl = document.getElementById('app-created');
  if (createdEl) createdEl.textContent = createdDate;
  
  // Users count
  const usersCount = app.usersCount || 0;
  const usersCountEl = document.getElementById('app-users-count');
  if (usersCountEl) usersCountEl.textContent = `${usersCount} clicks`;
  
  // Badges
  const badgesContainer = document.getElementById('app-badges');
  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    
    // Niche badge
    if (app.niche && typeof app.niche === 'string') {
      const nicheBadge = document.createElement('span');
      nicheBadge.className = `badge ${app.niche}`;
      nicheBadge.textContent = `${getNicheIcon(app.niche)} ${app.niche.charAt(0).toUpperCase() + app.niche.slice(1)}`;
      badgesContainer.appendChild(nicheBadge);
    }
    
    // Featured badge
    if (app.featured?.active) {
      const featuredBadge = document.createElement('span');
      featuredBadge.className = 'badge featured';
      featuredBadge.textContent = 'Featured';
      badgesContainer.appendChild(featuredBadge);
    }
    
    // Editor's Choice badge
    if (app.editor_pick) {
      const editorBadge = document.createElement('span');
      editorBadge.className = 'badge editor';
      editorBadge.textContent = "Editor's Choice";
      badgesContainer.appendChild(editorBadge);
    }
  }
  
  // Tags
  const tagsContainer = document.getElementById('app-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = '';
    if (app.tags && app.tags.length > 0) {
      app.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'chip';
        tagSpan.textContent = tag;
        tagsContainer.appendChild(tagSpan);
      });
    } else {
      const categoryChip = document.createElement('span');
      categoryChip.className = 'chip';
      categoryChip.textContent = app.category;
      tagsContainer.appendChild(categoryChip);
    }
  }
  
  // Rating
  const rating = app.rating_avg || 0;
  const ratingCount = app.rating_count || 0;
  
  const starsEl = document.getElementById('rating-stars');
  const scoreEl = document.getElementById('rating-score');
  const countEl = document.getElementById('rating-count');
  
  if (starsEl) starsEl.textContent = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  if (scoreEl) scoreEl.textContent = `${rating.toFixed(1)}/5`;
  if (countEl) countEl.textContent = `(${ratingCount} reviews)`;
  
  // Update users count in rating section if it exists
  const usersCountInRating = app.usersCount || 0;
  const usersCountElInRating = document.querySelector('.users-count');
  if (usersCountElInRating) {
    const numberEl = usersCountElInRating.querySelector('.number');
    if (numberEl) {
      numberEl.textContent = usersCountInRating;
    }
  }
  
  // Update users count in prominent display
  const usersNumberEl = document.getElementById('users-number');
  if (usersNumberEl) {
    usersNumberEl.textContent = usersCountInRating;
  }
  
  // CTA Button
  const ctaButton = document.getElementById('app-cta');
  if (ctaButton) {
    const appId = new URLSearchParams(window.location.search).get('id');
    if (appId) {
      ctaButton.href = `https://redirectandlogclick-dz75ziy5sq-uc.a.run.app?appId=${appId}`;
    } else {
      ctaButton.href = app.link || '#';
    }
    ctaButton.innerHTML = `<span>${getNicheCTA(app.niche)}</span>`;
  }
}

function getNicheIcon(niche) {
  if (!niche || typeof niche !== 'string') return '🔗';
  
  const icons = {
    web: '🌐',
    mobile: '📱',
    whatsapp: '💬'
  };
  return icons[niche] || '🔗';
}

function getNicheCTA(niche) {
  if (!niche || typeof niche !== 'string') return 'Open';
  
  const ctas = {
    web: 'Open App',
    mobile: 'Open App',
    whatsapp: 'Open in WhatsApp'
  };
  return ctas[niche] || 'Open';
}

// Render image gallery
function renderImageGallery(images) {
  const galleryContainer = document.getElementById('image-gallery');
  const galleryImages = document.getElementById('gallery-images');
  const prevButton = document.getElementById('gallery-prev');
  const nextButton = document.getElementById('gallery-next');
  
  if (!galleryContainer || !galleryImages) return;
  
  // Always show gallery
  galleryContainer.style.display = 'block';
  
  // Filter and limit to 5 images
  const validImages = (images || []).filter(img => img && typeof img === 'string').slice(0, 5);
  
  if (validImages.length === 0) {
    // Show empty state
    galleryImages.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--c-muted); font-style: italic;">No screenshots available</div>';
    // Hide navigation buttons
    if (prevButton) prevButton.style.display = 'none';
    if (nextButton) nextButton.style.display = 'none';
    return;
  }
  
  // Hide navigation buttons by default - they will only show in full-screen mode
  if (prevButton) prevButton.style.display = 'none';
  if (nextButton) nextButton.style.display = 'none';
  
  // Initialize gallery navigation for full-screen mode
  if (validImages.length > 1) {
    initializeGalleryNavigation(validImages);
  }
  
  // Render images with lazy loading and responsive images - show all images
  galleryImages.innerHTML = validImages.map((imageUrl, index) => `
    <div class="gallery-image" onclick="openLightbox('${imageUrl}')">
      <div class="image-container">
        <img 
          data-src="${imageUrl}" 
          alt="Screenshot ${index + 1}" 
          class="lazy-image"
          loading="lazy"
          onerror="this.src='/img/placeholder.png'"
        >
        <div class="image-placeholder">
          <div class="loading-spinner"></div>
        </div>
      </div>
    </div>
  `).join('');
  
  // Initialize lazy loading for gallery images
  initializeLazyLoading();
}

// Gallery Navigation
let currentImageIndex = 0;
let galleryImages = [];

function initializeGalleryNavigation(images) {
  galleryImages = images;
  currentImageIndex = 0;
  
  const prevButton = document.getElementById('gallery-prev');
  const nextButton = document.getElementById('gallery-next');
  const galleryImagesEl = document.getElementById('gallery-images');
  
  if (!prevButton || !nextButton || !galleryImagesEl) return;
  
  // Remove existing event listeners by cloning elements
  const newPrevButton = prevButton.cloneNode(true);
  const newNextButton = nextButton.cloneNode(true);
  prevButton.parentNode.replaceChild(newPrevButton, prevButton);
  nextButton.parentNode.replaceChild(newNextButton, nextButton);
  
  // Add event listeners to new buttons
  newPrevButton.addEventListener('click', () => navigateGallery(-1));
  newNextButton.addEventListener('click', () => navigateGallery(1));
  
  // Update button states
  updateGalleryButtons();
}

function navigateGallery(direction) {
  currentImageIndex += direction;
  
  // Wrap around if needed
  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  } else if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }
  
  // Update the displayed image
  updateGalleryDisplay();
  updateGalleryButtons();
}

function updateGalleryDisplay() {
  const galleryImagesEl = document.getElementById('gallery-images');
  if (!galleryImagesEl || galleryImages.length === 0) return;
  
  // Hide all images
  const images = galleryImagesEl.querySelectorAll('.gallery-image');
  images.forEach(img => img.style.display = 'none');
  
  // Show current image
  if (images[currentImageIndex]) {
    images[currentImageIndex].style.display = 'block';
  }
}

function updateGalleryButtons() {
  const prevButton = document.getElementById('gallery-prev');
  const nextButton = document.getElementById('gallery-next');
  
  if (!prevButton || !nextButton) return;
  
  // For carousel-style navigation, we always show both buttons
  // but we could disable them at boundaries if needed
  prevButton.disabled = false;
  nextButton.disabled = false;
}

// Lightbox functionality
window.openLightbox = function(imageUrl) {
  // Create lightbox if it doesn't exist
  let lightbox = document.getElementById('image-lightbox');
  
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" onclick="closeLightbox()">×</button>
      <button class="lightbox-nav lightbox-prev" onclick="navigateLightbox(-1)" style="display: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
      </button>
      <img src="" alt="Full size image">
      <button class="lightbox-nav lightbox-next" onclick="navigateLightbox(1)" style="display: none;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9,18 15,12 9,6"></polyline>
        </svg>
      </button>
    `;
    document.body.appendChild(lightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    });
  }
  
  // Find current image index
  const currentIndex = galleryImages.findIndex(img => img === imageUrl);
  window.currentLightboxIndex = currentIndex;
  
  // Show navigation buttons if there are multiple images
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  if (galleryImages.length > 1) {
    prevBtn.style.display = 'flex';
    nextBtn.style.display = 'flex';
  } else {
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
  }
  
  const img = lightbox.querySelector('img');
  img.src = imageUrl;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

window.closeLightbox = function() {
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

window.navigateLightbox = function(direction) {
  if (!galleryImages || galleryImages.length <= 1) return;
  
  window.currentLightboxIndex += direction;
  
  // Wrap around if needed
  if (window.currentLightboxIndex < 0) {
    window.currentLightboxIndex = galleryImages.length - 1;
  } else if (window.currentLightboxIndex >= galleryImages.length) {
    window.currentLightboxIndex = 0;
  }
  
  // Update the image
  const lightbox = document.getElementById('image-lightbox');
  if (lightbox) {
    const img = lightbox.querySelector('img');
    img.src = galleryImages[window.currentLightboxIndex];
  }
}

// Lazy Loading Implementation
function initializeLazyLoading() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately
    const lazyImages = document.querySelectorAll('.lazy-image[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy-image');
    });
    return;
  }

  // Create intersection observer
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px', // Start loading 50px before image comes into view
    threshold: 0.01
  });

  // Observe all lazy images
  const lazyImages = document.querySelectorAll('.lazy-image[data-src]');
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

// Load image with progressive enhancement
function loadImage(img) {
  const src = img.dataset.src;
  if (!src) return;

  // Show loading state
  const placeholder = img.parentElement.querySelector('.image-placeholder');
  if (placeholder) {
    placeholder.style.display = 'flex';
  }

  // Create new image to preload
  const newImg = new Image();
  
  newImg.onload = () => {
    // Image loaded successfully
    img.src = src;
    img.classList.remove('lazy-image');
    img.classList.add('loaded');
    
    // Hide loading placeholder
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    // Add fade-in effect
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      img.style.opacity = '1';
    }, 10);
  };
  
  newImg.onerror = () => {
    // Image failed to load
    img.src = '/img/placeholder.png';
    img.classList.remove('lazy-image');
    img.classList.add('error');
    
    // Hide loading placeholder
    if (placeholder) {
      placeholder.style.display = 'none';
    }
    
    console.warn('Failed to load image:', src);
  };
  
  // Start loading
  newImg.src = src;
}

// Responsive Images Helper
function getResponsiveImageSrc(imageUrl, size = 'medium') {
  // Check if image has processed versions
  if (imageUrl.includes('processed/')) {
    // Extract base URL and add size parameter
    const baseUrl = imageUrl.split('_')[0];
    return `${baseUrl}_${size}.jpg`;
  }
  
  // Fallback to original image
  return imageUrl;
}

// Progressive Loading for Gallery
function enableProgressiveLoading() {
  const galleryImages = document.querySelectorAll('.gallery-image img');
  
  galleryImages.forEach((img, index) => {
    // Add delay for progressive loading
    setTimeout(() => {
      if (img.dataset.src) {
        loadImage(img);
      }
    }, index * 100); // 100ms delay between each image
  });
}

// Report functionality
function initializeReportButton() {
  const reportBtn = document.getElementById('report-btn');
  if (!reportBtn) return;
  
  reportBtn.addEventListener('click', () => {
    showReportModal();
  });
}

function showReportModal() {
  const modal = document.createElement('div');
  modal.className = 'report-modal';
  modal.innerHTML = `
    <div class="report-modal-content">
      <h3>Report App</h3>
      <p style="color: var(--c-muted); margin-bottom: 1.5rem; font-size: 0.9rem;">
        Help us keep VibeStore safe by reporting issues with this app.
      </p>
      
      <div class="report-options">
        <div class="report-option" data-type="not-working">
          <input type="radio" id="not-working" name="report-type" value="not-working">
          <label for="not-working">
            <strong>App doesn't work or doesn't match description</strong><br>
            <span style="color: var(--c-muted); font-size: 0.85rem;">The app is broken, doesn't load, or the description is misleading</span>
          </label>
        </div>
        
        <div class="report-option" data-type="scam">
          <input type="radio" id="scam" name="report-type" value="scam">
          <label for="scam">
            <strong>App contains fraud or scam</strong><br>
            <span style="color: var(--c-muted); font-size: 0.85rem;">The app is fraudulent, contains malware, or is a scam</span>
          </label>
        </div>
        
        <div class="report-option" data-type="other">
          <input type="radio" id="other" name="report-type" value="other">
          <label for="other">
            <strong>Other</strong><br>
            <span style="color: var(--c-muted); font-size: 0.85rem;">Something else that violates our guidelines</span>
          </label>
        </div>
      </div>
      
      <div id="other-details" style="display: none;">
        <label for="report-details" style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--c-text);">
          Please provide more details:
        </label>
        <textarea 
          id="report-details" 
          class="report-textarea" 
          placeholder="Describe the issue in detail..."
          maxlength="1000"
        ></textarea>
        <div style="text-align: right; margin-top: 0.25rem; font-size: 0.8rem; color: var(--c-muted);">
          <span id="char-count">0</span>/1000 characters
        </div>
      </div>
      
      <div class="report-actions">
        <button class="btn-cancel" onclick="closeReportModal()">Cancel</button>
        <button class="btn-submit-report" id="submit-report-btn" onclick="submitReport()" disabled>
          Submit Report
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Add event listeners
  const reportOptions = modal.querySelectorAll('.report-option');
  const otherDetails = modal.querySelector('#other-details');
  const reportDetails = modal.querySelector('#report-details');
  const charCount = modal.querySelector('#char-count');
  const submitBtn = modal.querySelector('#submit-report-btn');
  
  reportOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from all options
      reportOptions.forEach(opt => opt.classList.remove('selected'));
      // Add selected class to clicked option
      option.classList.add('selected');
      
      // Check the radio button
      const radio = option.querySelector('input[type="radio"]');
      radio.checked = true;
      
      // Show/hide other details
      if (radio.value === 'other') {
        otherDetails.style.display = 'block';
        reportDetails.required = true;
      } else {
        otherDetails.style.display = 'none';
        reportDetails.required = false;
        reportDetails.value = '';
        charCount.textContent = '0';
      }
      
      // Enable submit button
      submitBtn.disabled = false;
    });
  });
  
  // Character counter for textarea
  reportDetails.addEventListener('input', () => {
    const count = reportDetails.value.length;
    charCount.textContent = count;
    
    if (count > 1000) {
      reportDetails.value = reportDetails.value.substring(0, 1000);
      charCount.textContent = '1000';
    }
  });
  
  // Close modal on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeReportModal();
    }
  });
  
  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeReportModal();
    }
  });
}

function closeReportModal() {
  const modal = document.querySelector('.report-modal');
  if (modal) {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  }
}

// Make functions globally available
window.closeReportModal = closeReportModal;
window.submitReport = submitReport;

async function submitReport() {
  const modal = document.querySelector('.report-modal');
  if (!modal) return;
  
  const selectedType = modal.querySelector('input[name="report-type"]:checked');
  const details = modal.querySelector('#report-details').value.trim();
  
  if (!selectedType) {
    alert('Please select a report type');
    return;
  }
  
  if (selectedType.value === 'other' && !details) {
    alert('Please provide details for your report');
    return;
  }
  
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) {
    alert('Error: No app selected');
    return;
  }
  
  try {
    const { db, storeMod } = await waitForFirebase();
    const { collection, addDoc, serverTimestamp } = storeMod;
    
    const reportData = {
      appId: appId,
      appTitle: currentApp?.title || 'Unknown App',
      reportType: selectedType.value,
      details: details || null,
      reportedBy: currentUser?.uid || 'anonymous',
      reportedByEmail: currentUser?.email || null,
      status: 'pending',
      createdAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      adminNotes: null
    };
    
    await addDoc(collection(db, 'reports'), reportData);
    
    // Close modal and show success message
    closeReportModal();
    alert('Thank you for your report. We will review it and take appropriate action.');
    
  } catch (error) {
    console.error('Error submitting report:', error);
    alert('Failed to submit report. Please try again.');
  }
}

async function loadReviews() {
  const reviewsContent = document.getElementById('reviews-content');
  if (!reviewsContent) return;
  
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) {
    reviewsContent.innerHTML = '<p style="color: var(--c-muted);">No app selected.</p>';
    return;
  }
  
  try {
    const { db, storeMod } = await waitForFirebase();
    const { collection, query, where, orderBy, getDocs, limit } = storeMod;
    
    // Load reviews for this app
    const reviewsQuery = query(
      collection(db, 'reviews'),
      where('appId', '==', appId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const reviewsSnapshot = await getDocs(reviewsQuery);
    
    if (reviewsSnapshot.empty) {
      reviewsContent.innerHTML = '<p style="color: var(--c-muted); text-align: center; padding: 2rem;">No reviews yet. Be the first to review this app!</p>';
      return;
    }
    
    let reviewsHTML = '<div class="reviews-list">';
    
    reviewsSnapshot.forEach((doc) => {
      const review = doc.data();
      const stars = '★'.repeat(review.stars) + '☆'.repeat(5 - review.stars);
      const date = review.createdAt?.toDate?.() || new Date();
      const dateStr = date.toLocaleDateString();
      
      reviewsHTML += `
        <div class="review-item" style="border-bottom: 1px solid #e2e8f0; padding: 1rem 0; margin-bottom: 1rem;">
          <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div class="review-stars" style="color: #f59e0b; font-size: 1.1rem;">${stars}</div>
            <div class="review-date" style="color: var(--c-muted); font-size: 0.9rem;">${dateStr}</div>
          </div>
          ${review.text ? `<div class="review-text" style="color: var(--c-text); line-height: 1.5;">${review.text}</div>` : ''}
        </div>
      `;
    });
    
    reviewsHTML += '</div>';
    reviewsContent.innerHTML = reviewsHTML;
    
  } catch (error) {
    console.error('Error loading reviews:', error);
    reviewsContent.innerHTML = '<p style="color: #ef4444;">Error loading reviews. Please try again later.</p>';
  }
}

// Check authentication state
async function checkAuthState() {
  const { auth } = await waitForFirebase();
  
  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    
    if (user) {
      // Show add review section for authenticated users
      const addReviewSection = document.getElementById('add-review-section');
      if (addReviewSection) {
        addReviewSection.style.display = 'block';
      }
      
      // Wait for FavoritesManager to initialize
      if (window.favoritesManager) {
        // Add listener for favorites changes
        window.favoritesManager.addListener(() => {
          updateButtonStates();
        });
      }
      
      // Update button states
      updateButtonStates();
      
    }
  });
}

// Update button states based on current user data (using FavoritesManager)
async function updateButtonStates() {
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId || !currentUser) return;

  try {
    // Update save button state
    const saveButton = document.getElementById('save-btn');
    if (saveButton && window.favoritesManager && window.favoritesManager.initialized) {
      const isFavorited = window.favoritesManager.isFavorited(appId);
      
      // Update button classes only (keep text the same)
      if (isFavorited) {
        saveButton.classList.add('saved', 'active');
      } else {
        saveButton.classList.remove('saved', 'active');
      }
      
    }

    // Update add to list button state
    if (window.listsManager && window.listsManager.initialized) {
      if (window.ListUI) {
        const listUI = new window.ListUI(window.listsManager);
        listUI.updateAddToListButton(appId);
      } else {
        updateAddToListButton(appId);
      }
    }
    
  } catch (error) {
    console.error('Error updating button states:', error);
  }
}


// Initialize star rating (global variable to persist rating)
let selectedRating = 0;

function initializeStarRating() {
  const stars = document.querySelectorAll('.star-rating .star');
  
  // Clear existing event listeners by cloning the elements
  stars.forEach(star => {
    const newStar = star.cloneNode(true);
    star.parentNode.replaceChild(newStar, star);
  });
  
  // Get the new stars after cloning
  const newStars = document.querySelectorAll('.star-rating .star');
  
  newStars.forEach((star, index) => {
    star.addEventListener('click', () => {
      selectedRating = index + 1;
      updateStarDisplay();
    });
    
    star.addEventListener('mouseenter', () => {
      highlightStars(index + 1);
    });
  });
  
  const starContainer = document.querySelector('.star-rating');
  if (starContainer) {
    // Remove existing event listener
    starContainer.removeEventListener('mouseleave', updateStarDisplay);
    // Add new event listener
    starContainer.addEventListener('mouseleave', () => {
      updateStarDisplay();
    });
  }
  
  function highlightStars(rating) {
    newStars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }
  
  function updateStarDisplay() {
    highlightStars(selectedRating);
  }
  
  // Initialize display
  updateStarDisplay();
  
  return () => selectedRating;
}

// Reset star rating
function resetStarRating() {
  selectedRating = 0;
  const stars = document.querySelectorAll('.star-rating .star');
  stars.forEach(star => {
    star.classList.remove('active');
  });
}

// Submit review
async function submitReview() {
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) {
    alert('No app selected');
    return;
  }
  
  if (!currentUser) {
    alert('Please sign in to submit a review');
    return;
  }
  
  const rating = selectedRating; // Use global variable
  const text = document.getElementById('review-text')?.value?.trim() || '';
  
  
  if (rating === 0) {
    alert('Please select a rating');
    return;
  }
  
        try {
          const { db, storeMod } = await waitForFirebase();
          const { doc, getDoc, setDoc, collection, addDoc, runTransaction, serverTimestamp } = storeMod;

          // Check if user has verified interaction
          const interactionRef = doc(db, 'interactions', `${currentUser.uid}_${appId}`);
          const interactionSnap = await getDoc(interactionRef);
          
          if (!interactionSnap.exists()) {
            throw new Error('No verified interaction');
          }

          const interactionData = interactionSnap.data();
          const lastClickAt = interactionData.lastClickAt?.toDate?.() || new Date(0);
          const daysSinceClick = (Date.now() - lastClickAt.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceClick > 30) {
            throw new Error('Verification expired');
          }

          // Check if user already reviewed this app
          const { query, where, getDocs } = storeMod;
          const existingReviewQuery = query(
            collection(db, 'reviews'),
            where('appId', '==', appId),
            where('userId', '==', currentUser.uid)
          );
          const existingReviews = await getDocs(existingReviewQuery);

          if (!existingReviews.empty) {
            alert('You have already reviewed this app.');
            return;
          }

          // Add review to Firestore
          const reviewData = {
            appId,
            userId: currentUser.uid,
            stars: rating,
            text: text,
            createdAt: serverTimestamp()
          };

          await addDoc(collection(db, 'reviews'), reviewData);

          // Update app rating aggregates using transaction
          const appRef = doc(db, 'apps', appId);
          await runTransaction(db, async (transaction) => {
            const appSnap = await transaction.get(appRef);
            if (!appSnap.exists()) {
              throw new Error('App not found');
            }

            const appData = appSnap.data();
            const currentRatingCount = appData.rating_count || 0;
            const currentRatingSum = appData.rating_sum || 0;
            
            const newRatingCount = currentRatingCount + 1;
            const newRatingSum = currentRatingSum + rating;
            const newRatingAvg = Math.round((newRatingSum / newRatingCount) * 10) / 10;

            transaction.update(appRef, {
              rating_count: newRatingCount,
              rating_sum: newRatingSum,
              rating_avg: newRatingAvg
            });
          });

          // Reload reviews and app data
          await loadReviews();
          await loadAppDetails();

          // Clear form
          document.getElementById('review-text').value = '';
          resetStarRating();

          alert('Review submitted successfully!');

        } catch (error) {
          console.error('Error submitting review:', error);

          // Handle specific error messages
          if (error.message.includes('No verified interaction')) {
            alert('You must click "Open" on this app first before you can review it. Please try the app and then come back to review it.');
          } else if (error.message.includes('Verification expired')) {
            alert('Your verification has expired. Please click "Open" on this app again and then try to review it.');
          } else {
            alert('Error submitting review. Please try again.');
          }
        }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadAppDetails();
  checkAuthState();
  initializeButtons();
  initializeStarRating(); // Initialize star rating system
  initializeReportButton(); // Initialize report button
  
  // Initialize review form
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitReview();
    });
  }
});


// Initialize button event listeners
function initializeButtons() {
  // Open button - redirect to app link with logging
  const openButton = document.getElementById('app-cta');
  if (openButton) {
    openButton.addEventListener('click', async (e) => {
      // Add pressed state
      openButton.classList.add('pressed');
      setTimeout(() => openButton.classList.remove('pressed'), 150);
      
      const appId = new URLSearchParams(window.location.search).get('id');
      if (!appId) {
        console.warn('❌ No app ID found in URL');
        return;
      }
      
      // Track the click using session tracker
      if (window.trackAppClick) {
        const canTrack = window.trackAppClick(appId, 'app_detail');
        if (canTrack) {
          console.log('📊 App click tracked successfully for app:', appId);
        } else {
          console.log('⏰ Click not tracked due to cooldown for app:', appId);
        }
      } else {
        console.warn('⚠️ Session tracker not available');
      }
      
      // Continue with existing logic for authenticated users
      if (currentUser) {
        console.log('🔗 Open App button clicked for app:', appId, 'by user:', currentUser.uid);
      } else {
        console.log('🔗 Open App button clicked for app:', appId, 'by anonymous user');
      }
      
      // Update the href with session ID for redirectAndLogClick
      if (window.sessionTracker && window.sessionTracker.sessionId) {
        const sessionId = window.sessionTracker.sessionId;
        const redirectUrl = `https://redirectandlogclick-dz75ziy5sq-uc.a.run.app?appId=${appId}&sessionId=${sessionId}`;
        
        // Get auth token if user is logged in
        if (window.$fb && window.$fb.auth && window.$fb.auth.currentUser) {
          try {
            const token = await window.$fb.auth.currentUser.getIdToken();
            openButton.href = `${redirectUrl}&token=${encodeURIComponent(token)}`;
          } catch (error) {
            console.warn('Failed to get auth token:', error);
            openButton.href = redirectUrl;
          }
        } else {
          openButton.href = redirectUrl;
        }
      }
      
      // Let the default link behavior happen
    });
  }

  // Save button - add to favorites (using FavoritesManager)
  const saveButton = document.getElementById('save-btn');
  if (saveButton) {
    saveButton.addEventListener('click', async () => {
      // Add pressed state
      saveButton.classList.add('pressed');
      setTimeout(() => saveButton.classList.remove('pressed'), 150);
      
      if (!currentUser) {
        alert('Please sign in to save apps to favorites');
        return;
      }

      const appId = new URLSearchParams(window.location.search).get('id');
      if (!appId) {
        alert('No app selected');
        return;
      }

      try {
        // Use the FavoritesManager
        if (window.favoritesManager && window.favoritesManager.initialized) {
          await window.favoritesManager.toggleFavorite(appId);
          // Update button state (will be called automatically via listener, but we can do it immediately too)
          updateButtonStates();
        } else {
          alert('Favorites system not initialized. Please refresh the page.');
        }
      } catch (error) {
        console.error('Error saving to favorites:', error);
        alert('Error saving to favorites. Please try again.');
      }
    });
  }

  // Add to List button functionality
  const addToListButton = document.getElementById('add-to-list-btn');
  if (addToListButton) {
    addToListButton.addEventListener('click', async () => {
      // Add pressed state
      addToListButton.classList.add('pressed');
      setTimeout(() => addToListButton.classList.remove('pressed'), 150);
      
      if (!currentUser) {
        alert('Please sign in to add apps to lists');
        return;
      }

      const appId = new URLSearchParams(window.location.search).get('id');
      if (!appId) {
        alert('No app selected');
        return;
      }

      try {
        // Initialize lists manager if not already done
        if (!window.listsManager) {
          alert('Lists system not available. Please refresh the page.');
          return;
        }

        if (!window.listsManager.initialized) {
          await window.listsManager.initialize(currentUser);
        }

        // Show add to list modal
        if (window.ListUI) {
          const listUI = new window.ListUI(window.listsManager);
          listUI.showAddToListModal(appId);
        } else {
          showAddToListModal(appId);
        }
      } catch (error) {
        console.error('Error adding to list:', error);
        alert('Error adding to list. Please try again.');
      }
    });
  }

}


// Helper function to check if app is favorited (using FavoritesManager)
function checkIfFavorited(appId) {
  if (window.favoritesManager && window.favoritesManager.initialized) {
    return window.favoritesManager.isFavorited(appId);
  }
  return false;
}

// Show add to list modal
function showAddToListModal(appId) {
  const lists = window.listsManager.getLists();
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>Add to List</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="lists-selection">
          ${lists.length === 0 ? 
            '<p style="text-align: center; color: var(--c-muted); margin: 2rem 0;">No lists yet. Create your first list in your profile.</p>' :
            lists.map(list => `
              <label class="list-option">
                <input type="radio" name="selectedList" value="${list.id}">
                <div class="list-option-content">
                  <span class="list-name">${list.name}</span>
                  <span class="list-count">${list.appCount} apps</span>
                </div>
              </label>
            `).join('')
          }
        </div>
        <div style="text-align: center; margin-top: 1rem;">
          <a href="/pages/profile" class="btn-create-new" style="display: inline-block; padding: 0.5rem 1rem; background: var(--c-primary); color: white; text-decoration: none; border-radius: 8px;">Create New List</a>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel">Cancel</button>
        <button class="btn-confirm" id="confirm-add-to-list" ${lists.length === 0 ? 'disabled' : ''}>Add to List</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Event listeners
  modal.querySelector('.modal-close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('.btn-cancel').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  modal.querySelector('#confirm-add-to-list').addEventListener('click', async () => {
    const selectedList = modal.querySelector('input[name="selectedList"]:checked');
    if (selectedList) {
      try {
        await window.listsManager.addAppToList(selectedList.value, appId);
        updateAddToListButton(appId);
        document.body.removeChild(modal);
      } catch (error) {
        console.error('Error adding app to list:', error);
        alert('Error adding app to list. Please try again.');
      }
    }
  });
}

// Update add to list button state
function updateAddToListButton(appId) {
  const addToListButton = document.getElementById('add-to-list-btn');
  if (!addToListButton || !window.listsManager || !window.listsManager.initialized) return;
  
  const listIds = window.listsManager.isAppInLists(appId);
  
  if (listIds.length > 0) {
    addToListButton.classList.add('added');
    addToListButton.querySelector('span').textContent = 'Added to List';
  } else {
    addToListButton.classList.remove('added');
    addToListButton.querySelector('span').textContent = 'Add to List';
  }
}

// Social sharing functionality
function initializeSocialSharing() {
  const appId = new URLSearchParams(window.location.search).get('id');
  if (!appId) return;
  
  // Get app data for sharing
  const getShareData = () => {
    const title = currentApp?.title || 'Check out this app';
    const description = currentApp?.description || '';
    const url = window.location.href;
    
    return { title, description, url };
  };
  
  // Facebook share
  document.getElementById('share-facebook')?.addEventListener('click', () => {
    const { url } = getShareData();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
  
  // Twitter/X share
  document.getElementById('share-twitter')?.addEventListener('click', () => {
    const { title, url } = getShareData();
    const text = `${title} - Check it out on VibeStore`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
  
  // LinkedIn share
  document.getElementById('share-linkedin')?.addEventListener('click', () => {
    const { url } = getShareData();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  });
  
  // WhatsApp share
  document.getElementById('share-whatsapp')?.addEventListener('click', () => {
    const { title, url } = getShareData();
    const text = `${title} - ${url}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  });
  
  // Copy link
  document.getElementById('share-copy')?.addEventListener('click', async () => {
    const { url } = getShareData();
    const btn = document.getElementById('share-copy');
    
    try {
      await navigator.clipboard.writeText(url);
      
      // Visual feedback
      btn.classList.add('copied');
      const originalTitle = btn.title;
      btn.title = 'Copied!';
      
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.title = originalTitle;
      }, 2000);
      
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        btn.classList.add('copied');
        setTimeout(() => btn.classList.remove('copied'), 2000);
      } catch (err) {
        alert('Failed to copy link. Please copy manually: ' + url);
      }
      document.body.removeChild(textArea);
    }
  });
}

// Initialize social sharing when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for app data to load
  setTimeout(() => {
    initializeSocialSharing();
  }, 1000);
});
</script>