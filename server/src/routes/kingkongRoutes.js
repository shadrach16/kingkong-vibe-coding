import express from 'express';
import { runAiTask } from '../controllers/kingkongController.js';
import authApiMiddleware from '../middleware/authApiMiddleware.js';

const router = express.Router();

router.post('/run-tasks', authApiMiddleware, runAiTask);

export default router;