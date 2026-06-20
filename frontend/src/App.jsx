import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession, logout } from './features/auth/authSlice';
import { fetchPreferences } from './features/users/userSlice';
import { setUnauthorizedHandler } from './api/api';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import TourGuideDashboard from './pages/TourGuideDashboard';
import DestinationsPage from './pages/DestinationManagement/DestinationsPage';
import PlanTourPage from './pages/TourManagement/PlanTourPage';
import AuthenticatedLayout from './components/layout/AuthenticatedLayout';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, authInitialized, sessionLoading, user } = useSelector((state) => state.auth);

  if (!authInitialized || sessionLoading) {
    return <div className="auth-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !user) {
    return <div className="auth-container">Loading...</div>;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(logout());
    });
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPreferences());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <AuthenticatedLayout>
                <DashboardPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/guide/dashboard"
          element={
            <ProtectedRoute allowedRoles={['tour_guide']}>
              <AuthenticatedLayout>
                <TourGuideDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
              <AuthenticatedLayout>
                <AdminDashboard />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/destinations"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <DestinationsPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout>
                <ProfilePage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/plan-tour"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <AuthenticatedLayout>
                <PlanTourPage />
              </AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
