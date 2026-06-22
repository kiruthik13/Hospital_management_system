import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../hooks/useToast';
import StatusBadge from '../../components/StatusBadge';

const ManageDoctors = () => {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    department: '',
    specialty: '',
    experience: '',
    consultationFee: '',
    availableDays: [],
    timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"], // Pre-selected standard
  });

  const fetchDoctorsAndDepartments = async () => {
    try {
      setLoading(true);
      const [docsRes, deptsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/departments'),
      ]);

      if (docsRes.data.success) {
        setDoctors(docsRes.data.data);
      }
      if (deptsRes.data.success) {
        setDepartments(deptsRes.data.data);
        if (deptsRes.data.data.length > 0 && !isEditMode) {
          setFormData((prev) => ({ ...prev, department: deptsRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
      setError('Could not load doctors database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsAndDepartments();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (day) => {
    const isSelected = formData.availableDays.includes(day);
    if (isSelected) {
      setFormData({
        ...formData,
        availableDays: formData.availableDays.filter((d) => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        availableDays: [...formData.availableDays, day],
      });
    }
  };

  const handleToggleStatus = async (doctor) => {
    try {
      const updatedStatus = !doctor.isActive;
      const response = await api.put(`/doctors/${doctor._id}`, { isActive: updatedStatus });
      if (response.data.success) {
        showToast(`Doctor status toggled successfully`, 'success');
        setDoctors((prev) =>
          prev.map((d) => (d._id === doctor._id ? response.data.data : d))
        );
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to toggle status.', 'error');
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor profile? (Will set to inactive)')) return;
    try {
      const response = await api.delete(`/doctors/${id}`);
      if (response.data.success) {
        showToast('Doctor soft deleted successfully', 'success');
        fetchDoctorsAndDepartments(); // Refresh
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete doctor profile.', 'error');
    }
  };

  const handleEditDoctorClick = (doctor) => {
    setFormData({
      name: doctor.name || '',
      email: doctor.userId?.email || '',
      phone: doctor.userId?.phone || '',
      password: '',
      department: doctor.department?._id || '',
      specialty: doctor.specialty || '',
      experience: doctor.experience || '',
      consultationFee: doctor.consultationFee || '',
      availableDays: doctor.availableDays || [],
      timeSlots: doctor.timeSlots || ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
    });
    setIsEditMode(true);
    setEditingDoctorId(doctor._id);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, department, specialty, experience, consultationFee, availableDays } = formData;
    if (!name || !experience || !consultationFee) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }
    if (!isEditMode && (!email || !phone)) {
      showToast('Email and phone are required for registration', 'warning');
      return;
    }
    if (availableDays.length === 0) {
      showToast('Please select at least one available working day', 'warning');
      return;
    }

    try {
      setModalLoading(true);
      if (isEditMode) {
        const response = await api.put(`/doctors/${editingDoctorId}`, {
          name,
          phone,
          department: department || null,
          specialty: specialty || '',
          experience: Number(experience),
          consultationFee: Number(consultationFee),
          availableDays,
          timeSlots: formData.timeSlots,
        });
        if (response.data.success) {
          showToast('Doctor profile updated successfully!', 'success');
          setShowAddModal(false);
          fetchDoctorsAndDepartments();
        }
      } else {
        const response = await api.post('/doctors', formData);
        if (response.data.success) {
          showToast('Doctor registered successfully!', 'success');
          setShowAddModal(false);
          // Reset Form
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            department: departments[0]?._id || '',
            specialty: '',
            experience: '',
            consultationFee: '',
            availableDays: [],
            timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
          });
          fetchDoctorsAndDepartments(); // Reload database
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save doctor.', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Doctors
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Register new practitioners and adjust availability settings
          </p>
        </div>
        <button
          onClick={() => {
            setIsEditMode(false);
            setEditingDoctorId(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              password: '',
              department: departments[0]?._id || '',
              specialty: '',
              experience: '',
              consultationFee: '',
              availableDays: [],
              timeSlots: ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"],
            });
            setShowAddModal(true);
          }}
          className="inline-flex justify-center items-center gap-2 px-4.5 py-2.5 bg-primary hover:bg-primary-dark font-display text-xs font-bold text-white rounded-xl shadow-md shadow-primary/10 transition-all duration-200"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Doctor
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-100 rounded-2xl h-64 animate-pulse" />
      ) : error ? (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-150 p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-400">No doctors registered in database.</p>
        </div>
      ) : (
        /* Doctors Table Card */
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs font-medium text-slate-500">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-slate-400 uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Doctor</th>
                  <th className="px-6 py-4 font-bold">Specialty</th>
                  <th className="px-6 py-4 font-bold">Experience</th>
                  <th className="px-6 py-4 font-bold">Fee</th>
                  <th className="px-6 py-4 font-bold">Rating</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-light font-display text-xs font-bold text-primary">
                          {doc.initials}
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {doc.availableDays.join(', ')}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {doc.department?.name || 'General'}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {doc.experience} Years
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-bold">
                      ₹{doc.consultationFee}
                    </td>
                    <td className="px-6 py-4 text-amber-600 font-bold">
                      ★ {doc.rating.toFixed(1)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={doc.isActive ? 'confirmed' : 'no-show'} />
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2.5 h-16">
                      <button
                        onClick={() => handleToggleStatus(doc)}
                        className={`text-[10px] font-bold px-2 py-1.5 rounded-lg border transition-colors ${
                          doc.isActive
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            : 'border-emerald-100 text-emerald-600 bg-emerald-50/50 hover:bg-emerald-50'
                        }`}
                      >
                        {doc.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEditDoctorClick(doc)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                        title="Edit Doctor"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteDoctor(doc._id)}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                        title="Delete Doctor"
                      >
                        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Doctor Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-xl relative my-8">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="font-display text-lg font-extrabold text-slate-900 tracking-tight mb-5">
              {isEditMode ? 'Edit Doctor Profile' : 'Add New Doctor Profile'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Doctor Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                    placeholder="Dr. Rajesh Patel"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required={!isEditMode}
                    disabled={isEditMode}
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-primary font-semibold ${
                      isEditMode
                        ? 'bg-slate-50 border-slate-150 text-slate-400 cursor-not-allowed'
                        : 'border-slate-200 text-slate-800'
                    }`}
                    placeholder="rajesh@hospital.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                    placeholder="9876543220"
                  />
                </div>

                {/* Password - Hide in Edit Mode */}
                {!isEditMode && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Login Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                      placeholder="doc123 (Default)"
                    />
                  </div>
                )}

                {/* Department Dropdown */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Department Specialty
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-primary font-semibold text-slate-800"
                  >
                    <option value="">-- No Department --</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Specialty */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Custom Specialty text
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                    placeholder="e.g. Cardiology, Inpatient care"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Experience (Years) *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    required
                    min="0"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                    placeholder="10"
                  />
                </div>

                {/* Fee */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Consultation Fee (₹) *
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    required
                    min="0"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-primary font-semibold text-slate-800"
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Working Days Checkboxes */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Working Available Days *
                </label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isChecked = formData.availableDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleCheckboxChange(day)}
                        className={`px-3 py-1.5 rounded-lg border font-bold text-[10px] transition-colors focus:outline-none ${
                          isChecked
                            ? 'bg-primary-light border-primary text-primary'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-display text-xs font-bold rounded-xl transition-colors focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 bg-primary hover:bg-primary-dark font-display text-xs font-bold text-white rounded-xl shadow-md shadow-primary/10 transition-colors focus:outline-none flex items-center gap-2 disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Register Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors;
