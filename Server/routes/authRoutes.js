import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { registerValidationRules, loginValidationRules, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public Authentication endpoints
router.post('/register', registerValidationRules, validate, register);
router.post('/login', loginValidationRules, validate, login);

// Protected Authentication Profile context
router.get('/me', protect, getMe);

export default router;
