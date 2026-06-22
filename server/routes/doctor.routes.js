const express = require('express');
const {
  getAllDoctors,
  getDoctorById,
  getBookedSlots,
  createDoctor,
  updateDoctor,
  softDeleteDoctor,
} = require('../controllers/doctor.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/slots', getBookedSlots);

// Admin-only routes
router.post('/', verifyToken, requireRole('admin'), createDoctor);
router.put('/:id', verifyToken, requireRole('admin'), updateDoctor);
router.delete('/:id', verifyToken, requireRole('admin'), softDeleteDoctor);

module.exports = router;
