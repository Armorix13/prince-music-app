import express from 'express';
import userRoutes from './user.route.js';
import portfolioRoutes from './portfolio.route.js';
import courseRoutes from './course.route.js';
import enrollmentRoutes from './enrollment.route.js';

const router = express.Router();

const API_VERSION = '/api/v1';

// Route mounting
router.use(`${API_VERSION}/portfolio`, portfolioRoutes);
router.use(`${API_VERSION}/users`, userRoutes);
router.use(`${API_VERSION}/courses`, courseRoutes);
router.use(`${API_VERSION}/enrollments`, enrollmentRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});


export default router;
