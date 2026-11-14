import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'change-me-in-production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

const publicUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || '',
  bio: user.bio || '',
  specialty: user.specialty || null,
  profilePicture: user.profilePicture || null,
  hasProfilePicture: Boolean(user.hasProfilePicture),
  isVerified: Boolean(user.isVerified),
});

// Register controller
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password) {
      return res
        .status(400)
        .json({ msg: 'Please provide all required fields' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Role is intentionally never taken from the request body: public
    // registration always creates a regular patient account. Doctor/admin
    // accounts are created by an administrator.
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'user',
    });

    await user.save();

    const verificationToken = signToken(user);
    user.verificationToken = verificationToken;
    await user.save();

    // Send the verification email, but never block registration on it.
    try {
      const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').replace(
        /\/$/,
        ''
      );
      await sendEmail({
        to: user.email,
        subject: 'Verify your ProHealth email',
        html: `<p>Welcome to ProHealth!</p><p>Please click <a href="${clientUrl}/verify-email/${verificationToken}">here</a> to verify your email address.</p>`,
      });
    } catch (emailError) {
      console.error(
        'Verification email could not be sent:',
        emailError.message
      );
    }

    return res.status(201).json({
      msg: 'Registration successful. Please check your email for verification.',
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // Email verification is encouraged but does not lock people out of their
    // account, especially when the mail provider is temporarily unavailable.
    const token = signToken(user);

    return res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Verify email controller
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'change-me-in-production'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid verification link' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    return res.status(400).json({ msg: 'Invalid or expired verification link' });
  }
};

// Forgot password controller
export const forgotPassword = async (req, res) => {
  const genericResponse = {
    msg: 'If an account exists with that email, password reset instructions have been sent.',
  };

  try {
    const email = normalizeEmail(req.body.email);
    const user = await User.findOne({ email });

    // Always answer the same way to avoid leaking which emails are registered.
    if (!user) {
      return res.json(genericResponse);
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    try {
      const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').replace(
        /\/$/,
        ''
      );
      await sendEmail({
        to: user.email,
        subject: 'Reset your ProHealth password',
        html: `<p>You requested a password reset.</p><p>Click <a href="${clientUrl}/reset-password/${resetToken}">here</a> to choose a new password. This link expires in 1 hour.</p><p>If you did not request this, you can safely ignore this email.</p>`,
      });
    } catch (emailError) {
      console.error('Password reset email failed:', emailError.message);
    }

    return res.json(genericResponse);
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.json(genericResponse);
  }
};

// Reset password controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ msg: 'Password must be at least 8 characters long' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired reset link' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get current user controller
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    return res.json({ user: publicUser(user) });
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ msg: 'Server error' });
  }
};
