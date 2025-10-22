# ⚡ Quick Start Guide

Get your GymApp up and running in 5 minutes!

## Step 1: Install Dependencies (1 minute)

```bash
npm install
```

## Step 2: Firebase Setup (2 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it (e.g., "my-gym-app")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication
1. Click "Authentication" → "Get started"
2. Click "Email/Password" → Enable it → Save

### Create Firestore Database
1. Click "Firestore Database" → "Create database"
2. Choose "Start in test mode"
3. Select your region
4. Click "Enable"

### Get Configuration
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll to "Your apps" → Click Web icon (</>)
3. Register app (name: "GymApp")
4. Copy the config values

## Step 3: Configure Environment (1 minute)

Create `.env` file in project root:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=my-gym-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-gym-app
VITE_FIREBASE_STORAGE_BUCKET=my-gym-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

💡 **Tip:** Copy from `.env.example` and replace the values

## Step 4: Start Development Server (30 seconds)

```bash
npm run dev
```

Open http://localhost:5173 🎉

## Step 5: Create Your Account (30 seconds)

1. Click "Sign up"
2. Enter email and password
3. Fill in your name
4. Click "Sign up"

You're in! 🚀

## What's Next?

### Create Your First Workout
1. Go to "Workouts" in sidebar
2. Click "New Workout"
3. Add exercises with sets/reps
4. Save

### Schedule a Session
1. Go to "Calendar"
2. Click on any date
3. Add event details
4. Link to a workout (optional)
5. Save

### Log Your Progress
1. Go to "Logs"
2. Click "New Log"
3. Record your workout
4. Track your performance

## Common Issues

### "Module not found" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Firebase auth not working
- Check `.env` values are correct
- Verify Email/Password is enabled in Firebase Console

### Blank screen
- Open browser console (F12)
- Check for error messages
- Verify Firebase config is correct

## Need Help?

- 📖 Full docs: [INSTALLATION.md](./INSTALLATION.md)
- 🚀 Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 💬 Check browser console for errors

---

**Happy training! 💪**
