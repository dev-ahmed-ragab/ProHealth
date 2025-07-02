import express from 'express';
import {
  getDoctorById,
  getAllDoctors,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getPublicDoctors,
  getDoctorForBooking,
  updatePassword,
  uploadProfilePicture,
  editProfilePicture,
} from '../controllers/user.controller.js';
import {
  authMiddleware,
  adminMiddleware,
  doctorOrAdminMiddleware,
} from '../middleware/auth.middleware.js';
import multer from 'multer';
import { check } from 'express-validator';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(file.originalname.toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only JPEG or PNG images are allowed'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

const router = express.Router();

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);

// Public routes for doctors
router.get('/doctors/:id', getDoctorForBooking);
router.get('/doctors', getPublicDoctors);

// Authenticated routes
router.get('/:id', authMiddleware, getUserById);
router.put(
  '/:id',
  [
    authMiddleware,
    check('name', 'Name is required').optional().notEmpty().trim(),
    check('email', 'Invalid email').optional().isEmail(),
    check('phone', 'Invalid phone number').optional().isMobilePhone(),
    check('bio', 'Bio must not exceed 500 characters')
      .optional()
      .isLength({ max: 500 }),
  ],
  updateUser
);
router.post(
  '/:id/password',
  [
    authMiddleware,
    check('currentPassword', 'Current password is required').notEmpty(),
    check(
      'newPassword',
      'New password must be at least 8 characters'
    ).isLength({ min: 8 }),
  ],
  updatePassword
);
router.post(
  '/:id/profile-picture',
  authMiddleware,
  upload.single('profilePicture'),
  uploadProfilePicture
);
router.post(
  '/:id/edit-profile-picture',
  authMiddleware,
  editProfilePicture
);

// Public routes for doctors
router.get('/public/doctors', getPublicDoctors);
router.get('/public/doctors/:id', getDoctorForBooking);

// Protected routes for doctors (admin/doctor only)
router.get(
  '/protected/doctors',
  authMiddleware,
  doctorOrAdminMiddleware,
  getAllDoctors
);
router.get(
  '/protected/doctors/:id',
  authMiddleware,
  doctorOrAdminMiddleware,
  getDoctorById
);

export default router;