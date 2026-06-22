import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import AppointmentTile from '../../components/AppointmentTile';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/my');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard metrics. Please reload.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    try {
      const response = await api.delete(`/appointments/${id}`);
      if (response.data.success) {
        showToast('Appointment cancelled successfully', 'success');
        // Refresh listings
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to cancel appointment', 'error');
    }
  };

  // Calculate statistics
  const upcomingCount = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status)).length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const totalCount = appointments.length;

  // Doctors Visited: unique doctor ID counts among completed appointments
  const visitedDoctors = new Set(
    appointments.filter((a) => a.status === 'completed').map((a) => a.doctor?._id || a.doctor)
  );
  const doctorsVisitedCount = visitedDoctors.size;

  const upcomingAppointments = appointments
    .filter((a) => ['pending', 'confirmed'].includes(a.status))
    .slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Hero Greeting */}
      <div className="relative rounded-2xl bg-gradient-to-tr from-primary to-blue-600 p-6 sm:p-8 text-white shadow-md overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-3">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Hello, {user?.name}!
          </h2>
          <p className="text-sm font-medium text-blue-100 leading-relaxed">
            Welcome to your patient care portal. Book new sessions, check doctor schedules, or view your medical appointment history.
          </p>
          <div className="pt-2">
            <Link
              to="/patient/book"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 font-display text-sm font-bold text-primary hover:bg-blue-50 shadow-md shadow-black/5 hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Book New Appointment
            </Link>
          </div>
        </div>
        {/* Abstract decorative elements */}
        <div className="absolute right-0 bottom-0 h-44 w-44 rounded-full bg-white/10 blur-2xl pointer-events-none translate-x-12 translate-y-12" />
      </div>

      {loading ? (
        // Loading Skeleton
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl p-6" />
            ))}
          </div>
          <div className="h-64 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-8">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              value={upcomingCount}
              label="Upcoming Bookings"
              color="blue"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value={completedCount}
              label="Completed Visits"
              color="emerald"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              value={doctorsVisitedCount}
              label="Doctors Visited"
              color="amber"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              }
              value={totalCount}
              label="Total Appointments"
              color="rose"
            />
          </div>

          {/* Upcoming Appointments List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight">
                Upcoming Appointments
              </h3>
              {appointments.length > 0 && (
                <Link
                  to="/patient/appointments"
                  className="text-xs font-bold text-primary hover:text-primary-dark tracking-wide uppercase"
                >
                  View All ({appointments.length})
                </Link>
              )}
            </div>

            {upcomingAppointments.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-display text-sm font-bold text-slate-800 tracking-tight">
                  No upcoming appointments
                </h4>
                <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1">
                  You do not have any pending or confirmed sessions scheduled.
                </p>
                <Link
                  to="/patient/book"
                  className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark font-display text-xs font-bold text-white rounded-xl shadow-sm shadow-primary/10 transition-all duration-200"
                >
                  Schedule One Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingAppointments.map((appt) => (
                  <AppointmentTile
                    key={appt._id}
                    appointment={appt}
                    onAction={handleCancelAppointment}
                    role="patient"
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientDashboard;
