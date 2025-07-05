import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../src/models/Book.js';
import { logger } from '../src/utils/logger.js';

dotenv.config();

const sampleBooks = [
  {
    title: "The Power of Positive Thinking",
    author: "Mwatha Njoroge",
    description: "Transform your mindset and unlock your potential with proven strategies for positive thinking. This comprehensive guide will help you overcome negative thought patterns and build a foundation for success.",
    price: 500,
    category: "Self-Help",
    coverImage: "uploads/covers/sample-cover-1.jpg",
    fileUrl: "uploads/books/sample-book-1.pdf",
    fileSize: 2048000,
    format: "PDF",
    pages: 150,
    featured: true,
    tags: ["mindset", "positivity", "success", "motivation"],
    seoTitle: "The Power of Positive Thinking - Transform Your Mindset",
    seoDescription: "Learn proven strategies for positive thinking and unlock your potential with this comprehensive guide by Mwatha Njoroge."
  },
  {
    title: "Leadership Excellence",
    author: "Mwatha Njoroge",
    description: "Develop exceptional leadership skills that inspire teams and drive results. Learn from real-world examples and practical strategies that successful leaders use every day.",
    price: 750,
    category: "Leadership",
    coverImage: "uploads/covers/sample-cover-2.jpg",
    fileUrl: "uploads/books/sample-book-2.pdf",
    fileSize: 3072000,
    format: "PDF",
    pages: 200,
    featured: true,
    tags: ["leadership", "management", "team building", "success"],
    seoTitle: "Leadership Excellence - Inspire Teams and Drive Results",
    seoDescription: "Master exceptional leadership skills with practical strategies and real-world examples from successful leaders."
  },
  {
    title: "Entrepreneurial Mindset",
    author: "Mwatha Njoroge",
    description: "Cultivate the mindset of successful entrepreneurs and learn how to identify opportunities, take calculated risks, and build sustainable businesses.",
    price: 600,
    category: "Business",
    coverImage: "uploads/covers/sample-cover-3.jpg",
    fileUrl: "uploads/books/sample-book-3.pdf",
    fileSize: 2560000,
    format: "PDF",
    pages: 180,
    featured: false,
    tags: ["entrepreneurship", "business", "mindset", "opportunities"],
    seoTitle: "Entrepreneurial Mindset - Build Sustainable Businesses",
    seoDescription: "Learn to think like successful entrepreneurs and build sustainable businesses with this comprehensive guide."
  },
  {
    title: "Personal Development Mastery",
    author: "Mwatha Njoroge",
    description: "A complete guide to personal growth and self-improvement. Discover proven techniques for building confidence, setting goals, and creating lasting positive change.",
    price: 550,
    category: "Personal Development",
    coverImage: "uploads/covers/sample-cover-4.jpg",
    fileUrl: "uploads/books/sample-book-4.pdf",
    fileSize: 2304000,
    format: "PDF",
    pages: 165,
    featured: false,
    tags: ["personal development", "self-improvement", "goals", "confidence"],
    seoTitle: "Personal Development Mastery - Complete Growth Guide",
    seoDescription: "Master personal development with proven techniques for building confidence, setting goals, and creating lasting change."
  },
  {
    title: "Motivation That Lasts",
    author: "Mwatha Njoroge",
    description: "Discover the secrets to maintaining long-term motivation and achieving your biggest goals. Learn practical strategies that keep you inspired and focused.",
    price: 450,
    category: "Motivation",
    coverImage: "uploads/covers/sample-cover-5.jpg",
    fileUrl: "uploads/books/sample-book-5.pdf",
    fileSize: 1792000,
    format: "PDF",
    pages: 140,
    featured: true,
    tags: ["motivation", "goals", "persistence", "inspiration"],
    seoTitle: "Motivation That Lasts - Achieve Your Biggest Goals",
    seoDescription: "Learn the secrets to maintaining long-term motivation and achieving your biggest goals with practical strategies."
  }
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing books
    await Book.deleteMany({});
    logger.info('Cleared existing books');
    
    // Insert sample books
    const books = await Book.insertMany(sampleBooks);
    logger.info(`Seeded ${books.length} books successfully`);
    
    console.log('\n✅ Books seeded successfully!');
    console.log(`📚 Created ${books.length} sample books`);
    
    books.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} - KES ${book.price}`);
    });
    
  } catch (error) {
    logger.error('Error seeding books:', error);
    console.error('❌ Failed to seed books:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedBooks();