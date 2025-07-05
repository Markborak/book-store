import express from 'express';
import path from 'path';
import fs from 'fs';
import { verifyDownloadToken } from '../utils/tokenGenerator.js';
import { logger } from '../utils/logger.js';
import PurchaseLog from '../models/PurchaseLog.js';
import Book from '../models/Book.js';

const router = express.Router();

// Download e-book with token
router.get('/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify token
    const tokenVerification = verifyDownloadToken(token);
    if (!tokenVerification.valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired download token'
      });
    }
    
    // Find purchase log
    const purchaseLog = await PurchaseLog.findOne({
      _id: tokenVerification.payload.purchaseLogId,
      downloadToken: token,
      paymentStatus: 'success'
    }).populate('bookId');
    
    if (!purchaseLog) {
      return res.status(404).json({
        success: false,
        message: 'Purchase record not found'
      });
    }
    
    // Check if token is expired
    if (purchaseLog.tokenExpiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: 'Download token has expired'
      });
    }
    
    // Check download limits
    if (purchaseLog.downloadCount >= purchaseLog.maxDownloads) {
      return res.status(403).json({
        success: false,
        message: 'Download limit exceeded'
      });
    }
    
    // Get book details
    const book = purchaseLog.bookId;
    if (!book || !book.active) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or unavailable'
      });
    }
    
    // Check if file exists
    const filePath = path.resolve(book.fileUrl);
    if (!fs.existsSync(filePath)) {
      logger.error('Book file not found:', filePath);
      return res.status(404).json({
        success: false,
        message: 'Book file not found'
      });
    }
    
    // Update download count
    purchaseLog.downloadCount += 1;
    await purchaseLog.save();
    
    // Set appropriate headers
    const filename = `${book.title} - ${book.author}.${book.format.toLowerCase()}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', book.format === 'PDF' ? 'application/pdf' : 'application/epub+zip');
    
    // Log download
    logger.info('Book downloaded:', {
      purchaseLogId: purchaseLog._id,
      bookTitle: book.title,
      downloadCount: purchaseLog.downloadCount,
      ipAddress: req.ip
    });
    
    // Stream file to client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
  } catch (error) {
    logger.error('Download error:', error);
    res.status(500).json({
      success: false,
      message: 'Download failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

// Get download info (without downloading)
router.get('/:token/info', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Verify token
    const tokenVerification = verifyDownloadToken(token);
    if (!tokenVerification.valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired download token'
      });
    }
    
    // Find purchase log
    const purchaseLog = await PurchaseLog.findOne({
      _id: tokenVerification.payload.purchaseLogId,
      downloadToken: token,
      paymentStatus: 'success'
    }).populate('bookId', 'title author format fileSize');
    
    if (!purchaseLog) {
      return res.status(404).json({
        success: false,
        message: 'Purchase record not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        bookTitle: purchaseLog.bookTitle,
        author: purchaseLog.bookId?.author || 'Mwatha Njoroge',
        format: purchaseLog.bookId?.format || 'PDF',
        fileSize: purchaseLog.bookId?.fileSize,
        downloadCount: purchaseLog.downloadCount,
        maxDownloads: purchaseLog.maxDownloads,
        remainingDownloads: purchaseLog.maxDownloads - purchaseLog.downloadCount,
        expiresAt: purchaseLog.tokenExpiresAt,
        isExpired: purchaseLog.tokenExpiresAt < new Date(),
        purchaseDate: purchaseLog.createdAt
      }
    });
    
  } catch (error) {
    logger.error('Download info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get download info',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
});

export default router;