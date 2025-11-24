// server/src/routes/internalFunctionRoutes.js

import express from 'express';
import { getInternalFunctions, createInternalFunction, updateInternalFunction,deleteInternalFunction,runInternalFunction } from '../controllers/internalFunctionController.js';
import authApiMiddleware from '../middleware/authApiMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getInternalFunctions);
router.post('/', authApiMiddleware, createInternalFunction);
router.put('/:id', authApiMiddleware, updateInternalFunction);
router.delete('/:id',authMiddleware, deleteInternalFunction);
router.post('/:projectId/functions/:functionId/run', authApiMiddleware, runInternalFunction,);



export default router;