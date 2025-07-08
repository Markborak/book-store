import Book from "../models/Book.js";
import { logger } from "../utils/logger.js";

export const getAllBooks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      featured,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { active: true };

    // Add category filter
    if (category) {
      query.category = category;
    }

    // Add featured filter
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    // Add search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query
    const books = await Book.find(query)
      .select("-updatedAt -__v")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
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
    logger.error("Error fetching books:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({
      _id: req.params.id,
      active: true,
    }).select("-updatedAt -__v");

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    logger.error("Error fetching book:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching book",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const getBookCategories = async (req, res) => {
  try {
    const categories = await Book.distinct("category", { active: true });

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    logger.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const getFeaturedBooks = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const books = await Book.find({ active: true, featured: true })
      .select("-fileUrl -updatedAt -__v")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: books,
    });
  } catch (error) {
    logger.error("Error fetching featured books:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured books",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const getBookStats = async (req, res) => {
  try {
    const stats = await Book.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: null,
          totalBooks: { $sum: 1 },
          totalSales: { $sum: "$salesCount" },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$rating" },
          categories: { $addToSet: "$category" },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalBooks: 0,
        totalSales: 0,
        avgPrice: 0,
        avgRating: 0,
        categories: [],
      },
    });
  } catch (error) {
    logger.error("Error fetching book stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching book stats",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};
