import express from 'express';
import { askQuestion, getChats, getChatById, createNewChat, deleteChat } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Enforce auth protection for all chat interaction endpoints
router.use(protect);

router.post('/', askQuestion);
router.post('/new', createNewChat);
router.get('/history', getChats);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);

export default router;
