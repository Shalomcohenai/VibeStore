# הגדרת API Keys

## ⚠️ אבטחה

קובץ `config.js` מכיל מפתחות API רגישים **ולעולם לא צריך להיות ב-Git**.

## 📝 הוראות התקנה

1. **העתק את קובץ הדוגמה:**
   ```bash
   cp VibeStore/assets/js/config.example.js VibeStore/assets/js/config.js
   ```

2. **ערוך את `config.js` והוסף את המפתחות שלך:**
   ```javascript
   const OPENAI_API_KEY = 'your-actual-api-key-here';
   ```

3. **ודא ש-`config.js` ב-`.gitignore`:**
   ```
   VibeStore/assets/js/config.js
   ```

## ✅ אימות

לאחר ההגדרה, כשתטען את עמוד עורך הבלוג (`/admin/blog-editor/`), תראה הודעה:
- ✅ "API Key נטען מהקובץ config.js" - אם המפתח נטען בהצלחה
- או שדה קלט להכנסת מפתח ידנית - אם המפתח לא נמצא

## 🔒 אבטחה

- **לעולם אל תעלה את `config.js` ל-Git**
- **אל תשתף את המפתחות שלך עם אחרים**
- **השתמש במפתחות שונים לסביבות שונות** (פיתוח/ייצור)

## 📋 רשימת קבצים

- `config.js` - קובץ ההגדרות שלך (לא ב-Git) ⚠️
- `config.example.js` - קובץ דוגמה (ב-Git) ✅
- `README_CONFIG.md` - קובץ זה
