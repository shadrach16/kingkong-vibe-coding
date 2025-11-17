import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, CLIENT_URL  } from '../config/env.js';
import Billing from '../models/Billing.js';
import User from '../models/User.js';
import Plan from '../models/Plan.js';

const stripe = new Stripe(STRIPE_SECRET_KEY);

const incrementTaskUsage = async (userId) => {
  const billingInfo = await Billing.findOneAndUpdate(
    { userId },
    { $inc: { usageCount: 1 } },
    { new: true }
  ).populate('currentPlan');

  if (!billingInfo) {
    throw new Error('An unexpected error occurred while updating billing information.');
  }

  const { usageCount, currentPlan } = billingInfo;
  const taskLimit = currentPlan?.taskLimit;

  // Check if the usage limit is exceeded, but only if a limit exists for the plan.
  if (taskLimit !== 0 && usageCount > taskLimit) {
    throw new Error('Usage limit exceeded for your current plan.');
  }

  return billingInfo;
};

const billingService = {


  getBillingInfo: async (userId) => {
    const billingInfo = await Billing.findOne({ userId }).populate('currentPlan');
    return billingInfo;
  },

  createCheckoutSession: async (priceId, userId) => {
    try {
      const plan = await Plan.findOne({ stripePriceId: priceId });

      if (!plan) {
        throw new Error('Invalid pricing plan selected.');
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        success_url: `${CLIENT_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${CLIENT_URL}/pricing?canceled=true`,
        client_reference_id: userId,
        metadata: {
          planId: plan._id.toString(),
          planName: plan.name,
        },
      });

      return { url: session.url };
    } catch (error) {
      console.error('Stripe Checkout Error:', error);
      throw new Error('Failed to initiate payment. Please try again.');
    }
  },

handleStripeWebhook: async (request) => {
  let event;
  const sig = request.headers['stripe-signature'];

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    throw new Error('Webhook signature verification failed.');
  }

  // Handle core subscription events
  switch (event.type) {
    case 'checkout.session.completed':
    case 'invoice.paid':
      const sessionOrInvoice = event.data.object;
      let userId, subscriptionId, priceId;

      if (event.type === 'checkout.session.completed') {
        userId = sessionOrInvoice.client_reference_id;
        subscriptionId = sessionOrInvoice.subscription;
        priceId = sessionOrInvoice.line_items.data[0].price.id; // Correct way to get priceId
      } else { // invoice.paid
        subscriptionId = sessionOrInvoice.subscription;
        priceId = sessionOrInvoice.lines.data[0].price.id; // For invoices
        const customer = await stripe.customers.retrieve(sessionOrInvoice.customer);
        userId = customer.metadata.userId;
      }

      if (!userId || !priceId || !subscriptionId) {
        console.error('Webhook payload missing key data: userId, priceId, or subscriptionId');
        return;
      }

      const user = await User.findById(userId);
      const newPlan = await Plan.findOne({ stripePriceId: priceId });

      if (!user || !newPlan) {
        console.error(`User or plan not found for ID: ${userId} / ${priceId}`);
        return;
      }

      await Billing.findOneAndUpdate(
        { userId: user._id },
        {
          currentPlan: newPlan._id,
          stripeSubscriptionId: subscriptionId,
          lastPaymentDate: new Date(),
          usageCount: 0,
        },
        { upsert: true, new: true }
      );

      user.subscriptionPlan = newPlan.name.toLowerCase();
      user.dailyTaskLimit = newPlan.taskLimit;
      await user.save();

      console.log(`✅ User ${user.email} successfully subscribed to the ${newPlan.name} plan.`);
      break;

    case 'customer.subscription.deleted':
    case 'invoice.payment_failed':
      const subscription = event.data.object.subscription;
      const userToDowngrade = await User.findOne({ stripeSubscriptionId: subscription });

      if (userToDowngrade) {
        // Downgrade the user to the free plan
        const freePlan = await Plan.findOne({ name: 'Free' });
        if (freePlan) {
          await Billing.findOneAndUpdate(
            { userId: userToDowngrade._id },
            { currentPlan: freePlan._id, stripeSubscriptionId: null,usageCount: 0 },
            { new: true }
          );

          userToDowngrade.subscriptionPlan = 'free';
          userToDowngrade.dailyTaskLimit = freePlan.taskLimit;
          await userToDowngrade.save();

          console.log(`⚠️ User ${userToDowngrade.email} downgraded to Free plan due to payment failure or cancellation.`);
        }
      }
      break;

    default:
      console.log(`🤷 Unhandled event type ${event.type}`);
  }

}
} 
 

export {
  incrementTaskUsage,
  billingService,
};