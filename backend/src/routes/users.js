import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import { idParamValidation } from '../middleware/validation.js';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.js';

const router = Router();

// Toutes les routes nécessitent l'authentification et les droits admin
router.use(authenticate, requireAdmin);

router.get('/', userController.getAllUsers);
router.get('/:id', idParamValidation, userController.getUserById);
router.patch(
  '/:id/role',
  idParamValidation,
  body('role').isIn(['user', 'admin']).withMessage('Rôle invalide'),
  validate,
  userController.updateUserRole
);
router.delete('/:id', idParamValidation, userController.deleteUser);

export default router;
