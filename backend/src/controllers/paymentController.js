import { body, validationResult } from "express-validator";
import mpesaService from "../services/mpesaService.js";
import whatsappService from "../services/whatsappService.js";
import emailService from "../services/emailService.js";
import { logger } from "../utils/logger.js";
import {
  generateTransactionId,
  validateMpesaCallback,
  parseMpesaCallback,
} from "../utils/mpesaUtils.js";
import { generateDownloadToken } from "../utils/tokenGenerator.js";
import Book from "../models/Book.js";
import PurchaseLog from "../models/PurchaseLog.js";

export const initiatePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { phoneNumber, bookId, customerEmail, customerName } = req.body;

    // Find the book
    const book = await Book.findById(bookId);
    if (!book || !book.active) {
      return res.status(404).json({
        success: false,
        message: "Book not found or unavailable",
      });
    }

    // Format phone number
    const formattedPhone = mpesaService.formatPhoneNumber(phoneNumber);

    // Validate amount
    const amount = mpesaService.validateAmount(book.price);

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Create purchase log
    const purchaseLog = new PurchaseLog({
      transactionId,
      phoneNumber: formattedPhone,
      bookId: book._id,
      bookTitle: book.title,
      amount,
      customerEmail,
      customerName,
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    await purchaseLog.save();

    // Initiate STK Push
    const stkResponse = await mpesaService.initiateSTKPush(
      formattedPhone,
      amount,
      transactionId,
      book.title
    );

    // Update purchase log with STK response
    purchaseLog.stkPushResponse = stkResponse;
    await purchaseLog.save();

    logger.info("Payment initiated successfully:", {
      transactionId,
      phoneNumber: formattedPhone,
      bookTitle: book.title,
      amount,
    });

    res.json({
      success: true,
      message: "Payment initiated successfully",
      transactionId,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      customerMessage: stkResponse.CustomerMessage,
    });
  } catch (error) {
    logger.error("Payment initiation error:", error);
    res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const handleMpesaCallback = async (req, res) => {
  try {
    const callbackData = req.body;
    logger.info("M-Pesa callback received:", callbackData);

    // Validate callback structure
    const validation = validateMpesaCallback(callbackData);
    if (!validation.isValid) {
      logger.error("Invalid M-Pesa callback:", validation.error);
      return res.status(400).json({
        success: false,
        message: validation.error,
      });
    }

    // Parse callback data
    const parsedData = parseMpesaCallback(callbackData);

    // Find purchase log by checkout request ID
    const purchaseLog = await PurchaseLog.findOne({
      "stkPushResponse.CheckoutRequestID": parsedData.checkoutRequestId,
    }).populate("bookId");

    if (!purchaseLog) {
      logger.error(
        "Purchase log not found for callback:",
        parsedData.checkoutRequestId
      );
      return res.status(404).json({
        success: false,
        message: "Purchase log not found",
      });
    }

    // Update purchase log based on result
    if (parsedData.resultCode === 0) {
      // Payment successful
      purchaseLog.paymentStatus = "success";
      purchaseLog.mpesaReceiptNumber =
        parsedData.callbackMetadata.mpesaReceiptNumber;

      // Generate download token
      const downloadToken = generateDownloadToken(
        purchaseLog._id,
        purchaseLog.bookId._id
      );
      purchaseLog.downloadToken = downloadToken;
      purchaseLog.tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await purchaseLog.save();

      // Update book sales count
      await Book.findByIdAndUpdate(purchaseLog.bookId._id, {
        $inc: { salesCount: 1 },
      });

      // Send e-book via WhatsApp
      const downloadUrl = `${process.env.FRONTEND_URL}/download/${downloadToken}`;
      const whatsappResult = await whatsappService.sendEbook(
        purchaseLog.phoneNumber,
        purchaseLog,
        downloadUrl
      );

      if (whatsappResult.success) {
        purchaseLog.whatsappDeliveryStatus = "sent";
        purchaseLog.whatsappMessageId = whatsappResult.messageId;
      } else {
        purchaseLog.whatsappDeliveryStatus = "failed";
        logger.error("WhatsApp delivery failed:", whatsappResult.error);
      }

      purchaseLog.deliveryAttempts += 1;
      purchaseLog.lastDeliveryAttempt = new Date();
      await purchaseLog.save();

      // Send email receipt if email provided
      if (purchaseLog.customerEmail) {
        try {
          await emailService.sendPurchaseReceipt(
            purchaseLog.customerEmail,
            purchaseLog
          );
        } catch (emailError) {
          logger.error("Email receipt failed:", emailError);
        }
      }

      // Send admin notification
      try {
        await emailService.sendAdminNotification(purchaseLog);
      } catch (adminEmailError) {
        logger.error("Admin notification failed:", adminEmailError);
      }

      logger.info("Payment processed successfully:", {
        transactionId: purchaseLog.transactionId,
        mpesaReceiptNumber: parsedData.callbackMetadata.mpesaReceiptNumber,
        whatsappDelivered: whatsappResult.success,
      });
    } else {
      // Payment failed
      purchaseLog.paymentStatus = "failed";
      await purchaseLog.save();

      logger.warn("Payment failed:", {
        transactionId: purchaseLog.transactionId,
        resultCode: parsedData.resultCode,
        resultDesc: parsedData.resultDesc,
      });
    }

    res.json({ success: true, message: "Callback processed successfully" });
  } catch (error) {
    logger.error("M-Pesa callback processing error:", error);
    res.status(500).json({
      success: false,
      message: "Callback processing failed",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const purchaseLog = await PurchaseLog.findOne({ transactionId })
      .populate("bookId", "title price")
      .select("-stkPushResponse -downloadToken");

    if (!purchaseLog) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      data: purchaseLog,
    });
  } catch (error) {
    logger.error("Payment status check error:", error);
    res.status(500).json({
      success: false,
      message: "Status check failed",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const retryWhatsAppDelivery = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const purchaseLog = await PurchaseLog.findOne({
      transactionId,
      paymentStatus: "success",
      whatsappDeliveryStatus: { $in: ["failed", "pending"] },
    }).populate("bookId");

    if (!purchaseLog) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or delivery not retryable",
      });
    }

    if (purchaseLog.deliveryAttempts >= 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum delivery attempts reached",
      });
    }

    // Retry WhatsApp delivery
    const downloadUrl = `${process.env.FRONTEND_URL}/download/${purchaseLog.downloadToken}`;
    const whatsappResult = await whatsappService.sendEbook(
      purchaseLog.phoneNumber,
      purchaseLog,
      downloadUrl
    );

    if (whatsappResult.success) {
      purchaseLog.whatsappDeliveryStatus = "sent";
      purchaseLog.whatsappMessageId = whatsappResult.messageId;
    } else {
      purchaseLog.whatsappDeliveryStatus = "failed";
    }

    purchaseLog.deliveryAttempts += 1;
    purchaseLog.lastDeliveryAttempt = new Date();
    await purchaseLog.save();

    res.json({
      success: whatsappResult.success,
      message: whatsappResult.success
        ? "Delivery retried successfully"
        : "Delivery retry failed",
      attempts: purchaseLog.deliveryAttempts,
    });
  } catch (error) {
    logger.error("Delivery retry error:", error);
    res.status(500).json({
      success: false,
      message: "Delivery retry failed",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const querySTKStatus = async (req, res) => {
  try {
    const { checkoutRequestId } = req.params;

    const stkStatus = await mpesaService.querySTKStatus(checkoutRequestId);

    res.json({
      success: true,
      data: stkStatus,
    });
  } catch (error) {
    logger.error("STK status query error:", error);
    res.status(500).json({
      success: false,
      message: "STK status query failed",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const formattedPhone = mpesaService.formatPhoneNumber(phoneNumber);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const transactions = await PurchaseLog.find({
      phoneNumber: formattedPhone,
      paymentStatus: "success",
    })
      .populate("bookId", "title coverImage")
      .select("-stkPushResponse -downloadToken")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await PurchaseLog.countDocuments({
      phoneNumber: formattedPhone,
      paymentStatus: "success",
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    logger.error("Transaction history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get transaction history",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : error.message,
    });
  }
};

export const validatePaymentData = [
  body("phoneNumber")
    .isMobilePhone("any")
    .withMessage("Valid phone number is required")
    .customSanitizer((value) => value.replace(/\D/g, "")),
  body("bookId").isMongoId().withMessage("Valid book ID is required"),
  body("customerEmail")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("customerName")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Customer name must be max 100 characters"),
];
