const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['razorpay', 'upi', 'cash', 'offline'], required: true },
  status: { type: String, enum: ['pending', 'verified', 'failed'], default: 'pending' },
  paymentId: { type: String },
  orderId: { type: String },
  transactionId: { type: String },
  receiptId: { type: String },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
