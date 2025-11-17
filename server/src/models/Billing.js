import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  currentPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  lastResetDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

const Billing = mongoose.model('Billing', billingSchema);

export default Billing;