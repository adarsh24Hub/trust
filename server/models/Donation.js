const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
