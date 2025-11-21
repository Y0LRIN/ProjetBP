import bookingService from '../services/bookingService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * BookingController - Handles booking management routes
 * 
 * @class BookingController
 * @description Manages booking CRUD operations with role-based access control
 */
class BookingController {
  /**
   * Retrieves bookings for the authenticated user
   * 
   * @async
   * @param {Object} req - Express request with user in req.user
   * @param {Object} res - Express response
   */
  getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await bookingService.getUserBookings(req.user.id);
    res.json(bookings);
  });

  /**
   * Retrieves all bookings (admin) or filtered by service (all users)
   * 
   * @async
   * @param {Object} req - Express request with optional serviceId query param
   * @param {Object} res - Express response
   */
  getAllBookings = asyncHandler(async (req, res) => {
    const { serviceId } = req.query;
    let bookings;
    
    if (serviceId) {
      // Filtre par service - accessible à tous les utilisateurs authentifiés
      bookings = await bookingService.getBookingsByService(parseInt(serviceId));
    } else if (req.user.role === 'admin') {
      // Toutes les réservations - admin uniquement
      bookings = await bookingService.getAllBookings();
    } else {
      return res.status(403).json({
        message: 'Accès refusé: réservé aux administrateurs',
      });
    }
    
    res.json(bookings);
  });

  /**
   * Retrieves a booking by ID (owner or admin only)
   * 
   * @async
   * @param {Object} req - Express request with booking ID in params
   * @param {Object} res - Express response
   */
  getBookingById = asyncHandler(async (req, res) => {
    const booking = await bookingService.getBookingById(req.params.id);
    
    // Vérifier que l'utilisateur est propriétaire ou admin
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Accès refusé',
      });
    }
    
    res.json(booking);
  });

  /**
   * Creates a new booking for the authenticated user
   * 
   * @async
   * @param {Object} req - Express request with booking data in body
   * @param {Object} res - Express response
   */
  createBooking = asyncHandler(async (req, res) => {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json({
      message: 'Réservation créée avec succès',
      booking,
    });
  });

  /**
   * Cancels a booking (owner or admin)
   * 
   * @async
   * @param {Object} req - Express request with booking ID in params
   * @param {Object} res - Express response
   */
  cancelBooking = asyncHandler(async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    await bookingService.cancelBooking(req.params.id, req.user.id, isAdmin);
    res.json({
      message: 'Réservation annulée avec succès',
    });
  });

  /**
   * Updates a booking status (admin only)
   * 
   * @async
   * @param {Object} req - Express request with booking ID in params and status in body
   * @param {Object} res - Express response
   */
  updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, status);
    res.json({
      message: 'Statut mis à jour avec succès',
      booking,
    });
  });
}

export default new BookingController();
