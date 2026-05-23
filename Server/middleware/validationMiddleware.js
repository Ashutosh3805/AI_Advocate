import { body, validationResult } from 'express-validator';

/**
 * Validation rules for registration endpoint
 */
export const registerValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password key-phrase must be at least 6 characters in length.'),
];

/**
 * Validation rules for login endpoint
 */
export const loginValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Provide a valid credentials email.')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Keyphrase field cannot be empty.'),
];

/**
 * Middleware that catches validation failures and returns formatted errors
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.path || err.param]: err.msg }));

  return res.status(400).json({
    success: false,
    message: 'Credentials validation failed.',
    data: extractedErrors,
  });
};
