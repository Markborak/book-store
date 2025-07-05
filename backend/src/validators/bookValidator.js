import { body } from 'express-validator';

export const createBookValidator = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required (max 200 characters)'),
  
  body('description')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description is required (max 2000 characters)'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .isIn(['Self-Help', 'Motivation', 'Business', 'Leadership', 'Personal Development'])
    .withMessage('Invalid category'),
  
  body('format')
    .optional()
    .isIn(['PDF', 'EPUB'])
    .withMessage('Invalid format'),
  
  body('pages')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Pages must be a positive integer'),
  
  body('isbn')
    .optional()
    .isLength({ min: 10, max: 17 })
    .withMessage('Invalid ISBN format'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean'),
  
  body('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a string'),
  
  body('seoTitle')
    .optional()
    .isLength({ max: 60 })
    .withMessage('SEO title must be max 60 characters'),
  
  body('seoDescription')
    .optional()
    .isLength({ max: 160 })
    .withMessage('SEO description must be max 160 characters')
];

export const updateBookValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be 1-200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Description must be 1-2000 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('category')
    .optional()
    .isIn(['Self-Help', 'Motivation', 'Business', 'Leadership', 'Personal Development'])
    .withMessage('Invalid category'),
  
  body('active')
    .optional()
    .isBoolean()
    .withMessage('Active must be a boolean'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean')
];