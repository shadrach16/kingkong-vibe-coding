import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  stripePriceId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0, // Store the price in the lowest currency unit (e.g., cents)
  },
  taskLimit: {
    type: Number,
    required: true,
    default: 0, // 0 for unlimited or a specific number
  },
}, {
  timestamps: true,
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;