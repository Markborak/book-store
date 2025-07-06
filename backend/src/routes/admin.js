import express from "express";
import { validationResult } from "express-validator";
import { auth, requireRole } from "../middleware/auth.js";
import {
  createBookValidator,
  updateBookValidator,
} from "../validators/bookValidator.js";
import upload from "../config/multer.js";
import Book from "../models/Book.js";
import PurchaseLog from "../models/PurchaseLog.js";
import User from "../models/User.js";
import whatsappService from "../services/whatsappService.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Apply authentication to all admin routes
router.use(auth);
router.use(requireRole("admin"));

// Get dashboard statistics
router.get("/dashboard/stats", async (req, res) => {
  try {
    const [totalBooks, totalSales, totalRevenue, recentPurchases] =
      await Promise.all([
        Book.countDocuments({ active: true }),
        PurchaseLog.countDocuments({ paymentStatus: "success" }),
        PurchaseLog.aggregate([
          { $match: { paymentStatus: "success" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        PurchaseLog.find({ paymentStatus: "success" })
          .populate("bookId", "title")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const monthlyRevenue = await PurchaseLog.aggregate([
      {
        $match: {
          paymentStatus: "success",
          createdAt: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth() - 11,
              1
            ),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalBooks,
        totalSales,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentPurchases,
        monthlyRevenue,
      },
    });
  } catch (error) {
    logger.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get dashboard stats",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

// Get all books (including inactive)
router.get("/books", async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (status) {
      query.active = status === "active";
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error("Admin books fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch books",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

// Create new book
router.post(
  "/books",
  upload.fields([
    { name: "bookFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createBookValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const {
        title,
        description,
        price,
        category,
        format = "PDF",
        pages,
        isbn,
        featured = false,
        tags,
        seoTitle,
        seoDescription,
      } = req.body;

      if (!req.files?.bookFile || !req.files?.coverImage) {
        return res.status(400).json({
          success: false,
          message: "Book file and cover image are required",
        });
      }

      const bookFile = req.files.bookFile[0];
      const coverImage = req.files.coverImage[0];

      const book = new Book({
        title,
        description,
        price: parseFloat(price),
        category,
        format,
        pages: pages ? parseInt(pages) : undefined,
        isbn,
        featured: featured === "true",
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        seoTitle,
        seoDescription,
        fileUrl: bookFile.path,
        fileSize: bookFile.size,
        coverImage: coverImage.path,
      });

      await book.save();

      logger.info("New book created:", { bookId: book._id, title: book.title });

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: book,
      });
    } catch (error) {
      logger.error("Book creation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create book",
        error:
          process.env.NODE_ENV === "production"
            ? "Internal server error"
            : error.message,
      });
    }
  }
);

// Update book
router.put("/books/:id", updateBookValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.tags && typeof updates.tags === "string") {
      updates.tags = updates.tags.split(",").map((tag) => tag.trim());
    }

    const book = await Book.findByIdAndUpdate(id, updates, { new: true });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    logger.info("Book updated:", { bookId: book._id, title: book.title });

    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    logger.error("Book update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

// Delete book
router.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    logger.info("Book deleted:", { bookId: book._id, title: book.title });

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    logger.error("Book deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

// Get purchase logs
router.get("/purchases", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      phoneNumber,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (status) {
      query.paymentStatus = status;
    }

    if (phoneNumber) {
      query.phoneNumber = { $regex: phoneNumber, $options: "i" };
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const purchases = await PurchaseLog.find(query)
      .populate("bookId", "title price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await PurchaseLog.countDocuments(query);

    res.json({
      success: true,
      data: purchases,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error("Purchase logs fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase logs",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

import path from "path";

import express from "express";
import { validationResult } from "express-validator";
import { auth, requireRole } from "../middleware/auth.js";

export default router;
