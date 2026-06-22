const path = require('path');
// Load environment variables from server/.env relative to this script
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Department = require('../models/Department');
const Doctor = require('../models/Doctor');

const departmentsData = [
  { name: 'Cardiology', icon: '🫀', description: 'Comprehensive heart care and cardiovascular health treatments.' },
  { name: 'Neurology', icon: '🧠', description: 'Advanced diagnosis and treatment of brain and nervous system disorders.' },
  { name: 'Orthopedics', icon: '🦴', description: 'Bone, joint, ligament, and musculoskeletal medical care.' },
  { name: 'Pediatrics', icon: '👶', description: 'Specialized healthcare and clinical treatments for children and infants.' },
  { name: 'Dermatology', icon: '🧬', description: 'Diagnosis and clinical treatment of skin, hair, and nail conditions.' },
  { name: 'ENT', icon: '👂', description: 'Ear, nose, and throat medical consultation and surgery.' },
];

const doctorsData = [
  {
    name: 'Dr. Priya Sharma',
    email: 'priya@hospital.com',
    phone: '9876543210',
    deptName: 'Cardiology',
    experience: 12,
    rating: 4.9,
    consultationFee: 800,
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    name: 'Dr. Arjun Mehta',
    email: 'arjun@hospital.com',
    phone: '9876543211',
    deptName: 'Cardiology',
    experience: 8,
    rating: 4.7,
    consultationFee: 650,
    availableDays: ['Tue', 'Thu', 'Sat'],
  },
  {
    name: 'Dr. Kavitha Nair',
    email: 'kavitha@hospital.com',
    phone: '9876543212',
    deptName: 'Neurology',
    experience: 15,
    rating: 4.8,
    consultationFee: 900,
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    name: 'Dr. Ramesh Kumar',
    email: 'ramesh@hospital.com',
    phone: '9876543213',
    deptName: 'Neurology',
    experience: 10,
    rating: 4.6,
    consultationFee: 750,
    availableDays: ['Tue', 'Thu', 'Sat'],
  },
  {
    name: 'Dr. Sunita Reddy',
    email: 'sunita@hospital.com',
    phone: '9876543214',
    deptName: 'Orthopedics',
    experience: 14,
    rating: 4.9,
    consultationFee: 850,
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    name: 'Dr. Vikram Singh',
    email: 'vikram@hospital.com',
    phone: '9876543215',
    deptName: 'Pediatrics',
    experience: 9,
    rating: 4.8,
    consultationFee: 600,
    availableDays: ['Tue', 'Thu', 'Sat'],
  },
  {
    name: 'Dr. Meena Pillai',
    email: 'meena@hospital.com',
    phone: '9876543216',
    deptName: 'Dermatology',
    experience: 7,
    rating: 4.7,
    consultationFee: 700,
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    name: 'Dr. Arun Thomas',
    email: 'arun@hospital.com',
    phone: '9876543217',
    deptName: 'ENT',
    experience: 11,
    rating: 4.6,
    consultationFee: 650,
    availableDays: ['Tue', 'Thu', 'Sat'],
  },
];

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"];

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

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();

    console.log('--- Seeding Departments ---');
    const deptMap = {};
    for (const dept of departmentsData) {
      let existingDept = await Department.findOne({ name: dept.name });
      if (!existingDept) {
        existingDept = await Department.create(dept);
        console.log(`Created department: ${dept.name}`);
      } else {
        existingDept.icon = dept.icon;
        existingDept.description = dept.description;
        await existingDept.save();
        console.log(`Updated department: ${dept.name}`);
      }
      deptMap[dept.name] = existingDept._id;
    }

    console.log('--- Seeding Admin and Patient Users ---');
    // Admin User
    let adminUser = await User.findOne({ email: 'admin@hospital.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@hospital.com',
        password: 'admin123', // Will be hashed by mongoose pre-save middleware
        phone: '1234567890',
        role: 'admin',
      });
      console.log('Created Admin user: admin@hospital.com');
    } else {
      adminUser.name = 'System Admin';
      adminUser.password = 'admin123'; // Re-triggers pre-save hashing
      adminUser.phone = '1234567890';
      adminUser.role = 'admin';
      await adminUser.save();
      console.log('Reset Admin user password/details');
    }

    // Patient User
    let patientUser = await User.findOne({ email: 'patient@mail.com' });
    if (!patientUser) {
      patientUser = await User.create({
        name: 'John Doe (Patient)',
        email: 'patient@mail.com',
        password: 'patient123',
        phone: '9876543219',
        role: 'patient',
      });
      console.log('Created Patient user: patient@mail.com');
    } else {
      patientUser.name = 'John Doe (Patient)';
      patientUser.password = 'patient123';
      patientUser.phone = '9876543219';
      patientUser.role = 'patient';
      await patientUser.save();
      console.log('Reset Patient user password/details');
    }

    console.log('--- Seeding Doctors ---');
    for (const doc of doctorsData) {
      let docUser = await User.findOne({ email: doc.email });
      if (!docUser) {
        docUser = await User.create({
          name: doc.name,
          email: doc.email,
          password: 'doc123',
          phone: doc.phone,
          role: 'doctor',
        });
        console.log(`Created doctor user: ${doc.email}`);
      } else {
        docUser.name = doc.name;
        docUser.password = 'doc123';
        docUser.phone = doc.phone;
        docUser.role = 'doctor';
        await docUser.save();
        console.log(`Reset doctor user password: ${doc.email}`);
      }

      // Check if doctor profile exists
      let docProfile = await Doctor.findOne({ userId: docUser._id });
      const deptId = deptMap[doc.deptName];

      if (!docProfile) {
        docProfile = await Doctor.create({
          userId: docUser._id,
          name: doc.name,
          initials: generateInitials(doc.name),
          department: deptId,
          experience: doc.experience,
          rating: doc.rating,
          consultationFee: doc.consultationFee,
          availableDays: doc.availableDays,
          timeSlots: timeSlots,
          isActive: true,
        });
        console.log(`Created doctor profile for: ${doc.name}`);
      } else {
        docProfile.name = doc.name;
        docProfile.initials = generateInitials(doc.name);
        docProfile.department = deptId;
        docProfile.experience = doc.experience;
        docProfile.rating = doc.rating;
        docProfile.consultationFee = doc.consultationFee;
        docProfile.availableDays = doc.availableDays;
        docProfile.timeSlots = timeSlots;
        docProfile.isActive = true;
        await docProfile.save();
        console.log(`Updated doctor profile for: ${doc.name}`);
      }
    }

    console.log('Database seeding completed successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
