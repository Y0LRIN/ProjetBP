import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import repository from '../repositories/jsonRepository.js';

/**
 * UserService - Handles user authentication and management
 * 
 * @class UserService
 * @description Manages user registration, login, profile access, and role management
 */
class UserService {
  /**
   * Registers a new user with hashed password
   * 
   * @async
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email (must be unique)
   * @param {string} userData.password - Plain text password
   * @param {string} userData.firstName - User first name
   * @param {string} userData.lastName - User last name
   * @returns {Promise<Object>} Created user without password
   * @throws {Error} If email already exists
   */
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await repository.findOne('users', user => user.email === email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await repository.create('users', {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user', // Par défaut
    });

    // Ne pas retourner le mot de passe
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  /**
   * Authenticates a user and generates JWT token
   * 
   * @async
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} Object with user data and JWT token
   * @throws {Error} If credentials are invalid
   */
  async login(email, password) {
    // Trouver l'utilisateur
    const user = await repository.findOne('users', u => u.email === email);
    if (!user) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email ou mot de passe incorrect');
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiration }
    );

    // Ne pas retourner le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Retrieves a user by ID (without password)
   * 
   * @async
   * @param {number} id - User ID
   * @returns {Promise<Object>} User data without password
   * @throws {Error} If user not found
   */
  async getUserById(id) {
    const user = await repository.findById('users', id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Retrieves all users without passwords (admin only)
   * 
   * @async
   * @returns {Promise<Array>} Array of users without passwords
   */
  async getAllUsers() {
    const users = await repository.read('users');
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Updates a user's role (admin only)
   * 
   * @async
   * @param {number} userId - User ID
   * @param {string} newRole - New role ('user' or 'admin')
   * @returns {Promise<Object>} Updated user without password
   * @throws {Error} If role is invalid or user not found
   */
  async updateUserRole(userId, newRole) {
    if (!['user', 'admin'].includes(newRole)) {
      throw new Error('Rôle invalide');
    }

    const updatedUser = await repository.update('users', userId, { role: newRole });
    if (!updatedUser) {
      throw new Error('Utilisateur non trouvé');
    }

    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  /**
   * Deletes a user (admin only)
   * 
   * @async
   * @param {number} userId - User ID
   * @returns {Promise<boolean>} true if deleted
   * @throws {Error} If user not found
   */
  async deleteUser(userId) {
    const result = await repository.delete('users', userId);
    if (!result) {
      throw new Error('Utilisateur non trouvé');
    }
    return true;
  }
}

export default new UserService();
