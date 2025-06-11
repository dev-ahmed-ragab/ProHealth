import { body } from 'express-validator';

export const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
];

export const postValidator = [
  body('title')
    .exists()
    .withMessage('عنوان المنشور مطلوب')
    .notEmpty()
    .withMessage('لا يمكن أن يكون العنوان فارغاً')
    .trim()
    .isLength({ max: 100 })
    .withMessage('يجب ألا يتجاوز العنوان 100 حرف'),
  body('content')
    .exists()
    .withMessage('محتوى المنشور مطلوب')
    .notEmpty()
    .withMessage('لا يمكن أن يكون المحتوى فارغاً')
    .trim(),
  body('category')
    .exists()
    .withMessage('تصنيف المنشور مطلوب')
    .notEmpty()
    .withMessage('لا يمكن أن يكون التصنيف فارغاً')
    .trim()
    .isIn(['frontend', 'backend', 'fullstack', 'devops', 'database', 'other'])
    .withMessage('تصنيف غير صالح')
];