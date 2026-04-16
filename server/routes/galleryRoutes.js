const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getImages, uploadImage, deleteImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { getCloudinaryStorage } = require('../config/cloudinary');

const upload = multer({ storage: getCloudinaryStorage('trust_gallery') });

router.route('/').get(getImages).post(protect, upload.single('image'), uploadImage);
router.route('/:id').delete(protect, deleteImage);

module.exports = router;
