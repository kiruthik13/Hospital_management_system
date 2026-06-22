import React from 'react';

const DoctorCard = ({ doctor, onBook }) => {
  const {
    name,
    initials,
    department,
    experience,
    rating,
    consultationFee,
    availableDays,
    isActive,
  } = doctor;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div>
        {/* Top Header Card */}
        <div className="flex items-start justify-between gap-4">
          {/* Avatar and Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 font-display text-sm font-extrabold text-white">
              {initials || 'DR'}
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-800 tracking-tight leading-snug">
                {name}
              </h3>
              <p className="text-xs font-semibold text-primary mt-0.5">
                {department?.name || 'General'}
              </p>
            </div>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
            <svg className="w-3.5 h-3.5 fill-amber-500 text-amber-500" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{rating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-slate-50 py-4 text-xs font-medium text-slate-500">
          <div>
            <span className="text-slate-400">Experience</span>
            <p className="mt-1 font-semibold text-slate-800 text-sm">{experience} Years</p>
          </div>
          <div>
            <span className="text-slate-400">Consultation Fee</span>
            <p className="mt-1 font-semibold text-slate-800 text-sm">₹{consultationFee}</p>
          </div>
        </div>

        {/* Available Days */}
        <div className="mt-5">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Available Days
          </span>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {availableDays.map((day) => (
              <span
                key={day}
                className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500"
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Booking CTA */}
      <div className="mt-6">
        <button
          onClick={() => onBook && onBook(doctor)}
          disabled={!isActive}
          className={`w-full py-2.5 px-4 font-display text-sm font-bold tracking-wide rounded-xl shadow-sm transition-all duration-200 focus:outline-none ${
            isActive
              ? 'bg-primary text-white hover:bg-primary-dark shadow-primary/10 hover:shadow-md'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
          }`}
        >
          {isActive ? 'Book Appointment' : 'Not Available'}
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
