import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier';

const USER_PUBLIC_FIELDS =
  'name email role phone bio specialty profilePicture hasProfilePicture isVerified createdAt';

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
  createdAt: user.createdAt,
});

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();

const isSelf = (req, id) =>
  req.user && req.user._id && req.user._id.toString() === id.toString();

const canManageUser = (req, id) =>
  req.user && (req.user.role === 'admin' || isSelf(req, id));

const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes('/upload/')) return null;
  const afterUpload = url.split('/upload/')[1] || '';
  const withoutVersion = afterUpload.replace(/^v\d+\//, '');
  return withoutUploadExtension(withoutVersion);
};

const withoutUploadExtension = (value) => value.replace(/\.[a-zA-Z0-9]+$/, '');

const destroyProfilePicture = async (url) => {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Could not remove old profile picture:', error.message);
  }
};

// Get single user by ID (admin or the user themselves)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!canManageUser(req, id)) {
      return res
        .status(403)
        .json({ success: false, msg: 'You can only view your own profile' });
    }

    const user = await User.findById(id).select(USER_PUBLIC_FIELDS);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    return res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, msg: 'Admin access required' });
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 100, 1),
      200
    );
    const search = String(req.query.search || '').trim();

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select(USER_PUBLIC_FIELDS)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: users.map(publicUser),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Update user (admin can update any user, users can update their own data)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!canManageUser(req, id)) {
      return res
        .status(403)
        .json({ success: false, msg: 'You can only edit your own profile' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const { name, email, phone, specialty, role, bio } = req.body;

    if (role !== undefined && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, msg: 'Only admins can change roles' });
    }

    if (role !== undefined && !['user', 'doctor', 'admin'].includes(role)) {
      return res
        .status(400)
        .json({ success: false, msg: 'Invalid role' });
    }

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res
          .status(400)
          .json({ success: false, msg: 'Name cannot be empty' });
      }
      user.name = String(name).trim();
    }

    if (email !== undefined) {
      const normalizedEmail = normalizeEmail(email);
      if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
        return res
          .status(400)
          .json({ success: false, msg: 'Please provide a valid email' });
      }
      const existing = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });
      if (existing) {
        return res
          .status(409)
          .json({ success: false, msg: 'That email is already in use' });
      }
      user.email = normalizedEmail;
    }

    if (phone !== undefined) user.phone = String(phone).trim();
    if (bio !== undefined) user.bio = String(bio).trim().slice(0, 500);

    if (role !== undefined) {
      user.role = role;
      if (role !== 'doctor') {
        user.specialty = null;
      }
    }

    if (specialty !== undefined) {
      if (user.role !== 'doctor') {
        return res.status(400).json({
          success: false,
          msg: 'Specialty can only be set for doctors',
        });
      }
      user.specialty = specialty || null;
    }

    await user.save();

    return res.json({
      success: true,
      msg: 'Profile updated successfully',
      user: publicUser(user),
    });
  } catch (err) {
    console.error('Update user error:', err);
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ success: false, msg: 'That email is already in use' });
    }
    if (err?.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        msg: Object.values(err.errors)[0]?.message || 'Invalid profile data',
      });
    }
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Delete user (admin can delete anyone, users can delete their own account)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!canManageUser(req, id)) {
      return res
        .status(403)
        .json({ success: false, msg: 'You can only delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    // Remove the account's appointments so other users do not see dangling
    // records, then remove the avatar stored on Cloudinary.
    await Appointment.deleteMany({
      $or: [{ patient: user._id }, { doctor: user._id }],
    });

    if (user.profilePicture) {
      await destroyProfilePicture(user.profilePicture);
    }

    await user.deleteOne();

    return res.json({
      success: true,
      msg: 'Account deleted successfully',
    });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Update user password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.params;

    if (!isSelf(req, id)) {
      return res
        .status(403)
        .json({ success: false, msg: 'You can only change your own password' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword || '');
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, msg: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ success: true, msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isSelf(req, id)) {
      return res.status(403).json({
        success: false,
        msg: 'You can only change your own profile picture',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, msg: 'Please choose an image to upload' });
    }

    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res
        .status(400)
        .json({ success: false, msg: 'The uploaded file is empty' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ProHealth', resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error.message);
          return res.status(502).json({
            success: false,
            msg: 'Image upload failed. Please try again.',
          });
        }

        try {
          if (user.profilePicture) {
            await destroyProfilePicture(user.profilePicture);
          }

          user.profilePicture = result.secure_url;
          user.hasProfilePicture = true;
          await user.save();

          return res.json({
            success: true,
            msg: 'Profile picture updated successfully',
            profilePicture: user.profilePicture,
            hasProfilePicture: user.hasProfilePicture,
            user: publicUser(user),
          });
        } catch (saveError) {
          console.error('Saving profile picture failed:', saveError.message);
          return res.status(500).json({
            success: false,
            msg: 'Could not save the uploaded image',
          });
        }
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error('Upload error:', err);
    return res
      .status(500)
      .json({ success: false, msg: 'Server error during upload' });
  }
};

// Apply a Cloudinary transformation to an existing profile picture
export const editProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isSelf(req, id)) {
      return res.status(403).json({
        success: false,
        msg: 'You can only change your own profile picture',
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    if (!user.profilePicture) {
      return res
        .status(400)
        .json({ success: false, msg: 'No profile picture to edit' });
    }

    const publicId = getCloudinaryPublicId(user.profilePicture);
    if (!publicId) {
      return res
        .status(400)
        .json({ success: false, msg: 'Profile picture could not be processed' });
    }

    const { transformation } = req.body;

    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      transformation: transformation || { width: 200, height: 200, crop: 'fill' },
    });

    user.profilePicture = result.secure_url;
    await user.save();

    return res.json({
      success: true,
      msg: 'Profile picture updated successfully',
      profilePicture: user.profilePicture,
      user: publicUser(user),
    });
  } catch (err) {
    console.error('Edit profile picture error:', err.message);
    return res
      .status(500)
      .json({ success: false, msg: 'Could not edit the profile picture' });
  }
};

// Get doctor by ID (admin or the doctor themselves)
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!canManageUser(req, id)) {
      return res
        .status(403)
        .json({ success: false, msg: 'You can only view your own profile' });
    }

    const doctor = await User.findOne({ _id: id, role: 'doctor' }).select(
      USER_PUBLIC_FIELDS
    );
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, msg: 'Doctor not found' });
    }

    return res.json({ success: true, data: publicUser(doctor) });
  } catch (err) {
    console.error('Get doctor error:', err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get all doctors (admin sees every doctor, a doctor sees themselves)
export const getAllDoctors = async (req, res) => {
  try {
    const query = { role: 'doctor' };
    if (req.user.role === 'doctor') {
      query._id = req.user._id;
    }

    const doctors = await User.find(query)
      .select(USER_PUBLIC_FIELDS)
      .sort({ name: 1 });

    return res.json({ success: true, data: doctors.map(publicUser) });
  } catch (err) {
    console.error('Get doctors error:', err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Public endpoint: doctors shown on the marketing site
export const getPublicDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('name specialty bio profilePicture')
      .sort({ name: 1 });

    return res.json({ success: true, data: doctors.map(publicUser) });
  } catch (err) {
    console.error('Get public doctors error:', err);
    return res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Public endpoint: doctor details for the booking page
export const getDoctorForBooking = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
    }).select('name specialty bio profilePicture');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'No doctor found with the given ID',
      });
    }

    return res.json({ success: true, data: publicUser(doctor) });
  } catch (err) {
    console.error('Error in getDoctorForBooking:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
