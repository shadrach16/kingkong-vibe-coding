import UsageMetric from '../models/UsageMetric.js';
import User from '../models/User.js';
import Project from '../models/Project.js'; // Import the Project model
import mongoose from 'mongoose';

// @desc    Get user's dashboard metrics (summary and time-series)
// @route   GET /api/metrics/usage
// @access  Private
const getUsageMetrics = async (req, res) => {
  try {
    const userId = req.user._id;

    // --- 1. Fetch Summary Metrics ---
    // Count total API calls
    const totalCalls = await UsageMetric.countDocuments({ userId });

    // Aggregate to count successful (2xx) and failed (4xx/5xx) calls
    const statusCounts = await UsageMetric.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          successfulCalls: {
            $sum: { $cond: [{ $and: [{ $gte: ['$status', 200] }, { $lt: ['$status', 300] }] }, 1, 0] },
          },
          failedCalls: {
            $sum: { $cond: [{ $gte: ['$status', 400] }, 1, 0] },
          },
        },
      },
    ]);

    const successfulCalls = statusCounts[0]?.successfulCalls || 0;
    const failedCalls = statusCounts[0]?.failedCalls || 0;

    // Fetch user for plan limits
    const user = await User.findById(userId).select('plan');
    const planLimit = user?.plan?.apiCallLimit || 5000;
    const usedPercentage = (totalCalls / planLimit) * 100;

    // Count total projects for the user using the Project model
    const totalProjects = await Project.countDocuments({ userId });

    const activeUsers = 1; // Placeholder for future implementation

    // --- 2. Fetch Time-Series Chart Data ---
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

    const apiCallsData = await UsageMetric.aggregate(pipeline);

    // Format data for the chart, filling in missing hours with a count of 0
    const formattedData = {};
    const tempDate = new Date(oneWeekAgo);

    while (tempDate <= new Date()) {
      const key = `${tempDate.getFullYear()}-${tempDate.getMonth()}-${tempDate.getDate()}-${tempDate.getHours()}`;
      formattedData[key] = { date: new Date(tempDate), count: 0 };
      tempDate.setHours(tempDate.getHours() + 1);
    }

    apiCallsData.forEach(item => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      if (formattedData[key]) {
        formattedData[key].count = item.count;
      }
    });

    // --- 3. Combine and Respond ---
    const metrics = {
      totalCalls,
      successfulCalls,
      failedCalls,
      planLimit,
      usedPercentage: parseFloat(usedPercentage.toFixed(2)),
      totalProjects,
      activeUsers,
      apiCallsData: Object.values(formattedData)
    };

    res.status(200).json(metrics);
    
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard metrics.' });
  }
};

export { getUsageMetrics };