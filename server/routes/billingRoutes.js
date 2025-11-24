import express from 'express';
import {  createCheckoutSession, handleStripeWebhook,getBillingInfo } from '../controllers/billingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Public webhook route (must be before middleware)
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Protected routes
router.use(authMiddleware);
router.get('/usage', authMiddleware, getBillingInfo);
router.post('/checkout', createCheckoutSession);

export default router;