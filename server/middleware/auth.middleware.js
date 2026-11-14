import jwt from 'jsonwebtoken';

const unauthorized = (res, message) =>
  res.status(401).json({ success: false, msg: message, message });

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorized(res, 'Please sign in to continue');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      return unauthorized(res, 'Please sign in to continue');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded._id || decoded.id;

    if (!userId) {
      return unauthorized(res, 'Invalid session. Please sign in again.');
    }

    req.user = {
      _id: userId,
      role: decoded.role,
    };

    return next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return unauthorized(res, 'Your session has expired. Please sign in again.');
  }
};

// Admin-only middleware
export const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res
      .status(403)
      .json({ success: false, msg: 'Admin access required' });
  }
  return next();
};

// Doctor or Admin middleware
export const doctorOrAdminMiddleware = (req, res, next) => {
  if (!['admin', 'doctor'].includes(req.user?.role)) {
    return res
      .status(403)
      .json({ success: false, msg: 'Doctor or admin access required' });
  }
  return next();
};
