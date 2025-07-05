import { body, param, query } from 'express-validator';

// Common validation rules
export const mongoIdValidation = (field) => 
  param(field).isMongoId().withMessage(`Invalid ${field} format`);

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];

export const phoneNumberValidation = (field) =>
  body(field)
    .isMobilePhone('any')
    .withMessage('Valid phone number is required')
    .customSanitizer(value => {
      // Remove all non-digit characters
      const cleaned = value.replace(/\D/g, '');
      
      // Convert to Kenyan format
      if (cleaned.startsWith('254')) {
        return cleaned;
      } else if (cleaned.startsWith('0')) {
        return '254' + cleaned.substring(1);
      } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
        return '254' + cleaned;
      }
      
      return cleaned;
    });

export const emailValidation = (field, required = false) => {
  const validator = required ? body(field) : body(field).optional();
  return validator
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required');
};

export const priceValidation = (field) =>
  body(field)
    .isFloat({ min: 0, max: 1000000 })
    .withMessage('Price must be between 0 and 1,000,000');

export const stringValidation = (field, minLength = 1, maxLength = 255, required = true) => {
  const validator = required ? body(field) : body(field).optional();
  return validator
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`);
};