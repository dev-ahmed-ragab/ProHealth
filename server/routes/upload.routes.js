import express from 'express';
import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../middleware/multer.js';
import fs from 'fs/promises';

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Request body:', req.body); // تتبع البيانات المرسلة
    console.log('Request file:', req.file); // تتبع الملف المرفوع

    if (!req.file) {
      throw new Error('لم يتم رفع أي صورة. تحقق من اسم الحقل (يجب أن يكون "image")');
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ProHealth', // اسم المجلد المحدد
    });

    console.log('Upload to Cloudinary successful:', result); // تأكيد نجاح الرفع

    // حذف الملف المؤقت
    await fs.unlink(req.file.path);
    console.log('Temporary file deleted:', req.file.path);

    res.status(200).json({
      message: 'تم رفع الصورة بنجاح',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error during upload:', error.message); // طباعة رسالة الخطأ
    res.status(500).json({ message: 'حدث خطأ أثناء رفع الصورة', error: error.message });
  }
});

export default router;