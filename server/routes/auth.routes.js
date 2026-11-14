import express from 'express';
import { check } from 'express-validator';
import { protect } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/auth.controller.js';

const router = express.Router();

// Register route
router.post(
  '/register',
  [
    check('name', 'Name is required').trim().notEmpty(),
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check(
      'password',
      'Password must be at least 8 characters'
    ).isLength({ min: 8 }),
  ],
  validate,
  register
);

// Login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').isString().notEmpty(),
  ],
  validate,
  login
);

// Verify email route
router.get('/verify-email/:token', verifyEmail);

// Forgot password route
router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail().normalizeEmail()],
  validate,
  forgotPassword
);

// Reset password route
router.post(
  '/reset-password/:token',
  [
    check(
      'password',
      'Password must be at least 8 characters'
    ).isLength({ min: 8 }),
  ],
  validate,
  resetPassword
);

// Get current user route
router.get('/me', protect, getMe);

export default router;
