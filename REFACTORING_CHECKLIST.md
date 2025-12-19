# רשימת משימות - ארגון מחדש VibeStore

## ✅ שלב 1: ניקוי והכנה (1-2 ימים)

### ארגון קבצים
- [ ] יצירת תיקייה `scripts/`
- [ ] העברת `clean-production.js` ל-`scripts/`
- [ ] העברת `optimize-images.js` ל-`scripts/`
- [ ] העברת `populate-blog-data.js` ל-`scripts/`
- [ ] העברת `version-check.js` ל-`scripts/`
- [ ] יצירת תיקייה `docs/`
- [ ] העברת כל קבצי `.md` ל-`docs/` (חוץ מ-README.md)
- [ ] יצירת תיקייה `tests/`
- [ ] העברת `debug-favorites.html` ל-`tests/integration/`
- [ ] העברת `test-image-system.html` ל-`tests/integration/`
- [ ] העברת `test-integration.html` ל-`tests/integration/`
- [ ] העברת `firestore-test.js` ל-`tests/unit/js/`

### ניקוי קוד
- [ ] הסרת comments על קוד שהוסר (`// Image loading removed`)
- [ ] בדיקה שאין קבצים לא בשימוש
- [ ] עדכון `.gitignore` לכלול `vendor/`, `node_modules/`, `_site/`

### עדכון Scripts
- [ ] עדכון `package.json` scripts לנתיבים החדשים
- [ ] עדכון כל ה-scripts שמתייחסים לקבצים שהוזזו

---

## ✅ שלב 2: יצירת מבנה JavaScript חדש (3-5 ימים)

### יצירת תיקיות
- [ ] יצירת `assets/js/core/`
- [ ] יצירת `assets/js/components/`
- [ ] יצירת `assets/js/features/`
- [ ] יצירת `assets/js/features/apps/`
- [ ] יצירת `assets/js/features/search/`
- [ ] יצירת `assets/js/features/favorites/`
- [ ] יצירת `assets/js/features/lists/`
- [ ] יצירת `assets/js/features/blog/`
- [ ] יצירת `assets/js/utils/`
- [ ] יצירת `assets/js/tracking/`

### יצירת Core Modules
- [ ] יצירת `core/firebase.js` (העברה מ-`firebaseConfig.js`)
- [ ] יצירת `core/constants.js` (חדש - כל ה-constants)
- [ ] יצירת `core/error-handler.js` (חדש)
- [ ] יצירת `core/navigation.js` (מתוך `app.js`)
- [ ] יצירת `core/animations.js` (מתוך `app.js`)

### יצירת Components
- [ ] יצירת `components/card.js` (איחוד כל card creation functions)
- [ ] בדיקה שאין דופליקציות של card creation

### פיצול app.js
- [ ] העתקת navigation logic ל-`core/navigation.js`
- [ ] העתקת animations ל-`core/animations.js`
- [ ] העתקת render apps ל-`features/apps/renderer.js`
- [ ] העתקת filters ל-`features/apps/filters.js`
- [ ] העתקת card creation ל-`components/card.js`
- [ ] השארת רק initialization ב-`app.js`

### העברת קבצים קיימים
- [ ] העברת `firestore-apps.js` ל-`features/apps/firestore.js`
- [ ] העברת `search-engine.js` ל-`features/search/engine.js`
- [ ] העברת `search-ui.js` ל-`features/search/ui.js`
- [ ] העברת `favorites.js` ל-`features/favorites/manager.js`
- [ ] העברת `lists-manager.js` ל-`features/lists/manager.js`
- [ ] העברת `list-ui.js` ל-`features/lists/ui.js`
- [ ] העברת `session-tracker.js` ל-`tracking/session.js`
- [ ] העברת `lazy-loading.js` ל-`utils/lazy-loading.js` (או להשאיר)

### Blog Modules
- [ ] העברת `blog-comments.js` ל-`features/blog/comments.js`
- [ ] העברת `blog-post.js` ל-`features/blog/post.js`
- [ ] העברת `blog.js` ל-`features/blog/main.js`
- [ ] העברת `blog-share.js` ל-`features/blog/share.js`
- [ ] העברת `admin-blog.js` ל-`features/blog/admin.js`

---

## ✅ שלב 3: מעבר ל-ES6 Modules (2-3 ימים)

### המרת קבצים
- [ ] המרת `core/firebase.js` ל-module (export/import)
- [ ] המרת `core/constants.js` ל-module
- [ ] המרת `core/error-handler.js` ל-module
- [ ] המרת `core/navigation.js` ל-module
- [ ] המרת `core/animations.js` ל-module
- [ ] המרת `components/card.js` ל-module
- [ ] המרת `features/apps/renderer.js` ל-module
- [ ] המרת `features/apps/filters.js` ל-module
- [ ] המרת `features/apps/firestore.js` ל-module
- [ ] המרת כל שאר ה-modules

### הסרת Global Dependencies
- [ ] הסרת כל `window.` assignments
- [ ] החלפה ב-`export` statements
- [ ] עדכון כל ה-imports להשתמש ב-`import` במקום `window.`

### עדכון HTML
- [ ] הוספת `type="module"` ל-`app.js` script tag
- [ ] הסרת כל ה-script tags הישנים
- [ ] בדיקה שהכל נטען נכון

### בדיקות
- [ ] בדיקה שהאתר עובד
- [ ] בדיקה ב-Chrome
- [ ] בדיקה ב-Firefox
- [ ] בדיקה ב-Safari
- [ ] בדיקת שגיאות ב-console
- [ ] בדיקת network tab (לוודא שהכל נטען)

---

## ✅ שלב 4: שיפורי אבטחה (1-2 ימים)

### Firestore Rules
- [ ] תיקון `allow read: if true` ל-`allow read: if resource.data.status == 'approved' || isAdmin()`
- [ ] בדיקת כל ה-rules
- [ ] בדיקה שאין permissions יותר מדי פתוחות
- [ ] בדיקת security rules עם Firebase emulator

### Input Validation
- [ ] יצירת `utils/validation.js`
- [ ] הוספת validation functions:
  - [ ] email validation
  - [ ] URL validation
  - [ ] text length validation
  - [ ] file type/size validation
- [ ] עדכון כל ה-forms להשתמש ב-validation

### Rate Limiting
- [ ] הוספת rate limiting ב-Cloud Functions (אם צריך)
- [ ] בדיקה של submission limits
- [ ] בדיקה של review limits

---

## ✅ שלב 5: שיפורים נוספים (אופציונלי)

### Documentation
- [ ] הוספת JSDoc comments ל-core modules
- [ ] הוספת JSDoc comments ל-components
- [ ] הוספת JSDoc comments ל-features
- [ ] עדכון README עם המבנה החדש

### Testing
- [ ] יצירת test suite בסיסי
- [ ] Unit tests ל-core modules
- [ ] Integration tests ל-features

### Performance
- [ ] בדיקת bundle size
- [ ] בדיקת load time
- [ ] בדיקת memory leaks
- [ ] Optimization אם צריך

### Optional: Bundler
- [ ] החלטה אם צריך Bundler (Vite/Webpack)
- [ ] התקנה והגדרה
- [ ] עדכון build process

### Optional: TypeScript
- [ ] החלטה אם לעבור ל-TypeScript
- [ ] התקנה והגדרה
- [ ] המרה הדרגתית של קבצים

---

## 📝 הערות

### לפני שמתחילים
- [ ] עשה backup של הפרויקט
- [ ] עשה commit של הקוד הנוכחי
- [ ] צור branch חדש: `refactoring`

### במהלך העבודה
- [ ] עשה commit אחרי כל שלב חשוב
- [ ] בדוק שהכל עובד לפני שאתה עובר לשלב הבא
- [ ] תעד שינויים חשובים

### אחרי סיום
- [ ] בדיקה מקיפה של כל הפונקציונליות
- [ ] בדיקה cross-browser
- [ ] עדכון documentation
- [ ] Merge ל-main branch

---

## 🎯 סדר עדיפויות

### Must Have (חובה) 🔴
- ✅ שלב 1: ניקוי והכנה
- ✅ שלב 2: יצירת מבנה JavaScript חדש
- ✅ שלב 3: מעבר ל-ES6 Modules

### Should Have (מומלץ) 🟡
- ✅ שלב 4: שיפורי אבטחה

### Nice to Have (אופציונלי) 🟢
- ⚠️ שלב 5: שיפורים נוספים

---

**נוצר:** ינואר 2025  
**עודכן:** [תאריך עדכון]

