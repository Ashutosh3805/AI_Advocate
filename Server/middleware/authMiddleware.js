import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect API routes and verify JWT tokens.
 * Extracts the user object from database and attaches it to req.user.
 */
export const protect = async (req, res, next) => {
  let token;

  // Read Bearer token from authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Secure session credentials not found.',
      data: null,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ai_advocate_super_secure_terminal_key_2026');

    // Retrieve user and exclude hashed password string
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. The target security identity is invalid or deleted.',
        data: null,
      });
    }

    next();
  } catch (error) {
    console.error(`[AUTH_MIDDLEWARE_ERROR] JWT Verification: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Access denied. Invalid, expired, or compromised token signature.',
      data: null,
    });
  }
};

/**
 * Middleware to restrict route access to specific roles.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden access. Your clearance role (${req.user?.role || 'none'}) is insufficient.`,
        data: null,
      });
    }
    next();
  };
};
