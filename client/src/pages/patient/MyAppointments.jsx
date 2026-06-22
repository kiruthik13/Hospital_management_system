import React, { useEffect, useState } from 'react';
import AppointmentTile from '../../components/AppointmentTile';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';

const MyAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | completed | cancelled

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments/my');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not retrieve your appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      const response = await api.delete(`/appointments/${id}`);
      if (response.data.success) {
        showToast('Appointment cancelled successfully', 'success');
        fetchAppointments(); // Refresh list
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to cancel appointment', 'error');
    }
  };

  // Filter listings based on activeTab
  const getFilteredAppointments = () => {
    switch (activeTab) {
      case 'completed':
        return appointments.filter((a) => a.status === 'completed');
      case 'cancelled':
        return appointments.filter((a) => ['cancelled', 'no-show'].includes(a.status));
      case 'upcoming':
      default:
        return appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
    }
  };

  const filteredAppts = getFilteredAppointments();

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled & No-Show' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          My Appointments
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Review and manage your scheduled consultations
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 px-1 font-display text-sm font-bold border-b-2 transition-all duration-200 focus:outline-none -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        // Loading Skeleton
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 bg-white border border-slate-100 rounded-2xl p-5 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : filteredAppts.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <h4 className="font-display text-sm font-bold text-slate-800 tracking-tight">
            No appointments found
          </h4>
          <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1">
            You do not have any consultations in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppts.map((appt) => (
            <AppointmentTile
              key={appt._id}
              appointment={appt}
              onAction={handleCancel}
              role="patient"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
