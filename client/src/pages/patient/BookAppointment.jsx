import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import StepIndicator from '../../components/StepIndicator';
import api from '../../api/axios';

const BookAppointment = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const steps = ['Specialty', 'Practitioner', 'Schedule', 'Confirm'];

  // Data states
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Selections
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [patientName, setPatientName] = useState(user?.name || '');

  // UI status states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [successBooking, setSuccessBooking] = useState(null);

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/departments');
        if (response.data.success) {
          setDepartments(response.data.data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load specialties. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Load doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await api.get('/doctors');
        if (response.data.success) {
          setDoctors(response.data.data.filter((doc) => doc.isActive));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load practitioners.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Pre-select doctor if navigated from FindDoctors (using state)
  useEffect(() => {
    if (location.state?.preSelectedDoctor && doctors.length > 0) {
      const doc = doctors.find((d) => d._id === location.state.preSelectedDoctor._id);
      if (doc) {
        setSelectedDoctor(doc);
        setSelectedDept(doc.department);
        setCurrentStep(3); // Skip directly to schedule picker
      }
    }
  }, [location.state, doctors]);

  // Load booked slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchBookedSlots = async () => {
        try {
          const response = await api.get(`/doctors/${selectedDoctor._id}/slots?date=${selectedDate}`);
          if (response.data.success) {
            setBookedSlots(response.data.data);
          }
        } catch (err) {
          console.error(err);
          showToast('Failed to retrieve booked slots.', 'error');
        }
      };
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  // Helper date formatter for HTML min date attribute
  const getTodayDateString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper to determine day abbreviation
  const getDayOfWeek = (dateStr) => {
    if (!dateStr) return '';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const d = new Date(dateStr);
    return days[d.getDay()];
  };

  const isDayAvailable = selectedDoctor && selectedDate
    ? selectedDoctor.availableDays.includes(getDayOfWeek(selectedDate))
    : false;

  // Navigation handlers
  const nextStep = () => {
    if (currentStep === 1 && !selectedDept) {
      showToast('Please select a specialty department', 'warning');
      return;
    }
    if (currentStep === 2 && !selectedDoctor) {
      showToast('Please select a medical practitioner', 'warning');
      return;
    }
    if (currentStep === 3) {
      if (!selectedDate) {
        showToast('Please choose an appointment date', 'warning');
        return;
      }
      if (!isDayAvailable) {
        showToast('The doctor is not available on this day of the week', 'warning');
        return;
      }
      if (!selectedSlot) {
        showToast('Please select a consultation slot', 'warning');
        return;
      }
    }
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
    setSelectedSlot(''); // Reset slot on back navigation
  };

  const handleBookingConfirm = async () => {
    try {
      setLoading(true);
      const payload = {
        doctor: selectedDoctor._id,
        department: selectedDept._id,
        date: selectedDate,
        slot: selectedSlot,
        notes: notes.trim(),
        patientName: patientName.trim(),
      };

      const response = await api.post('/appointments', payload);
      if (response.data.success) {
        setSuccessBooking(response.data.data);
        showToast('Appointment booked successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Conflict occurred. Please select another slot.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filters
  const filteredDoctors = doctors.filter((doc) => {
    const matchDept = selectedDept ? doc.department?._id === selectedDept._id : true;
    const matchSearch = doc.name.toLowerCase().includes(doctorSearch.toLowerCase());
    return matchDept && matchSearch;
  });

  // Success view renderer
  if (successBooking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-md flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6 border border-emerald-100 animate-bounce">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-slate-800 tracking-tight">
            Appointment Booked!
          </h2>
          <p className="text-xs font-semibold text-slate-400 mt-1 max-w-sm">
            Your medical consultation has been scheduled successfully.
          </p>

          <div className="w-full mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-sm space-y-3.5">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Patient Name</span>
              <span className="font-semibold text-slate-800">{patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Doctor</span>
              <span className="font-semibold text-slate-800">{selectedDoctor?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Specialty</span>
              <span className="font-semibold text-primary">{selectedDept?.name}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200/60 pt-3">
              <span className="text-slate-400 font-medium">Scheduled Date</span>
              <span className="font-semibold text-slate-800">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Consultation Slot</span>
              <span className="font-semibold text-slate-800">{selectedSlot}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3.5 w-full">
            <button
              onClick={() => navigate('/patient/appointments')}
              className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white font-display text-sm font-bold rounded-xl shadow-md shadow-primary/10 transition-all duration-200"
            >
              View My Appointments
            </button>
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="flex-1 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 font-display text-sm font-bold rounded-xl shadow-sm transition-all duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Book an Appointment
        </h2>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Complete the steps to schedule your physician consultation
        </p>
      </div>

      {/* Step Indicator Component */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {error && (
        <div className="text-center bg-red-50 border border-red-100 rounded-2xl p-6">
          <span className="text-red-700 font-semibold">{error}</span>
        </div>
      )}

      {/* Wizard Content */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[300px]">
        {/* Step 1: Select Specialty Department */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-3">
              Select Medical Specialty
            </h3>
            {loading && departments.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-28 bg-slate-50 border border-slate-100 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <button
                    key={dept._id}
                    onClick={() => {
                      setSelectedDept(dept);
                      setSelectedDoctor(null); // Reset practitioner selection on specialty change
                      nextStep();
                    }}
                    className={`flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 focus:outline-none hover:-translate-y-0.5 hover:shadow-sm ${
                      selectedDept?._id === dept._id
                        ? 'border-primary bg-primary-light ring-2 ring-primary/20'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl">{dept.icon || '🏥'}</span>
                    <div>
                      <h4 className="font-display text-sm font-bold text-slate-800 tracking-tight">{dept.name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                        {dept.doctorCount || 0} Doctors Available
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select Medical Practitioner */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-50 pb-4">
              <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight">
                Select Medical Practitioner
              </h3>
              {/* Search Bar */}
              <div className="relative rounded-xl max-w-xs w-full">
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  placeholder="Search doctor by name..."
                  className="block w-full pl-3.5 pr-10 py-2 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-primary font-medium"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm font-semibold text-slate-400">No doctors match your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredDoctors.map((doc) => (
                  <button
                    key={doc._id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      nextStep();
                    }}
                    className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-200 focus:outline-none hover:-translate-y-0.5 hover:shadow-sm ${
                      selectedDoctor?._id === doc._id
                        ? 'border-primary bg-primary-light ring-2 ring-primary/20'
                        : 'border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-blue-500 font-display text-xs font-bold text-white shadow-sm">
                      {doc.initials || 'DR'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display text-sm font-bold text-slate-800 truncate">{doc.name}</h4>
                      <p className="text-[10px] font-bold text-primary mt-0.5 uppercase tracking-wide">{doc.department?.name}</p>
                      <div className="flex gap-4 mt-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        <span>Exp: {doc.experience}yr</span>
                        <span>Fee: ₹{doc.consultationFee}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Date & Slot Picker */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-3">
              Schedule Appointment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Card Left */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white font-display text-xs font-bold shadow-md shadow-primary/10">
                    {selectedDoctor?.initials}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-slate-800 leading-snug">{selectedDoctor?.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">{selectedDept?.name}</p>
                  </div>
                </div>

                <div className="text-xs space-y-2 border-t border-slate-200/50 pt-3 text-slate-500 font-medium">
                  <div className="flex justify-between">
                    <span>Consultation Fee</span>
                    <span className="font-bold text-slate-800">₹{selectedDoctor?.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience</span>
                    <span className="font-bold text-slate-800">{selectedDoctor?.experience} Years</span>
                  </div>
                </div>

                <div className="border-t border-slate-200/50 pt-3">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Working Days</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedDoctor?.availableDays.map((day) => (
                      <span key={day} className="rounded-md bg-white border border-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Picker Inputs Middle/Right */}
              <div className="md:col-span-2 space-y-5">
                {/* Date Selection */}
                <div>
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Select Consultation Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    min={getTodayDateString()}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedSlot(''); // Reset slot on date change
                    }}
                    className="block w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold text-slate-800"
                  />
                </div>

                {/* Slot Selection Grid */}
                {selectedDate && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Select Time Slot
                    </label>

                    {!isDayAvailable ? (
                      <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
                        <p className="text-xs font-semibold text-amber-800">
                          Dr. {selectedDoctor?.name} is not available on {getDayOfWeek(selectedDate)}s.
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">
                          Please select dates on: {selectedDoctor?.availableDays.join(', ')}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {selectedDoctor?.timeSlots.map((slot) => {
                          const isBooked = bookedSlots.includes(slot);
                          const isSelected = selectedSlot === slot;

                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBooked}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all duration-150 focus:outline-none ${
                                isBooked
                                  ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed line-through'
                                  : isSelected
                                  ? 'bg-primary border-primary text-white shadow-md shadow-primary/10'
                                  : 'bg-white border-slate-150 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary Review */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-display text-lg font-bold text-slate-800 tracking-tight border-b border-slate-50 pb-3">
              Review and Confirm Booking
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Summary Card Left */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                <h4 className="font-display text-xs font-bold tracking-wider text-slate-400 uppercase">Consultation Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400">Doctor</span>
                    <span className="font-semibold text-slate-800">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400">Specialty</span>
                    <span className="font-semibold text-slate-800">{selectedDept?.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400">Scheduled Date</span>
                    <span className="font-semibold text-slate-800">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-2">
                    <span className="text-slate-400">Time Slot</span>
                    <span className="font-semibold text-slate-800">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400 font-bold">Consultation Fee</span>
                    <span className="font-extrabold text-primary text-base">₹{selectedDoctor?.consultationFee}</span>
                  </div>
                </div>
              </div>

              {/* Form Input Right */}
              <div className="space-y-4">
                {/* Patient Name input (default: logged in user) */}
                <div>
                  <label htmlFor="patientName" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-semibold text-slate-800"
                    placeholder="Enter name"
                  />
                </div>

                {/* Medical Notes */}
                <div>
                  <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Symptoms or Medical Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-primary text-sm font-medium text-slate-700"
                    placeholder="Briefly describe your symptoms or medical concern..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 font-display text-xs font-bold text-slate-600 rounded-xl transition-all duration-150 focus:outline-none"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2.5 bg-primary hover:bg-primary-dark font-display text-xs font-bold text-white rounded-xl shadow-md shadow-primary/10 transition-all duration-150 focus:outline-none"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleBookingConfirm}
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 font-display text-xs font-bold text-white rounded-xl shadow-md shadow-emerald-500/10 transition-all duration-150 focus:outline-none flex items-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Confirm Consultation'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
