import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import StatusBadge from '../../components/StatusBadge';

const AllAppointments = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all | confirmed | completed | cancelled

  const fetchAppointments = async (statusFilter) => {
    try {
      setLoading(true);
      let url = '/appointments/all';
      if (statusFilter && statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      const response = await api.get(url);
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch appointment logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(activeTab);
  }, [activeTab]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      if (response.data.success) {
        showToast(`Status updated to ${status} successfully`, 'success');
        fetchAppointments(activeTab); // Reload
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update appointment status.', 'error');
    }
  };

  const tabs = [
    { id: 'all', label: 'All Log' },
    { id: 'confirmed', label: 'Confirmed / Pending' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled & No-Show' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Appointment Logs
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Master registry of all patient consult listings
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

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-2xl h-64 animate-pulse" />
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-400">No appointments recorded under this status.</p>
        </div>
      ) : (
        /* Table Card */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs font-medium text-slate-500">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Patient Name</th>
                  <th className="px-6 py-4 font-bold">Doctor Assigned</th>
                  <th className="px-6 py-4 font-bold">Department</th>
                  <th className="px-6 py-4 font-bold">Date & Slot</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((appt) => {
                  const isUpcoming = ['pending', 'confirmed'].includes(appt.status);

                  return (
                    <tr key={appt._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 text-sm">
                        {appt.patientName || appt.patient?.name || 'Unknown Patient'}
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-semibold">
                        {appt.doctor?.name || 'Dr. Doctor'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                          {appt.department?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {appt.date} <span className="text-slate-400 font-bold ml-1">({appt.slot})</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={appt.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isUpcoming ? (
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'cancelled')}
                              className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors focus:outline-none"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'no-show')}
                              className="text-xs font-bold text-slate-500 hover:bg-slate-50 px-2 py-1 rounded-lg border border-slate-200 transition-colors focus:outline-none"
                            >
                              No-Show
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt._id, 'completed')}
                              className="text-xs font-bold text-white bg-primary hover:bg-primary-dark px-2.5 py-1 rounded-lg transition-colors focus:outline-none shadow-sm"
                            >
                              Complete
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-350 text-[10px] italic">No actions</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
