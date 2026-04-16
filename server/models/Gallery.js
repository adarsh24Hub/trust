const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
