# Firebase Storage Setup Guide - VibeStore

## 🔧 הגדרת Firebase Storage

### שלב 1: הגדרת Storage בפרויקט
1. עבור ל-[Firebase Console](https://console.firebase.google.com/project/vibestore-7af1e/storage)
2. לחץ על **"Get Started"**
3. בחר **"Start in test mode"** (זמנית)
4. בחר מיקום: **us-central1** (אותו מיקום כמו Functions)
5. לחץ על **"Done"**

### שלב 2: פריסת כללי אבטחה
```bash
cd /Users/shalom/Desktop/vibestore/VibeStore
firebase deploy --only storage
```

## 📁 מבנה תיקיות Storage

### תיקיות ציבוריות (קריאה לכולם)
```
/app-icons/{userId}/          # אייקוני אפליקציות
/app-screenshots/{userId}/    # צילומי מסך של אפליקציות
/processed/{appId}/           # תמונות מעובדות (Cloud Functions)
/thumbnails/{appId}/          # תמונות ממוזערות (Cloud Functions)
/profile-images/{userId}/     # תמונות פרופיל משתמשים
/blog-images/                 # תמונות בלוג (אדמין)
```

### תיקיות מוגבלות
```
/admin/                       # קבצים אדמין בלבד
/temp/{userId}/              # קבצים זמניים לעיבוד
```

## 🔒 כללי אבטחה מפורטים

### 1. אייקוני אפליקציות (`/app-icons/{userId}/`)
```javascript
// קריאה: כולם
allow read: if true;

// כתיבה: משתמש מאומת + בעלים + תמונה תקינה
allow write: if isAuthed() 
  && request.auth.uid == userId 
  && isValidImage() 
  && isValidSize() 
  && isValidFileName();

// מחיקה: בעלים או אדמין
allow delete: if isAuthed() && (request.auth.uid == userId || isAdmin());
```

### 2. צילומי מסך (`/app-screenshots/{userId}/`)
```javascript
// קריאה: כולם
allow read: if true;

// כתיבה: משתמש מאומת + בעלים + תמונה תקינה
allow write: if isAuthed() 
  && request.auth.uid == userId 
  && isValidImage() 
  && isValidSize() 
  && isValidFileName();

// מחיקה: בעלים או אדמין
allow delete: if isAuthed() && (request.auth.uid == userId || isAdmin());
```

### 3. תמונות מעובדות (`/processed/{appId}/`)
```javascript
// קריאה: כולם
allow read: if true;

// כתיבה: רק Cloud Functions
allow write: if false;

// מחיקה: רק אדמין
allow delete: if isAdmin();
```

### 4. תמונות ממוזערות (`/thumbnails/{appId}/`)
```javascript
// קריאה: כולם
allow read: if true;

// כתיבה: רק Cloud Functions
allow write: if false;

// מחיקה: רק אדמין
allow delete: if isAdmin();
```

### 5. תמונות פרופיל (`/profile-images/{userId}/`)
```javascript
// קריאה: כולם
allow read: if true;

// כתיבה: משתמש מאומת + בעלים + תמונה תקינה
allow write: if isAuthed() 
  && request.auth.uid == userId 
  && isValidImage() 
  && isValidSize() 
  && isValidFileName();

// מחיקה: בעלים או אדמין
allow delete: if isAuthed() && (request.auth.uid == userId || isAdmin());
```

### 6. תמונות בלוג (`/blog-images/`)
```javascript
// קריאה: כולם
allow read: if true;

// כתיבה: רק אדמין
allow write: if isAdmin() && isValidImage() && isValidSize();

// מחיקה: רק אדמין
allow delete: if isAdmin();
```

### 7. קבצים זמניים (`/temp/{userId}/`)
```javascript
// קריאה וכתיבה: משתמש מאומת + בעלים
allow read, write: if isAuthed() && request.auth.uid == userId;

// מחיקה: בעלים או אדמין
allow delete: if isAuthed() && (request.auth.uid == userId || isAdmin());
```

## ✅ פונקציות ולידציה

### `isValidImage()`
```javascript
function isValidImage() {
  return request.resource.contentType.matches('image/(jpeg|jpg|png|webp)');
}
```
**תמיכה בפורמטים**: JPEG, JPG, PNG, WebP

### `isValidSize()`
```javascript
function isValidSize() {
  return request.resource.size < 5 * 1024 * 1024; // 5MB limit
}
```
**גבול גודל**: 5MB לכל תמונה

### `isValidFileName()`
```javascript
function isValidFileName() {
  return request.resource.name.matches('.*\\.(jpg|jpeg|png|webp)$');
}
```
**סיומות מותרות**: .jpg, .jpeg, .png, .webp

## 🚀 שימוש בקוד

### העלאת אייקון אפליקציה
```javascript
// נתיב: /app-icons/{userId}/icon_{timestamp}.jpg
const storageRef = firebase.storage().ref(`app-icons/${userId}/icon_${Date.now()}.jpg`);
const uploadTask = storageRef.put(file);

uploadTask.then((snapshot) => {
  return snapshot.ref.getDownloadURL();
}).then((downloadURL) => {
  console.log('אייקון הועלה:', downloadURL);
});
```

### העלאת צילומי מסך
```javascript
// נתיב: /app-screenshots/{userId}/screenshot_{index}_{timestamp}.jpg
const storageRef = firebase.storage().ref(`app-screenshots/${userId}/screenshot_${index}_${Date.now()}.jpg`);
const uploadTask = storageRef.put(file);

uploadTask.then((snapshot) => {
  return snapshot.ref.getDownloadURL();
}).then((downloadURL) => {
  console.log('צילום מסך הועלה:', downloadURL);
});
```

### קריאת תמונות מעובדות
```javascript
// נתיב: /processed/{appId}/screenshot_large_{timestamp}.jpg
const storageRef = firebase.storage().ref(`processed/${appId}/screenshot_large_${timestamp}.jpg`);
const downloadURL = await storageRef.getDownloadURL();
```

## 🔧 הגדרת Cloud Functions

### עדכון Cloud Functions לעבודה עם Storage
```javascript
// ב-functions/index.js
import { getStorage } from 'firebase-admin/storage';

const bucket = getStorage().bucket();

// העלאת תמונה מעובדת
async function uploadProcessedImage(appId, type, size, imageBuffer) {
  const fileName = `processed/${appId}/${type}_${size}_${Date.now()}.jpg`;
  const file = bucket.file(fileName);
  
  await file.save(imageBuffer, {
    metadata: {
      contentType: 'image/jpeg',
      cacheControl: 'public, max-age=31536000'
    }
  });
  
  await file.makePublic();
  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}
```

## 📊 ניטור ושימוש

### מעקב אחר שימוש
- **Firebase Console** → **Storage** → **Usage**
- **Firebase Console** → **Storage** → **Files**
- **Firebase Console** → **Storage** → **Rules**

### עלויות משוערות
- **Storage**: $0.026/GB/חודש
- **Downloads**: $0.12/GB
- **Operations**: $0.05/10,000 פעולות

## ⚠️ הערות חשובות

### 1. אבטחה
- כל התמונות הציבוריות נגישות לכולם
- רק משתמשים מאומתים יכולים להעלות
- כל משתמש יכול להעלות רק לתיקייה שלו
- אדמין יכול לגשת לכל התיקיות

### 2. ביצועים
- תמונות מעובדות נשמרות עם Cache-Control
- CDN אוטומטי של Firebase
- דחיסה אוטומטית

### 3. גיבוי
- Firebase Storage כולל גיבוי אוטומטי
- שחזור נתונים זמין
- גרסה של קבצים

## 🧪 בדיקות

### בדיקת העלאה
```javascript
// בדיקת העלאת תמונה
const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
const storageRef = firebase.storage().ref(`test/test_${Date.now()}.jpg`);
const uploadTask = storageRef.put(testFile);

uploadTask.then((snapshot) => {
  console.log('✅ העלאה הצליחה');
  return snapshot.ref.getDownloadURL();
}).catch((error) => {
  console.error('❌ העלאה נכשלה:', error);
});
```

### בדיקת קריאה
```javascript
// בדיקת קריאת תמונה
const storageRef = firebase.storage().ref('app-icons/test/test.jpg');
storageRef.getDownloadURL().then((url) => {
  console.log('✅ קריאה הצליחה:', url);
}).catch((error) => {
  console.error('❌ קריאה נכשלה:', error);
});
```

## 🎯 סיכום

### מה הוגדר
- ✅ כללי אבטחה מקיפים
- ✅ מבנה תיקיות מאורגן
- ✅ ולידציה של קבצים
- ✅ הגבלות גודל וסוג
- ✅ הרשאות משתמשים

### מה נדרש
1. הגדרת Storage בפרויקט
2. פריסת כללי אבטחה
3. בדיקת העלאה וקריאה
4. ניטור שימוש ועלויות

### התוצאה
- מערכת Storage מאובטחת ומוכנה לשימוש
- תמיכה בכל סוגי התמונות
- ביצועים מותאמים
- אבטחה ברמה גבוהה

---

*מדריך הוכן עבור VibeStore Version 4.0*  
*תאריך: 2025-01-27*
