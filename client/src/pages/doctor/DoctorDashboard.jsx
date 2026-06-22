import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import AppointmentTile from '../../components/AppointmentTile';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [apptsRes, docsRes] = await Promise.all([
        api.get('/appointments/doctor'),
        api.get('/doctors'),
      ]);

      if (apptsRes.data.success) {
        setAppointments(apptsRes.data.data);
      }

      if (docsRes.data.success) {
        // Find current doctor profile
        const profile = docsRes.data.data.find(
          (doc) => doc.userId === user.id || doc.userId?._id === user.id
        );
        setDoctorProfile(profile);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      if (response.data.success) {
        showToast(`Appointment status updated to ${status}`, 'success');
        fetchData(); // Refresh data
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  const todayStr = getTodayDateString();

  // Metrics
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const todayCount = todayAppointments.length;
  const totalCount = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const ratingValue = doctorProfile?.rating || 4.8;

  const todayPendingAppts = todayAppointments.filter((a) => ['pending', 'confirmed'].includes(a.status));

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Greeting Card */}
      <div className="relative rounded-2xl bg-gradient-to-tr from-primary to-blue-600 p-6 sm:p-8 text-white shadow-md overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wider uppercase">
            🩺 Medical Practitioner Portal
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome back, {doctorProfile?.name || user?.name}!
          </h2>
          <p className="text-sm font-medium text-blue-100 leading-relaxed">
            Specialty: <span className="font-bold text-white">{doctorProfile?.specialty || doctorProfile?.department?.name || 'General Medicine'}</span>. Check today's consultations schedule, patient notes, or complete scheduled slots.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 h-44 w-44 rounded-full bg-white/10 blur-2xl pointer-events-none translate-x-12 translate-y-12" />
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl p-6" />
            ))}
          </div>
          <div className="h-64 bg-white border border-slate-100 rounded-2xl animate-pulse" />
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value={todayCount}
              label="Today's Appointments"
              color="blue"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
              }
              value={totalCount}
              label="Total Scheduled"
              color="rose"
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
                <svg className="w-6 h-6 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              }
              value={ratingValue.toFixed(1)}
              label="Practitioner Rating"
              color="amber"
            />
          </div>

          {/* Today's Schedule List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight">
                Today's Schedule ({todayPendingAppts.length} Pending)
              </h3>
              {appointments.length > 0 && (
                <Link
                  to="/doctor/appointments"
                  className="text-xs font-bold text-primary hover:text-primary-dark tracking-wide uppercase"
                >
                  View All Log History ({appointments.length})
                </Link>
              )}
            </div>

            {todayPendingAppts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                  </svg>
                </div>
                <h4 className="font-display text-sm font-bold text-slate-800 tracking-tight">
                  No pending consults today
                </h4>
                <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1">
                  You are all caught up! There are no remaining appointments scheduled for today.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {todayPendingAppts.map((appt) => (
                  <AppointmentTile
                    key={appt._id}
                    appointment={appt}
                    onAction={handleUpdateStatus}
                    role="doctor"
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

export default DoctorDashboard;
