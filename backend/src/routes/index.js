import { Router } from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import serviceRoutes from './services.js';
import bookingRoutes from './bookings.js';

const router = Router();

// Monter les routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/bookings', bookingRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

export default router;
