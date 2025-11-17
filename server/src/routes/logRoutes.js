import express from 'express';
import { getProjectLogs } from '../controllers/logController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:projectId', authMiddleware, getProjectLogs);

export default router;