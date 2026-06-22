import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../../components/DoctorCard';
import api from '../../api/axios';

const FindDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [docsRes, deptsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/departments'),
        ]);

        if (docsRes.data.success) {
          setDoctors(docsRes.data.data.filter((doc) => doc.isActive));
        }
        if (deptsRes.data.success) {
          setDepartments(deptsRes.data.data);
        }
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

  const filteredDoctors = doctors.filter((doc) => {
    const matchSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDeptId ? doc.department?._id === selectedDeptId : true;
    return matchSearch && matchDept;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Find Doctors
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Search CareSync specialists and book medical visits
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
        {/* Search Input */}
        <div className="relative rounded-xl flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctor by name (e.g. Dr. Priya Sharma)..."
            className="block w-full pl-3.5 pr-10 py-3 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-primary font-medium"
          />
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>

        {/* Department Filter */}
        <div className="sm:w-64">
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="block w-full px-3.5 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:border-primary font-semibold"
          >
            <option value="">All Specialties</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.icon} {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-white border border-slate-100 rounded-2xl p-6" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="font-display text-sm font-bold text-slate-800 tracking-tight">
            No doctors found
          </h4>
          <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1">
            Try adjusting your search filters or browse other specialties.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard
              key={doc._id}
              doctor={doc}
              onBook={handleBookNow}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FindDoctors;
