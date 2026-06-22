import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case 'confirmed':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          label: 'Confirmed',
        };
      case 'pending':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          label: 'Pending',
        };
      case 'cancelled':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          label: 'Cancelled',
        };
      case 'completed':
        return {
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          dot: 'bg-blue-500',
          label: 'Completed',
        };
      case 'no-show':
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
          label: 'No-Show',
        };
    }
  };

  const style = getBadgeStyles();

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wider ${style.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
};

export default StatusBadge;
