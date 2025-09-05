const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'wallet'],
    default: 'upi'
  },
  upiDetails: {
    vpa: String,
    transactionRef: String,
    bankRef: String
  },
  musicItems: [{
    musicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Music',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quality: {
      type: String,
      enum: ['low', 'medium', 'high', 'lossless'],
      default: 'high'
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  metadata: {
    userAgent: String,
    ipAddress: String,
    paymentGateway: String
  }
}, {
  timestamps: true
});

// Indexes for performance
paymentSchema.index({ userId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Method to mark payment as completed
paymentSchema.methods.markCompleted = function() {
  this.status = 'completed';
  return this.save();
};

// Method to mark payment as failed
paymentSchema.methods.markFailed = function() {
  this.status = 'failed';
  return this.save();
};

// Static method to get user payments
paymentSchema.statics.getUserPayments = function(userId, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('musicItems.musicId', 'title artist artwork');
};

// Transform output
paymentSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Payment', paymentSchema);
