import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'bookFile') {
      uploadPath = 'uploads/books/';
    } else if (file.fieldname === 'coverImage') {
      uploadPath = 'uploads/covers/';
    } else {
      uploadPath = 'uploads/';
    }
    
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'bookFile') {
    // Accept PDF and EPUB files
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/epub+zip' ||
        file.originalname.toLowerCase().endsWith('.epub')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and EPUB files are allowed for book files'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    // Accept image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for cover images'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 2 // Maximum 2 files
  },
  fileFilter
});

export default upload;