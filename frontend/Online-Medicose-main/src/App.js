import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Medications from './Medications';
import Appointments from './Appointments';
import NotificationCenter from './NotificationCenter';
import HealthAnalytics from './HealthAnalytics';
import DoctorDashboard from './DoctorDashboard';
import PrescriptionManager from './PrescriptionManager';
import VideoConsultation from './VideoConsultation';
import MedicationRefill from './MedicationRefill';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Root route - Login page */}
          <Route path="/" element={<Login />} />
          
          {/* Auth Routes - Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - Only accessible after login */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/medications" element={<ProtectedRoute element={<Medications />} />} />
          <Route path="/appointments" element={<ProtectedRoute element={<Appointments />} />} />
          <Route path="/notifications" element={<ProtectedRoute element={<NotificationCenter />} />} />
          <Route path="/health-analytics" element={<ProtectedRoute element={<HealthAnalytics />} />} />
          <Route path="/doctorProfile-dashboard" element={<ProtectedRoute element={<DoctorDashboard />} />} />
          <Route path="/prescriptions" element={<ProtectedRoute element={<PrescriptionManager />} />} />
          <Route path="/video-consultation" element={<ProtectedRoute element={<VideoConsultation />} />} />
          <Route path="/medication-refill" element={<ProtectedRoute element={<MedicationRefill />} />} />
          
          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;