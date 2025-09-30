# Firestore Indexes Required

This document lists the composite indexes required for VibeStore queries.

## Current Indexes Needed

### Apps Collection

1. **Basic Query Index** (status + createdAt)
   - Collection: `apps`
   - Fields: 
     - `status` (Ascending)
     - `createdAt` (Descending)

2. **Featured Apps Index** (status + featured.active + createdAt) - OPTIONAL
   - Collection: `apps`
   - Fields:
     - `status` (Ascending)
     - `featured.active` (Ascending)
     - `createdAt` (Descending)
   
   **Note**: Currently avoided by using client-side filtering to prevent index requirement.

3. **Category Filter Index** (status + category + createdAt)
   - Collection: `apps`
   - Fields:
     - `status` (Ascending)
     - `category` (Ascending)
     - `createdAt` (Descending)

3b. **Category Filter Index with __name__** (category + status + createdAt + __name__)
   - Collection: `apps`
   - Fields:
     - `category` (Ascending)
     - `status` (Ascending)
     - `createdAt` (Descending)
     - `__name__` (Ascending)
   
   **Note**: This index is required when combining category filter with status filter and ordering by createdAt.

4. **Niche Filter Index** (status + niche + createdAt)
   - Collection: `apps`
   - Fields:
     - `status` (Ascending)
     - `niche` (Ascending)
     - `createdAt` (Descending)

4b. **Niche Filter Index with __name__** (niche + status + createdAt + __name__)
   - Collection: `apps`
   - Fields:
     - `niche` (Ascending)
     - `status` (Ascending)
     - `createdAt` (Descending)
     - `__name__` (Ascending)
   
   **Note**: This index is required when combining niche filter with status filter and ordering by createdAt.

### Reviews Collection

1. **App Reviews Index** (appId + createdAt)
   - Collection: `reviews`
   - Fields:
     - `appId` (Ascending)
     - `createdAt` (Descending)

## How to Create Indexes

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Firestore Database
4. Click on "Indexes" tab
5. Click "Create Index"
6. Add the fields as specified above

## Auto-Generated Index Links

When you encounter an index error, Firebase will provide a direct link to create the required index. Use those links for the fastest setup.

### Current Required Index (from Error)
**Category + Status + CreatedAt + __name__ Index**
- Direct link: https://console.firebase.google.com/v1/r/project/vibestore-7af1e/firestore/indexes?create_composite=Ckxwcm9qZWN0cy92aWJlc3RvcmUtN2FmMWUvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2FwcHMvaW5kZXhlcy9fEAEaDAoIY2F0ZWdvcnkQARoKCgZzdGF0dXMQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
- Fields: category (Ascending), status (Ascending), createdAt (Descending), __name__ (Ascending)
- **Status**: ⚠️ REQUIRED - Click the link above to create this index immediately
