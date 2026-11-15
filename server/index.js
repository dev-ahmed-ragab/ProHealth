import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import { router as appointmentRoutes } from './routes/appointment.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import contactRoutes from './routes/contact.routes.js';
import './config/cloudinaryConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server folder first, then the repo root.
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  'http://localhost:3000,https://pro-health-wine.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header (curl, health checks, same-origin).
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Ensure database connection is ready before handling API requests (critical for serverless/cold starts)
app.use(async (req, res, next) => {
  if (req.path === '/api/health') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Database connection failed on request:', err.message);
    res.status(503).json({
      success: false,
      message: 'Database connection is temporarily unavailable. Please try again shortly.',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/contact', contactRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Central error handler (never leaks stack traces to clients)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    return next(err);
  }
  if (err?.type === 'entity.parse.failed') {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid JSON payload' });
  }
  res.status(err.status || 500).json({
    success: false,
    message:
      err.status && err.status < 500
        ? err.message
        : 'Unexpected server error. Please try again later.',
  });
});

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
};

connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

const PORT = process.env.PORT || 5000;

// On Vercel the app is invoked as a serverless function; do not bind a port.
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
export { connectDB };
