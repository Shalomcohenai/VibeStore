---
title: Report Issue
layout: page
permalink: /pages/report
---

<div class="report-container">

# Report an Issue

<p class="report-intro">Help us maintain a safe and quality platform. If you've encountered any issues, inappropriate content, or have concerns about an app or user behavior, please let us know.</p>

<div class="report-form-wrapper">
  <form id="reportForm" class="report-form">
    
    <div class="form-group">
      <label for="reportType">Issue Type *</label>
      <select id="reportType" required>
        <option value="">Select an issue type...</option>
        <option value="inappropriate_content">Inappropriate Content</option>
        <option value="spam">Spam or Fake App</option>
        <option value="broken_link">Broken Link</option>
        <option value="duplicate">Duplicate Listing</option>
        <option value="misleading_info">Misleading Information</option>
        <option value="copyright">Copyright Violation</option>
        <option value="privacy_concern">Privacy Concern</option>
        <option value="security_issue">Security Issue</option>
        <option value="harassment">Harassment or Abuse</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-group">
      <label for="reportUrl">Related URL (if applicable)</label>
      <input type="url" id="reportUrl" placeholder="https://vibestore.app/pages/app?id=...">
      <small>Link to the app, page, or content you're reporting</small>
    </div>

    <div class="form-group">
      <label for="reportEmail">Your Email *</label>
      <input type="email" id="reportEmail" required placeholder="your@email.com">
      <small>We'll use this to follow up if needed</small>
    </div>

    <div class="form-group">
      <label for="reportDetails">Description *</label>
      <textarea id="reportDetails" required rows="6" placeholder="Please provide detailed information about the issue..."></textarea>
      <small>Include as much detail as possible to help us investigate</small>
    </div>

    <div class="form-group checkbox-group">
      <label>
        <input type="checkbox" id="reportConfirm" required>
        <span>I confirm that this report is accurate and submitted in good faith</span>
      </label>
    </div>

    <div id="reportStatus" class="status-message"></div>

    <button type="submit" class="submit-btn" id="submitReportBtn">
      <span class="btn-text">Submit Report</span>
      <span class="btn-loader" style="display: none;">Submitting...</span>
    </button>

  </form>
</div>

<div class="report-info">
  <h3>What happens next?</h3>
  <ul>
    <li>Our team will review your report within 2-3 business days</li>
    <li>If we need more information, we'll contact you at the email provided</li>
    <li>We'll take appropriate action based on our Terms of Service and Guidelines</li>
    <li>For urgent security issues, we may respond within 24 hours</li>
  </ul>

  <h3>Alternative Contact</h3>
  <p>For urgent matters or general inquiries, you can also reach us at:</p>
  <p><strong>Email:</strong> <a href="mailto:vibeappstore@gmail.com">vibeappstore@gmail.com</a></p>
</div>

</div>

<style>
.report-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.report-intro {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-left: 4px solid #dc3545;
  border-radius: 4px;
}

.report-form-wrapper {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.report-form .form-group {
  margin-bottom: 1.5rem;
}

.report-form label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.report-form input[type="email"],
.report-form input[type="url"],
.report-form select,
.report-form textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.report-form input:focus,
.report-form select:focus,
.report-form textarea:focus {
  outline: none;
  border-color: #dc3545;
}

.report-form small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

.report-form textarea {
  resize: vertical;
  min-height: 120px;
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

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #c82333;
}

.submit-btn:disabled {
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

.report-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.report-info h3 {
  color: #333;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.report-info h3:first-child {
  margin-top: 0;
}

.report-info ul {
  margin-left: 1.5rem;
}

.report-info li {
  margin-bottom: 0.5rem;
  color: #555;
}

@media (max-width: 768px) {
  .report-container {
    padding: 1rem 0.5rem;
  }
  
  .report-form-wrapper {
    padding: 1rem;
  }
}
</style>

<script type="module">
import { db, auth } from '/assets/js/firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

document.getElementById('reportForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submitReportBtn');
  const statusDiv = document.getElementById('reportStatus');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');
  
  // Get form values
  const reportType = document.getElementById('reportType').value;
  const reportUrl = document.getElementById('reportUrl').value;
  const reportEmail = document.getElementById('reportEmail').value;
  const reportDetails = document.getElementById('reportDetails').value;
  
  // Disable submit button
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline';
  statusDiv.className = 'status-message';
  statusDiv.style.display = 'none';
  
  try {
    // Get current user if authenticated
    let userId = null;
    let userEmail = null;
    if (auth.currentUser) {
      userId = auth.currentUser.uid;
      userEmail = auth.currentUser.email;
    }
    
    // Save report to Firestore
    await addDoc(collection(db, 'reports'), {
      type: reportType,
      url: reportUrl || null,
      email: reportEmail,
      details: reportDetails,
      userId: userId,
      userEmail: userEmail,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    // Show success message
    statusDiv.textContent = '✓ Report submitted successfully! We\'ll review it and get back to you if needed.';
    statusDiv.className = 'status-message success';
    
    // Reset form
    document.getElementById('reportForm').reset();
    
    // Track event
    if (window.gtag) {
      gtag('event', 'submit_report', {
        'event_category': 'engagement',
        'event_label': reportType
      });
    }
    
  } catch (error) {
    console.error('Error submitting report:', error);
    statusDiv.textContent = '✗ Error submitting report. Please try again or email us directly at vibeappstore@gmail.com';
    statusDiv.className = 'status-message error';
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
});
</script>

