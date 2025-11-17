// server/src/middleware/usageMetricsMiddleware.js

import UsageMetric from '../models/UsageMetric.js';
import { getPayloadSize } from '../utils/helpers.js';

// List of specific routes to log usage for
const loggedRoutes = [
  '/api/v1/projects',
  '/api/v1/metrics/usage',
  '/api/v1/kingkong/run-tasks',
  '/v1/internal-functions'
];

const usageMetricsMiddleware = async (req, res, next) => {
  const start = performance.now();
  
  // Store the response body for payload size calculation
  const originalSend = res.send;
  res.send = function (body) {
    res.body = body;
    originalSend.apply(res, arguments);
  };
  
  const originalJson = res.json;
  res.json = function (body) {
    res.body = body;
    originalJson.apply(res, arguments);
  };

  res.on('finish', async () => {
    try {
      const responseTime = performance.now() - start;
      const userId = req.user?._id;

      // Check if the user is authenticated and the route is in our list
      const shouldLog = loggedRoutes.includes(req.originalUrl);

      if (userId && shouldLog) {
        const requestSize = getPayloadSize(req.body);
        const responseSize = getPayloadSize(res.body);

        const newMetric = new UsageMetric({
          userId: userId,
          endpoint: req.originalUrl,
          method: req.method,
          status: res.statusCode,
          responseTime: responseTime.toFixed(2),
          requestSize: requestSize,
          responseSize: responseSize
        });

        await newMetric.save();
        console.log(`[${req.method}] ${req.originalUrl} - Logged usage metric for user: ${userId}`);
      }
    } catch (error) {
      console.error('Error logging usage metric:', error.message);
    }
  });

  next();
};

export default usageMetricsMiddleware;