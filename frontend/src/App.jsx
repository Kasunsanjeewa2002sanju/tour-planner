import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, fetchPreferences } from './features/users/userSlice';
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
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  
  if (loading) return <div className="auth-container">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchMe());
      dispatch(fetchPreferences());
    }
  }, [isAuthenticated, token, dispatch]);

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
