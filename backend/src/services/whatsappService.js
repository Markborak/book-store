/**
 * WhatsAppService class handles sending messages and documents via the UltraMsg WhatsApp API.
 * It supports sending text messages, documents, and e-books with retry logic and error handling.
 */
import axios from "axios";
import { logger } from "../utils/logger.js";

class WhatsAppService {
  constructor() {
    // Normalize apiUrl to remove trailing slash if present
    let apiUrlRaw = process.env.WHATSAPP_API_URL || "https://api.ultramsg.com";
    if (apiUrlRaw.endsWith("/")) {
      apiUrlRaw = apiUrlRaw.slice(0, -1);
    }
    this.apiUrl = apiUrlRaw;

    // If the apiUrl already contains the instanceId, avoid appending it again
    this.instanceId = process.env.WHATSAPP_INSTANCE_ID;
    this.token = process.env.WHATSAPP_TOKEN;
    this.maxRetries = 3; // Maximum retry attempts for sending messages/documents
  }

  /**
   * Sends a text message to a WhatsApp phone number with retry and exponential backoff.
   * @param {string} phoneNumber - Recipient phone number in international format.
   * @param {string} message - Text message body to send.
   * @returns {Promise<object>} Result object with success status and messageId or error.
   */
  async sendMessage(phoneNumber, message) {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        // Construct URL avoiding duplication of instanceId
        let url = `${this.apiUrl}`;
        if (!this.apiUrl.includes(this.instanceId)) {
          url += `/${this.instanceId}`;
        }
        url += `/messages/chat?token=${this.token}`;

        const response = await axios.post(
          url,
          {
            to: this.formatPhoneNumber(phoneNumber),
            body: message,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.sent) {
          logger.info("WhatsApp message sent successfully:", {
            phoneNumber,
            messageId: response.data.id,
          });
          return {
            success: true,
            messageId: response.data.id,
            response: response.data,
          };
        } else {
          throw new Error("Message not sent: " + response.data.message);
        }
      } catch (error) {
        attempts++;
        logger.error(
          `WhatsApp send attempt ${attempts} failed:`,
          error.response?.data || error.message
        );

        if (attempts >= this.maxRetries) {
          return {
            success: false,
            error: error.response?.data || error.message,
            attempts,
          };
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempts) * 1000)
        );
      }
    }
  }

  /**
   * Sends a document (e.g., PDF) to a WhatsApp phone number with retry and exponential backoff.
   * @param {string} phoneNumber - Recipient phone number in international format.
   * @param {string} documentUrl - Public URL of the document to send.
   * @param {string} filename - Name of the document file.
   * @param {string} caption - Optional caption message for the document.
   * @returns {Promise<object>} Result object with success status and messageId or error.
   */
  async sendDocument(phoneNumber, documentUrl, filename, caption) {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        // Construct URL avoiding duplication of instanceId
        let url = `${this.apiUrl}`;
        if (!this.apiUrl.includes(this.instanceId)) {
          url += `/${this.instanceId}`;
        }
        url += `/messages/document?token=${this.token}`;

        const response = await axios.post(
          url,
          {
            to: this.formatPhoneNumber(phoneNumber),
            document: documentUrl,
            filename: filename,
            caption: caption || "",
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.sent) {
          logger.info("WhatsApp document sent successfully:", {
            phoneNumber,
            filename,
            messageId: response.data.id,
          });
          return {
            success: true,
            messageId: response.data.id,
            response: response.data,
          };
        } else {
          throw new Error("Document not sent: " + response.data.message);
        }
      } catch (error) {
        attempts++;
        logger.error(
          `WhatsApp document send attempt ${attempts} failed:`,
          error.response?.data || error.message
        );

        if (attempts >= this.maxRetries) {
          return {
            success: false,
            error: error.response?.data || error.message,
            attempts,
          };
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempts) * 1000)
        );
      }
    }
  }

  /**
   * Sends an e-book to a WhatsApp phone number.
   * Attempts to send the e-book as a document first using the public file URL.
   * Falls back to sending a text message with a download link if document send fails.
   * @param {string} phoneNumber - Recipient phone number.
   * @param {object} purchaseLog - Purchase log object containing book and purchase details.
   * @param {string} downloadUrl - Public download URL for the e-book.
   * @returns {Promise<object>} Result object with success status and messageId or error.
   */
  async sendEbook(phoneNumber, purchaseLog, downloadUrl) {
    // Fix: Ensure downloadUrl is defined and valid
    const validDownloadUrl =
      downloadUrl && typeof downloadUrl === "string"
        ? downloadUrl
        : `${
            process.env.FRONTEND_URL ||
            "https://daringachieversnetwork.netlify.app"
          }/download/${
            purchaseLog._id || purchaseLog._doc?._id || purchaseLog.id
          }`;

    const message = this.createEbookMessage(purchaseLog, validDownloadUrl);

    try {
      // Construct full public URL for the document
      const backendUrl =
        process.env.BACKEND_URL || "https://book-store-pk35.onrender.com";
      const publicFileUrl = purchaseLog.bookId.fileUrl.startsWith("http")
        ? purchaseLog.bookId.fileUrl
        : `${backendUrl.replace(
            /\/$/,
            ""
          )}/${purchaseLog.bookId.fileUrl.replace(/^\/+/, "")}`;

      const documentResult = await this.sendDocument(
        phoneNumber,
        publicFileUrl,
        `${purchaseLog.bookTitle}.pdf`,
        message
      );

      if (documentResult.success) {
        return documentResult;
      }

      // Fallback to text message with download link
      const textResult = await this.sendMessage(phoneNumber, message);
      return textResult;
    } catch (error) {
      logger.error("Error sending e-book via WhatsApp:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  createEbookMessage(purchaseLog, downloadUrl) {
    return `🎉 Thank you for your purchase from Daring Achievers Network!

📚 *Book:* ${purchaseLog.bookTitle}
✨ *Author:* Mwatha Njoroge
💰 *Amount:* KES ${purchaseLog.amount}
📧 *Transaction ID:* ${purchaseLog.transactionId}


🌟 Thank you for choosing Daring Achievers Network! 
Your journey to greatness starts now! 💪

📞 *Support:* mwathanjoroge@gmail.com
🌐 *Website:* daringachieversnetwork.netlify.app

*Follow us for more inspiring content!*`;
  }

  formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Convert to format expected by WhatsApp API
    if (cleaned.startsWith("254")) {
      return cleaned + "@c.us";
    } else if (cleaned.startsWith("0")) {
      return "254" + cleaned.substring(1) + "@c.us";
    } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
      return "254" + cleaned + "@c.us";
    }

    throw new Error("Invalid phone number format");
  }

  async getInstanceStatus() {
    try {
      // Construct URL avoiding duplication of instanceId
      let url = `${this.apiUrl}`;
      if (!this.apiUrl.includes(this.instanceId)) {
        url += `/${this.instanceId}`;
      }
      url += `/instance/status?token=${this.token}`;

      const response = await axios.get(url);

      return response.data;
    } catch (error) {
      logger.error(
        "Error getting WhatsApp instance status:",
        error.response?.data || error.message
      );
      throw new Error("Failed to get WhatsApp instance status");
    }
  }
}

export default new WhatsAppService();
