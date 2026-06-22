const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Book an appointment (Patient only)
// @route   POST /api/appointments
// @access  Private (Patient)
const bookAppointment = async (req, res, next) => {
  try {
    const { doctor, department, date, slot, notes, patientName } = req.body;
    const patientId = req.user.id;

    if (!doctor || !department || !date || !slot || !patientName) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // 1. Verify doctor exists and is active
    const doctorObj = await Doctor.findById(doctor);
    if (!doctorObj || !doctorObj.isActive) {
      return res.status(404).json({ success: false, message: 'Doctor not found or inactive' });
    }

    // 2. Check if the day is available for this doctor
    // date comes as YYYY-MM-DD. Convert to day of week short code (Mon, Tue, etc.)
    const parsedDate = new Date(date);
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const selectedDay = daysOfWeek[parsedDate.getDay()];
    if (!doctorObj.availableDays.includes(selectedDay)) {
      return res.status(400).json({ success: false, message: `Doctor is not available on ${selectedDay}s` });
    }

    // 3. Check if time slot is valid for this doctor
    if (!doctorObj.timeSlots.includes(slot)) {
      return res.status(400).json({ success: false, message: 'Selected time slot is invalid for this doctor' });
    }

    // 4. Double booking validation: check if doctor has another active booking at that date & slot
    const conflict = await Appointment.findOne({
      doctor,
      date,
      slot,
      status: { $in: ['pending', 'confirmed', 'completed'] },
    });

    if (conflict) {
      return res.status(400).json({ success: false, message: 'This slot is already booked for this doctor' });
    }

    // 5. Create appointment (default status: confirmed)
    const appointment = await Appointment.create({
      patient: patientId,
      doctor,
      department,
      date,
      slot,
      status: 'confirmed',
      notes: notes || '',
      patientName,
    });

    return res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in patient's appointments
// @route   GET /api/appointments/my
// @access  Private (Patient)
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor')
      .populate('department')
      .sort({ date: -1, slot: -1 });

    return res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in doctor's appointments
// @route   GET /api/appointments/doctor
// @access  Private (Doctor)
const getDoctorAppointments = async (req, res, next) => {
  try {
    const doctorProfile = await Doctor.findOne({ userId: req.user.id });
    if (!doctorProfile) {
      return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({ doctor: doctorProfile._id })
      .populate('patient', 'name email phone')
      .populate('department')
      .sort({ date: -1, slot: -1 });

    return res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ALL appointments (Admin only)
// @route   GET /api/appointments/all
// @access  Private (Admin)
const getAllAppointments = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor')
      .populate('department')
      .sort({ date: -1, slot: -1 });

    return res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Doctor / Admin only)
// @route   PATCH /api/appointments/:id/status
// @access  Private (Doctor / Admin)
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid or missing status parameter' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // If logged-in user is a doctor, verify this appointment belongs to them
    if (req.user.role === 'doctor') {
      const doctorProfile = await Doctor.findOne({ userId: req.user.id });
      if (!doctorProfile || appointment.doctor.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied: not your appointment' });
      }
    }

    appointment.status = status;
    await appointment.save();

    return res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment (Patient only, own only)
// @route   DELETE /api/appointments/:id
// @access  Private (Patient)
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Verify ownership
    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied: not your appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    return res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};
