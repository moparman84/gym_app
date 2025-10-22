# User Photo Upload Guide

## Current Status
- ✅ Photo upload UI exists
- ⚠️ Currently saves Base64 strings to Firestore (not recommended)
- ✅ Firebase Storage is configured in your project

## Recommended Implementation: Firebase Storage

### Step 1: Update firebase.js
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';  // Add this

// ... existing config ...

const storage = getStorage(app);  // Add this

export { auth, db, storage };  // Export storage
```

### Step 2: Update ProfilePage.jsx

Replace the `handlePhotoChange` function with:

```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

const handlePhotoChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  // Validate file size (e.g., max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image must be less than 5MB');
    return;
  }

  try {
    setIsSaving(true); // Show loading state
    
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `profile_photos/${user.uid}_${timestamp}.${file.name.split('.').pop()}`;
    
    // Upload to Firebase Storage
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update local state
    setPhotoURL(downloadURL);
    
    // Optionally auto-save to Firestore immediately
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      photoURL: downloadURL,
      updatedAt: new Date().toISOString()
    });
    
    await fetchUserProfile(user.uid);
    alert('Photo uploaded successfully!');
    
  } catch (error) {
    console.error('Error uploading photo:', error);
    alert('Failed to upload photo: ' + error.message);
  } finally {
    setIsSaving(false);
  }
};
```

### Step 3: Update Firebase Storage Security Rules

In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload their own profile photos
    match /profile_photos/{userId}_{timestamp}.{extension} {
      allow read: if true;  // Anyone can view profile photos
      allow write: if request.auth != null 
                   && request.auth.uid == userId  // Only owner can upload
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');  // Images only
    }
  }
}
```

## Alternative: Keep Current Base64 Approach

If you want to keep it simple for now, you can stick with Base64 BUT:

### Add Image Compression

```javascript
npm install browser-image-compression
```

```javascript
import imageCompression from 'browser-image-compression';

const handlePhotoChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    // Compress image before converting to Base64
    const options = {
      maxSizeMB: 0.5,  // Max file size
      maxWidthOrHeight: 400,  // Max dimensions
      useWebWorker: true
    };
    
    const compressedFile = await imageCompression(file, options);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result);
    };
    reader.readAsDataURL(compressedFile);
    
  } catch (error) {
    console.error('Error processing image:', error);
    alert('Failed to process image');
  }
};
```

## Comparison

| Feature | Base64 (Current) | Firebase Storage (Recommended) |
|---------|------------------|--------------------------------|
| Implementation | Simple | Moderate |
| Performance | Slow | Fast |
| Storage Cost | Inefficient | Efficient |
| Size Limit | ~700KB safe | 5GB per file |
| CDN | No | Yes (automatic) |
| Best Practice | ❌ No | ✅ Yes |

## Recommendation

**Use Firebase Storage** - It's the proper way and will scale better as your app grows. The implementation is straightforward and you already have it configured!
