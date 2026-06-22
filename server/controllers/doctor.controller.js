const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const generateInitials = (name) => {
  const cleanName = name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, '');
  const parts = cleanName.split(/\s+/).filter((p) => p.length > 0);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  } else if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return 'DR';
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getAllDoctors = async (req, res, next) => {
  try {
    // Populate department
    const doctors = await Doctor.find().populate('department').populate('userId', 'email phone');
    return res.json({
      success: true,
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single doctor details
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('department').populate('userId', 'email phone');
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booked slots for a doctor on a specific date
// @route   GET /api/doctors/:id/slots
// @access  Public
const getBookedSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date parameter ?date=YYYY-MM-DD is required' });
    }

    // Query appointments for doctor on that date which are not cancelled or no-show
    const appointments = await Appointment.find({
      doctor: req.params.id,
      date,
      status: { $in: ['pending', 'confirmed', 'completed'] },
    });

    const bookedSlots = appointments.map((appt) => appt.slot);

    return res.json({
      success: true,
      data: bookedSlots,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a doctor (Admin only)
// @route   POST /api/doctors
// @access  Private (Admin)
const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      department,
      specialty,
      experience,
      consultationFee,
      availableDays,
      timeSlots,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !experience ||
      !consultationFee ||
      !availableDays ||
      !timeSlots
    ) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create User account for Doctor
    const user = await User.create({
      name,
      email,
      password: password || 'doc123',
      phone,
      role: 'doctor',
    });

    // Create Doctor profile
    const initials = generateInitials(name);
    const doctor = await Doctor.create({
      userId: user._id,
      name,
      initials,
      department: department || null,
      specialty: specialty || 'General Medicine',
      experience: Number(experience),
      consultationFee: Number(consultationFee),
      availableDays,
      timeSlots,
      isActive: true,
    });

    // Populate department info
    const populatedDoctor = await Doctor.findById(doctor._id).populate('department').populate('userId', 'email phone');

    return res.status(201).json({
      success: true,
      data: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a doctor (Admin only)
// @route   PUT /api/doctors/:id
// @access  Private (Admin)
const updateDoctor = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      department,
      specialty,
      experience,
      consultationFee,
      availableDays,
      timeSlots,
      isActive,
    } = req.body;

    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    // Update Doctor profile fields
    if (name !== undefined) doctor.name = name;
    if (name !== undefined) doctor.initials = generateInitials(name);
    if (department !== undefined) doctor.department = department === '' ? null : department;
    if (specialty !== undefined) doctor.specialty = specialty;
    if (experience !== undefined) doctor.experience = Number(experience);
    if (consultationFee !== undefined) doctor.consultationFee = Number(consultationFee);
    if (availableDays !== undefined) doctor.availableDays = availableDays;
    if (timeSlots !== undefined) doctor.timeSlots = timeSlots;
    if (isActive !== undefined) doctor.isActive = isActive;

    await doctor.save();

    // Also update matching User's name/phone if changed
    const user = await User.findById(doctor.userId);
    if (user) {
      if (name !== undefined) user.name = name;
      if (phone !== undefined) user.phone = phone;
      await user.save();
    }

    const populatedDoctor = await Doctor.findById(doctor._id).populate('department').populate('userId', 'email phone');

    return res.json({
      success: true,
      data: populatedDoctor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft delete a doctor (Admin only)
// @route   DELETE /api/doctors/:id
// @access  Private (Admin)
const softDeleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    doctor.isActive = false;
    await doctor.save();

    return res.json({
      success: true,
      message: 'Doctor soft deleted successfully',
      data: doctor,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getBookedSlots,
  createDoctor,
  updateDoctor,
  softDeleteDoctor,
};
