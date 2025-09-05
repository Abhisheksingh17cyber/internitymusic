const express = require('express');
const { body, validationResult } = require('express-validator');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const Payment = require('../models/Payment');
const Music = require('../models/Music');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create', authenticateToken, [
  body('musicItems').isArray({ min: 1 }).withMessage('At least one music item is required'),
  body('musicItems.*.musicId').isMongoId().withMessage('Valid music ID is required'),
  body('musicItems.*.quality').isIn(['low', 'medium', 'high', 'lossless']).withMessage('Valid quality is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { musicItems } = req.body;
    let totalAmount = 0;
    const processedItems = [];

    // Validate and calculate total amount
    for (const item of musicItems) {
      const music = await Music.findById(item.musicId);
      if (!music || !music.isActive) {
        return res.status(404).json({ error: `Music not found: ${item.musicId}` });
      }

      // Calculate price based on quality
      let price = music.price;
      switch (item.quality) {
        case 'lossless':
          price *= 2;
          break;
        case 'high':
          price *= 1.5;
          break;
        case 'medium':
          price *= 1.2;
          break;
        default:
          // low quality uses base price
          break;
      }

      processedItems.push({
        musicId: music._id,
        price: Math.round(price * 100) / 100, // Round to 2 decimal places
        quality: item.quality
      });

      totalAmount += processedItems[processedItems.length - 1].price;
    }

    if (totalAmount === 0) {
      return res.status(400).json({ error: 'Cannot create payment for free items' });
    }

    // Generate unique transaction ID
    const transactionId = uuidv4();

    // Create payment record
    const payment = new Payment({
      userId: req.userId,
      transactionId,
      amount: Math.round(totalAmount * 100) / 100,
      musicItems: processedItems,
      totalAmount: Math.round(totalAmount * 100) / 100,
      metadata: {
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    await payment.save();

    // Generate UPI payment URL
    const upiUrl = generateUPIUrl(transactionId, totalAmount);

    // Generate QR code
    const qrCode = await QRCode.toDataURL(upiUrl);

    res.json({
      success: true,
      paymentId: payment._id,
      transactionId,
      amount: totalAmount,
      upiUrl,
      qrCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Payment creation failed' });
  }
});

// Check payment status
router.get('/:transactionId/status', authenticateToken, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
      userId: req.userId
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({
      transactionId: payment.transactionId,
      status: payment.status,
      amount: payment.amount,
      createdAt: payment.createdAt
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// UPI webhook (for payment gateway integration)
router.post('/webhook/upi', async (req, res) => {
  try {
    // Verify webhook signature (implement based on your payment gateway)
    const { transactionId, status, gatewayTransactionId } = req.body;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Update payment status
    payment.status = status === 'SUCCESS' ? 'completed' : 'failed';
    payment.upiDetails.transactionRef = gatewayTransactionId;
    await payment.save();

    // If payment successful, create download permissions
    if (payment.status === 'completed') {
      // Implementation for creating download permissions would go here
      console.log(`Payment completed for transaction: ${transactionId}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get user's payment history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('musicItems.musicId', 'title artist artwork');

    const total = await Payment.countDocuments({ userId: req.userId });

    res.json({
      payments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Generate UPI URL
function generateUPIUrl(transactionId, amount) {
  const params = new URLSearchParams({
    pa: process.env.UPI_RECEIVER_VPA, // Payee VPA
    pn: 'MusicStream Pro', // Payee name
    tr: transactionId, // Transaction reference
    am: amount.toString(), // Amount
    cu: 'INR', // Currency
    tn: `MusicStream Pro - ${transactionId}` // Transaction note
  });

  return `upi://pay?${params.toString()}`;
}

module.exports = router;
