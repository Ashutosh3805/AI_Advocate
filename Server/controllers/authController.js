import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT generator utility
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ai_advocate_super_secure_terminal_key_2026', {
    expiresIn: '30d', // Session length: 30 days
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Credential conflict. This email is already registered.',
        data: null,
      });
    }

    // Elegant default name generator if not explicitly provided (e.g. frontend register only asks for email/password)
    const derivedName = name || email.split('@')[0].toUpperCase();

    // Create new user record
    const user = await User.create({
      name: derivedName,
      email,
      password,
      role: role || 'user',
    });

    if (user) {
      return res.status(201).json({
        success: true,
        message: 'Registration executed successfully.',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to record user identity data.',
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Lookup user record
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Invalid email credentials.',
        data: null,
      });
    }

    // Verify keyphrase password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. Invalid secure keyphrase.',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Terminal session initiated successfully.',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // req.user is populated by protect middleware
    return res.status(200).json({
      success: true,
      message: 'Secure profile context retrieved.',
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};
