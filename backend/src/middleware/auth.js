import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * JWT authentication middleware - validates token and attaches user to request
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 * @returns {void}
 */
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwtSecret);

    // Ajouter les informations utilisateur à la requête
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    }
    return res.status(401).json({ message: 'Token invalide' });
  }
};

/**
 * Admin role verification middleware - requires admin role
 * 
 * @param {Object} req - Express request with user from authenticate middleware
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 * @returns {void}
 */
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé: droits administrateur requis' });
  }
};

/**
 * Optional authentication middleware - continues even if token is invalid
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 * @returns {void}
 */
export const optionalAuthenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, config.jwtSecret);
      req.user = decoded;
    }
  } catch (error) {
    // Ignore les erreurs et continue
  }
  next();
};
