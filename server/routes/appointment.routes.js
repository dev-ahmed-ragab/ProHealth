import express from 'express';
import { check, query } from 'express-validator';
import {
  createAppointment,
  getAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  updateAppointment,
  getAppointmentById,
  deleteAppointment,
  getAvailableSlots,
} from '../controllers/appointment.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';

const router = express.Router();

const statusValues = ['pending', 'confirmed', 'cancelled', 'completed'];

// Get available slots for a doctor on a specific date
router.get(
  '/available/:doctorId/:date',
  [
    authMiddleware,
    check('doctorId', 'معرف الطبيب غير صالح').isMongoId(),
    check('date', 'التاريخ غير صالح').isISO8601(),
  ],
  validate,
  getAvailableSlots
);

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
  validate,
  createAppointment
);

// Get all appointments for the authenticated user
router.get(
  '/',
  [
    authMiddleware,
    query('page', 'الصفحة يجب أن تكون رقمًا').optional().isInt({ min: 1 }),
    query('limit', 'الحد يجب أن يكون رقمًا').optional().isInt({ min: 1 }),
    query('status', 'الحالة غير صالحة').optional().isIn(statusValues),
    query('from', 'تاريخ البداية غير صالح').optional().isISO8601(),
    query('to', 'تاريخ النهاية غير صالح').optional().isISO8601(),
  ],
  validate,
  getAppointments
);

// Get a specific doctor's appointments (doctor themselves or an admin)
router.get(
  '/doctor/:doctorId',
  [
    authMiddleware,
    check('doctorId', 'معرف الطبيب غير صالح').isMongoId(),
    query('status', 'الحالة غير صالحة').optional().isIn(statusValues),
    query('from', 'تاريخ البداية غير صالح').optional().isISO8601(),
    query('to', 'تاريخ النهاية غير صالح').optional().isISO8601(),
  ],
  validate,
  getDoctorAppointments
);

// Update appointment status
router.patch(
  '/:id/status',
  [
    authMiddleware,
    check('id', 'معرف الموعد غير صالح').isMongoId(),
    check('status', 'الحالة غير صالحة').isIn(statusValues),
  ],
  validate,
  updateAppointmentStatus
);

// Delete an appointment
router.delete(
  '/:id',
  [authMiddleware, check('id', 'معرف الموعد غير صالح').isMongoId()],
  validate,
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
  validate,
  cancelAppointment
);

// Update an appointment (reschedule)
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
  validate,
  updateAppointment
);

// Get a specific appointment by ID
router.get(
  '/:id',
  [authMiddleware, check('id', 'معرف الموعد غير صالح').isMongoId()],
  validate,
  getAppointmentById
);

export { router };
