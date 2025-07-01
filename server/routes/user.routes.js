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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('يجب أن تكون الصورة بصيغة JPEG أو PNG'));
  },
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
    check('name', 'الاسم مطلوب').optional().notEmpty().trim(),
    check('email', 'البريد الإلكتروني غير صالح').optional().isEmail(),
    check('phone', 'رقم الهاتف غير صالح').optional().isMobilePhone(),
    check('bio', 'الوصف يجب ألا يتجاوز 500 حرف')
      .optional()
      .isLength({ max: 500 }),
  ],
  updateUser
);
router.post(
  '/:id/password',
  [
    authMiddleware,
    check('currentPassword', 'كلمة المرور الحالية مطلوبة').notEmpty(),
    check(
      'newPassword',
      'كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'
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