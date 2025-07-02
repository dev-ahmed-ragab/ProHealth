import express from 'express';
import cloudinary from '../config/cloudinaryConfig.js';
import upload from '../middleware/multer.js';
import streamifier from 'streamifier';

const router = express.Router();

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No image uploaded. Please ensure the field name is "image"');
    }

    // Stream the file buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ProHealth', resource_type: 'image' },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Failed to upload image', error: error.message });
        }

        res.status(200).json({
          message: 'Image uploaded successfully',
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    // Use streamifier to stream the buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error('Error during upload:', error.message);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});

export default router;