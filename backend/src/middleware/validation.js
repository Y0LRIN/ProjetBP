import { body, param, validationResult } from 'express-validator';

/**
 * Validation result checker middleware - returns errors if validation failed
 * 
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 * @returns {void}
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Erreurs de validation',
      errors: errors.array(),
    });
  }
  next();
};

/**
 * Registration validation rules - validates email, password, firstName, lastName
 */
export const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('firstName').trim().notEmpty().withMessage('Le prénom est requis'),
  body('lastName').trim().notEmpty().withMessage('Le nom est requis'),
  validate,
];

/**
 * Login validation rules - validates email and password
 */
export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis'),
  validate,
];

/**
 * Service creation validation rules - validates name, type, description, slots
 */
export const createServiceValidation = [
  body('name').trim().notEmpty().withMessage('Le nom du service est requis'),
  body('type')
    .isIn(['room', 'equipment', 'other'])
    .withMessage('Type de service invalide'),
  body('description').optional().trim(),
  body('slots').optional().isArray().withMessage('Les créneaux doivent être un tableau'),
  validate,
];

/**
 * Service update validation rules - validates ID and optional fields
 */
export const updateServiceValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('type')
    .optional()
    .isIn(['room', 'equipment', 'other'])
    .withMessage('Type de service invalide'),
  body('description').optional().trim(),
  validate,
];

/**
 * Slot addition validation rules - validates service ID and slot format
 */
export const addSlotValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  body('slot')
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    .withMessage('Format de créneau invalide (YYYY-MM-DD HH:MM)'),
  validate,
];

/**
 * Slot removal validation rules - validates service ID and slot
 */
export const removeSlotValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  body('slot').notEmpty().withMessage('Le créneau est requis'),
  validate,
];

/**
 * Booking creation validation rules - validates service ID and slot format
 */
export const createBookingValidation = [
  body('serviceId').isInt({ min: 1 }).withMessage('ID de service invalide'),
  body('slot')
    .matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
    .withMessage('Format de créneau invalide (YYYY-MM-DD HH:MM)'),
  validate,
];

export const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID invalide'),
  validate,
];
