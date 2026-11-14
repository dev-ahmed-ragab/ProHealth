import express from 'express';
import cloudinary from '../config/cloudinaryConfig.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.js';
import streamifier from 'streamifier';

const router = express.Router();

router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image uploaded. Please use the "image" field.',
    });
  }

  if (!req.file.buffer || req.file.buffer.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: 'The uploaded file is empty' });
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'ProHealth', resource_type: 'image' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary upload error:', error.message);
        return res.status(502).json({
          success: false,
          message: 'Image upload failed. Please try again.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        imageUrl: result.secure_url,
        publicId: result.public_id,
      });
    }
  );

  uploadStream.on('error', (error) => {
    console.error('Upload stream error:', error.message);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'Image upload failed. Please try again.',
      });
    }
  });

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

export default router;
