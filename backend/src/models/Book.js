import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  author: {
    type: String,
    required: true,
    default: 'Mwatha Njoroge',
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Self-Help', 'Motivation', 'Business', 'Leadership', 'Personal Development']
  },
  coverImage: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  format: {
    type: String,
    required: true,
    enum: ['PDF', 'EPUB'],
    default: 'PDF'
  },
  publicationDate: {
    type: Date,
    default: Date.now
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true
  },
  pages: {
    type: Number,
    min: 1
  },
  language: {
    type: String,
    default: 'English'
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  salesCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: String,
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for search functionality
bookSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Book', bookSchema);