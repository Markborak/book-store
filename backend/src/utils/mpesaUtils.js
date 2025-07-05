import crypto from 'crypto';

export function generateTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${minute}${second}`;
}

export function generatePassword(businessShortCode, passkey, timestamp) {
  const concatenated = businessShortCode + passkey + timestamp;
  return Buffer.from(concatenated).toString('base64');
}

export function generateTransactionId() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 15);
  return `DA${timestamp}${random}`.toUpperCase();
}

export function validateMpesaCallback(callbackData) {
  const requiredFields = ['Body', 'stkCallback'];
  const stkCallback = callbackData.Body?.stkCallback;
  
  if (!stkCallback) {
    return { isValid: false, error: 'Invalid callback structure' };
  }
  
  const requiredStkFields = ['MerchantRequestID', 'CheckoutRequestID', 'ResultCode'];
  const missingStkFields = requiredStkFields.filter(field => !stkCallback[field]);
  
  if (missingStkFields.length > 0) {
    return { 
      isValid: false, 
      error: `Missing required STK fields: ${missingStkFields.join(', ')}` 
    };
  }
  
  return { isValid: true };
}

export function parseMpesaCallback(callbackData) {
  const stkCallback = callbackData.Body.stkCallback;
  
  const result = {
    merchantRequestId: stkCallback.MerchantRequestID,
    checkoutRequestId: stkCallback.CheckoutRequestID,
    resultCode: stkCallback.ResultCode,
    resultDesc: stkCallback.ResultDesc,
    callbackMetadata: null
  };
  
  // If payment was successful, extract metadata
  if (stkCallback.ResultCode === 0 && stkCallback.CallbackMetadata) {
    const metadata = {};
    stkCallback.CallbackMetadata.Item.forEach(item => {
      switch (item.Name) {
        case 'Amount':
          metadata.amount = item.Value;
          break;
        case 'MpesaReceiptNumber':
          metadata.mpesaReceiptNumber = item.Value;
          break;
        case 'TransactionDate':
          metadata.transactionDate = item.Value;
          break;
        case 'PhoneNumber':
          metadata.phoneNumber = item.Value;
          break;
      }
    });
    result.callbackMetadata = metadata;
  }
  
  return result;
}