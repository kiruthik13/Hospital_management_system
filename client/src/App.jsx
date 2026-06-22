import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import FindDoctors from './pages/patient/FindDoctors';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import AllAppointments from './pages/admin/AllAppointments';
import Departments from './pages/admin/Departments';

// Redirect Component for /dashboard
const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  
  switch (user.role) {
    case 'patient':
      return <Navigate to="/patient/dashboard" replace />;
    case 'doctor':
      return <Navigate to="/doctor/dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Layout for Protected Pages
const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row relative">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Fallback Role Redirect */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Protected Routes Layout */}
          <Route element={<DashboardLayout />}>
            {/* Patient Routes */}
            <Route element={<ProtectedRoute role="patient" />}>
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/book" element={<BookAppointment />} />
              <Route path="/patient/appointments" element={<MyAppointments />} />
              <Route path="/patient/doctors" element={<FindDoctors />} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute role="doctor" />}>
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/doctors" element={<ManageDoctors />} />
              <Route path="/admin/appointments" element={<AllAppointments />} />
              <Route path="/admin/departments" element={<Departments />} />
            </Route>
          </Route>

          {/* Catch All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
