// Local demo runner: starts an in-memory MongoDB, seeds sample data, then
// boots the real API server against it. Development only.
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

const mongod = await MongoMemoryServer.create();
const uri = mongod.getUri('prohealth');
process.env.MONGODB_URI = uri;
process.env.PORT = process.env.PORT || '5000';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'prohealth-local-demo-secret';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.CLIENT_URLS = 'http://localhost:3000';

console.log('In-memory MongoDB:', uri);

await import('../index.js');
await mongoose.connection.asPromise();

const { default: User } = await import('../models/User.js');
const { default: Appointment } = await import('../models/Appointment.js');

const pad = (value) => String(value).padStart(2, '0');
const isoDay = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(0, 0, 0, 0);
  return date;
};

const seed = async () => {
  const existing = await User.countDocuments();
  if (existing > 0) {
    console.log('Seed skipped, database already has users.');
    return;
  }

  const admin = await User.create({
    name: 'Ahmed Admin',
    email: 'admin@prohealth.dev',
    password: 'Admin1234',
    role: 'admin',
    isVerified: true,
    phone: '+20 100 000 0001',
  });

  const doctorSpecs = [
    {
      name: 'Sarah Hassan',
      email: 'sarah.doctor@prohealth.dev',
      specialty: 'cardiology',
      bio: 'Cardiologist with 12 years of experience in preventive heart care.',
      phone: '+20 100 000 0002',
    },
    {
      name: 'Omar Khaled',
      email: 'omar.doctor@prohealth.dev',
      specialty: 'pediatrics',
      bio: 'Pediatrician focused on child nutrition and respiratory health.',
      phone: '+20 100 000 0003',
    },
    {
      name: 'Laila Mostafa',
      email: 'laila.doctor@prohealth.dev',
      specialty: 'dermatology',
      bio: 'Dermatologist treating chronic skin conditions and cosmetic care.',
      phone: '+20 100 000 0004',
    },
  ];

  const doctors = [];
  for (const spec of doctorSpecs) {
    doctors.push(
      await User.create({
        ...spec,
        password: 'Doctor1234',
        role: 'doctor',
        isVerified: true,
      })
    );
  }

  const patients = [];
  for (const spec of [
    { name: 'Mona Adel', email: 'mona@prohealth.dev', phone: '+20 100 000 0010' },
    { name: 'Youssef Tarek', email: 'youssef@prohealth.dev', phone: '+20 100 000 0011' },
    { name: 'Nour Ibrahim', email: 'nour@prohealth.dev', phone: '+20 100 000 0012' },
  ]) {
    patients.push(
      await User.create({
        ...spec,
        password: 'Patient1234',
        role: 'user',
        isVerified: true,
      })
    );
  }

  const slot = (hour) => ({
    startTime: `${pad(hour)}:00`,
    endTime: `${pad(hour)}:30`,
  });

  const appointments = [
    {
      patient: patients[0]._id,
      doctor: doctors[0]._id,
      date: isoDay(0),
      ...slot(10),
      status: 'pending',
      reason: 'Chest tightness after exercise',
    },
    {
      patient: patients[1]._id,
      doctor: doctors[0]._id,
      date: isoDay(0),
      ...slot(11),
      status: 'confirmed',
      reason: 'Blood pressure follow-up',
    },
    {
      patient: patients[2]._id,
      doctor: doctors[1]._id,
      date: isoDay(1),
      ...slot(9),
      status: 'confirmed',
      reason: 'Recurring cough for one week',
    },
    {
      patient: patients[0]._id,
      doctor: doctors[2]._id,
      date: isoDay(2),
      ...slot(14),
      status: 'pending',
      reason: 'Skin rash on both arms',
    },
    {
      patient: patients[1]._id,
      doctor: doctors[2]._id,
      date: isoDay(-3),
      ...slot(15),
      status: 'completed',
      reason: 'Annual skin check',
    },
    {
      patient: patients[2]._id,
      doctor: doctors[1]._id,
      date: isoDay(-5),
      ...slot(12),
      status: 'cancelled',
      reason: 'Vaccination appointment',
    },
  ];

  await Appointment.insertMany(appointments);

  console.log('');
  console.log('Demo accounts (password in brackets):');
  console.log('  admin@prohealth.dev    [Admin1234]');
  console.log('  sarah.doctor@prohealth.dev [Doctor1234]');
  console.log('  mona@prohealth.dev     [Patient1234]');
  console.log(`Seeded ${doctors.length} doctors, ${patients.length} patients, ${appointments.length} appointments.`);
  console.log('');
};

try {
  await seed();
} catch (error) {
  console.error('Seeding failed:', error);
}

const shutdown = async () => {
  await mongod.stop();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
