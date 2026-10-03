import express from 'express';
import multer from 'multer';
import {
  createProject,
  listProjects,
  getProject,
  getDashboardStats,
  handleTryDemoProject
} from '../controllers/projectController.js';
import {
  uploadDocument,
  listDocuments
} from '../controllers/documentController.js';
import {
  runAIAnalysis,
  getInsights
} from '../controllers/analysisController.js';
import {
  listTasks,
  createTask
} from '../controllers/taskController.js';
import { listDecisions } from '../controllers/decisionController.js';
import { listIssues } from '../controllers/issueController.js';
import { getTimeline } from '../controllers/timelineController.js';
import { projectChat } from '../controllers/chatController.js';
import { generateHandoffReport } from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Project routes
router.post('/', protect, createProject);
router.get('/', protect, listProjects);
router.get('/dashboard-stats', protect, getDashboardStats);
router.post('/demo', protect, handleTryDemoProject);
router.get('/:id', protect, getProject);

// Documents sub-routes
router.post('/:id/documents', protect, upload.single('file'), uploadDocument);
router.get('/:id/documents', protect, listDocuments);

// AI Analysis & Insights
router.post('/:id/analyze', protect, runAIAnalysis);
router.get('/:id/insights', protect, getInsights);

// Tasks sub-routes
router.get('/:id/tasks', protect, listTasks);
router.post('/:id/tasks', protect, createTask);

// Decisions, Issues, Timeline
router.get('/:id/decisions', protect, listDecisions);
router.get('/:id/issues', protect, listIssues);
router.get('/:id/timeline', protect, getTimeline);

// Grounded Chat
router.post('/:id/chat', protect, projectChat);

// Handoff Report
router.post('/:id/generate-handoff', protect, generateHandoffReport);

export default router;
