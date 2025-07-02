import User from '../models/User.js';
import cloudinary from '../config/cloudinaryConfig.js';
import streamifier from 'streamifier';

// Get single user by ID (accessible by admin or the user themselves)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const users = await User.find().select(
      '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
    );

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user (admin can update any user, users can update their own data)
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, specialty, role, bio } = req.body;

    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can change roles' });
    }

    if (specialty && role !== 'doctor') {
      return res
        .status(400)
        .json({ msg: 'Specialty can only be set for doctors' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.bio = bio || user.bio;

    if (req.user.role === 'admin') {
      user.role = role || user.role;
      user.specialty = specialty || user.specialty;
    }

    await user.save();
    res.json({ msg: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Delete profile picture from Cloudinary if it exists
    if (user.profilePicture) {
      const publicId = user.profilePicture.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`ProHealth/${publicId}`);
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update user password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ msg: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Check if file buffer exists
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ msg: 'Invalid file data' });
    }

    // Stream the file buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ProHealth', resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ msg: 'Failed to upload to Cloudinary', error: error.message });
        }

        // Delete previous profile picture from Cloudinary if it exists
        if (user.profilePicture) {
          const publicId = user.profilePicture.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`ProHealth/${publicId}`);
        }

        // Update user with new Cloudinary URL
        user.profilePicture = result.secure_url;
        user.hasProfilePicture = true;
        await user.save();

        const updatedUser = await User.findById(req.params.id);
        if (!updatedUser.profilePicture.startsWith('https://res.cloudinary.com/')) {
          return res.status(500).json({ msg: 'Failed to save Cloudinary URL' });
        }

        res.json({
          msg: 'Profile picture uploaded successfully',
          profilePicture: updatedUser.profilePicture,
          hasProfilePicture: updatedUser.hasProfilePicture,
        });
      }
    );

    // Use streamifier to stream the buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ msg: 'Server error during upload', error: err.message });
  }
};

// Edit profile picture
export const editProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ msg: 'No profile picture to edit' });
    }

    // Extract publicId from the existing Cloudinary URL
    const publicId = user.profilePicture.split('/').pop().split('.')[0];
    const { transformation } = req.body; // Example: { width: 200, height: 200, crop: 'fill' }

    // Apply transformation to the existing image
    const result = await cloudinary.uploader.explicit(`ProHealth/${publicId}`, {
      type: 'upload',
      transformation: transformation || { width: 200, height: 200, crop: 'fill' },
    });

    // Update user with the new transformed image URL
    user.profilePicture = result.secure_url;
    await user.save();

    res.json({
      msg: 'Profile picture edited successfully',
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error('Error during edit:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get doctor by ID (admin or doctor themselves)
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select(
      '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
    );

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ msg: 'Doctor not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ msg: 'Unauthorized access' });
    }

    res.json(doctor);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all doctors (admin or doctor)
export const getAllDoctors = async (req, res) => {
  try {
    let doctors;
    if (req.user.role === 'doctor') {
      doctors = await User.find({ _id: req.user._id, role: 'doctor' }).select(
        '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
      );
    } else {
      doctors = await User.find({ role: 'doctor' }).select(
        '-password -verificationToken -resetPasswordToken -resetPasswordExpires'
      );
    }

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Public endpoint: Get doctors for frontend display
export const getPublicDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'doctor',
      isVerified: true,
    }).select('name specialty bio profilePicture phone');

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Public endpoint: Get doctor details for appointment booking
export const getDoctorForBooking = async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id).select(
      'name specialty bio profilePicture phone'
    );

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'No doctor found with the given ID' });
    }
    if (!doctor.specialty) {
      return res
        .status(404)
        .json({ success: false, message: 'User is not a doctor' });
    }

    res.json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error('Error in getDoctorForBooking:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};