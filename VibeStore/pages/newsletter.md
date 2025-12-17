---
title: Newsletter
layout: page
permalink: /pages/newsletter
---

<div class="newsletter-container">

# Weekly Newsletter

<p class="newsletter-intro">Stay updated with the latest apps, trending discoveries, and our editor's picks. Get curated recommendations delivered to your inbox every week.</p>

<div class="newsletter-features">
  <div class="feature">
    <h3>🚀 New Apps</h3>
    <p>Be the first to discover newly approved applications</p>
  </div>
  <div class="feature">
    <h3>📈 Trending</h3>
    <p>See what's popular in the VibeStore community</p>
  </div>
  <div class="feature">
    <h3>⭐ Editor's Picks</h3>
    <p>Handpicked quality apps curated by our team</p>
  </div>
</div>

<div class="newsletter-form-wrapper">
  <h2>Subscribe Now</h2>
  <p class="form-description">Join our community and get weekly updates. No spam, unsubscribe anytime.</p>
  
  <form id="newsletterForm" class="newsletter-form">
    
    <div class="form-group">
      <label for="subscriberEmail">Email Address *</label>
      <input type="email" id="subscriberEmail" required placeholder="your@email.com">
    </div>

    <div class="form-group">
      <label for="subscriberName">Name (Optional)</label>
      <input type="text" id="subscriberName" placeholder="Your name">
    </div>

    <div class="form-group checkbox-group">
      <label>
        <input type="checkbox" id="subscriberConsent" required>
        <span>I agree to receive weekly newsletters from VibeStore</span>
      </label>
    </div>

    <div class="form-group checkbox-group">
      <label>
        <input type="checkbox" id="subscriberPrivacy" required>
        <span>I have read and agree to the <a href="/pages/privacy" target="_blank">Privacy Policy</a></span>
      </label>
    </div>

    <div id="newsletterStatus" class="status-message"></div>

    <button type="submit" class="subscribe-btn" id="subscribeBtn">
      <span class="btn-text">Subscribe to Newsletter</span>
      <span class="btn-loader" style="display: none;">Subscribing...</span>
    </button>

  </form>
</div>

<div class="newsletter-info">
  <h3>What to Expect</h3>
  <ul>
    <li><strong>Weekly Delivery:</strong> Every Sunday morning</li>
    <li><strong>Curated Content:</strong> Only the best apps and updates</li>
    <li><strong>No Spam:</strong> We respect your inbox</li>
    <li><strong>Easy Unsubscribe:</strong> One-click unsubscribe in every email</li>
  </ul>

  <h3>Privacy & Security</h3>
  <p>Your email is safe with us. We never share your information with third parties. Read our <a href="/pages/privacy">Privacy Policy</a> for details.</p>
</div>

<div class="subscriber-count">
  <p>Join <strong id="subscriberCountDisplay">-</strong> subscribers already receiving our weekly updates</p>
</div>

</div>

<style>
.newsletter-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.newsletter-intro {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.newsletter-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.feature h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.feature p {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.newsletter-form-wrapper {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.newsletter-form-wrapper h2 {
  margin-top: 0;
  color: #222;
  text-align: center;
}

.form-description {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
}

.newsletter-form .form-group {
  margin-bottom: 1.5rem;
}

.newsletter-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.newsletter-form input[type="email"],
.newsletter-form input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.newsletter-form input:focus {
  outline: none;
  border-color: #28a745;
}

.checkbox-group label {
  display: flex;
  align-items: flex-start;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.5rem;
  margin-top: 0.25rem;
  width: auto;
}

.checkbox-group a {
  color: #0066cc;
  text-decoration: underline;
}

.subscribe-btn {
  width: 100%;
  padding: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.subscribe-btn:hover:not(:disabled) {
  background: #218838;
}

.subscribe-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.status-message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  display: none;
}

.status-message.success {
  display: block;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  display: block;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.newsletter-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.newsletter-info h3 {
  color: #333;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.newsletter-info h3:first-child {
  margin-top: 0;
}

.newsletter-info ul {
  margin-left: 1.5rem;
}

.newsletter-info li {
  margin-bottom: 0.5rem;
  color: #555;
}

.newsletter-info a {
  color: #0066cc;
  text-decoration: underline;
}

.subscriber-count {
  text-align: center;
  padding: 1rem;
  background: #e8f4f8;
  border-radius: 8px;
  color: #555;
}

.subscriber-count strong {
  color: #28a745;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .newsletter-container {
    padding: 1rem 0.5rem;
  }
  
  .newsletter-form-wrapper {
    padding: 1rem;
  }
  
  .newsletter-features {
    grid-template-columns: 1fr;
  }
}
</style>

<script type="module">
import { db } from '/assets/js/firebaseConfig.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs, getCountFromServer } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Load subscriber count
async function loadSubscriberCount() {
  try {
    const subscribersRef = collection(db, 'newsletter_subscriptions');
    const q = query(subscribersRef, where('status', '==', 'active'));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    document.getElementById('subscriberCountDisplay').textContent = count;
  } catch (error) {
    console.error('Error loading subscriber count:', error);
    document.getElementById('subscriberCountDisplay').textContent = 'many';
  }
}

loadSubscriberCount();

// Handle form submission
document.getElementById('newsletterForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('subscribeBtn');
  const statusDiv = document.getElementById('newsletterStatus');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  
  const email = document.getElementById('subscriberEmail').value.trim().toLowerCase();
  const name = document.getElementById('subscriberName').value.trim();
  
  // Disable submit button
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  statusDiv.className = 'status-message';
  statusDiv.style.display = 'none';
  
  try {
    // Check if already subscribed
    const subscribersRef = collection(db, 'newsletter_subscriptions');
    const q = query(subscribersRef, where('email', '==', email));
    const existingSnapshot = await getDocs(q);
    
    if (!existingSnapshot.empty) {
      // Already subscribed
      statusDiv.textContent = '✓ You are already subscribed to our newsletter!';
      statusDiv.className = 'status-message success';
      document.getElementById('newsletterForm').reset();
    } else {
      // Add new subscriber
      await addDoc(subscribersRef, {
        email: email,
        name: name || null,
        status: 'active',
        source: 'website',
        subscribedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      statusDiv.textContent = '✓ Successfully subscribed! Check your inbox for a welcome email.';
      statusDiv.className = 'status-message success';
      
      // Reset form
      document.getElementById('newsletterForm').reset();
      
      // Reload subscriber count
      setTimeout(() => loadSubscriberCount(), 500);
      
      // Track event
      if (window.gtag) {
        gtag('event', 'newsletter_subscribe', {
          'event_category': 'engagement',
          'event_label': 'newsletter_form'
        });
      }
    }
    
  } catch (error) {
    console.error('Error subscribing:', error);
    statusDiv.textContent = '✗ Error subscribing. Please try again or contact us at vibeappstore@gmail.com';
    statusDiv.className = 'status-message error';
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
});
</script>

