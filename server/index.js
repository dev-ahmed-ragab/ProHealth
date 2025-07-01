import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { router as appointmentRoutes } from './routes/appointment.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dn7s97ydy',
  api_key: process.env.CLOUDINARY_API_KEY || '661839662643331',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'GydXCIzBQBFptgSEfjvWrODNUnQ',
});

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تهيئة CORS
app.use(cors({
  origin: ['https://pro-health-wine.vercel.app', 'http://localhost:3000'], // أضف المنشأ المحلي
  credentials: true, // إذا كنت تستخدم ملفات تعريف الارتباط أو التوكن
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/upload', uploadRoutes);

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose
  .connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// تصدير الـ app كافتراضي لـ Vercel و ESM
export default app;
export { cloudinary };