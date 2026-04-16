const express = require('express');
const router = express.Router();
const { 
  getDonations, 
  createUpiDonation,
  createRazorpayOrder,
  verifyRazorpayPayment,
  webhookRazorpay,
  approveUpiDonation,
  rejectUpiDonation,
  deleteDonation, 
  getDonationStats 
} = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

// Public stats
router.route('/stats').get(getDonationStats);

// Razorpay & Webhook
router.post('/create-order', createRazorpayOrder);
router.post('/verify-payment', verifyRazorpayPayment);
// Razorpay webhook typically sends a raw JSON. 
// Standard JSON is fine if we reconstruct string via JSON.stringify or use raw-body.
router.post('/webhook', webhookRazorpay);

// Manual UPI
router.post('/upi', createUpiDonation);

// Admin Protected Routes
router.route('/').get(protect, getDonations);
router.route('/:id').delete(protect, deleteDonation);
router.put('/:id/approve', protect, approveUpiDonation);
router.put('/:id/reject', protect, rejectUpiDonation);

module.exports = router;
