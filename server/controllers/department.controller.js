const Department = require('../models/Department');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all departments (enriched with counts)
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();

    const enriched = await Promise.all(
      departments.map(async (dept) => {
        const doctorCount = await Doctor.countDocuments({
          department: dept._id,
          isActive: true,
        });
        const appointmentCount = await Appointment.countDocuments({
          department: dept._id,
        });
        return {
          ...dept.toObject(),
          doctorCount,
          appointmentCount,
        };
      })
    );

    return res.json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a department (Admin only)
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;

    if (!name || !icon || !description) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const exists = await Department.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Department already exists' });
    }

    const department = await Department.create({
      name,
      icon,
      description,
    });

    return res.status(201).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a department (Admin only)
// @route   PUT /api/departments/:id
// @access  Private (Admin)
const updateDepartment = async (req, res, next) => {
  try {
    const { name, icon, description } = req.body;

    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    if (name !== undefined) department.name = name;
    if (icon !== undefined) department.icon = icon;
    if (description !== undefined) department.description = description;

    await department.save();

    return res.json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDepartments,
  createDepartment,
  updateDepartment,
};
