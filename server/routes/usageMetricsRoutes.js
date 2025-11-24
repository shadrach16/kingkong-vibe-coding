// server/src/routes/usageMetricsRoutes.js

import express from 'express';
import { getUsageMetrics } from '../controllers/usageMetricsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/usage', authMiddleware, getUsageMetrics);

export default router;