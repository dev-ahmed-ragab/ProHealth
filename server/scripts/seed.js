import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import User from '../models/User.js';
import Appointment from '../models/Appointment.js';

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in server/.env');
  process.exit(1);
}

const futureDate = (daysAhead) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(0, 0, 0, 0);
  return d;
};

async function seedDatabase() {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected successfully to MongoDB!');

    // Clean existing seed data
    console.log('🧹 Clearing existing demo data...');
    await User.deleteMany({
      email: {
        $in: [
          'admin@prohealth.dev',
          'sarah.doctor@prohealth.dev',
          'omar.doctor@prohealth.dev',
          'laila.doctor@prohealth.dev',
          'khaled.doctor@prohealth.dev',
          'patient.test@example.com',
        ],
      },
    });

    console.log('🌱 Seeding users and doctors...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'Ahmed Admin',
      email: 'admin@prohealth.dev',
      password: 'Admin1234',
      role: 'admin',
      isVerified: true,
      phone: '+20 100 000 0001',
      bio: 'ProHealth Chief Healthcare Administrator.',
    });

    // 2. Create Doctors
    const doctors = await User.create([
      {
        name: 'Sarah Hassan',
        email: 'sarah.doctor@prohealth.dev',
        password: 'Doctor1234',
        role: 'doctor',
        isVerified: true,
        specialty: 'cardiology',
        phone: '+20 100 000 0002',
        bio: 'Senior Consultant Cardiologist with 14 years of experience in heart disease prevention and cardiac catheterization.',
        profilePicture: '/images/sarah-doctor.jpg',
        hasProfilePicture: true,
      },
      {
        name: 'Omar Khaled',
        email: 'omar.doctor@prohealth.dev',
        password: 'Doctor1234',
        role: 'doctor',
        isVerified: true,
        specialty: 'pediatrics',
        phone: '+20 100 000 0003',
        bio: 'Lead Pediatrician focused on infant development, early childhood diseases, and preventive pediatric nutrition.',
        profilePicture: '/images/team-member-5.jpg',
        hasProfilePicture: true,
      },
      {
        name: 'Laila Mostafa',
        email: 'laila.doctor@prohealth.dev',
        password: 'Doctor1234',
        role: 'doctor',
        isVerified: true,
        specialty: 'dermatology',
        phone: '+20 100 000 0004',
        bio: 'Board-certified Dermatologist specializing in laser treatments, clinical skincare, and modern cosmetic therapies.',
        profilePicture: '/images/laila-doctor.jpg',
        hasProfilePicture: true,
      },
      {
        name: 'Khaled Mansour',
        email: 'khaled.doctor@prohealth.dev',
        password: 'Doctor1234',
        role: 'doctor',
        isVerified: true,
        specialty: 'neurology',
        phone: '+20 100 000 0005',
        bio: 'Professor of Neurology with extensive research in neuro-rehabilitation, headache disorders, and memory care.',
        profilePicture: '/images/team-member-4.jpg',
        hasProfilePicture: true,
      },
    ]);

    // 3. Create Sample Patient
    const patient = await User.create({
      name: 'Mohamed Ali',
      email: 'patient.test@example.com',
      password: 'Patient1234',
      role: 'user',
      isVerified: true,
      phone: '+20 100 000 0099',
    });

    console.log('📅 Seeding sample appointments...');

    await Appointment.create([
      {
        patient: patient._id,
        doctor: doctors[0]._id, // Sarah
        date: futureDate(1),
        startTime: '10:00',
        endTime: '10:30',
        status: 'confirmed',
        reason: 'Routine cardiovascular health checkup and blood pressure assessment.',
      },
      {
        patient: patient._id,
        doctor: doctors[1]._id, // Omar
        date: futureDate(2),
        startTime: '11:00',
        endTime: '11:30',
        status: 'pending',
        reason: 'Follow-up for infant immunization and growth progress.',
      },
      {
        patient: patient._id,
        doctor: doctors[2]._id, // Laila
        date: futureDate(3),
        startTime: '14:00',
        endTime: '14:30',
        status: 'confirmed',
        reason: 'Skin consultation for seasonal allergy and rash.',
      },
    ]);

    console.log('\n🎉 Database Seeded Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 TEST ACCOUNTS:');
    console.log('• Admin:   admin@prohealth.dev        / Admin1234');
    console.log('• Doctor:  sarah.doctor@prohealth.dev / Doctor1234');
    console.log('• Doctor:  omar.doctor@prohealth.dev  / Doctor1234');
    console.log('• Doctor:  laila.doctor@prohealth.dev / Doctor1234');
    console.log('• Patient: patient.test@example.com   / Patient1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
