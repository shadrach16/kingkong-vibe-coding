import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import kingkongRoutes from './routes/kingkongRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import logRoutes from './routes/logRoutes.js';
// import serverlessRoutes from './routes/serverlessRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import planRoutes from './routes/planRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import usageMetricsRoutes from './routes/usageMetricsRoutes.js';
import { logger, errorLogger } from './logger.js';
import authMiddleware from './middleware/authMiddleware.js'; // User JWT Auth
import authApiMiddleware from './middleware/authApiMiddleware.js'; // API Key Auth
import usageMetricsMiddleware from './middleware/usageMetricsMiddleware.js';
import internalFunctionRoutes from './routes/internalFunctionRoutes.js';
import './config/gemini.js'; // Import the new Gemini AI config
import './config/cloudinary.js'; // Import the new Cloudinary config

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the KingKong Backend API!');
});

// Authentication routes - public access
app.use('/api/auth', authRoutes);

// Private API Routes (for dashboard use)
// These routes are protected by the USER's JWT.
// The metrics middleware logs these requests.
app.use(usageMetricsMiddleware);
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/metrics', usageMetricsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/logs', logRoutes);
// app.use('/api/serverless', serverlessRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/plans', planRoutes);
// V1 API Routes (for external developers using their API Key)
// These routes are protected by the PROJECT's API Key.
// The metrics middleware will also log these requests if they're configured to do so.
app.use('/api/v1/internal-functions', internalFunctionRoutes); 
app.use('/api/v1/kingkong', authApiMiddleware, kingkongRoutes);
// You can add more v1 routes here

app.use(errorLogger);

export default app;