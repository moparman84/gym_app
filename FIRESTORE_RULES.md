# Firestore Security Rules for Alternative Athletics

## Required Rules for Leaderboards

To enable leaderboard saving, you need to update your Firestore security rules:

### Go to Firebase Console:
1. Open: https://console.firebase.google.com
2. Select your project
3. Click "Firestore Database" in left sidebar
4. Click "Rules" tab
5. Replace with the rules below
6. Click "Publish"

---

## Recommended Rules (Development/Test Mode):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read all, write own
    match /users/{userId} {
      allow read: if true; // All users can read user profiles
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Events collection - all can read, admins can write
    match /events/{eventId} {
      allow read: if true; // All users can view calendar events
      allow write: if request.auth != null; // Any authenticated user can create/edit events
      // In production, you'd want: allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Workouts collection - all can read, admins can write
    match /workouts/{workoutId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Workout logs - users can read/write own
    match /workoutLogs/{logId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Login history - read/write for authenticated users
    match /loginHistory/{historyId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Message board - all authenticated can read/write
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Strict Production Rules (Recommended):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated(); // All authenticated users can read profiles
      allow write: if isAuthenticated() && request.auth.uid == userId; // Users can only edit their own profile
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if isAuthenticated(); // All members can view calendar
      allow create: if isAdmin(); // Only admins can create events
      allow update: if isAdmin(); // Only admins can update events (including leaderboards)
      allow delete: if isAdmin(); // Only admins can delete events
    }
    
    // Workouts collection
    match /workouts/{workoutId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin(); // Only admins can manage workouts
    }
    
    // Workout logs - users manage their own
    match /workoutLogs/{logId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
      allow update, delete: if isAuthenticated() && resource.data.userId == request.auth.uid;
    }
    
    // Login history
    match /loginHistory/{historyId} {
      allow read: if isAdmin(); // Only admins can view login history
      allow create: if isAuthenticated(); // Anyone can log their login
    }
    
    // Message board
    match /messages/{messageId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      (resource.data.userId == request.auth.uid || isAdmin());
      allow delete: if isAuthenticated() && 
                      (resource.data.userId == request.auth.uid || isAdmin());
    }
  }
}
```

---

## Quick Fix for "Permission Denied" Errors:

### Option 1: Test Mode (Easiest, Less Secure)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **WARNING**: This allows ANYONE to read/write your database. Only use for development!

### Option 2: Authenticated Users Only (Recommended for Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows any logged-in user to read/write everything.

---

## How to Check Current Rules:

1. Go to Firebase Console
2. Firestore Database → Rules tab
3. Check what rules are currently active
4. If you see "allow read, write: if false;" - that's blocking everything!

---

## Common Issues:

### "Permission Denied" when saving leaderboards
**Cause**: Firestore rules don't allow updates to events collection
**Solution**: Use Option 1 (test mode) or Option 2 (authenticated) above

### "Missing or insufficient permissions"
**Cause**: User not authenticated OR rules too strict
**Solution**: 
1. Make sure you're logged in
2. Update rules to allow authenticated users
3. Check browser console for detailed error

### Changes not saving at all
**Cause**: Firestore not initialized or timeout
**Solution**: 
1. Check .env file has correct Firebase config
2. Make sure Firestore is enabled in Firebase Console
3. Check browser console for errors

---

## Testing Your Rules:

### In Firebase Console:
1. Go to Firestore Database → Rules
2. Click "Rules Playground" tab
3. Test different operations (read, write, update)
4. Check if they pass or fail

### In Browser Console:
When you click "Save Leaderboard", check console for:
- "Saving leaderboards for event: [id]"
- "Leaderboards saved successfully!" ✅
- OR error message ❌

---

## Current Setup Requirement:

For the app to work properly RIGHT NOW, you need AT LEAST:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows all authenticated users to read/write everything.

Later, you can upgrade to the strict production rules for better security.

---

## Summary:

1. ✅ Enable Firestore in Firebase Console
2. ✅ Set rules to allow authenticated users
3. ✅ Make sure you're logged in
4. ✅ Try saving leaderboard again
5. ✅ Check browser console for errors

If still not working, check browser console (F12) and look for specific error messages!
