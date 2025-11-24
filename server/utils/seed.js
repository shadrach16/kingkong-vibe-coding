import mongoose from 'mongoose';
import Plan from '../models/Plan.js';
import { MONGO_URI } from '../config/env.js';

mongoose.connect(MONGO_URI).then(async () => {
  console.log('MongoDB Connected. Seeding plans...');
  await Plan.deleteMany({});
  await Plan.create({
    name: 'Free',
    stripePriceId: 'price_free', // This is a mock ID, replace with a real one
    taskLimit: 10, // 10 tasks/month
  });
  console.log('Plans seeded successfully!');
  mongoose.disconnect();
}).catch(err => {
  console.error('Seeding failed:', err);
});