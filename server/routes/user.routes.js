import express from 'express';
import multer from 'multer';
import { check } from 'express-validator';
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
import validate from '../middleware/validate.js';

// Configure multer for in-memory uploads (streamed straight to Cloudinary).
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const extension = file.originalname.split('.').pop()?.toLowerCase() || '';
  if (allowed.test(file.mimetype) && allowed.test(extension)) {
    return cb(null, true);
  }
  return cb(new Error('Only JPEG and PNG images are allowed'));
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadSingleImage = (req, res, next) => {
  upload.single('profilePicture')(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        msg:
          error.code === 'LIMIT_FILE_SIZE'
            ? 'Image is too large. Maximum size is 5MB.'
            : error.message,
      });
    }
    return next();
  });
};

const profileValidators = [
  check('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  check('email').optional().trim().isEmail().withMessage('Invalid email'),
  check('phone')
    .optional()
    .trim()
    .matches(/^[+()\-\s\d]{6,20}$/)
    .withMessage('Invalid phone number'),
  check('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  check('role')
    .optional()
    .isIn(['user', 'doctor', 'admin'])
    .withMessage('Invalid role'),
];

const router = express.Router();

// Public routes (must be declared before "/:id")
router.get('/doctors', getPublicDoctors);
router.get('/doctors/:id', getDoctorForBooking);
router.get('/public/doctors', getPublicDoctors);
router.get('/public/doctors/:id', getDoctorForBooking);

// Admin-only routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.delete('/:id', authMiddleware, deleteUser);

// Protected doctor routes
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

// Authenticated routes
router.get('/:id', authMiddleware, getUserById);
router.put(
  '/:id',
  authMiddleware,
  profileValidators,
  validate,
  updateUser
);
router.post(
  '/:id/password',
  authMiddleware,
  [
    check('currentPassword', 'Current password is required').notEmpty(),
    check('newPassword', 'New password must be at least 8 characters').isLength({
      min: 8,
    }),
  ],
  validate,
  updatePassword
);
router.post(
  '/:id/profile-picture',
  authMiddleware,
  uploadSingleImage,
  uploadProfilePicture
);
router.post(
  '/:id/edit-profile-picture',
  authMiddleware,
  editProfilePicture
);

export default router;
