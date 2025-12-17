// VibeStore — session-tracker.js
// מערכת ניהול sessions למשתמשים אנונימיים
// כולל מניעת זיופים בסיסית

class SessionTracker {
  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.lastClickTimes = new Map(); // מניעת זיופים
    this.clickCooldown = 5 * 60 * 1000; // 5 דקות
  }

  /**
   * קבלת או יצירת session ID
   */
  getOrCreateSessionId() {
    let sessionId = localStorage.getItem('vibestore_session');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('vibestore_session', sessionId);
      }
    return sessionId;
  }

  /**
   * יצירת session ID ייחודי
   */
  generateSessionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `session_${timestamp}_${random}`;
  }

  /**
   * בדיקה אם המשתמש יכול ללחוץ על אפליקציה (מניעת זיופים)
   */
  canClickApp(appId) {
    const now = Date.now();
    const lastClickTime = this.lastClickTimes.get(appId) || 0;

    if (now - lastClickTime < this.clickCooldown) {
      const remainingTime = Math.ceil((this.clickCooldown - (now - lastClickTime)) / 1000);
      return false;
    }

    return true;
  }

  /**
   * רישום כניסה לאפליקציה
   */
  recordAppClick(appId, source = 'direct') {
    if (!this.canClickApp(appId)) {
      return false; // לא נספר בגלל cooldown
    }

    // רישום זמן הלחיצה
    this.lastClickTimes.set(appId, Date.now());

    // שליחה לשרת
    this.sendClickToServer(appId, source);

    return true;
  }

  /**
   * שליחת נתוני הכניסה לשרת
   */
  async sendClickToServer(appId, source) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-Session-ID': this.sessionId
      };

      // הוספת token אם המשתמש מחובר
      if (window.$fb && window.$fb.auth && window.$fb.auth.currentUser) {
        const token = await window.$fb.auth.currentUser.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('https://us-central1-vibestore-7af1e.cloudfunctions.net/trackClick', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          appId: appId,
          source: source,
          sessionId: this.sessionId
        })
      });

      if (response.ok) {
        } else {
        }
    } catch (error) {
      console.error('❌ Error tracking click:', error);
    }
  }

  /**
   * קבלת מידע על הסשן הנוכחי
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      clickCooldown: this.clickCooldown,
      activeClicks: this.lastClickTimes.size
    };
  }

  /**
   * איפוס הסשן (לצורך בדיקות)
   */
  resetSession() {
    localStorage.removeItem('vibestore_session');
    this.lastClickTimes.clear();
    this.sessionId = this.getOrCreateSessionId();
    }
}

// יצירת instance גלובלי
window.sessionTracker = new SessionTracker();

// פונקציה עזר גלובלית
window.trackAppClick = function(appId, source = 'direct') {
  return window.sessionTracker.recordAppClick(appId, source);
};

