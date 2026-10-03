import express from 'express';
import { updateTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/:id/status', protect, updateTaskStatus);

export default router;
