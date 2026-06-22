import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [apptsRes, docsRes, deptsRes] = await Promise.all([
          api.get('/appointments/all'),
          api.get('/doctors'),
          api.get('/departments'),
        ]);

        if (apptsRes.data.success) {
          setAppointments(apptsRes.data.data);
        }
        if (docsRes.data.success) {
          setDoctors(docsRes.data.data);
        }
        if (deptsRes.data.success) {
          setDepartments(deptsRes.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to retrieve system metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalAppts = appointments.length;
  const confirmedAppts = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status)).length;
  const totalDocs = doctors.filter((d) => d.isActive).length;
  const totalDepts = departments.length;

  const recentAppts = appointments.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Administrative Dashboard
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Hospital management control panel and records log
        </p>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            <div className="lg:col-span-2 h-80 bg-white border border-slate-100 rounded-2xl" />
            <div className="h-80 bg-white border border-slate-100 rounded-2xl" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              value={totalAppts}
              label="Total Appointments"
              color="blue"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              value={confirmedAppts}
              label="Active / Confirmed"
              color="emerald"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              value={totalDocs}
              label="Active Doctors"
              color="amber"
            />
            <StatCard
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                </svg>
              }
              value={totalDepts}
              label="Total Specialties"
              color="rose"
            />
          </div>

          {/* Details Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Appointments Left */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-800 tracking-tight">
                  Recent Appointments
                </h3>
                <Link
                  to="/admin/appointments"
                  className="text-xs font-bold text-primary hover:text-primary-dark tracking-wide uppercase"
                >
                  View All
                </Link>
              </div>

              {recentAppts.length === 0 ? (
                <p className="text-center text-xs font-semibold text-slate-400 py-8">
                  No appointments scheduled.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs font-medium text-slate-500">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-slate-400 uppercase tracking-wider">
                        <th className="pb-3 font-bold">Patient</th>
                        <th className="pb-3 font-bold">Doctor</th>
                        <th className="pb-3 font-bold">Specialty</th>
                        <th className="pb-3 font-bold">Date & Slot</th>
                        <th className="pb-3 font-bold text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentAppts.map((appt) => (
                        <tr key={appt._id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3.5 font-bold text-slate-800">
                            {appt.patientName || appt.patient?.name}
                          </td>
                          <td className="py-3.5 text-slate-700">
                            {appt.doctor?.name || 'Dr. Doctor'}
                          </td>
                          <td className="py-3.5">
                            <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                              {appt.department?.name}
                            </span>
                          </td>
                          <td className="py-3.5 text-slate-600">
                            {appt.date} ({appt.slot})
                          </td>
                          <td className="py-3.5 text-right">
                            <StatusBadge status={appt.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Department Overview Right */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-800 tracking-tight">
                  Specialty Focus
                </h3>
                <Link
                  to="/admin/departments"
                  className="text-xs font-bold text-primary hover:text-primary-dark tracking-wide uppercase"
                >
                  Manage
                </Link>
              </div>

              <div className="divide-y divide-slate-50">
                {departments.map((dept) => (
                  <div key={dept._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl flex-shrink-0">{dept.icon || '🏥'}</span>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 block truncate">
                          {dept.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate block mt-0.5">
                          {dept.description}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-lg bg-primary-light text-primary border border-primary/10 px-2 py-0.5 text-[10px] font-bold">
                      {dept.doctorCount || 0} Doc
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
