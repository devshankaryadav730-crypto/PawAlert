import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar     from './components/Navbar';
import Landing    from './pages/Landing';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Report     from './pages/Report';
import Track      from './pages/Track';
import Dashboard  from './pages/Dashboard';
import Authority  from './pages/Authority';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!user)   return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/report"    element={<Report />} />
        <Route path="/track"     element={<Track />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/authority" element={
          <ProtectedRoute role="authority"><Authority /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
