import { body } from 'express-validator';

export const initiatePaymentValidator = [
  body('phoneNumber')
    .isMobilePhone('any')
    .withMessage('Valid phone number is required')
    .customSanitizer(value => value.replace(/\D/g, '')),
  
  body('bookId')
    .isMongoId()
    .withMessage('Valid book ID is required'),
  
  body('customerEmail')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('customerName')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Customer name must be max 100 characters')
];