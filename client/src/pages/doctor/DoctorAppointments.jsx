import React, { useEffect, useState } from 'react';
import AppointmentTile from '../../components/AppointmentTile';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';

const DoctorAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all | confirmed | completed

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments/doctor');
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load appointment lists. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      if (response.data.success) {
        showToast(`Appointment status changed to ${status}`, 'success');
        fetchAppointments(); // Refresh list
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  // Filter based on selected tab
  const getFilteredAppointments = () => {
    switch (activeTab) {
      case 'confirmed':
        return appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
      case 'completed':
        return appointments.filter((a) => a.status === 'completed');
      case 'all':
      default:
        return appointments;
    }
  };

  const filteredAppts = getFilteredAppointments();

  const tabs = [
    { id: 'all', label: 'All Consultations' },
    { id: 'confirmed', label: 'Upcoming / Confirmed' },
    { id: 'completed', label: 'Completed History' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Appointment Schedule
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Monitor incoming visits and clinical consult logs
        </p>
      </div>

      {/* Tabs */}
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
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
          <h4 className="font-display text-sm font-bold text-slate-800 tracking-tight">
            No schedules found
          </h4>
          <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1">
            You do not have any patient listings in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppts.map((appt) => (
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
  );
};

export default DoctorAppointments;
