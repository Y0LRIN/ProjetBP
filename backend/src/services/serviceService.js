import repository from '../repositories/jsonRepository.js';

/**
 * ServiceService - Handles service management
 * 
 * @class ServiceService
 * @description Manages CRUD operations for services and slot generation
 */
class ServiceService {
  /**
   * Retrieves all services
   * 
   * @async
   * @returns {Promise<Array>} Array of all services
   */
  async getAllServices() {
    return await repository.read('services');
  }

  /**
   * Retrieves a service by ID
   * 
   * @async
   * @param {number} id - Service ID
   * @returns {Promise<Object>} Service data
   * @throws {Error} If service not found
   */
  async getServiceById(id) {
    const service = await repository.findById('services', id);
    if (!service) {
      throw new Error('Service non trouvé');
    }
    return service;
  }

  /**
   * Creates a new service (admin only)
   * 
   * @async
   * @param {Object} serviceData - Service creation data
   * @param {string} serviceData.name - Service name
   * @param {string} serviceData.description - Service description
   * @param {number} serviceData.duration - Duration in minutes
   * @param {number} serviceData.price - Price in euros
   * @param {string} serviceData.category - Service category
   * @returns {Promise<Object>} Created service
   * @throws {Error} If service with same name exists
   */
  async createService(serviceData) {
    const { name, type, description, slots = [] } = serviceData;

    if (!name || !type) {
      throw new Error('Le nom et le type du service sont requis');
    }

    if (!['room', 'equipment', 'other'].includes(type)) {
      throw new Error('Type de service invalide');
    }

    return await repository.create('services', {
      name,
      type,
      description: description || '',
      slots: Array.isArray(slots) ? slots : [],
    });
  }

  /**
   * Updates an existing service (admin only)
   * 
   * @async
   * @param {number} id - Service ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated service
   * @throws {Error} If service not found
   */
  async updateService(id, updates) {
    const { name, type, description } = updates;

    if (type && !['room', 'equipment', 'other'].includes(type)) {
      throw new Error('Type de service invalide');
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (description !== undefined) updateData.description = description;

    const updatedService = await repository.update('services', id, updateData);
    if (!updatedService) {
      throw new Error('Service non trouvé');
    }

    return updatedService;
  }

  /**
   * Deletes a service and all related bookings (admin only)
   * 
   * @async
   * @param {number} id - Service ID
   * @returns {Promise<boolean>} true if deleted
   * @throws {Error} If service not found
   */
  async deleteService(id) {
    // Vérifier s'il y a des réservations actives pour ce service
    const bookings = await repository.findMany('bookings', b => b.serviceId === parseInt(id));
    if (bookings.length > 0) {
      throw new Error('Impossible de supprimer un service avec des réservations actives');
    }

    const result = await repository.delete('services', id);
    if (!result) {
      throw new Error('Service non trouvé');
    }
    return true;
  }

  /**
   * Adds a time slot to a service (admin only)
   * 
   * @async
   * @param {number} serviceId - Service ID
   * @param {Object} slotData - Slot data
   * @param {string} slotData.start - Start time (ISO format)
   * @param {string} slotData.end - End time (ISO format)
   * @returns {Promise<Object>} Updated service with new slot
   * @throws {Error} If service not found or slot overlaps
   */
  async addSlot(serviceId, slotData) {
    const service = await this.getServiceById(serviceId);
    
    // Valider le format du créneau (YYYY-MM-DD HH:MM)
    const slotRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!slotRegex.test(slot)) {
      throw new Error('Format de créneau invalide. Utilisez YYYY-MM-DD HH:MM');
    }

    // Vérifier si le créneau existe déjà
    if (service.slots.includes(slot)) {
      throw new Error('Ce créneau existe déjà');
    }

    const updatedSlots = [...service.slots, slot].sort();
    return await repository.update('services', serviceId, { slots: updatedSlots });
  }

  /**
   * Removes a time slot from a service (admin only)
   * 
   * @async
   * @param {number} serviceId - Service ID
   * @param {string} slot - Slot time to remove
   * @returns {Promise<Object>} Updated service without the slot
   * @throws {Error} If service not found or slot has active booking
   */
  async removeSlot(serviceId, slot) {
    const service = await this.getServiceById(serviceId);
    
    // Vérifier s'il y a une réservation pour ce créneau
    const booking = await repository.findOne(
      'bookings',
      b => b.serviceId === parseInt(serviceId) && b.slot === slot
    );
    if (booking) {
      throw new Error('Impossible de supprimer un créneau avec une réservation active');
    }

    const updatedSlots = service.slots.filter(s => s !== slot);
    return await repository.update('services', serviceId, { slots: updatedSlots });
  }

  /**
   * Retrieves all available slots for a service (excludes booked slots)
   * 
   * @async
   * @param {number} serviceId - Service ID
   * @returns {Promise<Array>} Array of available slot times
   */
  async getAvailableSlots(serviceId) {
    const service = await this.getServiceById(serviceId);
    const bookings = await repository.findMany('bookings', b => b.serviceId === parseInt(serviceId));
    
    const bookedSlots = bookings.map(b => b.slot);
    const availableSlots = service.slots.filter(slot => !bookedSlots.includes(slot));
    
    return availableSlots;
  }
}

export default new ServiceService();
