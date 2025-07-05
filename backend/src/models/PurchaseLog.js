import mongoose from 'mongoose';

const purchaseLogSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^254\d{9}$/
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  mpesaReceiptNumber: {
    type: String,
    unique: true,
    sparse: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'M-Pesa'
  },
  whatsappDeliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'failed'],
    default: 'pending'
  },
  whatsappMessageId: {
    type: String,
    sparse: true
  },
  deliveryAttempts: {
    type: Number,
    default: 0
  },
  lastDeliveryAttempt: Date,
  downloadToken: {
    type: String,
    unique: true,
    sparse: true
  },
  tokenExpiresAt: Date,
  downloadCount: {
    type: Number,
    default: 0
  },
  maxDownloads: {
    type: Number,
    default: 5
  },
  customerEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  customerName: String,
  ipAddress: String,
  userAgent: String,
  stkPushResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  refundStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'processed'],
    default: 'none'
  },
  refundReason: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
purchaseLogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
purchaseLogSchema.index({ phoneNumber: 1 });
purchaseLogSchema.index({ transactionId: 1 });
purchaseLogSchema.index({ paymentStatus: 1 });
purchaseLogSchema.index({ createdAt: -1 });
purchaseLogSchema.index({ downloadToken: 1 });

export default mongoose.model('PurchaseLog', purchaseLogSchema);