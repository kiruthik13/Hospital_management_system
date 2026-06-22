const path = require('path');
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
  { name: 'Ophthalmology', icon: '👁️', description: 'Comprehensive eye care, vision diagnostics, and ocular surgery.' },
  { name: 'Gastroenterology', icon: '🧪', description: 'Digestive system and liver disease diagnosis and treatment.' },
  { name: 'Psychiatry', icon: '🧘', description: 'Mental health diagnosis, therapy, and psychiatric medical treatments.' },
  { name: 'Gynecology', icon: '🤰', description: 'Women\'s reproductive health, pregnancy care, and childbirth support.' }
];

const patientsData = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '9876543201',
    password: 'rahul123',
    role: 'patient',
  },
  {
    name: 'Priya Nair',
    email: 'priya.nair@gmail.com',
    phone: '9876543202',
    password: 'priya123',
    role: 'patient',
  },
  {
    name: 'Arun Kumar',
    email: 'arun.kumar@gmail.com',
    phone: '9876543203',
    password: 'arun1234',
    role: 'patient',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@gmail.com',
    phone: '9876543204',
    password: 'sneha123',
    role: 'patient',
  },
  {
    name: 'Amit Patel',
    email: 'amit.patel@gmail.com',
    phone: '9876543205',
    password: 'amit123',
    role: 'patient',
  },
];

const doctorsData = [
  {
    name: 'Dr. Rajesh Gupta',
    email: 'rajesh.gupta@hospital.com',
    phone: '9876543206',
    password: 'rajesh123',
    specialty: 'Cardiology',
    experience: 15,
    consultationFee: 800,
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    name: 'Dr. Sunita Rao',
    email: 'sunita.rao@hospital.com',
    phone: '9876543207',
    password: 'sunita123',
    specialty: 'Neurology',
    experience: 12,
    consultationFee: 900,
    availableDays: ['Tue', 'Thu'],
  },
  {
    name: 'Dr. Vikram Malhotra',
    email: 'vikram.malhotra@hospital.com',
    phone: '9876543208',
    password: 'vikram123',
    specialty: 'Orthopedics',
    experience: 10,
    consultationFee: 700,
    availableDays: ['Mon', 'Thu', 'Sat'],
  },
  {
    name: 'Dr. Neha Sen',
    email: 'neha.sen@hospital.com',
    phone: '9876543209',
    password: 'neha123',
    specialty: 'Pediatrics',
    experience: 8,
    consultationFee: 600,
    availableDays: ['Tue', 'Wed', 'Fri'],
  },
  {
    name: 'Dr. Anil Deshmukh',
    email: 'anil.deshmukh@hospital.com',
    phone: '9876543210',
    password: 'anil123',
    specialty: 'Dermatology',
    experience: 14,
    consultationFee: 750,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
  },
  {
    name: 'Dr. Priya Nair (Doc)',
    email: 'priya.nair.doctor@hospital.com',
    phone: '9876543211',
    password: 'priya123',
    specialty: 'ENT',
    experience: 9,
    consultationFee: 650,
    availableDays: ['Mon', 'Wed', 'Sat'],
  },
  {
    name: 'Dr. Amit Verma',
    email: 'amit.verma@hospital.com',
    phone: '9876543212',
    password: 'amit123',
    specialty: 'Ophthalmology',
    experience: 11,
    consultationFee: 700,
    availableDays: ['Tue', 'Thu', 'Fri'],
  },
  {
    name: 'Dr. Shalini Joshi',
    email: 'shalini.joshi@hospital.com',
    phone: '9876543213',
    password: 'shalini123',
    specialty: 'Gastroenterology',
    experience: 13,
    consultationFee: 850,
    availableDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    name: 'Dr. Rohit Kapoor',
    email: 'rohit.kapoor@hospital.com',
    phone: '9876543214',
    password: 'rohit123',
    specialty: 'Psychiatry',
    experience: 16,
    consultationFee: 1000,
    availableDays: ['Tue', 'Thu', 'Sat'],
  },
  {
    name: 'Dr. Meera Saxena',
    email: 'meera.saxena@hospital.com',
    phone: '9876543215',
    password: 'meera123',
    specialty: 'Gynecology',
    experience: 10,
    consultationFee: 800,
    availableDays: ['Mon', 'Tue', 'Thu'],
  },
];

const adminsData = [
  {
    name: 'Admin Amit',
    email: 'admin.amit@hospital.com',
    phone: '8000000101',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Admin Riya',
    email: 'admin.riya@hospital.com',
    phone: '8000000102',
    password: 'admin234',
    role: 'admin',
  },
  {
    name: 'Admin Karan',
    email: 'admin.karan@hospital.com',
    phone: '8000000103',
    password: 'admin345',
    role: 'admin',
  },
  {
    name: 'Admin Pooja',
    email: 'admin.pooja@hospital.com',
    phone: '8000000104',
    password: 'admin456',
    role: 'admin',
  },
  {
    name: 'Admin Sunil',
    email: 'admin.sunil@hospital.com',
    phone: '8000000105',
    password: 'admin567',
    role: 'admin',
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

const seedCustomData = async () => {
  try {
    console.log('Connecting to database for custom seeding...');
    await connectDB();

    // 1. Seed Specialties (Departments)
    console.log('\n--- Seeding Specialties ---');
    const deptMap = {};
    for (const dept of departmentsData) {
      let existingDept = await Department.findOne({ name: dept.name });
      if (!existingDept) {
        existingDept = await Department.create(dept);
        console.log(`Created specialty department: ${dept.name}`);
      } else {
        existingDept.icon = dept.icon;
        existingDept.description = dept.description;
        await existingDept.save();
        console.log(`Updated specialty department: ${dept.name}`);
      }
      deptMap[dept.name] = existingDept._id;
    }

    // 2. Seed Patients
    console.log('\n--- Seeding Patients ---');
    for (const patient of patientsData) {
      let user = await User.findOne({ email: patient.email });
      if (!user) {
        user = await User.create(patient);
        console.log(`Created Patient user: ${patient.email}`);
      } else {
        user.name = patient.name;
        user.password = patient.password;
        user.phone = patient.phone;
        user.role = 'patient';
        await user.save();
        console.log(`Updated Patient user: ${patient.email}`);
      }
    }

    // 3. Seed Admins
    console.log('\n--- Seeding Admins ---');
    for (const admin of adminsData) {
      let user = await User.findOne({ email: admin.email });
      if (!user) {
        user = await User.create(admin);
        console.log(`Created Admin user: ${admin.email}`);
      } else {
        user.name = admin.name;
        user.password = admin.password;
        user.phone = admin.phone;
        user.role = 'admin';
        await user.save();
        console.log(`Updated Admin user: ${admin.email}`);
      }
    }

    // 4. Seed Doctors
    console.log('\n--- Seeding Doctors ---');
    for (const doc of doctorsData) {
      // Find or create User
      let user = await User.findOne({ email: doc.email });
      if (!user) {
        user = await User.create({
          name: doc.name,
          email: doc.email,
          password: doc.password,
          phone: doc.phone,
          role: 'doctor',
        });
        console.log(`Created Doctor user: ${doc.email}`);
      } else {
        user.name = doc.name;
        user.password = doc.password;
        user.phone = doc.phone;
        user.role = 'doctor';
        await user.save();
        console.log(`Updated Doctor user: ${doc.email}`);
      }

      // Find department ID if it matches seeded departments
      const deptId = deptMap[doc.specialty] || null;

      // Find or create Doctor Profile
      let docProfile = await Doctor.findOne({ userId: user._id });
      if (!docProfile) {
        docProfile = await Doctor.create({
          userId: user._id,
          name: doc.name,
          initials: generateInitials(doc.name),
          department: deptId,
          specialty: doc.specialty,
          experience: doc.experience,
          rating: 4.8,
          consultationFee: doc.consultationFee,
          availableDays: doc.availableDays,
          timeSlots: timeSlots,
          isActive: true,
        });
        console.log(`Created Doctor profile for: ${doc.name} (Specialty: ${doc.specialty})`);
      } else {
        docProfile.name = doc.name;
        docProfile.initials = generateInitials(doc.name);
        docProfile.department = deptId;
        docProfile.specialty = doc.specialty;
        docProfile.experience = doc.experience;
        docProfile.consultationFee = doc.consultationFee;
        docProfile.availableDays = doc.availableDays;
        docProfile.timeSlots = timeSlots;
        docProfile.isActive = true;
        await docProfile.save();
        console.log(`Updated Doctor profile for: ${doc.name} (Specialty: ${doc.specialty})`);
      }
    }

    console.log('\nCustom data seeding completed successfully!');
    mongoose.disconnect();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedCustomData();
