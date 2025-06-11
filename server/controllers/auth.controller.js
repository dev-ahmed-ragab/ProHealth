import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

// Register controller
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create user
    user = new User({ name, email, password, role });
    
    // Save user first
    await user.save();

    // Generate verification token
    const verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    user.verificationToken = verificationToken;
    await user.save();

    try {
      // Send verification email
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email',
        html: `<p>Please click <a href="${verificationUrl}">here</a> to verify your email.</p>`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue despite email error
    }

    res.status(201).json({ msg: 'Registration successful. Please check your email for verification.' });
  } catch (err) {
    console.error('Registration error:', err); // إضافة سجل للخطأ
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(400).json({ msg: 'Please verify your email first' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Verify email controller
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and update
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    res.status(400).json({ msg: 'Invalid or expired token' });
  }
};

// Forgot password controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`
    });

    res.json({ msg: 'Password reset instructions sent to your email' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Reset password controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Find user by token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get current user controller
export const getMe = async (req, res) => {
  try {
    // User is already available in req.user from the protect middleware
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};