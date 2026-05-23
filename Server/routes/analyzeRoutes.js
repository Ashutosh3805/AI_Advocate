import express from 'express';
import { analyzeDocument } from '../controllers/analyzeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce auth protection for legal analyze endpoints
router.use(protect);

router.post('/', analyzeDocument);

export default router;
