# הוראות לתיקון בעיית Cache

השגיאה `generateSlug has already been declared` נובעת מכך שהדפדפן טוען גרסה ישנה של הקובץ מה-cache.

## פתרון מהיר:

### 1. Hard Refresh (רענון קשיח):
- **Windows/Linux**: `Ctrl + Shift + R` או `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### 2. ניקוי Cache ידני:
1. פתח DevTools (F12)
2. לחץ ימני על כפתור הרענון
3. בחר **"Empty Cache and Hard Reload"**

### 3. ניקוי Cache מלא:
1. פתח DevTools (F12)
2. לך ל-Network tab
3. סמן "Disable cache"
4. רענן את הדף

### 4. ניקוי Cache מההגדרות:
- **Chrome**: Settings → Privacy → Clear browsing data → Cached images and files
- **Firefox**: Settings → Privacy → Clear Data → Cached Web Content
- **Safari**: Develop → Empty Caches

## אם זה לא עוזר:

1. סגור את כל הטאבים של האתר
2. סגור את הדפדפן לחלוטין
3. פתח מחדש את הדפדפן
4. גש שוב לאתר

## בדיקה שהקובץ עודכן:

פתח את הקונסול (F12) והקלד:
```javascript
fetch('/assets/js/admin-blog.js?v=20250127-4')
  .then(r => r.text())
  .then(text => {
    const matches = text.match(/function generateSlugFromTitle/g);
    console.log('Found generateSlugFromTitle:', matches ? matches.length : 0);
    const oldMatches = text.match(/function generateSlug[^F]/g);
    console.log('Found old generateSlug:', oldMatches ? oldMatches.length : 0);
  });
```

אם אתה רואה `generateSlugFromTitle: 1` ו-`old generateSlug: 0` - הקובץ עודכן נכון.
