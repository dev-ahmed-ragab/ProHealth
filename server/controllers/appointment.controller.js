import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import moment from 'moment-timezone';

// Get available appointment slots for a doctor on a specific date
export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    // التحقق من وجود الطبيب
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'الطبيب غير موجود',
      });
    }

    // تحويل التاريخ إلى بداية اليوم بتوقيت UTC
    const appointmentDate = moment.tz(date, 'UTC').startOf('day');
    if (!appointmentDate.isValid()) {
      return res.status(400).json({
        success: false,
        message: 'التاريخ غير صالح',
      });
    }

    // جلب المواعيد الموجودة للطبيب في التاريخ المحدد
    const existingAppointments = await Appointment.find({
      doctor: doctorId,
      date: appointmentDate.toDate(),
      status: { $in: ['pending', 'confirmed'] },
    })
      .select('startTime endTime')
      .lean();

    // تحديد ساعات العمل
    const workingHours = {
      start: 8, // 8 صباحًا
      end: 17, // 5 مساءً
    };

    // إنشاء فتحات زمنية كل 30 دقيقة
    const slotDuration = 30; // مدة الفتحة بالدقائق
    const availableSlots = [];
    const startOfDay = moment(appointmentDate).add(workingHours.start, 'hours');
    const endOfDay = moment(appointmentDate).add(workingHours.end, 'hours');

    for (
      let slotStart = startOfDay;
      slotStart < endOfDay;
      slotStart.add(slotDuration, 'minutes')
    ) {
      const slotEnd = moment(slotStart).add(slotDuration, 'minutes');
      const startTime = slotStart.format('HH:mm');
      const endTime = slotEnd.format('HH:mm');

      // التحقق من عدم وجود تداخل مع المواعيد الموجودة
      const isSlotTaken = existingAppointments.some((apt) => {
        const aptStart = moment(appointmentDate)
          .add(parseInt(apt.startTime.split(':')[0]), 'hours')
          .add(parseInt(apt.startTime.split(':')[1]), 'minutes');
        const aptEnd = moment(appointmentDate)
          .add(parseInt(apt.endTime.split(':')[0]), 'hours')
          .add(parseInt(apt.endTime.split(':')[1]), 'minutes');

        // التحقق من التداخل
        return slotStart.isBefore(aptEnd) && slotEnd.isAfter(aptStart);
      });

      if (!isSlotTaken) {
        availableSlots.push({
          startTime,
          endTime,
        });
      }
    }

    res.json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'خطأ في الخادم',
    });
  }
};

// Delete an appointment
export const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'الموعد غير موجود',
      });
    }

    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user._id.toString() &&
      appointment.doctor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح لك بحذف هذا الموعد',
      });
    }

    await appointment.deleteOne();

    res.json({
      success: true,
      message: 'تم حذف الموعد بنجاح',
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الموعد',
    });
  }
};

// Create a new appointment for the authenticated user
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date, startTime, reason } = req.body;
    const appointmentDate = moment.tz(date, 'UTC').startOf('day').toDate();

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: 'الطبيب غير موجود' });
    }

    const today = moment.tz('UTC').startOf('day').toDate();
    if (appointmentDate < today) {
      return res
        .status(400)
        .json({ success: false, message: 'لا يمكن حجز موعد في الماضي' });
    }

    const [hours, minutes] = startTime.split(':').map(Number);
    const endTimeDate = moment(appointmentDate)
      .add({ hours, minutes })
      .add(1, 'hour');
    const endTime = endTimeDate.format('HH:mm');

    const conflictingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date: appointmentDate,
      startTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflictingAppointment) {
      return res.status(409).json({
        success: false,
        message: 'الوقت محجوز مسبقًا',
        conflictingAppointment,
      });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date: appointmentDate,
      startTime,
      endTime,
      reason,
      status: 'pending',
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      data: await Appointment.findById(appointment._id)
        .populate('patientInfo')
        .populate('doctorInfo'),
    });
  } catch (error) {
    console.error('Error in createAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
      error: error.message,
    });
  }
};

// Get all appointments for the authenticated user
export const getAppointments = async (req, res) => {
  try {
    const { role, _id } = req.user;
    const { status, from, to, page = 1, limit = 10 } = req.query;
    let query = {};

    if (role === 'user') {
      query.patient = _id;
    } else if (role === 'doctor') {
      query.doctor = _id;
    } else if (role !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح لك' });
    }

    if (status) query.status = status;
    if (from)
      query.date = {
        ...query.date,
        $gte: moment.tz(from, 'UTC').startOf('day').toDate(),
      };
    if (to)
      query.date = {
        ...query.date,
        $lte: moment.tz(to, 'UTC').endOf('day').toDate(),
      };

    const appointments = await Appointment.find(query)
      .populate('patientInfo')
      .populate('doctorInfo')
      .sort({ date: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      data: appointments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (error) {
    console.error('Error in getAppointments:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
      error: error.message,
    });
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

    if (role === 'user' && appointment.patient.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك' });
    }
    if (role === 'doctor' && appointment.doctor.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      success: true,
      data: await Appointment.findById(appointment._id)
        .populate('patientInfo')
        .populate('doctorInfo'),
    });
  } catch (error) {
    console.error('Error in updateAppointmentStatus:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
      error: error.message,
    });
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
        message: `لا يمكن إلغاء موعد ${appointment.status}`,
      });
    }

    appointment.status = 'cancelled';
    appointment.notes = cancellationReason
      ? `سبب الإلغاء: ${cancellationReason}`
      : 'تم إلغاء الموعد بدون سبب';

    await appointment.save();

    res.json({
      success: true,
      data: await Appointment.findById(appointment._id)
        .populate('patientInfo')
        .populate('doctorInfo'),
    });
  } catch (error) {
    console.error('Error in cancelAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
      error: error.message,
    });
  }
};

// Update a specific appointment
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
        message: `لا يمكن تحديث موعد ${appointment.status}`,
      });
    }

    if (date || startTime) {
      const newDate = date
        ? moment.tz(date, 'UTC').startOf('day').toDate()
        : appointment.date;
      const newStartTime = startTime || appointment.startTime;

      const conflictingAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        date: newDate,
        startTime: newStartTime,
        _id: { $ne: id },
        status: { $in: ['pending', 'confirmed'] },
      });

      if (conflictingAppointment) {
        return res.status(409).json({
          success: false,
          message: 'الوقت الجديد محجوز',
          conflictingAppointment,
        });
      }

      if (date) {
        if (newDate < moment.tz('UTC').startOf('day').toDate()) {
          return res.status(400).json({
            success: false,
            message: 'لا يمكن تحديث الموعد إلى تاريخ في الماضي',
          });
        }
        appointment.date = newDate;
      }
      if (startTime) {
        appointment.startTime = newStartTime;
        const [hours, minutes] = newStartTime.split(':').map(Number);
        const endTimeDate = moment(newDate)
          .add({ hours, minutes })
          .add(1, 'hour');
        appointment.endTime = endTimeDate.format('HH:mm');
      }
    }

    if (reason) appointment.reason = reason;

    await appointment.save();

    res.json({
      success: true,
      data: await Appointment.findById(appointment._id)
        .populate('patientInfo')
        .populate('doctorInfo'),
    });
  } catch (error) {
    console.error('Error in updateAppointment:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
      error: error.message,
    });
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

    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Error in getAppointmentById:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في الخادم',
      error: error.message,
    });
  }
};
