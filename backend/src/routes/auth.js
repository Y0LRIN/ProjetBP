import { Router } from 'express';
import authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { registerValidation, loginValidation } from '../middleware/validation.js';

const router = Router();

// Routes publiques
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);

// Routes protégées
router.get('/profile', authenticate, authController.getProfile);

export default router;
