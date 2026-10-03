import express from 'express';
import { updateIssueStatus } from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.patch('/:id/status', protect, updateIssueStatus);

export default router;
