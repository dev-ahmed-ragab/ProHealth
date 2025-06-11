// // import jwt from 'jsonwebtoken';
// // import User from '../models/User.js'; // Import User model to validate user existence

// // export const authMiddleware = (req, res, next) => {
// //   try {
// //     // Get token from Authorization header
// //     const authHeader = req.header('Authorization');
// //     if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //       return res.status(401).json({ success: false, message: 'الرجاء تقديم توكن صالح' });
// //     }

// //     const token = authHeader.replace('Bearer ', '');
// //     if (!token) {
// //       return res.status(401).json({ success: false, message: 'لم يتم العثور على توكن' });
// //     }

// //     // Verify token
// //     if (!process.env.JWT_SECRET) {
// //       throw new Error('JWT_SECRET is not defined in environment variables');
// //     }
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     console.log('Decoded JWT:', decoded); // Debug log

// //     // Ensure _id exists in payload
// //     if (!decoded._id && !decoded.id) {
// //       return res.status(401).json({ success: false, message: 'توكن غير صالح: معرف المستخدم مفقود' });
// //     }

// //     // Normalize _id
// //     req.user = {
// //       _id: decoded._id || decoded.id, // Support both _id and id
// //       role: decoded.role,
// //     };

// //     // Optional: Validate user exists in database
// //     // const user = await User.findById(req.user._id);
// //     // if (!user) {
// //     //   return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
// //     // }

// //     next();
// //   } catch (error) {
// //     console.error('Auth Middleware Error:', error.message); // Debug log
// //     res.status(401).json({ success: false, message: 'توكن غير صالح' });
// //   }
// // };
// import jwt from 'jsonwebtoken';

// // Authentication middleware
// export const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization')?.replace('Bearer ', '');
  
//   if (!token) {
//     return res.status(401).json({ msg: 'No token, authorization denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Contains user id and role
//     next();
//   } catch (err) {
//     res.status(401).json({ msg: 'Token is not valid' });
//   }
// };

// // Admin-only middleware
// export const adminMiddleware = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ msg: 'Admin access required' });
//   }
//   next();
// };
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Import User model to validate user existence

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'الرجاء تقديم توكن صالح' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'لم يتم العثور على توكن' });
    }

    // Verify token
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded); // Debug log

    // Ensure _id exists in payload
    if (!decoded._id && !decoded.id) {
      return res.status(401).json({ success: false, message: 'توكن غير صالح: معرف المستخدم مفقود' });
    }

    // Normalize _id
    req.user = {
      _id: decoded._id || decoded.id, // Support both _id and id
      role: decoded.role,
    };

    // Optional: Validate user exists in database
    // const user = await User.findById(req.user._id);
    // if (!user) {
    //   return res.status(401).json({ success: false, message: 'المستخدم غير موجود' });
    // }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message); // Debug log
    res.status(401).json({ success: false, message: 'توكن غير صالح' });
  }
};

// Admin-only middleware
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

// Doctor or Admin middleware
export const doctorOrAdminMiddleware = (req, res, next) => {
  if (!['admin', 'doctor'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Doctor or Admin access required' });
  }
  next();
};