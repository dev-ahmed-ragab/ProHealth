import express from 'express';
import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../middleware/multer.js';
import fs from 'fs/promises';

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('لم يتم رفع أي صورة. تحقق من اسم الحقل (يجب أن يكون "image")');
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ProHealth',
      resource_type: 'image',
    });

    // Delete temporary file
    await fs.unlink(req.file.path);

    res.status(200).json({
      message: 'تم رفع الصورة بنجاح',
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error('Error during upload:', error.message);
    res.status(500).json({ message: 'حدث خطأ أثناء رفع الصورة', error: error.message });
  }
});

export default router;