import { billingService } from '../services/billingService.js';
import Billing from '../models/Billing.js'; // Import the model to use it directly

const getBillingInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const billingInfo = await billingService.getBillingInfo(userId);
    if (!billingInfo) {
      // Create a default billing document if one doesn't exist
      const newBillingInfo = await new Billing({ userId, usageCount: 0 }).save();
      return res.status(200).json(newBillingInfo);
    }
    res.status(200).json(billingInfo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch billing info.', error: error.message });
  }
};

const createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;
    const userId = req.user._id;
    const session = await billingService.createCheckoutSession(priceId, userId);
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create checkout session.' });
  }
};

const handleStripeWebhook = async (req, res) => {
  try {
    await billingService.handleStripeWebhook(req);
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export {
  getBillingInfo,
  createCheckoutSession,
  handleStripeWebhook,
};