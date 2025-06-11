import express from 'express';
import { protect } from '../middleware/auth.js';
import { check } from 'express-validator';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe
} from '../controllers/auth.controller.js';

const router = express.Router();

// Register route
router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], register);

// Login route
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], login);

// Verify email route
router.get('/verify-email/:token', verifyEmail);

// Forgot password route
router.post('/forgot-password', [
  check('email', 'Please include a valid email').isEmail()
], forgotPassword);

// Reset password route
router.post('/reset-password/:token', [
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], resetPassword);

// Get current user route
router.get('/me', protect, getMe);

export default router;