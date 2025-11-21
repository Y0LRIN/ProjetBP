/**
 * Global error handling middleware - catches and formats all errors
 * 
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 * @returns {void}
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation',
      errors: err.errors,
    });
  }

  // Erreur métier personnalisée
  if (err.message) {
    const statusCode = err.statusCode || 400;
    return res.status(statusCode).json({
      message: err.message,
    });
  }

  // Erreur par défaut
  res.status(500).json({
    message: 'Une erreur interne est survenue',
  });
};

/**
 * 404 handler middleware - handles undefined routes
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @returns {void}
 */
export const notFound = (req, res) => {
  res.status(404).json({
    message: 'Route non trouvée',
    path: req.originalUrl,
  });
};

/**
 * Async handler wrapper - catches async/await errors automatically
 * 
 * @param {Function} fn - Async route handler function
 * @returns {Function} Wrapped function with error catching
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
