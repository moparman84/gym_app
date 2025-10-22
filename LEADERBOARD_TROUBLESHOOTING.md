# 🏆 Leaderboard & Message Board Troubleshooting Guide

## 🚨 **CRITICAL: Firestore Rules Configuration Required!**

### **Issue: Leaderboards and Message Board Not Saving**

**ROOT CAUSE:** Your Firestore security rules don't have the correct collection names configured!

#### **The Problem:**
1. **Message Board** uses collection: `messageboard` (one word)
2. **Old Firestore rules** referenced: `messages` (plural, different name)
3. **Result:** No permission rules = writes are BLOCKED! ❌

#### **The Fix:**

**Option 1: QUICK FIX (Development Mode) - EASIEST**

1. Go to **Firebase Console**: https://console.firebase.google.com
2. Select your project
3. Click **"Firestore Database"** → **"Rules"** tab
4. Copy and paste this:

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

5. Click **"Publish"**

**Option 2: PRODUCTION RULES (Secure) - RECOMMENDED**

Copy the contents of `firestore.rules` file (in your project root) and paste into Firebase Console Rules tab.

---

## ✅ Issue: "Saved but not showing up when I check"

### **FIXED!** Here's what was wrong and how it's fixed:

---

## 🐛 **The Problem:**

The leaderboard modal was using **stale data** from the event prop instead of fetching fresh data from Firestore when reopening.

**What happened:**
1. You added entries ✅
2. Clicked "Save" ✅
3. Data saved to Firestore ✅
4. Closed modal ✅
5. Reopened modal ❌ **← Still showing old cached data**

---

## ✅ **The Fix:**

The modal now:
1. ✅ **Fetches fresh data** from Firestore every time it opens
2. ✅ Shows **loading spinner** while fetching
3. ✅ Displays the **actual saved data** from database
4. ✅ Logs everything to console for debugging

---

## 🔍 **How to Test the Fix:**

### **Step 1: Open Console**
- Press **F12**
- Go to **Console** tab

### **Step 2: Add Entry**
1. Open leaderboard modal (Ctrl+Click event)
2. Select a member
3. Enter time (e.g., "180" or "3:00")
4. Click **"+"** button

**Console should show:**
```
Adding entry: {userId: "...", userName: "...", time: "180", weight: "..."}
Updated main leaderboard: [...]
```

### **Step 3: Save**
1. Click **"Save Leaderboards"**

**Console should show:**
```
Saving leaderboards for event: abc123
Main leaderboard: [...]
Updating with data: {...}
Leaderboards saved successfully!
```

### **Step 4: Reopen and Verify**
1. Close the modal
2. Ctrl+Click the event again

**Console should show:**
```
Fetched fresh event data: {...}
```

**You should see:**
- ⏳ Loading spinner briefly
- 🏆 Your entries displayed with rankings!

---

## 🎯 **What to Look For:**

### **✅ SUCCESS - Working correctly:**
```
Console:
- "Fetched fresh event data: {mainLeaderboard: [...], lockerWodLeaderboard: [...]}"
- Data array has your entries

UI:
- Loading spinner appears briefly
- Entries display with medals (🥇🥈🥉)
- Times show correctly
- Names show correctly
```

### **❌ PROBLEM - Still not working:**

#### **Problem 1: Empty array in console**
```
Fetched fresh event data: {mainLeaderboard: [], lockerWodLeaderboard: []}
```
**Cause**: Data didn't save to Firestore  
**Solution**: Check Firestore rules (see FIRESTORE_RULES.md)

#### **Problem 2: "Event not found"**
```
Event not found in Firestore
```
**Cause**: Event doesn't exist in database  
**Solution**: Create a new event and try again

#### **Problem 3: No console logs at all**
**Cause**: Modal not opening or JavaScript error  
**Solution**: Check for red errors in console

---

## 🔧 **Additional Improvements Made:**

### **1. Time Format Conversion**
- **Before**: Only accepted seconds (180)
- **Now**: Accepts both formats:
  - Seconds: `180` → saves as "180"
  - MM:SS: `3:00` → converts to "180"

### **2. User Display**
- **Before**: Only showed displayName
- **Now**: Falls back to email if no displayName

### **3. Loading States**
- **Before**: No feedback while loading
- **Now**: Shows spinner and "Loading leaderboards..."

### **4. Debug Logging**
- Added console logs at every step
- Easy to see what's happening
- Helps identify issues quickly

---

## 📊 **Data Flow:**

### **When Saving:**
```
1. Click "Save Leaderboards"
   ↓
2. Create update object with both leaderboards
   ↓
3. Send to Firestore: updateDoc(eventRef, {...})
   ↓
4. Success! Data stored in database
   ↓
5. Close modal
   ↓
6. Calendar refreshes (shows 🏆 if entries exist)
```

### **When Opening:**
```
1. Click event (or Ctrl+Click)
   ↓
2. Modal opens with event ID
   ↓
3. Fetch fresh data: getDoc(eventRef)
   ↓
4. Parse mainLeaderboard and lockerWodLeaderboard
   ↓
5. Display with rankings and medals
```

---

## 🎨 **Visual Indicators:**

### **Calendar:**
- **No leaderboard**: "Monday WOD"
- **Has leaderboard**: "🏆 Monday WOD"

### **Rankings:**
- **1st Place**: 🥇 Gold background, yellow border
- **2nd Place**: 🥈 Gray background
- **3rd Place**: 🥉 Orange background
- **Others**: Regular gray background

### **Time Display:**
- Stored as seconds: "180"
- Displayed as: "3:00"
- Sorted automatically (fastest first)

---

## 🚨 **Common Issues & Solutions:**

### **Issue: "Loading spinner never stops"**
**Cause**: Firestore fetch timing out  
**Solution**: 
1. Check internet connection
2. Verify Firestore is enabled in Firebase Console
3. Check browser console for errors

### **Issue: "Entries disappear after refresh"**
**Cause**: Data not persisting to Firestore  
**Solution**:
1. Check Firestore rules allow write
2. Verify you're logged in
3. Check console for "permission denied" errors

### **Issue: "Times showing wrong"**
**Cause**: Format mismatch  
**Solution**: 
- Enter as seconds (180) or MM:SS (3:00)
- Both now work correctly

### **Issue: "User names showing as 'Unknown'"**
**Cause**: User profile not in Firestore  
**Solution**:
1. Make sure user has signed up
2. Check Firestore users collection
3. Verify displayName or email exists

---

## ✅ **Quick Checklist:**

Before reporting issues, verify:

- [ ] Firestore is enabled in Firebase Console
- [ ] Firestore rules allow authenticated users to write
- [ ] You're logged in as admin
- [ ] Event exists in calendar
- [ ] Browser console (F12) is open
- [ ] You see console logs when saving/loading
- [ ] No red errors in console

---

## 📝 **Testing Checklist:**

1. **Add Entry:**
   - [ ] Select user
   - [ ] Enter time
   - [ ] Click + button
   - [ ] Entry appears immediately

2. **Save:**
   - [ ] Click "Save Leaderboards"
   - [ ] See "Leaderboards saved successfully!"
   - [ ] Modal closes

3. **Verify Saved:**
   - [ ] Ctrl+Click event again
   - [ ] See loading spinner
   - [ ] Entries appear with correct data
   - [ ] Rankings correct (fastest first)

4. **Check Calendar:**
   - [ ] Event shows 🏆 emoji
   - [ ] Regular click (member) can view
   - [ ] Data persists after page refresh

---

## 🎉 **Success Indicators:**

You'll know it's working when:

1. ✅ Console shows "Fetched fresh event data" with your entries
2. ✅ Loading spinner appears briefly when opening
3. ✅ Entries display with correct names and times
4. ✅ Rankings show medals (1st, 2nd, 3rd)
5. ✅ Data persists after closing and reopening
6. ✅ Calendar shows 🏆 on events with leaderboards
7. ✅ Page refresh still shows saved data

---

## 🆘 **Still Having Issues?**

If it's still not working after following this guide:

1. **Clear browser cache**: Ctrl+Shift+Del
2. **Hard refresh**: Ctrl+Shift+R
3. **Check Firestore Console**: 
   - Go to Firebase Console
   - Click Firestore Database
   - Find your event document
   - Look for `mainLeaderboard` and `lockerWodLeaderboard` fields
   - Verify they contain your data

4. **Share console logs**: 
   - Copy everything from browser console
   - Look for errors (red text)
   - Check what data is being fetched/saved

---

## 📞 **Debug Commands:**

Paste these in browser console to check data:

```javascript
// Check if event has leaderboards in Firestore
// (Replace 'event_id' with your actual event ID)
import { doc, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';

const eventRef = doc(db, 'events', 'event_id');
const snap = await getDoc(eventRef);
console.log('Event data:', snap.data());
```

---

**The leaderboard system is now fully functional and fetches fresh data every time! 🎉**
