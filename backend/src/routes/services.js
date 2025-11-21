import { Router } from 'express';
import serviceController from '../controllers/serviceController.js';
import { authenticate, requireAdmin, optionalAuthenticate } from '../middleware/auth.js';
import {
  createServiceValidation,
  updateServiceValidation,
  addSlotValidation,
  removeSlotValidation,
  idParamValidation,
} from '../middleware/validation.js';

const router = Router();

// Routes publiques
router.get('/', serviceController.getAllServices);
router.get('/:id', idParamValidation, serviceController.getServiceById);
router.get('/:id/slots/available', idParamValidation, serviceController.getAvailableSlots);

// Routes admin uniquement
router.post('/', authenticate, requireAdmin, createServiceValidation, serviceController.createService);
router.patch('/:id', authenticate, requireAdmin, updateServiceValidation, serviceController.updateService);
router.delete('/:id', authenticate, requireAdmin, idParamValidation, serviceController.deleteService);
router.post('/:id/slots', authenticate, requireAdmin, addSlotValidation, serviceController.addSlot);
router.delete('/:id/slots', authenticate, requireAdmin, removeSlotValidation, serviceController.removeSlot);

export default router;
