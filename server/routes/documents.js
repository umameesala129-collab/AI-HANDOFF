import express from 'express';
import {
  downloadDocument,
  getDocumentSource,
  reprocessDocument,
  deleteDocument
} from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id/file', protect, downloadDocument);
router.get('/:id/source', protect, getDocumentSource);
router.post('/:id/reprocess', protect, reprocessDocument);
router.delete('/:id', protect, deleteDocument);

export default router;
