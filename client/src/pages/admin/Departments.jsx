import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';

const Departments = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    description: '',
  });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/departments');
      if (response.data.success) {
        setDepartments(response.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load specialties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditDeptClick = (dept) => {
    setFormData({
      name: dept.name || '',
      icon: dept.icon || '',
      description: dept.description || '',
    });
    setIsEditMode(true);
    setEditingDeptId(dept._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, icon, description } = formData;
    if (!name || !icon || !description) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      setModalLoading(true);
      if (isEditMode) {
        const response = await api.put(`/departments/${editingDeptId}`, formData);
        if (response.data.success) {
          showToast('Specialty department updated!', 'success');
          setShowModal(false);
          setFormData({ name: '', icon: '', description: '' });
          fetchDepartments(); // Refresh list
        }
      } else {
        const response = await api.post('/departments', formData);
        if (response.data.success) {
          showToast('Specialty department created!', 'success');
          setShowModal(false);
          setFormData({ name: '', icon: '', description: '' });
          fetchDepartments(); // Refresh list
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save department.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
            Specialty Departments
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Configure hospital medical specialties and check counters
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditMode(false);
            setEditingDeptId(null);
            setFormData({ name: '', icon: '', description: '' });
            setShowModal(true);
          }}
          className="inline-flex justify-center items-center gap-2 px-4.5 py-2.5 bg-primary hover:bg-primary-dark font-display text-xs font-bold text-white rounded-xl shadow-md shadow-primary/10 transition-all duration-200"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Specialty
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-white border border-slate-100 rounded-2xl p-6" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-400">No specialties registered in database.</p>
        </div>
      ) : (
        /* Departments Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept._id}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-2xl">
                      {dept.icon || '🏥'}
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-bold text-slate-800 tracking-tight">
                        {dept.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Specialty Code
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditDeptClick(dept)}
                    className="text-slate-400 hover:text-primary hover:bg-primary-light/50 p-1.5 rounded-lg transition-colors focus:outline-none"
                    title="Edit Department"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-2.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-500 font-medium">
                  {dept.description}
                </p>
              </div>

              {/* Counters Info Footer */}
              <div className="mt-6 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Doctors
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                    {dept.doctorCount || 0}
                  </span>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-2 border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Appointments
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                    {dept.appointmentCount || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Specialty Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-xl relative animate-scale-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-display text-lg font-extrabold text-slate-900 tracking-tight mb-5">
              {isEditMode ? 'Edit Medical Specialty' : 'Add Medical Specialty'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Department Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Specialty Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                  placeholder="Neurology"
                />
              </div>

              {/* Icon Emoji */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Icon (Emoji String) *
                </label>
                <input
                  type="text"
                  name="icon"
                  required
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                  placeholder="🧠"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-medium text-slate-700"
                  placeholder="Provide department specialty details..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-display text-xs font-bold rounded-xl transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark font-display text-xs font-bold text-white rounded-xl shadow-md shadow-primary/10 transition-colors focus:outline-none flex items-center gap-2 disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create Specialty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;
