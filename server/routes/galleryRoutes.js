const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getImages, uploadImage, deleteImage } = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Images only!');
    }
  }
});

router.route('/').get(getImages).post(protect, upload.single('image'), uploadImage);
router.route('/:id').delete(protect, deleteImage);

module.exports = router;
