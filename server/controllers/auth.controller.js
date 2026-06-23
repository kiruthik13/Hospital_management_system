const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ─── Token Generator ───────────────────────────────────────────────────────────
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured in the environment variables');
  }
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ─── Register ──────────────────────────────────────────────────────────────────
// @desc    Register a new user (patient or doctor only — admin is blocked)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, role, specialty, experience, consultationFee } = req.body;

    // Block admin self-registration
    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot register as admin' });
    }

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Force role to either doctor or patient only
    const resolvedRole = role === 'doctor' ? 'doctor' : 'patient';

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: resolvedRole,
    });

    // Auto-create Doctor profile if registering as doctor
    if (resolvedRole === 'doctor') {
      const Doctor = require('../models/Doctor');
      const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00'];

      const cleanName = name.replace(/^(Dr\.|Mr\.|Ms\.)\s+/i, '');
      const parts = cleanName.split(/\s+/).filter((p) => p.length > 0);
      let initials = 'DR';
      if (parts.length >= 2) {
        initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      } else if (parts.length === 1) {
        initials = parts[0].substring(0, 2).toUpperCase();
      }

      const specialtyValue = specialty || 'General Medicine';

      await Doctor.create({
        userId: user._id,
        name: name.toLowerCase().startsWith('dr.') ? name : `Dr. ${name}`,
        initials,
        specialty: specialtyValue,
        department: null,
        experience: Number(experience) || 5,
        rating: 4.5,
        consultationFee: Number(consultationFee) || 500,
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        timeSlots,
        isActive: true,
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Login ─────────────────────────────────────────────────────────────────────
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    // Only the designated admin email can log in as admin
    if (user.role === 'admin' && user.email !== 'caresync@gmail.com') {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── Get Me ────────────────────────────────────────────────────────────────────
// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
