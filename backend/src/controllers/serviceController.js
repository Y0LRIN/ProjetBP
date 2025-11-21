import serviceService from '../services/serviceService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * ServiceController - Handles service management routes
 * 
 * @class ServiceController
 * @description Manages service CRUD operations and slot management
 */
class ServiceController {
  /**
   * Retrieves all services
   * 
   * @async
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  getAllServices = asyncHandler(async (req, res) => {
    const services = await serviceService.getAllServices();
    res.json(services);
  });

  /**
   * Retrieves a service by ID
   * 
   * @async
   * @param {Object} req - Express request with service ID in params
   * @param {Object} res - Express response
   */
  getServiceById = asyncHandler(async (req, res) => {
    const service = await serviceService.getServiceById(req.params.id);
    res.json(service);
  });

  /**
   * Creates a new service (admin only)
   * 
   * @async
   * @param {Object} req - Express request with service data in body
   * @param {Object} res - Express response
   */
  createService = asyncHandler(async (req, res) => {
    const service = await serviceService.createService(req.body);
    res.status(201).json({
      message: 'Service créé avec succès',
      service,
    });
  });

  /**
   * Updates an existing service (admin only)
   * 
   * @async
   * @param {Object} req - Express request with service ID in params and updates in body
   * @param {Object} res - Express response
   */
  updateService = asyncHandler(async (req, res) => {
    const service = await serviceService.updateService(req.params.id, req.body);
    res.json({
      message: 'Service mis à jour avec succès',
      service,
    });
  });

  /**
   * Deletes a service (admin only)
   * 
   * @async
   * @param {Object} req - Express request with service ID in params
   * @param {Object} res - Express response
   */
  deleteService = asyncHandler(async (req, res) => {
    await serviceService.deleteService(req.params.id);
    res.json({
      message: 'Service supprimé avec succès',
    });
  });

  /**
   * Adds a time slot to a service (admin only)
   * 
   * @async
   * @param {Object} req - Express request with service ID in params and slot in body
   * @param {Object} res - Express response
   */
  addSlot = asyncHandler(async (req, res) => {
    const { slot } = req.body;
    const service = await serviceService.addSlot(req.params.id, slot);
    res.json({
      message: 'Créneau ajouté avec succès',
      service,
    });
  });

  /**
   * Removes a time slot from a service (admin only)
   * 
   * @async
   * @param {Object} req - Express request with service ID in params and slot in body
   * @param {Object} res - Express response
   */
  removeSlot = asyncHandler(async (req, res) => {
    const { slot } = req.body;
    const service = await serviceService.removeSlot(req.params.id, slot);
    res.json({
      message: 'Créneau supprimé avec succès',
      service,
    });
  });

  /**
   * Retrieves available time slots for a service
   * 
   * @async
   * @param {Object} req - Express request with service ID in params
   * @param {Object} res - Express response
   */
  getAvailableSlots = asyncHandler(async (req, res) => {
    const slots = await serviceService.getAvailableSlots(req.params.id);
    res.json(slots);
  });
}

export default new ServiceController();
