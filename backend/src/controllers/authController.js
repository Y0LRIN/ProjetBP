import userService from '../services/userService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * AuthController - Handles authentication routes
 * 
 * @class AuthController
 * @description Manages registration, login, and profile retrieval endpoints
 */
class AuthController {
  /**
   * Handles user registration
   * 
   * @async
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  register = asyncHandler(async (req, res) => {
    const user = await userService.register(req.body);
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user,
    });
  });

  /**
   * Handles user login and JWT generation
   * 
   * @async
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json({
      message: 'Connexion réussie',
      ...result,
    });
  });

  /**
   * Retrieves the authenticated user's profile
   * 
   * @async
   * @param {Object} req - Express request (with req.user from auth middleware)
   * @param {Object} res - Express response
   */
  getProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  });
}

export default new AuthController();
