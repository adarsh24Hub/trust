const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

const getImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    
    // Cloudinary automatically provides the full URL in req.file.path
    const imageUrl = req.file.path;
    const newImage = await Gallery.create({
      imageUrl,
      description: req.body.description || ''
    });

    res.status(201).json(newImage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getImages, uploadImage, deleteImage };
