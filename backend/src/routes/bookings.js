import { Router } from 'express';
import bookingController from '../controllers/bookingController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { createBookingValidation, idParamValidation } from '../middleware/validation.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.js';

const router = Router();

// Routes utilisateur avec authentification
router.get('/my-bookings', authenticate, bookingController.getMyBookings);
router.get('/:id', authenticate, idParamValidation, bookingController.getBookingById);
router.post('/', authenticate, createBookingValidation, bookingController.createBooking);
router.delete('/:id', authenticate, idParamValidation, bookingController.cancelBooking);

// Routes admin
router.get('/', authenticate, bookingController.getAllBookings);
router.patch(
  '/:id/status',
  requireAdmin,
  idParamValidation,
  body('status').isIn(['confirmed', 'cancelled', 'completed']).withMessage('Statut invalide'),
  validate,
  bookingController.updateBookingStatus
);

export default router;
