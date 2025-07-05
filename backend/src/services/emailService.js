import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, html, attachments = []) {
    try {
      const mailOptions = {
        from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
        attachments
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info('Email sent successfully:', { to, subject, messageId: result.messageId });
      
      return {
        success: true,
        messageId: result.messageId
      };
    } catch (error) {
      logger.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendPurchaseReceipt(customerEmail, purchaseLog) {
    const subject = `Purchase Receipt - ${purchaseLog.bookTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">Thank you for your purchase!</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Purchase Details</h3>
          <p><strong>Book:</strong> ${purchaseLog.bookTitle}</p>
          <p><strong>Author:</strong> Mwatha Njoroge</p>
          <p><strong>Amount:</strong> KES ${purchaseLog.amount}</p>
          <p><strong>Transaction ID:</strong> ${purchaseLog.transactionId}</p>
          <p><strong>M-Pesa Receipt:</strong> ${purchaseLog.mpesaReceiptNumber}</p>
          <p><strong>Purchase Date:</strong> ${new Date(purchaseLog.createdAt).toLocaleDateString()}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>📱 Your e-book has been sent to your WhatsApp number.</strong></p>
          <p>If you didn't receive it, please contact us at ${process.env.CONTACT_EMAIL}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            <strong>Mwatha Njoroge</strong><br>
            Daring Achievers Network<br>
            ${process.env.CONTACT_EMAIL}<br>
            ${process.env.CONTACT_PHONE}
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail(customerEmail, subject, html);
  }

  async sendAdminNotification(purchaseLog) {
    const subject = `New Book Purchase - ${purchaseLog.bookTitle}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e3a8a;">New Book Purchase</h2>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px;">
          <h3>Purchase Details</h3>
          <p><strong>Book:</strong> ${purchaseLog.bookTitle}</p>
          <p><strong>Customer:</strong> ${purchaseLog.customerName || 'N/A'}</p>
          <p><strong>Phone:</strong> ${purchaseLog.phoneNumber}</p>
          <p><strong>Email:</strong> ${purchaseLog.customerEmail || 'N/A'}</p>
          <p><strong>Amount:</strong> KES ${purchaseLog.amount}</p>
          <p><strong>Transaction ID:</strong> ${purchaseLog.transactionId}</p>
          <p><strong>M-Pesa Receipt:</strong> ${purchaseLog.mpesaReceiptNumber}</p>
          <p><strong>WhatsApp Status:</strong> ${purchaseLog.whatsappDeliveryStatus}</p>
        </div>
      </div>
    `;

    return await this.sendEmail(process.env.CONTACT_EMAIL, subject, html);
  }
}

export default new EmailService();