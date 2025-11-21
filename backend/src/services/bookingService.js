import repository from '../repositories/jsonRepository.js';

/**
 * BookingService - Handles booking management
 * 
 * @class BookingService
 * @description Manages booking creation, cancellation, and retrieval with conflict detection
 */
class BookingService {
  /**
   * Retrieves all bookings for a specific user
   * 
   * @async
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of user's bookings with service details
   */
  async getUserBookings(userId) {
    const bookings = await repository.findMany('bookings', b => b.userId === parseInt(userId));
    
    // Enrichir avec les informations du service
    const enrichedBookings = await Promise.all(
      bookings.map(async booking => {
        try {
          const service = await serviceService.getServiceById(booking.serviceId);
          return {
            ...booking,
            service: {
              id: service.id,
              name: service.name,
              type: service.type,
            },
          };
        } catch (error) {
          return booking;
        }
      })
    );

    return enrichedBookings;
  }

  /**
   * Retrieves all bookings in the system (admin only)
   * 
   * @async
   * @returns {Promise<Array>} Array of all bookings with service and user details
   */
  async getAllBookings() {
    const bookings = await repository.read('bookings');
    
    // Enrichir avec les informations du service et de l'utilisateur
    const enrichedBookings = await Promise.all(
      bookings.map(async booking => {
        try {
          const service = await serviceService.getServiceById(booking.serviceId);
          const user = await repository.findById('users', booking.userId);
          return {
            ...booking,
            service: {
              id: service.id,
              name: service.name,
              type: service.type,
            },
            user: user ? {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            } : null,
          };
        } catch (error) {
          return booking;
        }
      })
    );

    return enrichedBookings;
  }

  /**
   * Retrieves all bookings for a specific service
   * 
   * @async
   * @param {number} serviceId - Service ID
   * @returns {Promise<Array>} Array of bookings for the service
   */
  async getBookingsByService(serviceId) {
    const bookings = await repository.findMany('bookings', b => b.serviceId === serviceId);
    return bookings;
  }

  /**
   * Retrieves a booking by ID
   * 
   * @async
   * @param {number} id - Booking ID
   * @returns {Promise<Object>} Booking data
   * @throws {Error} If booking not found
   */
  async getBookingById(id) {
    const booking = await repository.findById('bookings', id);
    if (!booking) {
      throw new Error('Réservation non trouvée');
    }
    return booking;
  }

  /**
   * Creates a new booking with conflict validation
   * 
   * @async
   * @param {Object} bookingData - Booking creation data
   * @param {number} bookingData.userId - User ID
   * @param {number} bookingData.serviceId - Service ID
   * @param {string} bookingData.start - Start time (ISO format)
   * @param {string} bookingData.end - End time (ISO format)
   * @returns {Promise<Object>} Created booking
   * @throws {Error} If service not found or time slot unavailable
   */
  async createBooking(bookingData) {
    const { serviceId, slot } = bookingData;

    if (!serviceId || !slot) {
      throw new Error('Le service et le créneau sont requis');
    }

    // Vérifier que le service existe
    const service = await serviceService.getServiceById(serviceId);

    // Vérifier que le créneau existe pour ce service
    if (!service.slots.includes(slot)) {
      throw new Error('Ce créneau n\'existe pas pour ce service');
    }

    // Vérifier que le créneau n'est pas déjà réservé
    const existingBooking = await repository.findOne(
      'bookings',
      b => b.serviceId === parseInt(serviceId) && b.slot === slot
    );
    if (existingBooking) {
      throw new Error('Ce créneau est déjà réservé');
    }

    // Vérifier que l'utilisateur n'a pas déjà une réservation pour ce créneau (conflit horaire)
    const userBookings = await this.getUserBookings(userId);
    const hasConflict = userBookings.some(b => b.slot === slot);
    if (hasConflict) {
      throw new Error('Vous avez déjà une réservation à ce créneau horaire');
    }

    return await repository.create('bookings', {
      userId: parseInt(userId),
      serviceId: parseInt(serviceId),
      slot,
      status: 'confirmed',
    });
  }

  /**
   * Cancels a booking (user can cancel own, admin can cancel any)
   * 
   * @async
   * @param {number} bookingId - Booking ID
   * @param {number} userId - User ID requesting cancellation
   * @param {boolean} [isAdmin=false] - Whether requester is admin
   * @returns {Promise<boolean>} true if cancelled
   * @throws {Error} If booking not found or unauthorized
   */
  async cancelBooking(bookingId, userId, isAdmin = false) {
    const booking = await this.getBookingById(bookingId);

    // Vérifier que l'utilisateur est propriétaire de la réservation ou est admin
    if (!isAdmin && booking.userId !== parseInt(userId)) {
      throw new Error('Vous n\'êtes pas autorisé à annuler cette réservation');
    }

    const result = await repository.delete('bookings', bookingId);
    if (!result) {
      throw new Error('Réservation non trouvée');
    }

    return true;
  }

  /**
   * Updates the status of a booking (admin only)
   * 
   * @async
   * @param {number} bookingId - Booking ID
   * @param {string} status - New status ('confirmed', 'cancelled', 'completed')
   * @returns {Promise<Object>} Updated booking
   * @throws {Error} If status invalid or booking not found
   */
  async updateBookingStatus(bookingId, status) {
    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      throw new Error('Statut invalide');
    }

    const updatedBooking = await repository.update('bookings', bookingId, { status });
    if (!updatedBooking) {
      throw new Error('Réservation non trouvée');
    }

    return updatedBooking;
  }
}

export default new BookingService();
