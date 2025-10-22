# 🎉 Alternative Athletics - New Features Guide

## ✅ All Features Implemented Successfully!

---

## 📅 **1. Shared Calendar for All Members**

### **What Changed:**
✅ **All calendar events are now visible to everyone**
- When admins create workout sessions, they automatically appear on all members' calendars
- No more per-user filtering - everyone sees the complete gym class schedule

### **How It Works:**
- **Admins**: Create events that all members can see
- **Members**: View the full class schedule and see when workouts are happening
- Events show up instantly for all users

---

## 👤 **2. Enhanced User Profiles**

### **New Profile Tabs:**

#### **📸 Photo Upload**
- Click the camera icon when editing your profile
- Upload profile photos (JPG, PNG, WebP, etc.)
- Photos display as your profile picture throughout the app

#### **⚖️ Stats & Goals Tab**
- **Current Weight**: Track your current weight in lbs
- **Goal Weight**: Set your target weight
- **Progress Tracker**: Automatically calculates how many lbs to goal

#### **💪 1 Rep Max Tab**
- Track your one-rep max for different exercises
- Add exercise name (e.g., "Squat", "Deadlift", "Bench Press")
- Record weight in lbs
- View all your 1RMs in one place
- Delete/update entries anytime

#### **🏆 Personal Records Tab**
- Log personal achievements
- Track any type of record (time, reps, distance, etc.)
- Add date for each record
- Visual trophy badges for PRs
- Examples:
  - "Murph" - "32:45" 
  - "Max Pull-ups" - "50 reps"
  - "Fran" - "3:15"

### **How to Use:**
1. Go to **Profile** page
2. Click **Edit Profile**
3. Use the tabs to navigate between sections
4. Add your data
5. Click **Save Changes**

---

## 🏆 **3. Leaderboard System**

### **Two Leaderboard Types:**

#### **Main Workout**
- Primary workout of the day
- Track completion times and weights used

#### **Locker WOD** (Workout of the Day)
- Secondary/bonus workout
- Separate leaderboard from main workout

### **Features:**

#### **🥇 Ranked Display**
- **1st Place**: Gold medal, yellow background
- **2nd Place**: Silver background
- **3rd Place**: Bronze/orange background
- **Others**: Standard gray background
- Automatically sorted by **fastest time** (lowest to highest)

#### **📊 Entry Format**
- **Athlete Name**: Auto-populated from member list
- **Time**: In seconds (180) or MM:SS format (3:00)
- **Weight Used**: Optional, in lbs (e.g., "135" for Rx weight)

---

## 🔧 **Admin Features: Managing Leaderboards**

### **How to Add Leaderboard Entries:**

#### **Method 1: From Calendar Event**
1. Click on a calendar event
2. Click **"Manage Leaderboards"** button (yellow trophy button)
3. Choose **Main Workout** or **Locker WOD** tab
4. Select athlete from dropdown
5. Enter time (e.g., "180" or "3:00")
6. Enter weight (optional)
7. Click **"+"** to add
8. Click **"Save Leaderboards"**

#### **Method 2: Ctrl+Click on Calendar**
1. Hold **Ctrl** (or **Cmd** on Mac)
2. Click any event on the calendar
3. Opens leaderboard modal directly

### **Active Members Selection:**
- Dropdown shows **all registered gym members**
- Select only members who participated that day
- Add multiple entries for the same workout
- Easy to add, edit, or remove entries

### **Time Format Options:**
Both formats work and display correctly:
- **Seconds**: `180` → displays as "3:00"
- **MM:SS**: `3:00` → displays as "3:00"
- **Decimals**: `125.5` → displays as "2:05"

### **Automatic Sorting:**
- Entries automatically sort by **fastest time first**
- No manual reordering needed
- Rankings update instantly (1st, 2nd, 3rd, etc.)

---

## 📱 **Member Experience: Viewing Leaderboards**

### **How Members View Leaderboards:**

1. **Calendar Indicator**:
   - Events with leaderboards show 🏆 emoji
   - Look for: "🏆 Morning WOD" on the calendar

2. **Click to View**:
   - **Members**: Simply click any event with a 🏆
   - **Admins**: Ctrl+Click to view (regular click edits)

3. **Leaderboard Display**:
   - See both Main Workout and Locker WOD tabs
   - View rankings with medals
   - See times and weights used
   - Compare your performance with others

### **Motivational Features:**
- ✅ See who got top times
- ✅ Track your ranking over time
- ✅ Friendly competition among members
- ✅ Celebrate achievements together

---

## 🎯 **Complete Workflow Example**

### **For Admins:**

**1. Create Workout Event:**
```
1. Click date on calendar
2. Create event: "Monday WOD - Fran"
3. Save event
```

**2. After Workout - Add Leaderboards:**
```
1. Ctrl+Click the "Monday WOD - Fran" event
2. Select "Main Workout" tab
3. Add entries:
   - Select: John Doe
   - Time: 240 (4 minutes)
   - Weight: 95
   - Click +

   - Select: Jane Smith
   - Time: 195 (3:15)
   - Weight: 65
   - Click +

   - Select: Mike Johnson  
   - Time: 310 (5:10)
   - Weight: 115
   - Click +

4. Click "Save Leaderboards"
```

**3. Result:**
- Automatic ranking: Jane (1st), John (2nd), Mike (3rd)
- 🏆 appears on calendar event
- All members can now view it!

### **For Members:**

**1. Check Schedule:**
```
- Open Calendar
- See "🏆 Monday WOD - Fran"
```

**2. View Leaderboard:**
```
- Click the event
- See Main Workout tab:
  🥇 Jane Smith - 3:15 @ 65 lbs
  🥈 John Doe - 4:00 @ 95 lbs
  🥉 Mike Johnson - 5:10 @ 115 lbs
```

**3. Update Profile:**
```
- Go to Profile > Personal Records
- Add: "Fran" - "3:15" - date
- Save!
```

---

## 📊 **Database Structure**

### **User Profile Fields (Firestore):**
```javascript
{
  uid: "user_id",
  displayName: "John Doe",
  email: "john@example.com",
  role: "member",
  
  // NEW FIELDS:
  photoURL: "data:image/jpeg;base64,...",  // Profile photo
  currentWeight: "185",                     // Current weight (lbs)
  goalWeight: "175",                        // Goal weight (lbs)
  
  oneRepMaxes: [                           // 1RM tracking
    {
      id: 1234567890,
      exercise: "Squat",
      weight: "315"
    },
    {
      id: 1234567891,
      exercise: "Deadlift",
      weight: "405"
    }
  ],
  
  personalRecords: [                       // PRs tracking
    {
      id: 1234567892,
      exercise: "Fran",
      record: "3:15",
      date: "2024-10-21"
    },
    {
      id: 1234567893,
      exercise: "Max Pull-ups",
      record: "50 reps",
      date: "2024-10-15"
    }
  ]
}
```

### **Calendar Event with Leaderboards:**
```javascript
{
  id: "event_id",
  title: "Monday WOD",
  start: "2024-10-21T09:00:00",
  end: "2024-10-21T10:00:00",
  workoutId: "workout_id",
  
  // NEW FIELDS:
  mainLeaderboard: [
    {
      id: 1234567894,
      userId: "user_id_1",
      userName: "Jane Smith",
      time: "195",      // 3:15 in seconds
      weight: "65"
    },
    {
      id: 1234567895,
      userId: "user_id_2",
      userName: "John Doe",
      time: "240",      // 4:00 in seconds
      weight: "95"
    }
  ],
  
  lockerWodLeaderboard: [
    {
      id: 1234567896,
      userId: "user_id_3",
      userName: "Mike Johnson",
      time: "180",
      weight: "135"
    }
  ]
}
```

---

## 🎨 **UI/UX Highlights**

### **Visual Indicators:**
- 🏆 **Trophy emoji** on calendar events with leaderboards
- 🥇 **Gold medal** for 1st place
- 🥈 **Silver background** for 2nd place
- 🥉 **Bronze background** for 3rd place
- **Color-coded tabs** for easy navigation
- **Profile photo badges** throughout the app

### **Responsive Design:**
- ✅ Desktop optimized
- ✅ Tablet friendly
- ✅ Mobile responsive
- ✅ Touch-friendly buttons

### **User Feedback:**
- Loading states
- Success messages
- Error handling
- Confirmation dialogs

---

## 🔐 **Permissions**

| Feature | Admin | Member |
|---------|-------|--------|
| Create calendar events | ✅ | ❌ |
| View calendar events | ✅ | ✅ |
| Add leaderboard entries | ✅ | ❌ |
| Remove leaderboard entries | ✅ | ❌ |
| View leaderboards | ✅ | ✅ |
| Edit own profile | ✅ | ✅ |
| Upload profile photo | ✅ | ✅ |
| Track 1RMs | ✅ | ✅ |
| Log PRs | ✅ | ✅ |

---

## 🚀 **Quick Start Guide**

### **As Admin:**

1. **Create a Class:**
   ```
   - Click date on calendar
   - Fill in details
   - Save
   ```

2. **After Class - Add Leaderboard:**
   ```
   - Ctrl+Click the event
   - Switch tabs (Main/Locker)
   - Select athletes
   - Enter times & weights
   - Save
   ```

3. **Monitor Progress:**
   ```
   - Go to Admin Dashboard
   - View member activity
   - Track engagement
   ```

### **As Member:**

1. **Check Schedule:**
   ```
   - View Calendar
   - See upcoming classes
   - Look for 🏆 events
   ```

2. **View Results:**
   ```
   - Click 🏆 events
   - See leaderboards
   - Compare times
   ```

3. **Update Profile:**
   ```
   - Go to Profile
   - Use tabs to navigate
   - Track weight, 1RMs, PRs
   - Upload photo
   ```

---

## 💡 **Pro Tips**

### **For Admins:**
- ✅ Add leaderboards same day as workout for best engagement
- ✅ Use Ctrl+Click shortcut for quick leaderboard access
- ✅ Include weight used so members can compare Rx vs scaled
- ✅ Add both Main and Locker WOD when applicable

### **For Members:**
- ✅ Update your profile regularly to track progress
- ✅ Check leaderboards after workouts
- ✅ Log your PRs when you hit them
- ✅ Use 1RM tab to plan scaling weights

---

## 🐛 **Troubleshooting**

### **"Leaderboard not showing"**
- **Cause**: Admin hasn't added entries yet
- **Solution**: Check back later or ask gym staff

### **"Can't add leaderboard entry"**
- **Cause**: You're not an admin
- **Solution**: Only admins can manage leaderboards

### **"Profile photo not uploading"**
- **Cause**: File might be too large
- **Solution**: Resize image to under 1MB, try again

### **"🏆 not appearing on calendar"**
- **Cause**: No leaderboard entries added yet
- **Solution**: Trophy only shows after admin adds at least one entry

---

## 🎉 **Summary**

### **✅ What You Can Do Now:**

**Members:**
- View complete gym class schedule
- See leaderboard rankings for workouts
- Track weight progress and goals
- Log 1 rep maxes
- Record personal achievements
- Upload profile photos
- Compare performance with other members

**Admins:**
- Schedule classes visible to all
- Manage dual leaderboards (Main + Locker WOD)
- Select active participants
- Track times and weights
- Create competitive, engaging environment
- Monitor member activity
- Build community through friendly competition

---

## 🔄 **What's Different From Before:**

| Before | After |
|--------|-------|
| Events filtered per user | All events visible to everyone ✅ |
| Basic profile only | Full stats tracking ✅ |
| No performance tracking | Dual leaderboards ✅ |
| No photo uploads | Profile photos ✅ |
| No 1RM tracking | Complete 1RM system ✅ |
| No PR logging | Personal records tracking ✅ |
| No competition features | Rankings & medals ✅ |

---

## 📞 **Need Help?**

If you have questions about any of these features:
1. Check this guide first
2. Try the feature yourself
3. Ask gym administrators
4. Reference the ADMIN_ACCESS.md for setup help

---

**Alternative Athletics - Built for community, competition, and progress! 💪🏆**
