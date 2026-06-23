import React from 'react';
import StatusBadge from './StatusBadge';
import generateReceipt from '../utils/generateReceipt';

const AppointmentTile = ({ appointment, onAction, role = 'patient' }) => {
  const { _id, doctor, patient, department, date, slot, status, notes, patientName } = appointment;

  const formatDate = (dateStr) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const isUpcoming = ['pending', 'confirmed'].includes(status);
  const canDownloadReceipt = ['confirmed', 'completed'].includes(status);

  return (
    <div className="flex flex-col justify-between p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col gap-3">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {role === 'doctor' ? (
              <div className="flex flex-col">
                <h4 className="font-display text-sm font-bold text-slate-800 truncate">
                  {patientName || patient?.name || 'Unknown Patient'}
                </h4>
                <p className="text-xs font-semibold text-slate-400">Patient Profile</p>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light font-display text-xs font-bold text-primary">
                  {doctor?.initials || 'DR'}
                </div>
                <div className="flex flex-col">
                  <h4 className="font-display text-sm font-bold text-slate-800 truncate">
                    {doctor?.name || 'Dr. Doctor'}
                  </h4>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                    {department?.name || 'General'}
                  </p>
                </div>
              </div>
            )}
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Date and Time Slot Details */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="truncate">{formatDate(date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{slot}</span>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="text-xs text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 mt-1">
            <span className="font-bold text-slate-600 block mb-1">Symptoms/Notes:</span>
            <p className="italic leading-normal">{notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between gap-2 flex-wrap">

        {/* PDF Receipt Button (patient view, confirmed/completed) */}
        {role === 'patient' && canDownloadReceipt && (
          <button
            onClick={() => generateReceipt(appointment)}
            className="px-3.5 py-1.5 font-display text-xs font-bold text-primary border border-primary/20 hover:border-primary/50 hover:bg-primary-light rounded-xl transition-all duration-200 focus:outline-none flex items-center gap-1.5"
          >
            📄 Receipt
          </button>
        )}

        {/* If no receipt button, add spacer */}
        {!(role === 'patient' && canDownloadReceipt) && <div />}

        {/* Action Buttons */}
        {isUpcoming && onAction && (
          <div className="flex items-center gap-2">
            {role === 'patient' && (
              <button
                onClick={() => onAction(_id, 'cancelled')}
                className="px-3.5 py-1.5 font-display text-xs font-bold text-rose-600 border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 rounded-xl transition-all duration-200 focus:outline-none"
              >
                Cancel
              </button>
            )}

            {role === 'doctor' && (
              <>
                <button
                  onClick={() => onAction(_id, 'no-show')}
                  className="px-3.5 py-1.5 font-display text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 rounded-xl transition-all duration-200 focus:outline-none"
                >
                  No-Show
                </button>
                <button
                  onClick={() => onAction(_id, 'completed')}
                  className="px-3.5 py-1.5 font-display text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-sm shadow-primary/10 rounded-xl transition-all duration-200 focus:outline-none"
                >
                  Mark Completed
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={() => onAction(_id, 'cancelled')}
                  className="px-3.5 py-1.5 font-display text-xs font-bold text-rose-600 border border-rose-100 hover:border-rose-300 hover:bg-rose-50/50 rounded-xl transition-all duration-200 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onAction(_id, 'no-show')}
                  className="px-3.5 py-1.5 font-display text-xs font-bold text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50 rounded-xl transition-all duration-200 focus:outline-none"
                >
                  No-Show
                </button>
                <button
                  onClick={() => onAction(_id, 'completed')}
                  className="px-3.5 py-1.5 font-display text-xs font-bold text-white bg-primary hover:bg-primary-dark shadow-sm shadow-primary/10 rounded-xl transition-all duration-200 focus:outline-none"
                >
                  Complete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentTile;
