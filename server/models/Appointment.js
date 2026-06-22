const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Date (YYYY-MM-DD) is required'],
    },
    slot: {
      type: String,
      required: [true, 'Time slot (HH:MM) is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'confirmed',
    },
    notes: {
      type: String,
      default: '',
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
