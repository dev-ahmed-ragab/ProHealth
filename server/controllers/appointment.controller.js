import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import moment from 'moment-timezone';

const SLOT_MINUTES = 30;
const WORK_START_HOUR = 8;
const WORK_END_HOUR = 17;
const ACTIVE_STATUSES = ['pending', 'confirmed'];

const timeToMinutes = (time = '') => {
  const [hours, minutes] = String(time).split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

const minutesToTime = (minutes) => {
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mins = String(minutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
};

const isValidSlotStart = (time) => {
  const minutes = timeToMinutes(time);
  if (minutes === null) return false;
  const workStart = WORK_START_HOUR * 60;
  const workEnd = WORK_END_HOUR * 60 - SLOT_MINUTES;
  return (
    minutes >= workStart &&
    minutes <= workEnd &&
    minutes % SLOT_MINUTES === 0
  );
};

const rangesOverlap = (aStart, aEnd, bStart, bEnd) =>
  aStart < bEnd && aEnd > bStart;

const startOfToday = () => moment.tz('UTC').startOf('day').toDate();

// Get available appointment slots for a doctor on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'الطبيب غير موجود' });
    }

    const appointmentDate = moment.tz(date, 'UTC').startOf('day');
    if (!appointmentDate.isValid()) {
      return res
        .status(400)
        .json({ success: false, message: 'التاريخ غير صالح' });
    }

    if (appointmentDate.toDate() < startOfToday()) {
      return res
        .status(400)
        .json({ success: false, message: 'لا يمكن عرض فتحات في تاريخ ماضي' });
    }

    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: appointmentDate.toDate(),
      status: { $in: ACTIVE_STATUSES },
    })
      .select('startTime endTime')
      .lean();

    const takenRanges = existingAppointments
      .map((appointment) => ({
        start: timeToMinutes(appointment.startTime),
        end: timeToMinutes(appointment.endTime),
      }))
      .filter(({ start, end }) => start !== null && end !== null);

    const now = moment();
    const isToday = appointmentDate.isSame(now, 'day');
    const availableSlots = [];

    for (
      let minutes = WORK_START_HOUR * 60;
      minutes + SLOT_MINUTES <= WORK_END_HOUR * 60;
      minutes += SLOT_MINUTES
    ) {
      const slotEnd = minutes + SLOT_MINUTES;

      // Hide slots that already passed today.
      if (
        isToday &&
        appointmentDate.clone().add(minutes, 'minutes').isBefore(now)
      ) {
        continue;
      }

      const isTaken = takenRanges.some(({ start, end }) =>
        rangesOverlap(minutes, slotEnd, start, end)
      );

      if (!isTaken) {
        availableSlots.push({
          startTime: minutesToTime(minutes),
          endTime: minutesToTime(slotEnd),
        });
      }
    }

    return res.json({ success: true, data: availableSlots });
  } catch (error) {
    console.error('Error getting available slots:', error);
    return res
      .status(500)
      .json({ success: false, message: 'خطأ في الخادم' });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: 'الموعد غير موجود' });
    }

    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح لك بحذف هذا الموعد' });
    }

    await appointment.deleteOne();

    return res.json({ success: true, message: 'تم حذف الموعد بنجاح' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return res
      .status(500)
      .json({ success: false, message: 'خطأ في حذف الموعد' });
  }
};

// Create a new appointment for the authenticated user
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, startTime, reason } = req.body;

    if (!doctorId || !date || !startTime) {
      return res.status(400).json({
        success: false,
        message: 'معرف الطبيب والتاريخ والوقت مطلوبة',
      });
    }

    const appointmentDate = moment.tz(date, 'UTC').startOf('day').toDate();

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'الطبيب غير موجود' });
    }

    if (appointmentDate < startOfToday()) {
      return res
        .status(400)
        .json({ success: false, message: 'لا يمكن حجز موعد في الماضي' });
    }

    if (!isValidSlotStart(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'الوقت غير صالح. اختر أحد الأوقات المتاحة.',
      });
    }

    // A patient should not hold two active appointments with the same doctor
    // for the same day and time.
    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: appointmentDate,
      status: { $in: ACTIVE_STATUSES },
      startTime,
    });

    if (conflictingAppointment) {
      return res
        .status(409)
        .json({ success: false, message: 'هذا الوقت محجوز مسبقًا' });
    }

    const endTime = minutesToTime(timeToMinutes(startTime) + SLOT_MINUTES);

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date: appointmentDate,
      startTime,
      endTime,
      reason: reason?.trim() || undefined,
      status: 'pending',
    });

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patientInfo')
      .populate('doctorInfo');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Error in createAppointment:', error);
    return res
      .status(500)
      .json({ success: false, message: 'تعذر إنشاء الموعد' });
  }
};

const listAppointments = async (req, res) => {
  const { role, _id } = req.user;
  const { status, from, to } = req.query;

  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 10, 1),
    100
  );

  const query = {};

  if (role === 'user') {
    query.patient = _id;
  } else if (role === 'doctor') {
    query.doctor = _id;
  } else if (role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, message: 'غير مصرح لك' });
  }

  if (status) query.status = status;
  if (from || to) {
    query.date = {};
    if (from) {
      query.date.$gte = moment.tz(from, 'UTC').startOf('day').toDate();
    }
    if (to) {
      query.date.$lte = moment.tz(to, 'UTC').endOf('day').toDate();
    }
  }

  const appointments = await Appointment.find(query)
    .populate('patientInfo')
    .populate('doctorInfo')
    .sort({ date: 1, startTime: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Appointment.countDocuments(query);

  return res.json({
    success: true,
    data: appointments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
};

// Get all appointments for the authenticated user
export const getAppointments = async (req, res) => {
  try {
    return await listAppointments(req, res);
  } catch (error) {
    console.error('Error in getAppointments:', error);
    return res
      .status(500)
      .json({ success: false, message: 'خطأ في جلب المواعيد' });
  }
};

// Get a specific doctor's appointments (doctor themselves or an admin)
export const getDoctorAppointments = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (
      req.user.role !== 'admin' &&
      req.user._id.toString() !== doctorId.toString()
    ) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح لك بمشاهدة هذه المواعيد' });
    }

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'الطبيب غير موجود' });
    }

    const scopedRequest = Object.assign(Object.create(req), {
      user: { role: 'doctor', _id: doctorId },
    });

    return await listAppointments(scopedRequest, res);
  } catch (error) {
    console.error('Error in getDoctorAppointments:', error);
    return res
      .status(500)
      .json({ success: false, message: 'خطأ في جلب مواعيد الطبيب' });
  }
};

// Update the status of a specific appointment
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { role, _id } = req.user;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: 'الموعد غير موجود' });
    }

    if (role === 'user') {
      return res.status(403).json({
        success: false,
        message: 'يمكنك إلغاء الموعد من صفحة مواعيدي',
      });
    }

    if (role === 'doctor' && appointment.doctor.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح لك' });
    }

    if (['cancelled', 'completed'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن تعديل موعد مكتمل أو ملغي',
      });
    }

    if (role === 'doctor' && status === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن إرجاع الموعد إلى حالة الانتظار',
      });
    }

    appointment.status = status;
    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patientInfo')
      .populate('doctorInfo');

    return res.json({ success: true, data: populated });
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    return res
      .status(500)
      .json({ success: false, message: 'تعذر تحديث حالة الموعد' });
  }
};

// Cancel a specific appointment
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const { _id, role } = req.user;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: 'الموعد غير موجود' });
    }

    if (role === 'user' && appointment.patient.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح بإلغاء هذا الموعد' });
    }
    if (role === 'doctor' && appointment.doctor.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح بإلغاء هذا الموعد' });
    }

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن إلغاء هذا الموعد',
      });
    }

    appointment.status = 'cancelled';
    appointment.notes = cancellationReason
      ? `سبب الإلغاء: ${cancellationReason}`
      : 'تم إلغاء الموعد بدون سبب';

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patientInfo')
      .populate('doctorInfo');

    return res.json({ success: true, data: populated });
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    return res
      .status(500)
      .json({ success: false, message: 'تعذر إلغاء الموعد' });
  }
};

// Update (reschedule) a specific appointment
export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, reason } = req.body;
    const { _id, role } = req.user;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: 'الموعد غير موجود' });
    }

    if (role === 'user' && appointment.patient.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح بتحديث هذا الموعد' });
    }
    if (role === 'doctor' && appointment.doctor.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح بتحديث هذا الموعد' });
    }

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن تحديث موعد مكتمل أو ملغي',
      });
    }

    if (startTime && !isValidSlotStart(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'الوقت غير صالح. اختر أحد الأوقات المتاحة.',
      });
    }

    const newDate = date
      ? moment.tz(date, 'UTC').startOf('day').toDate()
      : appointment.date;
    const newStartTime = startTime || appointment.startTime;

    if (newDate < startOfToday()) {
      return res.status(400).json({
        success: false,
        message: 'لا يمكن تحديث الموعد إلى تاريخ في الماضي',
      });
    }

    const conflictingAppointment = await Appointment.findOne({
      doctor: appointment.doctor,
      date: newDate,
      _id: { $ne: id },
      status: { $in: ACTIVE_STATUSES },
      startTime: newStartTime,
    });

    if (conflictingAppointment) {
      return res
        .status(409)
        .json({ success: false, message: 'الوقت الجديد محجوز' });
    }

    appointment.date = newDate;
    appointment.startTime = newStartTime;
    appointment.endTime = minutesToTime(
      timeToMinutes(newStartTime) + SLOT_MINUTES
    );
    if (reason !== undefined) appointment.reason = reason?.trim() || undefined;

    await appointment.save();

    const populated = await Appointment.findById(appointment._id)
      .populate('patientInfo')
      .populate('doctorInfo');

    return res.json({ success: true, data: populated });
  } catch (error) {
    console.error('Error in updateAppointment:', error);
    return res
      .status(500)
      .json({ success: false, message: 'تعذر تحديث الموعد' });
  }
};

// Get a specific appointment by ID
export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, role } = req.user;

    const appointment = await Appointment.findById(id)
      .populate('patientInfo')
      .populate('doctorInfo');

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: 'الموعد غير موجود' });
    }

    if (role === 'user' && appointment.patient.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح بمشاهدة هذا الموعد' });
    }
    if (role === 'doctor' && appointment.doctor.toString() !== _id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: 'غير مصرح بمشاهدة هذا الموعد' });
    }

    return res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    return res
      .status(500)
      .json({ success: false, message: 'خطأ في جلب الموعد' });
  }
};
