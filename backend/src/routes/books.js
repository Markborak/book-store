import express from 'express';
import { 
  getAllBooks, 
  getBookById, 
  getBookCategories, 
  getFeaturedBooks, 
  getBookStats 
} from '../controllers/bookController.js';

const router = express.Router();

// Get all active books
router.get('/', getAllBooks);

// Get book categories
router.get('/meta/categories', getBookCategories);

// Get featured books
router.get('/featured/list', getFeaturedBooks);

// Get book stats
router.get('/meta/stats', getBookStats);

// Get single book (must be last to avoid conflicts)
router.get('/:id', getBookById);

export default router;