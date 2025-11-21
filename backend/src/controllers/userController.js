import userService from '../services/userService.js';
import { asyncHandler } from '../middleware/errorHandler.js';

/**
 * UserController - Handles user management routes (admin only)
 * 
 * @class UserController
 * @description Manages user CRUD operations for administrators
 */
class UserController {
  /**
   * Retrieves all users (admin only)
   * 
   * @async
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
  });

  /**
   * Retrieves a user by ID (admin only)
   * 
   * @async
   * @param {Object} req - Express request with user ID in params
   * @param {Object} res - Express response
   */
  getUserById = asyncHandler(async (req, res) => {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  });

  /**
   * Updates a user's role (admin only)
   * 
   * @async
   * @param {Object} req - Express request with user ID in params and role in body
   * @param {Object} res - Express response
   */
  updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await userService.updateUserRole(req.params.id, role);
    res.json({
      message: 'Rôle mis à jour avec succès',
      user,
    });
  });

  /**
   * Deletes a user (admin only)
   * 
   * @async
   * @param {Object} req - Express request with user ID in params
   * @param {Object} res - Express response
   */
  deleteUser = asyncHandler(async (req, res) => {
    await userService.deleteUser(req.params.id);
    res.json({
      message: 'Utilisateur supprimé avec succès',
    });
  });
}

export default new UserController();
