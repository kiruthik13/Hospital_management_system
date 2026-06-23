require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in the environment variables.');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

const authRoutes = require('./routes/auth.routes');
const doctorRoutes = require('./routes/doctor.routes');
const departmentRoutes = require('./routes/department.routes');
const appointmentRoutes = require('./routes/appointment.routes');

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174'
];
if (process.env.CLIENT_URL && !allowedOrigins.includes(process.env.CLIENT_URL)) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Bind routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/appointments', appointmentRoutes);

// Test API endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database and start listening
connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // Verify SMTP configuration on server startup
    try {
      const { verifyMailer } = require('./utils/mailer');
      await verifyMailer();
    } catch (err) {
      console.error('⚠️ Unexpected error verifying mailer:', err.message);
    }
  });
});
