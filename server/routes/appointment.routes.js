import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
  getAvailableSlots,
} from '../controllers/appointment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { check } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Create a new appointment
router.post(
  '/',
  [
    authMiddleware,
    check('doctorId', 'معرف الطبيب مطلوب').notEmpty().isMongoId(),
    check('date', 'التاريخ غير صالح').isISO8601(),
    check('startTime', 'وقت البدء غير صالح (صيغة HH:MM)').matches(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
    ),
    check('reason', 'السبب يجب ألا يكون فارغًا إذا تم تقديمه')
      .optional()
      .isString()
      .trim()
      .notEmpty(),
  ],
  createAppointment
);

// Get all appointments for the authenticated user
router.get(
  '/',
  [
    authMiddleware,
    check('page', 'الصفحة يجب أن تكون رقمًا').optional().isInt({ min: 1 }),
    check('limit', 'الحد يجب أن يكون رقمًا').optional().isInt({ min: 1 }),
    check('status', 'الحالة غير صالحة')
      .optional()
      .isIn(['pending', 'confirmed', 'cancelled', 'completed']),
  ],
  getAppointments
);

// Get doctor's appointments
router.get(
  '/doctor/:doctorId',
  [
    authMiddleware,
    check('doctorId', 'معرف الطبيب غير صالح').isMongoId(),
    check('status', 'الحالة غير صالحة')
      .optional()
      .isIn(['pending', 'confirmed', 'cancelled', 'completed']),
    check('from', 'تاريخ البداية غير صالح').optional().isISO8601(),
    check('to', 'تاريخ النهاية غير صالح').optional().isISO8601(),
  ],
  async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { status, from, to } = req.query;

      const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'الطبيب غير موجود',
        });
      }

      req.user = { role: 'doctor', _id: doctorId };
      return getAppointments(req, res);
    } catch (error) {
      console.error('Error in doctor appointments:', error);
      return res.status(500).json({
        success: false,
        message: 'خطأ في جلب مواعيد الطبيب',
        error: error.message,
      });
    }
  }
);

// Update appointment status
router.patch(
  '/:id/status',
  [
    authMiddleware,
    check('id', 'معرف الموعد غير صالح').isMongoId(),
    check('status', 'الحالة غير صالحة').isIn([
      'pending',
      'confirmed',
      'cancelled',
      'completed',
    ]),
  ],
  updateAppointmentStatus
);

// Delete an appointment
router.delete(
  '/:id',
  [authMiddleware, check('id', 'معرف الموعد غير صالح').isMongoId()],
  deleteAppointment
);

// Cancel an appointment
router.post(
  '/:id/cancel',
  [
    authMiddleware,
    check('id', 'معرف الموعد غير صالح').isMongoId(),
    check('cancellationReason', 'سبب الإلغاء يجب ألا يكون فارغًا إذا تم تقديمه')
      .optional()
      .isString()
      .trim()
      .notEmpty(),
  ],
  cancelAppointment
);

// Update an appointment
router.put(
  '/:id',
  [
    authMiddleware,
    check('id', 'معرف الموعد غير صالح').isMongoId(),
    check('date', 'التاريخ غير صالح').optional().isISO8601(),
    check('startTime', 'وقت البدء غير صالح (صيغة HH:MM)')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    check('reason', 'السبب يجب ألا يكون فارغًا إذا تم تقديمه')
      .optional()
      .isString()
      .trim()
      .notEmpty(),
  ],
  updateAppointment
);

// Get available slots for a doctor on a specific date
router.get(
  '/available/:doctorId/:date',
  [
    authMiddleware,
    check('doctorId', 'معرف الطبيب غير صالح').isMongoId(),
    check('date', 'التاريخ غير صالح').isISO8601(),
  ],
  getAvailableSlots
);

// Get a specific appointment by ID
router.get(
  '/:id',
  [authMiddleware, check('id', 'معرف الموعد غير صالح').isMongoId()],
  getAppointmentById
);

export { router };
