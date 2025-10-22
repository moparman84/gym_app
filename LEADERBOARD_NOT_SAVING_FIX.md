# 🚨 URGENT: Leaderboards Not Saving to Firestore

## ⚡ **QUICK FIX (Do This First):**

### **Step 1: Update Firestore Rules NOW**

1. Go to: **https://console.firebase.google.com**
2. Select your project
3. Click **"Firestore Database"** (left sidebar)
4. Click **"Rules"** tab
5. **Copy and paste this EXACT code:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write everything (FOR TESTING)
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click **"Publish"** button
7. Wait for green checkmark "Rules successfully published"
8. **Wait 60 seconds** for rules to propagate

### **Step 2: Test Leaderboard Save**

1. **Hard refresh your app** (Ctrl + Shift + R)
2. Open browser console (F12)
3. Go to Training Schedule → Daily View
4. Ctrl+Click on a workout
5. Click "Manage Leaderboards"
6. Add an entry
7. Click "Save Leaderboards"
8. **Watch the console for error messages**

---

## 🔍 **Diagnose the Problem:**

### **Open Browser Console (F12) and look for:**

#### **✅ Success Message:**
```
=== SAVING LEADERBOARDS ===
Event ID: abc123
Main leaderboard entries: [...]
Event exists, current data: {...}
Updating event with: {...}
✅ SUCCESS! Leaderboards saved to Firestore
Verified saved data: {...}
```
**If you see this:** It's working! ✅

---

#### **❌ Permission Denied Error:**
```
❌ ERROR saving leaderboards
Error code: permission-denied
Error message: Missing or insufficient permissions
```

**THIS IS THE PROBLEM!** Your Firestore rules are blocking saves.

**FIX:**
1. Update Firestore rules (see Step 1 above)
2. Make sure you clicked "Publish"
3. Wait 60 seconds
4. Try again

---

#### **❌ Not Found Error:**
```
Error code: not-found
Error message: No document to update
```

**PROBLEM:** Event doesn't exist in Firestore

**FIX:**
1. Refresh the page
2. Create a NEW event
3. Try adding leaderboard to new event

---

#### **❌ Network Error:**
```
Error code: unavailable
Error message: Failed to get document
```

**PROBLEM:** Internet connection or Firebase is down

**FIX:**
1. Check internet connection
2. Check Firebase Console works
3. Try again in a few minutes

---

## 🔧 **Detailed Troubleshooting:**

### **Issue 1: Rules Not Published**

**Symptoms:**
- Permission denied error
- Console shows "permission-denied"

**Solution:**
```
✅ Go to Firebase Console
✅ Firestore Database → Rules
✅ Check rules have this line:
   allow read, write: if request.auth != null;
✅ Click Publish
✅ See green checkmark
✅ Wait 60 seconds
✅ Hard refresh app (Ctrl + Shift + R)
✅ Try again
```

---

### **Issue 2: Not Logged In**

**Symptoms:**
- Permission denied
- User profile shows as null

**Solution:**
```
✅ Check top right corner shows your name
✅ If not logged in, sign in again
✅ Refresh page
✅ Try again
```

---

### **Issue 3: Event Not in Firestore**

**Symptoms:**
- "Event not found" error
- Old events from before Firestore setup

**Solution:**
```
✅ Create a NEW event on calendar
✅ Use the new event
✅ Delete old events (they may be broken)
✅ Try again
```

---

### **Issue 4: Browser Cache**

**Symptoms:**
- Old code running
- Changes not appearing

**Solution:**
```
✅ Hard refresh: Ctrl + Shift + R
✅ Clear cache: Ctrl + Shift + Del
✅ Close all tabs
✅ Reopen app
✅ Try again
```

---

## 📋 **Complete Testing Checklist:**

### **Before Testing:**
- [ ] Firestore rules updated and published
- [ ] Green checkmark in Firebase Console
- [ ] Waited 60 seconds after publishing
- [ ] Hard refreshed browser (Ctrl + Shift + R)
- [ ] Verified logged in (name in top right)
- [ ] Browser console open (F12)

### **Test Steps:**
1. [ ] Go to Training Schedule
2. [ ] Switch to Daily View
3. [ ] Navigate to a day with a workout
4. [ ] Ctrl+Click the workout
5. [ ] Click "Manage Leaderboards"
6. [ ] Select a user from dropdown
7. [ ] Enter time (e.g., "3:45" or "225")
8. [ ] Click "Add Entry"
9. [ ] Entry appears in list
10. [ ] Click "Save Leaderboards"
11. [ ] **Watch console for messages**

### **Expected Console Output:**
```
=== SAVING LEADERBOARDS ===
Event ID: [event-id]
Main leaderboard entries: [{...}]
Event exists, current data: {...}
Updating event with: {mainLeaderboard: [...], ...}
✅ SUCCESS! Leaderboards saved to Firestore
Verified saved data: {mainLeaderboard: [...], ...}
```

### **If Success:**
- [ ] Alert says "Leaderboards saved successfully!"
- [ ] Modal closes
- [ ] Refresh page
- [ ] Leaderboard still shows (persisted!)
- [ ] Daily View shows leaderboard entries

### **If Failure:**
- [ ] Note the error code from console
- [ ] Note the error message
- [ ] Check which issue above matches
- [ ] Follow the fix steps
- [ ] Try again

---

## 🎯 **Most Common Issues:**

### **#1 - Firestore Rules (90% of cases)**

**Problem:** Rules block writes to `events` collection

**Current Rules Check:**
```javascript
// ❌ WRONG - Blocks updates:
match /events/{eventId} {
  allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}

// ✅ CORRECT - Allows authenticated users:
match /{document=**} {
  allow read, write: if request.auth != null;
}
```

**Fix:** Use the CORRECT rules from Step 1

---

### **#2 - Not Waiting After Rule Update**

**Problem:** Rules take time to propagate

**Fix:**
- Publish rules
- **WAIT 60 SECONDS** (seriously!)
- Hard refresh browser
- Try again

---

### **#3 - Old Broken Events**

**Problem:** Events created before rules were fixed

**Fix:**
- Delete old events
- Create fresh events
- Add leaderboards to new events

---

## 🆘 **Still Not Working?**

### **Copy This Info:**

1. **Open browser console (F12)**
2. **Try to save leaderboard**
3. **Copy ALL red error messages**
4. **Copy the console output**

### **Share These Details:**

```
Browser: [Chrome/Firefox/Safari]
Error Code: [permission-denied/not-found/etc]
Error Message: [full message]
Console Output: [paste entire console log]

Firestore Rules Status:
- Published? [yes/no]
- When published? [time]
- Green checkmark? [yes/no]

Testing:
- Logged in? [yes/no]
- Hard refreshed? [yes/no]
- New event or old? [new/old]
```

---

## ✅ **Final Verification:**

After fixing, verify everything works:

1. **Create new event**
   - [ ] Saves to Firestore
   - [ ] Shows on calendar
   - [ ] Shows in daily view

2. **Add leaderboard entry**
   - [ ] Can add entry
   - [ ] Can save leaderboard
   - [ ] No errors in console
   - [ ] Success message appears

3. **Verify persistence**
   - [ ] Refresh page (Ctrl + R)
   - [ ] Leaderboard still there
   - [ ] Daily view shows entries
   - [ ] Data persists ✅

---

## 🎉 **Success Indicators:**

You'll know it's working when:
- ✅ Console shows "✅ SUCCESS! Leaderboards saved to Firestore"
- ✅ Alert says "Leaderboards saved successfully!"
- ✅ Page refresh preserves leaderboards
- ✅ Daily view displays leaderboard entries
- ✅ No permission errors in console

---

## 📝 **Summary:**

**Problem:** Leaderboards not saving to Firestore  
**Root Cause:** Firestore security rules blocking writes  
**Solution:** Update rules to allow authenticated users  
**Time to Fix:** 2 minutes  
**Expected Result:** Leaderboards save and persist! ✅

---

**⚡ UPDATE THOSE FIRESTORE RULES NOW! ⚡**

See **DEPLOY_FIRESTORE_RULES.md** for detailed instructions.
