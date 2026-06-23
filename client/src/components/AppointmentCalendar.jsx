import React, { useState } from 'react';
import Calendar from 'react-calendar';

const STATUS_COLORS = {
  confirmed: '#2563eb',
  completed: '#10b981',
  cancelled: '#f43f5e',
  pending: '#f59e0b',
  'no-show': '#94a3b8',
};

const STATUS_BG = {
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-rose-50 text-rose-600',
  pending: 'bg-amber-50 text-amber-700',
  'no-show': 'bg-slate-100 text-slate-500',
};

const formatDateKey = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const AppointmentCalendar = ({ appointments = [], role = 'patient' }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Build a map: dateKey → [appointment, ...]
  const appointmentsByDate = appointments.reduce((acc, appt) => {
    const key = appt.date; // already YYYY-MM-DD
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const key = formatDateKey(date);
    const dayAppts = appointmentsByDate[key];
    if (!dayAppts || dayAppts.length === 0) return null;

    return (
      <div className="flex justify-center gap-0.5 mt-1 flex-wrap">
        {dayAppts.slice(0, 4).map((appt, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: STATUS_COLORS[appt.status] || '#94a3b8',
            }}
          />
        ))}
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    const key = formatDateKey(date);
    return appointmentsByDate[key]?.length > 0 ? 'has-appointment' : '';
  };

  const handleDateClick = (date) => {
    const key = formatDateKey(date);
    setSelectedDate(key);
  };

  const selectedAppts = selectedDate ? (appointmentsByDate[selectedDate] || []) : [];

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-base font-bold text-slate-800 tracking-tight">
          📅 Appointment Calendar
        </h3>
        {selectedDate && (
          <button
            onClick={() => setSelectedDate(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Clear ✕
          </button>
        )}
      </div>

      <Calendar
        onClickDay={handleDateClick}
        tileContent={tileContent}
        tileClassName={tileClassName}
        value={selectedDate ? new Date(selectedDate + 'T12:00:00') : undefined}
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span className="text-[10px] font-bold text-slate-500 capitalize">{status}</span>
          </div>
        ))}
      </div>

      {/* Selected Day Appointments */}
      {selectedDate && (
        <div className="mt-5 border-t border-[#e2e8f0] pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            {selectedDate} — {selectedAppts.length} Appointment{selectedAppts.length !== 1 ? 's' : ''}
          </h4>

          {selectedAppts.length === 0 ? (
            <p className="text-xs text-slate-400 font-semibold text-center py-4">
              No appointments on this day.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedAppts.map((appt) => (
                <div
                  key={appt._id}
                  className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {role === 'doctor'
                        ? appt.patientName || appt.patient?.name || 'Patient'
                        : appt.doctor?.name || 'Doctor'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                      {appt.slot} · {appt.department?.name || 'General'}
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold rounded-full px-2.5 py-1 capitalize ${STATUS_BG[appt.status] || 'bg-slate-100 text-slate-500'}`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;
