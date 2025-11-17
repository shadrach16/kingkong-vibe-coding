// server/src/services/usageService.js

import UsageMetric from '../models/UsageMetric.js';
import mongoose from 'mongoose';

// ... other service functions

const getApiCallMetrics = async (userId) => {
  const now = new Date();
  const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));

  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: oneWeekAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
          hour: { $hour: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.hour': 1 },
    },
    {
      $project: {
        _id: 0,
        date: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
            hour: '$_id.hour',
          },
        },
        count: 1,
      },
    },
  ];

  const data = await UsageMetric.aggregate(pipeline);
  return data;
};

// ... export other functions
export { getApiCallMetrics };