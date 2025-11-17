import express from 'express';
import { getUserProfile, generateNewApiKey,getDashboardData } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getUserProfile);
router.post('/api-key', generateNewApiKey);
router.get('/dashboard', getDashboardData);

export default router;

