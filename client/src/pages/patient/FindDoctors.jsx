import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

// ─── Doctor Card ──────────────────────────────────────────────────────────────

const StarRating = ({ rating }) => {
  const stars = Math.round(rating || 0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-[10px] font-bold text-slate-500 ml-1">{(rating || 0).toFixed(1)}</span>
    </div>
  );
};

const DoctorCard = ({ doctor, onBook }) => {
  const { name, initials, specialty, department, experience, rating, consultationFee, availableDays } = doctor;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-primary transition-all duration-200 flex flex-col gap-4">
      {/* Top Row */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 font-display text-sm font-bold text-white shadow-md shadow-primary/20">
          {initials || 'DR'}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display text-sm font-bold text-slate-800 truncate">{name}</h4>
          <span className="inline-block mt-1 text-[10px] font-bold bg-primary-light text-primary rounded-full px-2.5 py-0.5 uppercase tracking-wide">
            {specialty || department?.name || 'General'}
          </span>
        </div>
      </div>

      {/* Rating */}
      <StarRating rating={rating} />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 text-xs">
        <div>
          <span className="text-slate-400 font-semibold block">Experience</span>
          <span className="font-bold text-slate-800">{experience} yrs</span>
        </div>
        <div>
          <span className="text-slate-400 font-semibold block">Fee</span>
          <span className="font-bold text-primary">₹{consultationFee}</span>
        </div>
      </div>

      {/* Available Days */}
      <div className="flex flex-wrap gap-1">
        {(availableDays || []).map((day) => (
          <span
            key={day}
            className="text-[9px] font-bold uppercase tracking-wide rounded-md border border-[#e2e8f0] bg-white px-1.5 py-0.5 text-slate-500"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Book Button */}
      <button
        onClick={() => onBook(doctor)}
        className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-display text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-blue-200 transition-all duration-200"
      >
        Book Appointment →
      </button>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_MAP = {
  Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
  Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat',
};

const FindDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchName, setSearchName] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [feeMin, setFeeMin] = useState(0);
  const [feeMax, setFeeMax] = useState(2000);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docsRes, deptsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/departments'),
        ]);
        if (docsRes.data.success) setDoctors(docsRes.data.data.filter((d) => d.isActive));
        if (deptsRes.data.success) setDepartments(deptsRes.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch doctor database.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBookNow = (doctor) => {
    navigate('/patient/book', { state: { preSelectedDoctor: doctor } });
  };

  const clearFilters = () => {
    setSearchName('');
    setSelectedDept('');
    setSelectedDay('');
    setFeeMin(0);
    setFeeMax(2000);
    setSortBy('rating');
  };

  const hasActiveFilters = searchName || selectedDept || selectedDay || feeMin > 0 || feeMax < 2000 || sortBy !== 'rating';

  const filteredDoctors = useMemo(() => {
    let result = doctors.filter((doc) => {
      const matchName = doc.name.toLowerCase().includes(searchName.toLowerCase());
      const matchDept = selectedDept
        ? doc.department?._id === selectedDept || doc.department === selectedDept
        : true;
      const matchDay = selectedDay
        ? (doc.availableDays || []).includes(DAY_MAP[selectedDay])
        : true;
      const fee = doc.consultationFee || 0;
      const matchFee = fee >= feeMin && fee <= feeMax;
      return matchName && matchDept && matchDay && matchFee;
    });

    // Sort
    switch (sortBy) {
      case 'fee_asc':
        result = [...result].sort((a, b) => (a.consultationFee || 0) - (b.consultationFee || 0));
        break;
      case 'fee_desc':
        result = [...result].sort((a, b) => (b.consultationFee || 0) - (a.consultationFee || 0));
        break;
      case 'experience':
        result = [...result].sort((a, b) => (b.experience || 0) - (a.experience || 0));
        break;
      case 'rating':
      default:
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [doctors, searchName, selectedDept, selectedDay, feeMin, feeMax, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-[#0f172a] tracking-tight">
          Find Doctors
        </h2>
        <p className="text-xs font-semibold text-[#94a3b8] mt-1">
          Search CareSync specialists and book medical visits
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 shadow-sm space-y-4">
        {/* Row 1: Search + Specialty + Day */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8] text-sm pointer-events-none">🔍</span>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search doctor by name..."
              className="w-full pl-9 pr-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          {/* Specialty */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="sm:w-52 px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm font-semibold text-slate-700 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="">All Specialties</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>{dept.icon} {dept.name}</option>
            ))}
          </select>

          {/* Day */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="sm:w-44 px-4 py-2.5 border border-[#e2e8f0] rounded-xl text-sm font-semibold text-slate-700 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="">All Days</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Row 2: Fee Range + Sort + Clear */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Fee Min */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Min ₹</label>
            <input
              type="number"
              value={feeMin}
              min={0}
              max={feeMax}
              onChange={(e) => setFeeMin(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm font-semibold outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Fee Max */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 whitespace-nowrap">Max ₹</label>
            <input
              type="number"
              value={feeMax}
              min={feeMin}
              onChange={(e) => setFeeMax(Number(e.target.value))}
              className="w-24 px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm font-semibold outline-none focus:border-primary transition-all"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sm:w-52 px-4 py-2 border border-[#e2e8f0] rounded-xl text-sm font-semibold text-slate-700 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-blue-100 transition-all"
          >
            <option value="rating">Highest Rated</option>
            <option value="fee_asc">Fee: Low to High</option>
            <option value="fee_desc">Fee: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-xs font-bold text-rose-600 border border-rose-100 hover:bg-rose-50 rounded-xl transition-all duration-200"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && !error && (
        <p className="text-xs font-bold text-slate-500">
          Showing <span className="text-primary">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
          {hasActiveFilters ? ' matching your filters' : ''}
        </p>
      )}

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-white border border-[#e2e8f0] rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h4 className="font-display text-sm font-bold text-slate-800 tracking-tight">
            No doctors match your filters
          </h4>
          <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1">
            Try adjusting your search criteria or clear filters.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-5 py-2 bg-primary hover:bg-primary-dark text-white font-display text-xs font-bold rounded-xl transition-all duration-200"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc._id} doctor={doc} onBook={handleBookNow} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
