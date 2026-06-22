const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true,
    },
    initials: {
      type: String,
      required: [true, 'Initials are required'],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    specialty: {
      type: String,
      trim: true,
      default: 'General Medicine',
    },
    experience: {
      type: Number,
      required: [true, 'Experience in years is required'],
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
    },
    availableDays: {
      type: [String],
      required: [true, 'Available days are required'],
    },
    timeSlots: {
      type: [String],
      required: [true, 'Time slots are required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Doctor', doctorSchema);
