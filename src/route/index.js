import express from 'express';
import userRoutes from './user.route.js';

const router = express.Router();

const API_VERSION = '/api/v1';

// Route mounting
router.use(`${API_VERSION}/users`, userRoutes);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
