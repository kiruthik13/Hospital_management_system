const express = require('express');
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointment.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all appointment routes
router.use(verifyToken);

// Patient routes
router.post('/', requireRole('patient'), bookAppointment);
router.get('/my', requireRole('patient'), getMyAppointments);
router.delete('/:id', requireRole('patient'), cancelAppointment);

// Doctor route
router.get('/doctor', requireRole('doctor'), getDoctorAppointments);

// Admin route
router.get('/all', requireRole('admin'), getAllAppointments);

// Doctor & Admin route to update appointment status
router.patch('/:id/status', requireRole('doctor', 'admin'), updateAppointmentStatus);

module.exports = router;
