import React from 'react';

const StatCard = ({ icon, value, label, color = 'blue' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
      case 'success':
        return {
          bg: 'bg-emerald-50 text-emerald-600',
          border: 'border-emerald-100',
        };
      case 'amber':
      case 'warning':
        return {
          bg: 'bg-amber-50 text-amber-600',
          border: 'border-amber-100',
        };
      case 'rose':
      case 'danger':
        return {
          bg: 'bg-rose-50 text-rose-600',
          border: 'border-rose-100',
        };
      case 'blue':
      case 'primary':
      default:
        return {
          bg: 'bg-blue-50 text-blue-600',
          border: 'border-blue-100',
        };
    }
  };

  const classes = getColorClasses();

  return (
    <div className={`flex items-center gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md`}>
      {/* Icon Circle */}
      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${classes.bg}`}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display text-2xl font-extrabold tracking-tight text-slate-800 truncate">
          {value}
        </h4>
        <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase truncate mt-0.5">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
