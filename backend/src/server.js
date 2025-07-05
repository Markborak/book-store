/*import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import 'express-async-errors';

import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import paymentRoutes from './routes/payments.js';
import adminRoutes from './routes/admin.js';
import downloadRoutes from './routes/downloads.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Create required directories
const requiredDirs = ['uploads/books', 'uploads/covers', 'logs'];
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Payment specific rate limiting
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 payment requests per 5 minutes
  message: {
    success: false,
    message: 'Too many payment requests, please try again later.'
  }
});
app.use('/api/payments', paymentLimiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Database connection with retry logic
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/downloads', downloadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Daring Achievers Network API',
    version: '1.0.0'
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Daring Achievers Network API',
    version: '1.0.0',
    author: 'Mwatha Njoroge',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      payments: '/api/payments',
      admin: '/api/admin',
      downloads: '/api/downloads'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  mongoose.connection.close(() => {
    logger.info('MongoDB connection closed');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Daring Achievers Network API running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;*/

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import "express-async-errors";

import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";
import authRoutes from "./routes/auth.js";
import bookRoutes from "./routes/books.js";
import paymentRoutes from "./routes/payments.js";
import adminRoutes from "./routes/admin.js";
import downloadRoutes from "./routes/downloads.js";

// Load environment variables
dotenv.config();

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

// Create required directories
const requiredDirs = ["uploads/books", "uploads/covers", "logs"];
requiredDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: (
      process.env.FRONTEND_URL || "https://daringachieversnetwork.netlify.app"
    ).replace(/\/$/, ""),
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api/", limiter);

// Payment-specific rate limiting
const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3,
  message: {
    success: false,
    message: "Too many payment requests, please try again later.",
  },
});
app.use("/api/payments", paymentLimiter);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve static files
app.use("/uploads", express.static("uploads"));

// Database connection with debug logs and updated options
const connectDB = async () => {
  try {
    logger.info(
      `Connecting to MongoDB with URI: ${
        process.env.MONGODB_URI ? "[REDACTED]" : "MONGODB_URI NOT SET"
      }`
    );
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/downloads", downloadRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Daring Achievers Network API",
    version: "1.0.0",
  });
});
// DB connection test route
app.get("/debug-db", async (req, res) => {
  try {
    const mongooseState = mongoose.connection.readyState;
    res.json({
      connected: mongooseState === 1,
      host: mongoose.connection.host,
      db: mongoose.connection.name,
      status: mongooseState,
    });
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

// API documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Daring Achievers Network API",
    version: "1.0.0",
    author: "Mwatha Njoroge",
    endpoints: {
      auth: "/api/auth",
      books: "/api/books",
      payments: "/api/payments",
      admin: "/api/admin",
      downloads: "/api/downloads",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    logger.info("MongoDB connection closed");
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Daring Achievers Network API running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
