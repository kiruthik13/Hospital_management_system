import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Legend, Tooltip,
  AreaChart, Area, CartesianGrid, XAxis, YAxis, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api/axios';

const CHART_COLORS = {
  confirmed: '#2563eb',
  completed: '#10b981',
  cancelled: '#f43f5e',
  pending:   '#f59e0b',
  'no-show': '#94a3b8',
};

// ─── Chart Data Helpers ───────────────────────────────────────────────────────

const buildStatusPieData = (appointments) => {
  const counts = {};
  appointments.forEach((a) => {
    counts[a.status] = (counts[a.status] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

const buildWeeklyAreaData = (appointments) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  const result = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const label = days[d.getDay()];
    const count = appointments.filter(
      (a) => (a.createdAt || '').startsWith(dateStr)
    ).length;
    result.push({ day: label, appointments: count });
  }
  return result;
};

const buildTopDoctorsData = (appointments) => {
  const map = {};
  appointments.forEach((a) => {
    const docId = a.doctor?._id;
    if (!docId) return;
    if (!map[docId]) {
      map[docId] = {
        name: (a.doctor?.name || 'Doctor').replace('Dr. ', '').split(' ')[0],
        count: 0,
      };
    }
    map[docId].count += 1;
  });
  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-bold text-slate-800">{label || payload[0].name}</p>
        <p className="text-primary font-semibold">{payload[0].value} appointments</p>
      </div>
    );
  }
  return null;
};

// ─── Component ────────────────────────────────────────────────────────────────

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

        if (apptsRes.data.success) setAppointments(apptsRes.data.data);
        if (docsRes.data.success) setDoctors(docsRes.data.data);
        if (deptsRes.data.success) setDepartments(deptsRes.data.data);
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

  // Chart data
  const pieData = buildStatusPieData(appointments);
  const weeklyData = buildWeeklyAreaData(appointments);
  const topDoctorsData = buildTopDoctorsData(appointments);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Administrative Dashboard
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Hospital management control panel and analytics
        </p>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-white border border-slate-100 rounded-2xl" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : (
        <>
          {/* ── Stat Cards ────────────────────────────────────────────────── */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
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

          {/* ── Charts Row 1: Pie + Area ───────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Pie Chart — Appointments by Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
              <h3 className="font-display text-sm font-bold text-slate-800 mb-4 tracking-tight">
                Appointments by Status
              </h3>
              {pieData.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-sm text-slate-400 font-semibold">
                  No appointment data yet
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CHART_COLORS[entry.name] || '#94a3b8'}
                          stroke="none"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'capitalize' }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Area Chart — Weekly Trend */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
              <h3 className="font-display text-sm font-bold text-slate-800 mb-4 tracking-tight">
                Weekly Appointment Trend
              </h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ fill: '#2563eb', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#1d4ed8' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Bar Chart — Top Doctors ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]">
            <h3 className="font-display text-sm font-bold text-slate-800 mb-4 tracking-tight">
              Top Doctors by Bookings
            </h3>
            {topDoctorsData.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-sm text-slate-400 font-semibold">
                No booking data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topDoctorsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ── Details Section ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Appointments */}
            <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-800 tracking-tight">
                  Recent Appointments
                </h3>
                <Link to="/admin/appointments" className="text-xs font-bold text-primary hover:text-primary-dark tracking-wide uppercase">
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
                          <td className="py-3.5 text-slate-700">{appt.doctor?.name || 'Dr. Doctor'}</td>
                          <td className="py-3.5">
                            <span className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                              {appt.department?.name}
                            </span>
                          </td>
                          <td className="py-3.5 text-slate-600">{appt.date} ({appt.slot})</td>
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

            {/* Specialty Overview */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-slate-800 tracking-tight">
                  Specialty Focus
                </h3>
                <Link to="/admin/departments" className="text-xs font-bold text-primary hover:text-primary-dark tracking-wide uppercase">
                  Manage
                </Link>
              </div>
              <div className="divide-y divide-slate-50">
                {departments.map((dept) => (
                  <div key={dept._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xl flex-shrink-0">{dept.icon || '🏥'}</span>
                      <div className="truncate">
                        <span className="text-xs font-bold text-slate-800 block truncate">{dept.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold truncate block mt-0.5">{dept.description}</span>
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
