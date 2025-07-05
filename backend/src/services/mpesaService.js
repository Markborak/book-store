import axios from 'axios';
import { logger } from '../utils/logger.js';
import { generateTimestamp, generatePassword } from '../utils/mpesaUtils.js';

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.businessShortCode = process.env.MPESA_BUSINESS_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.baseUrl = process.env.MPESA_ENVIRONMENT === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.access_token;
    } catch (error) {
      logger.error('Error getting M-Pesa access token:', error.response?.data || error.message);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  async initiateSTKPush(phoneNumber, amount, transactionId, accountReference) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = generateTimestamp();
      const password = generatePassword(this.businessShortCode, this.passkey, timestamp);

      const requestBody = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: this.businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: `Payment for ${accountReference}`
      };

      const response = await axios.post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      logger.info('STK Push initiated successfully:', { transactionId, phoneNumber, amount });
      return response.data;
    } catch (error) {
      logger.error('Error initiating STK Push:', error.response?.data || error.message);
      throw new Error('Failed to initiate STK Push');
    }
  }

  async querySTKStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = generateTimestamp();
      const password = generatePassword(this.businessShortCode, this.passkey, timestamp);

      const requestBody = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(`${this.baseUrl}/mpesa/stkpushquery/v1/query`, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Error querying STK status:', error.response?.data || error.message);
      throw new Error('Failed to query STK status');
    }
  }

  formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    
    throw new Error('Invalid phone number format');
  }

  validateAmount(amount) {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1 || numAmount > 70000) {
      throw new Error('Invalid amount. Must be between KES 1 and KES 70,000');
    }
    return Math.round(numAmount);
  }
}

export default new MpesaService();