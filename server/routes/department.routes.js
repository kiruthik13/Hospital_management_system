const express = require('express');
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
} = require('../controllers/department.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

// Public route
router.get('/', getAllDepartments);

// Admin-only routes
router.post('/', verifyToken, requireRole('admin'), createDepartment);
router.put('/:id', verifyToken, requireRole('admin'), updateDepartment);

module.exports = router;
