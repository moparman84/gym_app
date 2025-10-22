# 🏋️ GymApp - Workout Management & Scheduling System

A modern, full-featured gym management web application built with React, Firebase, and TailwindCSS. Perfect for personal trainers, gym owners, or fitness enthusiasts looking to track and schedule workouts.

![React](https://img.shields.io/badge/React-18-blue)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 **Authentication**
- Secure email/password authentication via Firebase Auth
- Protected routes with automatic redirection
- User profile management with role-based access (admin, coach, member)

### 📅 **Calendar Management**
- Interactive workout calendar powered by FullCalendar
- Day, week, and month views
- Drag-and-drop event scheduling
- Link workouts to calendar events
- Real-time sync with Firestore

### 💪 **Workout Library**
- Create custom workout templates
- Add exercises with sets, reps, and notes
- Full CRUD operations (Create, Read, Update, Delete)
- Organize workouts by categories

### 📊 **Progress Tracking**
- Log daily workouts with detailed exercise data
- Track sets, reps, weight, and personal notes
- View workout history sorted by date
- Monitor performance over time

### 👤 **User Profiles**
- Customizable user profiles
- Role-based permissions
- Bio and contact information
- Profile editing capabilities

### 📱 **Responsive Design**
- Fully responsive mobile-first design
- Touch-friendly interface
- Works seamlessly on desktop, tablet, and mobile
- Modern UI with TailwindCSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Firebase account (free tier works)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
```

2. **Set up Firebase:**

- Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
- Enable Email/Password authentication
- Create a Firestore database
- Copy your Firebase config

3. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Run development server:**

```bash
npm run dev
```

Visit `http://localhost:5173` 🎉

## 📚 Documentation

- **[Installation Guide](./INSTALLATION.md)** - Detailed setup instructions
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Firebase Hosting or other platforms

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM v6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework

### Backend & Services
- **Firebase Authentication** - User authentication
- **Firestore** - NoSQL cloud database
- **Firebase Hosting** - Web hosting (deployment)

### UI Components & Libraries
- **FullCalendar** - Interactive calendar
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Heroicons** - Beautiful icons
- **date-fns** - Date manipulation

### State Management
- **Zustand** - Lightweight state management

## 📁 Project Structure

```
gym_app/
├── src/
│   ├── components/
│   │   ├── auth/              # Login, Register, ProtectedRoute
│   │   ├── calendar/          # EventModal
│   │   ├── layout/            # DashboardLayout
│   │   ├── workouts/          # WorkoutModal
│   │   └── workoutLogs/       # LogModal
│   ├── pages/
│   │   ├── LandingPage.jsx    # Public landing page
│   │   ├── CalendarPage.jsx   # Workout calendar
│   │   ├── WorkoutsPage.jsx   # Workout library
│   │   ├── LogsPage.jsx       # Workout logs
│   │   └── ProfilePage.jsx    # User profile
│   ├── config/
│   │   └── firebase.js        # Firebase configuration
│   ├── store/
│   │   └── useAuthStore.js    # Authentication state
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
├── .env.example               # Environment variables template
├── firebase.json              # Firebase hosting config
├── tailwind.config.js         # Tailwind configuration
├── vite.config.js             # Vite configuration
└── package.json               # Dependencies

```

## 🔥 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Deployment
firebase deploy      # Deploy to Firebase Hosting
```

## 🗄️ Database Schema

### Collections

- **`users`** - User profiles and roles
- **`workouts`** - Workout templates with exercises
- **`events`** - Calendar events and scheduled workouts
- **`logs`** - Workout completion logs

See [INSTALLATION.md](./INSTALLATION.md) for detailed schema structure.

## 🔒 Security

- Environment variables for sensitive data
- Firebase Security Rules for Firestore
- Protected routes requiring authentication
- Role-based access control

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Branding

- Update app name in `index.html`
- Replace logos in `public/` directory
- Modify landing page content in `LandingPage.jsx`

## 🚢 Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions and alternative platforms.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter issues:

1. Check [INSTALLATION.md](./INSTALLATION.md) for troubleshooting
2. Review Firebase Console for error messages
3. Check browser console for client-side errors

## 🎯 Roadmap

Future enhancements:
- [ ] Advanced analytics and charts
- [ ] Exercise video demonstrations
- [ ] Social features (share workouts)
- [ ] Mobile app (React Native)
- [ ] Nutrition tracking
- [ ] Coach-client messaging
- [ ] Workout plan templates
- [ ] Export workout data

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev)
- Powered by [Firebase](https://firebase.google.com)
- Styled with [TailwindCSS](https://tailwindcss.com)
- Icons by [Heroicons](https://heroicons.com)

---

**Made with ❤️ for the fitness community**
