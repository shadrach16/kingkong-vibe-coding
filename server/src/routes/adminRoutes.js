import express from 'express';
import { getAllUsers, updateUserTaskLimit, resetUserApiKey } from '../controllers/adminController.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(adminMiddleware);

router.get('/users', getAllUsers);
router.put('/user/:id/task-limit', updateUserTaskLimit);
router.put('/user/:id/reset-api-key', resetUserApiKey);

export default router;