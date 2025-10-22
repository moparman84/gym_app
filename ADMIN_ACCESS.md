# 🔐 How to Access Admin Features

## ❗ Important: There is NO separate admin login page

**Admin access is controlled by your user role in Firestore, not by a special login page.**

---

## 📋 How to Become an Admin

### **Step 1: Create Your Account**
1. Go to the landing page
2. Click **"Member sign up"** (or **"Get started"**)
3. Fill in your details:
   - Full Name
   - Email
   - Password
4. Click **"Sign up"**

### **Step 2: Set Your Role to Admin in Firestore**

1. **Open Firebase Console**
   - Go to: https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Database**
   - Click "Firestore Database" in the left sidebar
   - Click on the `users` collection

3. **Find Your User Document**
   - Look for your user ID (it matches your Firebase Auth UID)
   - Or search by email

4. **Edit the Role Field**
   - Click on your user document
   - Find the `role` field
   - Change the value from `"member"` to `"admin"`
   - Click **"Update"**

### **Step 3: Sign Out and Sign Back In**
1. Sign out of the app
2. Sign back in with your email and password
3. You'll now see the **"Admin"** menu item in the sidebar!

---

## ✅ What You'll See as Admin

After setting your role to `"admin"`, you'll have access to:

### **In the Sidebar:**
- ✅ **Admin Dashboard** (new menu item appears)
- ✅ All regular member features

### **On Pages:**
- ✅ **Calendar:** Can create and edit class schedules
- ✅ **Workouts:** Can create, edit, and delete workout programs
- ✅ **Message Board:** Can delete any member's posts
- ✅ **Admin Dashboard:** See all member activity and login history

---

## 🔍 How to Tell if You're an Admin

**Check the sidebar:**
- If you see an **"Admin"** menu item with a shield icon → You're an admin ✅
- If you DON'T see it → You're a regular member

**On the Workouts page:**
- Admins see a **"New Workout"** button
- Members only see existing workouts

**On the Calendar:**
- Admins can click dates to create events
- Members see: "Only gym administrators can schedule workout sessions"

---

## 👥 User Roles Explained

| Role | Access Level |
|------|--------------|
| **member** | View schedules, view workouts, log personal workouts, use message board |
| **coach** | Same as member (can be customized later) |
| **admin** | Full access to everything + Admin Dashboard |

---

## 🛠️ Setting Roles for Other Users

As an admin, you'll need to manually set roles in Firestore:

1. Go to Firebase Console → Firestore Database
2. Open the `users` collection
3. Find the user you want to promote
4. Edit their `role` field:
   - `"admin"` - Full administrative access
   - `"coach"` - Same as member (customizable)
   - `"member"` - Standard access (default)

---

## ⚠️ Common Issues

### "I don't see the Admin menu"
**Causes:**
1. Your role is still set to `"member"` in Firestore
2. You haven't signed out and back in after changing the role
3. You're looking at an older cached version

**Solution:**
- Check Firestore: `users` collection → your document → `role` field
- Make sure it says exactly: `"admin"` (lowercase, with quotes)
- Sign out completely
- Sign back in
- Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)

### "I changed my role but nothing happened"
**Solution:**
- **Must sign out and sign back in** for role changes to take effect
- The app loads your role when you log in

### "Can I make myself admin through the app?"
**No.** For security reasons, role changes must be done in Firebase Console.
This prevents regular users from promoting themselves.

---

## 🎯 Quick Reference

**To Log In:**
1. Use the regular "Member login" button
2. Enter your email and password
3. No special admin URL or login page

**To Access Admin Features:**
1. Make sure your Firestore role is `"admin"`
2. Sign out and sign back in
3. Look for the "Admin" menu item in the sidebar

**To Promote Another User:**
1. Go to Firebase Console
2. Firestore Database → `users` collection
3. Find their user document
4. Change `role` to `"admin"`
5. They must sign out and back in

---

## 📞 Need Help?

If you're still having trouble accessing admin features:

1. ✅ Verify your email is in the `users` collection in Firestore
2. ✅ Confirm the `role` field says exactly `"admin"`
3. ✅ Sign out completely from the app
4. ✅ Sign back in
5. ✅ Check the browser console for any errors (F12)

**Still not working?** Check the Firebase Console for any security rule issues.

---

## 🎉 You're All Set!

Once you see the **"Admin"** menu item in your sidebar, you have full administrative access to Alternative Athletics' member portal!
