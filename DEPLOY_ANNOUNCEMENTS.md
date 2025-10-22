# Deploy Announcements Feature

## ✅ Firestore Rules Updated

The `firestore.rules` file has been updated with announcements security rules.

## 🚀 Deploy to Firebase

### Option 1: Firebase Console (Quick)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Firestore Database** in left menu
4. Click **Rules** tab
5. Copy the entire content from `firestore.rules` file
6. Paste into the editor
7. Click **Publish**

### Option 2: Firebase CLI (Recommended)

```bash
# Make sure you're in the project directory
cd c:\Users\Smile\source\repos\gym_app\gym_app

# Deploy only Firestore rules
firebase deploy --only firestore:rules
```

## 📋 What Was Added

```javascript
// Announcements collection
match /announcements/{announcementId} {
  allow read: if true; // Everyone can read announcements
  allow create: if isAdmin(); // Only admins can create
  allow delete: if isAdmin(); // Only admins can delete
}
```

### Security Features:
- ✅ **Anyone can read** - Even non-logged-in users can see announcements
- ✅ **Only admins create** - Regular members cannot post announcements
- ✅ **Only admins delete** - Regular members cannot delete announcements
- ✅ **No updates** - Announcements are create/delete only (no editing)

## 🔍 Verify Deployment

After deploying, test the following:

### As Admin:
1. ✅ Can create announcements
2. ✅ Can delete announcements
3. ✅ Can view all announcements

### As Regular Member:
1. ✅ Can view all announcements
2. ❌ Cannot see "Add Announcement" button
3. ❌ Cannot delete announcements
4. ❌ Cannot access delete functionality

## 🧪 Test the Rules

Use Firebase Console → Firestore → Rules → Rules Playground:

```javascript
// Test 1: Read (should ALLOW)
service: cloud.firestore
location: /databases/(default)/documents/announcements/test123
operation: get
authenticated: yes
auth uid: any-user-id

// Test 2: Create as Admin (should ALLOW)
service: cloud.firestore
location: /databases/(default)/documents/announcements/test456
operation: create
authenticated: yes
auth uid: admin-user-id
(with role: 'admin' in users collection)

// Test 3: Create as Member (should DENY)
service: cloud.firestore
location: /databases/(default)/documents/announcements/test789
operation: create
authenticated: yes
auth uid: member-user-id
(with role: 'member' in users collection)
```

## 📝 Collection Structure

```javascript
// Collection: announcements
{
  "announcementId": {
    title: "Gym Closure This Weekend",
    body: "The gym will be closed on Saturday...",
    createdAt: "2025-10-21T21:38:00.000Z",
    createdBy: "Admin Name"
  }
}
```

## ⚠️ Important Notes

1. **Deploy Required** - Rules must be deployed before announcements will work
2. **Admin Role** - User must have `role: 'admin'` in users collection
3. **Public Read** - Announcements are publicly readable (intentional)
4. **No Edit** - Only create/delete (prevents announcement modification)

## 🎉 Ready to Use!

Once deployed:
1. Go to Calendar page
2. Scroll to Announcements section
3. Click "Add Announcement" (admin only)
4. Start posting announcements!

## 🔧 Troubleshooting

### "Permission denied" when creating announcement
- Check user has `role: 'admin'` in Firestore users collection
- Verify rules are deployed
- Check browser console for specific error

### Can't see announcements
- Check Firestore console for `announcements` collection
- Verify at least one announcement exists
- Check browser console for errors

### Rules not working
- Re-deploy: `firebase deploy --only firestore:rules`
- Check for syntax errors in Firebase Console
- Wait 1-2 minutes for propagation
