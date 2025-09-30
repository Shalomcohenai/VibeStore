---
title: Sign in / Sign up
layout: page
permalink: /pages/auth
---

<div class="auth-container">
  <!-- Sign In Form -->
  <div class="auth-card" id="signin-card">
    <h2 class="auth-title">Welcome Back</h2>
    <p class="auth-subtitle">Sign in to your VibeStore account</p>
    
    <form id="signin-form" class="auth-form">
      <div class="form-group">
        <input type="email" id="signin-email" class="auth-input" placeholder="Email" required>
      </div>
      <div class="form-group">
        <input type="password" id="signin-password" class="auth-input" placeholder="Password" required>
      </div>
      <button type="submit" class="auth-btn primary" id="signin-btn">
        <span class="btn-text">Sign In</span>
        <span class="btn-loading" style="display: none;">Signing in...</span>
      </button>
    </form>

    <!-- Google Sign In -->
    <div class="divider">
      <span>or</span>
    </div>
    
    <button class="auth-btn google" id="google-signin-btn">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continue with Google
    </button>

    <div class="auth-switch">
      <p>Don't have an account? <a href="#" id="show-signup">Sign up</a></p>
      <p><a href="#" id="forgot-password">Forgot password?</a></p>
    </div>
  </div>

  <!-- Sign Up Form -->
  <div class="auth-card" id="signup-card" style="display: none;">
    <h2 class="auth-title">Create Account</h2>
    <p class="auth-subtitle">Join the VibeStore community</p>
    
    <form id="signup-form" class="auth-form">
      <div class="form-group">
        <input type="text" id="signup-name" class="auth-input" placeholder="Full Name" required>
      </div>
      <div class="form-group">
        <input type="email" id="signup-email" class="auth-input" placeholder="Email" required>
      </div>
      <div class="form-group">
        <input type="password" id="signup-password" class="auth-input" placeholder="Password (min 6 characters)" required minlength="6">
      </div>
      <button type="submit" class="auth-btn primary" id="signup-btn">
        <span class="btn-text">Create Account</span>
        <span class="btn-loading" style="display: none;">Creating account...</span>
      </button>
    </form>

    <div class="auth-switch">
      <p>Already have an account? <a href="#" id="show-signin">Sign in</a></p>
    </div>
  </div>

  <!-- Success Message -->
  <div class="auth-message" id="auth-success" style="display: none;">
    <div class="message-content success">
      <h3>Welcome to VibeStore!</h3>
      <p>You've successfully signed in. Redirecting to home page...</p>
    </div>
  </div>

  <!-- Error Message -->
  <div class="auth-message" id="auth-error" style="display: none;">
    <div class="message-content error">
      <h3>Sign In Failed</h3>
      <p id="error-text">Please check your credentials and try again.</p>
      <button class="auth-btn secondary" id="retry-btn">Try Again</button>
    </div>
  </div>
</div>

<style>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.auth-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0,0,0,.08);
  border: 1px solid var(--c-line);
}

.auth-title {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--c-text);
}

.auth-subtitle {
  text-align: center;
  color: var(--c-muted);
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.auth-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--c-line);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.auth-input:focus {
  outline: none;
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(107,70,193,0.1);
}

.auth-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
}

.auth-btn.primary {
  background: var(--c-primary);
  color: white;
}

.auth-btn.primary:hover {
  background: var(--c-accent);
  transform: translateY(-1px);
}

.auth-btn.google {
  background: white;
  border: 2px solid var(--c-line);
  color: var(--c-text);
}

.auth-btn.google:hover {
  border-color: var(--c-primary);
  transform: translateY(-1px);
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--c-line);
}

.divider span {
  background: white;
  padding: 0 1rem;
  color: var(--c-muted);
  font-size: 0.9rem;
}

.auth-switch {
  text-align: center;
  margin-top: 1.5rem;
}

.auth-switch p {
  margin: 0.5rem 0;
  color: var(--c-muted);
}

.auth-switch a {
  color: var(--c-primary);
  text-decoration: none;
  font-weight: 600;
}

.auth-switch a:hover {
  text-decoration: underline;
}

.message-content.success {
  background: #f0fdf4;
  border: 1px solid #22c55e;
  color: #15803d;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}

.message-content.error {
  background: #fef2f2;
  border: 1px solid #ef4444;
  color: #dc2626;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
}
</style>

<script type="module">
// Wait for Firebase to initialize
const waitForFirebase = () => new Promise(resolve => {
  const check = () => {
    if (window.$fb && window.$fb.auth) {
      resolve(window.$fb);
    } else {
      setTimeout(check, 100);
    }
  };
  check();
});

try {
  const { auth, authMod } = await waitForFirebase();

  // DOM elements
  const signinCard = document.getElementById('signin-card');
  const signupCard = document.getElementById('signup-card');
  const authSuccess = document.getElementById('auth-success');
  const authError = document.getElementById('auth-error');

  // Form switching
  document.getElementById('show-signup')?.addEventListener('click', (e) => {
    e.preventDefault();
    signinCard.style.display = 'none';
    signupCard.style.display = 'block';
  });

  document.getElementById('show-signin')?.addEventListener('click', (e) => {
    e.preventDefault();
    signupCard.style.display = 'none';
    signinCard.style.display = 'block';
  });

  // Show success
  const showSuccess = () => {
    signinCard.style.display = 'none';
    signupCard.style.display = 'none';
    authSuccess.style.display = 'block';
    setTimeout(() => window.location.href = '/', 2000);
  };

  // Sign in form
  document.getElementById('signin-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    
    try {
      await authMod.signInWithEmailAndPassword(auth, email, password);
      showSuccess();
    } catch (error) {
      alert('Sign in failed: ' + error.message);
    }
  });

  // Sign up form  
  document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
      const userCredential = await authMod.createUserWithEmailAndPassword(auth, email, password);
      await authMod.updateProfile(userCredential.user, { displayName: name });
      showSuccess();
    } catch (error) {
      alert('Sign up failed: ' + error.message);
    }
  });

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const provider = new authMod.GoogleAuthProvider();
      await authMod.signInWithPopup(auth, provider);
      showSuccess();
    } catch (error) {
      alert('Google sign in failed: ' + error.message);
    }
  };

  document.getElementById('google-signin-btn')?.addEventListener('click', handleGoogleSignIn);

  // Check if user is already signed in
  authMod.onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes('/pages/auth')) {
      // User is already signed in, redirect to home
      window.location.href = '/';
    }
  });

} catch (error) {
  console.log('Firebase not ready yet, authentication will be limited');
}
</script>