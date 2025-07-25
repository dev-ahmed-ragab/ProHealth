import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['user', 'doctor', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    specialty: {
      type: String,
      enum: [
        'general',
        'cardiology',
        'neurology',
        'pediatrics',
        'orthopedics',
        'dermatology',
        null,
      ],
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    phone: { type: String, trim: true },
    profilePicture: { type: String, trim: true, default: null },
    hasProfilePicture: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);