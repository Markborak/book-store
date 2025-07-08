import axios from "axios";
import { logger } from "../utils/logger.js";

class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || "https://api.ultramsg.com";
    this.instanceId = process.env.WHATSAPP_INSTANCE_ID;
    this.token = process.env.WHATSAPP_TOKEN;
    this.maxRetries = 3;
  }

  async sendMessage(phoneNumber, message) {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        const response = await axios.post(
          `${this.apiUrl}/${this.instanceId}/messages/chat?token=${this.token}`,
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

  async sendDocument(phoneNumber, documentUrl, filename, caption) {
    let attempts = 0;
    while (attempts < this.maxRetries) {
      try {
        const response = await axios.post(
          `${this.apiUrl}/${this.instanceId}/messages/document?token=${this.token}`,
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

  async sendEbook(phoneNumber, purchaseLog, downloadUrl) {
    const message = this.createEbookMessage(purchaseLog, downloadUrl);

    try {
      // Try to send as document first if file URL is available
      if (purchaseLog.bookId?.fileUrl) {
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

📥 *Download your e-book here:*
${downloadUrl}

⚡ *Important Notes:*
• This download link is valid for 24 hours
• You can download up to 5 times
• Keep this link safe and don't share it

🌟 Thank you for choosing Daring Achievers Network! 
Your journey to greatness starts now! 💪

📞 *Support:* mwathanjoroge@gmail.com
🌐 *Website:* daringachievers.com

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
      const response = await axios.get(
        `${this.apiUrl}/${this.instanceId}/instance/status?token=${this.token}`
      );

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
