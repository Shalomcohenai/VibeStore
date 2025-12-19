# מדריך הגדרת אנליטיקה ו-SEO - VibeStore

## סטטוס: ✅ הושלם

כל מערכת האנליטיקה וה-SEO הוגדרה והופעלה.

---

## 📊 Google Analytics 4

### הגדרה
- **ID:** `G-59FYNPQGEP`
- **מיקום:** `_includes/analytics.html`
- **מצב:** פעיל

### תכונות
- ✅ Page view tracking אוטומטי
- ✅ Event tracking (app clicks, searches, favorites, וכו')
- ✅ Session tracking
- ✅ Time on page tracking
- ✅ Custom events לכל פעולה

### Events שמועברים:
- `page_view` - כל עמוד
- `app_click` - לחיצה על אפליקציה
- `search` - חיפוש
- `favorite` - הוספה/הסרה ממועדפים
- `list_action` - פעולות על רשימות
- `review_submit` - שליחת ביקורת
- `share` - שיתוף
- `time_on_page` - זמן על עמוד

---

## 📄 Page Views Tracking

### Firestore Collection: `page_views`

כל page view נשמר ב-Firestore עם:
- `path` - נתיב העמוד
- `title` - כותרת העמוד
- `userId` - ID משתמש (אם מחובר)
- `sessionId` - ID סשן
- `timestamp` - זמן
- `userAgent` - User agent
- `referrer` - מקור הפניה
- `screenWidth/Height` - גודל מסך
- `viewportWidth/Height` - גודל viewport

### שימוש:
```javascript
// אוטומטי - כל עמוד נטרק אוטומטית
// או ידנית:
window.Analytics.trackPageView('/pages/app', 'App Details');
```

---

## 📈 Analytics Events

### Firestore Collection: `analytics_events`

כל event נשמר ב-Firestore עם:
- `event_name` - שם האירוע
- `params` - פרמטרים נוספים
- `userId` - ID משתמש (אם מחובר)
- `sessionId` - ID סשן
- `timestamp` - זמן
- `path` - נתיב העמוד
- `userAgent` - User agent

### שימוש:
```javascript
// Track custom event
window.Analytics.trackEvent('custom_event', {
  param1: 'value1',
  param2: 'value2'
});

// Track app click
window.Analytics.trackAppClick(appId, appTitle, 'source');

// Track search
window.Analytics.trackSearch(query, resultsCount);

// Track favorite
window.Analytics.trackFavorite(appId, isFavorite);

// Track share
window.Analytics.trackShare('facebook', 'app', appId);
```

---

## 🎛️ Admin Dashboard - Page Analytics

### גישה:
1. התחבר כמנהל
2. לך ל-`/pages/admin`
3. לחץ על טאב **"📄 Page Analytics"**

### תכונות:
- **Total Page Views** - סך כל הצפיות
- **Unique Pages** - מספר עמודים ייחודיים
- **Unique Sessions** - מספר סשנים ייחודיים
- **Avg Time on Page** - זמן ממוצע על עמוד

### פילטרים:
- **Time Filter:** 7/30/90 days או All time
- **Path Filter:** סינון לפי נתיב עמוד

### דוחות:
- **Top Pages by Views** - 20 העמודים הפופולריים ביותר
- **Page Views Timeline** - גרף צפיות לפי יום (30 ימים אחרונים)
- **Recent Page Views** - 50 הצפיות האחרונות

### Export:
- **Export CSV** - ייצוא כל נתוני page views ל-CSV

---

## 🔍 SEO Improvements

### Meta Tags
כל עמוד כולל:
- ✅ `<title>` דינמי
- ✅ `<meta name="description">` דינמי
- ✅ `<meta name="keywords">` דינמי
- ✅ `<link rel="canonical">` דינמי

### Open Graph (Facebook)
- ✅ `og:type`
- ✅ `og:url`
- ✅ `og:title`
- ✅ `og:description`
- ✅ `og:image`

### Twitter Cards
- ✅ `twitter:card`
- ✅ `twitter:url`
- ✅ `twitter:title`
- ✅ `twitter:description`
- ✅ `twitter:image`

### Structured Data (JSON-LD)
- ✅ **WebSite Schema** - לכל האתר
- ✅ **Organization Schema** - לארגון
- ✅ **BlogPosting Schema** - לפוסטי בלוג
- ✅ **SoftwareApplication Schema** - לעמודי אפליקציות

### Sitemap
- ✅ Sitemap דינמי (Cloud Function)
- ✅ כולל כל העמודים, פוסטי בלוג ואפליקציות
- ✅ מתעדכן אוטומטית כל 24 שעות

### Robots.txt
- ✅ קובץ robots.txt קיים
- ✅ מאפשר גישה לכל העמודים

---

## 🔐 Firestore Security Rules

### Collections חדשות:
```javascript
// page_views
match /page_views/{viewId} {
  allow read: if isAdmin();
  allow list: if isAdmin();
  allow create: if true; // Anyone can create (for tracking)
  allow update, delete: if false;
}

// analytics_events
match /analytics_events/{eventId} {
  allow read: if isAdmin();
  allow list: if isAdmin();
  allow create: if true; // Anyone can create (for tracking)
  allow update, delete: if false;
}
```

---

## 📝 קבצים שנוצרו/עודכנו

### נוצרו:
- `assets/js/core/analytics.js` - מערכת אנליטיקה מרכזית

### עודכנו:
- `_includes/analytics.html` - שיפור Google Analytics
- `_includes/head.html` - שיפור SEO + Structured Data
- `_layouts/default.html` - הוספת analytics.js
- `assets/js/session-tracker.js` - שילוב עם Analytics
- `assets/js/components/card.js` - שילוב עם Analytics
- `assets/js/features/search/ui.js` - שילוב עם Analytics
- `security/firestore.rules` - הוספת rules ל-page_views ו-analytics_events
- `pages/admin.html` - הוספת Page Analytics Dashboard

---

## 🚀 שימוש

### Tracking אוטומטי:
- כל page view נטרק אוטומטית
- כל app click נטרק אוטומטית
- כל search נטרק אוטומטית

### Tracking ידני:
```javascript
// Track custom event
window.Analytics.trackEvent('my_custom_event', {
  custom_param: 'value'
});

// Track page view
window.Analytics.trackPageView('/custom-page', 'Custom Page Title');
```

---

## 📊 צפייה בנתונים

### Google Analytics:
1. לך ל-[Google Analytics](https://analytics.google.com)
2. בחר את הפרופיל `G-59FYNPQGEP`
3. צפה ב-Reports > Realtime / Events

### Admin Dashboard:
1. התחבר כמנהל
2. לך ל-`/pages/admin`
3. לחץ על **"📄 Page Analytics"**
4. צפה בכל הנתונים

---

## ✅ סיכום

כל מערכת האנליטיקה וה-SEO מוגדרת ופועלת:
- ✅ Google Analytics 4
- ✅ Page Views Tracking
- ✅ Events Tracking
- ✅ Admin Dashboard
- ✅ SEO מלא
- ✅ Structured Data
- ✅ Sitemap דינמי

**הכל מוכן לשימוש!** 🎉
