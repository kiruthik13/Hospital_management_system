const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'caresync@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const ADMIN_NAME = 'CareSync Admin';
const ADMIN_PHONE = '9000000000';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('❌ MONGO_URI is not defined in .env');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    // Idempotent check — skip if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password with saltRounds = 10
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashed,
      phone: ADMIN_PHONE,
      role: 'admin',
    });

    console.log(`✅ Admin created: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
