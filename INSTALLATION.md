# GymApp - Installation & Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18+ and **npm** 9+
- A **Firebase** account (free tier works fine)
- A code editor (VS Code recommended)

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- React 18 & React Router DOM
- Firebase SDK
- TailwindCSS
- FullCalendar
- React Hook Form & Zod
- Zustand
- Heroicons

## Step 2: Firebase Setup

### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the setup wizard
3. Once created, click on "Web" (</>) to add a web app
4. Register your app with a nickname (e.g., "GymApp")

### 2.2 Enable Firebase Services

**Enable Authentication:**
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Click "Save"

**Create Firestore Database:**
1. Go to **Firestore Database** > **Create database**
2. Start in **test mode** (you can add security rules later)
3. Choose a location closest to your users
4. Click "Enable"

### 2.3 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Copy the Firebase configuration object

### 2.4 Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

2. Edit `.env` and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important:** Never commit the `.env` file to version control!

## Step 3: Run Development Server

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Step 4: Create Your First User

1. Navigate to `http://localhost:5173`
2. Click "Sign up" or go to `/register`
3. Create an account with email and password
4. You'll be automatically logged in and redirected to the dashboard

## Step 5: (Optional) Set Admin Role

By default, all users are created with the "member" role. To make a user an admin:

1. Go to Firebase Console > Firestore Database
2. Navigate to the `users` collection
3. Find your user document (by email or uid)
4. Edit the `role` field and change it to `"admin"`
5. Refresh your app to see admin features

## Firestore Database Structure

The app uses the following collections:

### `users`
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "John Doe",
  role: "member" | "coach" | "admin",
  createdAt: "ISO timestamp",
  bio: "optional",
  phone: "optional"
}
```

### `workouts`
```javascript
{
  name: "Upper Body Strength",
  description: "Full upper body workout",
  exercises: [
    {
      name: "Bench Press",
      sets: "3",
      reps: "10",
      notes: "optional"
    }
  ],
  createdBy: "user_id",
  createdAt: "ISO timestamp"
}
```

### `events`
```javascript
{
  title: "Morning Workout",
  start: "2024-01-15T09:00:00",
  end: "2024-01-15T10:00:00",
  workoutId: "workout_id (optional)",
  description: "optional",
  assignedUsers: ["user_id"],
  createdBy: "user_id",
  createdAt: "ISO timestamp"
}
```

### `logs`
```javascript
{
  workoutName: "Leg Day",
  date: "2024-01-15",
  exercises: [
    {
      name: "Squats",
      sets: "4",
      reps: "8",
      weight: "225",
      notes: "optional"
    }
  ],
  notes: "Great session!",
  userId: "user_id",
  createdAt: "ISO timestamp"
}
```

## Troubleshooting

### Issue: "Module not found" errors
**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Firebase auth not working
**Solution:** 
- Verify your `.env` file has correct values
- Ensure Email/Password auth is enabled in Firebase Console
- Check browser console for specific error messages

### Issue: Firestore permission errors
**Solution:** 
- Ensure Firestore is in test mode during development
- For production, add proper security rules (see DEPLOYMENT.md)

### Issue: TailwindCSS not working
**Solution:**
- Verify `tailwind.config.js` and `postcss.config.js` exist
- Check that `@tailwind` directives are in `src/index.css`
- Restart the dev server

## Next Steps

- Customize the app colors in `tailwind.config.js`
- Add Firebase security rules for production
- See `DEPLOYMENT.md` for deployment instructions
- Explore the codebase and add custom features

## Support

For issues or questions:
- Check Firebase documentation: https://firebase.google.com/docs
- Check Vite documentation: https://vitejs.dev
- Review the codebase comments and structure
