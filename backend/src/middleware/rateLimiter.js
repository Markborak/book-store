import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

// General API rate limiter
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60
    });
  }
});

// Payment specific rate limiter
export const paymentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 payment requests per 5 minutes
  message: {
    success: false,
    message: 'Too many payment requests, please try again later.',
    retryAfter: 5 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Payment rate limit exceeded:', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      phoneNumber: req.body?.phoneNumber
    });
    res.status(429).json({
      success: false,
      message: 'Too many payment requests, please try again later.',
      retryAfter: 5 * 60
    });
  }
});

// Admin specific rate limiter
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for admin operations
  message: {
    success: false,
    message: 'Too many admin requests, please try again later.',
    retryAfter: 15 * 60
  }
});