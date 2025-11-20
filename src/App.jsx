import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import ProfileSetup from './pages/ProfileSetup';
import Feed from './pages/Feed';
import Communities from './pages/Communities';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications'; 
import Saved from './pages/Saved';

const ProtectedRoute = ({ children }) => {
  const { user, userData, loading } = useAuth();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Loading...</div>;
  
  // 1. Not logged in? Go to Auth
  if (!user) return <Navigate to="/login" />;

  // 2. Logged in but no profile data? Go to Setup
  if (user && userData === null) return <Navigate to="/setup" />;

  // 3. Good to go
  return <Layout>{children}</Layout>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/setup" element={<ProfileSetup />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/communities" element={<ProtectedRoute><Communities /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}