import express from 'express';
import { createServerlessFunction } from '../controllers/serverlessController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createServerlessFunction);

export default router;