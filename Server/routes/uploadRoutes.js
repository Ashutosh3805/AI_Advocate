import express from 'express';
import { uploadPDF, getDocuments } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Enforce auth protection for all document management endpoints
router.use(protect);

// Upload endpoint expecting file parameter 'file' matching standard multer forms
router.post('/upload', upload.single('file'), uploadPDF);

// Retrieve all uploaded documents metadata list
router.get('/documents', getDocuments);

export default router;
