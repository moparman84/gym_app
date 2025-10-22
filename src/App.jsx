import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import CalendarPage from './pages/CalendarPage';
import WorkoutsPage from './pages/WorkoutsPage';
import LogsPage from './pages/LogsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import MessageBoardPage from './pages/MessageBoardPage';
import MessageThreadPage from './pages/MessageThreadPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initAuth();
    return () => unsubscribe();
  }, [initAuth]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CalendarPage />} />
          <Route path="workouts" element={<WorkoutsPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="messages" element={<MessageBoardPage />} />
          <Route path="messages/:postId" element={<MessageThreadPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
