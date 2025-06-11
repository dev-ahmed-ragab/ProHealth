import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value >= new Date().setHours(0, 0, 0, 0);
        },
        message: 'Appointment date must be in the future',
      },
    },
    startTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format'],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please use HH:MM format'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent double bookings
appointmentSchema.index({ doctor: 1, date: 1, startTime: 1 }, { unique: true });

// Virtuals for additional data
appointmentSchema.virtual('patientInfo', {
  ref: 'User',
  localField: 'patient',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name email phone' },
});

appointmentSchema.virtual('doctorInfo', {
  ref: 'User',
  localField: 'doctor',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name specialty' },
});

export default mongoose.model('Appointment', appointmentSchema);