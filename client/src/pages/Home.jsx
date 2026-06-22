import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments');
        if (response.data.success) {
          setDepartments(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Could not load departments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const stats = [
    { value: '50K+', label: 'Patients Cured', desc: 'Active records in database' },
    { value: '120+', label: 'Expert Doctors', desc: 'Certified professionals' },
    { value: '15+', label: 'Departments', desc: 'Multi-specialty operations' },
    { value: '98%', label: 'Satisfaction Rate', desc: 'Patient feedback reviews' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Landing Header */}
      <nav className="w-full bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/20">
              <svg className="w-5.5 h-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
              </svg>
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-slate-800">
              Care<span className="text-primary">Sync</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4.5 py-2 font-display text-sm font-bold text-primary hover:text-primary-dark transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4.5 py-2 bg-primary hover:bg-primary-dark font-display text-sm font-bold text-white rounded-xl shadow-md shadow-primary/10 transition-all duration-200"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-6">
            <span className="inline-flex self-center items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light text-primary text-xs font-bold tracking-wider uppercase">
              ✨ Intelligent Healthcare Scheduling
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Your Health, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Scheduled in Seconds</span>
            </h1>
            <p className="text-base sm:text-lg text-muted font-medium max-w-2xl mx-auto leading-relaxed">
              Connect with leading certified clinical specialists, check real-time schedule grids, and manage medical visits instantly. High-quality clinical consultations designed around your life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark font-display text-base font-bold text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-200 text-center"
              >
                Book Appointment Now
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 border border-slate-200 bg-white text-slate-700 hover:border-slate-300 font-display text-base font-bold rounded-xl shadow-sm transition-all duration-200 text-center"
              >
                Sign In to Account
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />
      </section>

      {/* Stats Section */}
      <section className="bg-white border-y border-slate-100 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-slate-800">
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-primary mt-2">
                  {stat.label}
                </span>
                <span className="text-xs text-muted font-medium mt-1">
                  {stat.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
              Our Medical Specialties
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-3">
              Explore medical services managed by CareSync clinical experts
            </p>
          </div>

          {loading ? (
            // Loading Skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="h-44 rounded-2xl bg-white border border-slate-100 p-6 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-slate-100" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-slate-100 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2 mt-5">
                    <div className="h-3 bg-slate-100 rounded w-full" />
                    <div className="h-3 bg-slate-100 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-8 max-w-lg mx-auto">
              <span className="text-red-700 font-semibold">{error}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-2xl">
                      {dept.icon || '🏥'}
                    </div>
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-800">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {dept.doctorCount || 0} Doctors Available
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-500 font-medium">
                    {dept.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} CareSync Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
