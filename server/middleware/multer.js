import multer from 'multer';
import path from 'path';

// إعداد التخزين المؤقت للملفات
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    console.log('Destination path:', uploadPath); // تتبع المسار
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + path.extname(file.originalname);
    console.log('Generated filename:', filename); // تتبع اسم الملف
    cb(null, filename);
  },
});

// فلتر للسماح بأنواع معينة من الملفات
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('يُسمح فقط برفع الصور بصيغ JPEG أو PNG!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // حد الحجم: 5 ميجابايت
});

export default upload;