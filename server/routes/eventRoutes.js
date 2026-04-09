const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { getEvents, createEvent, updateEvent, deleteEvent, likeEvent, commentOnEvent, deleteComment } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.route('/').get(getEvents).post(protect, upload.single('image'), createEvent);
router.route('/:id').put(protect, updateEvent).delete(protect, deleteEvent);

// Social routes
router.post('/:id/like', likeEvent);
router.post('/:id/comment', commentOnEvent);
router.delete('/:eventId/comment/:commentId', protect, deleteComment);

module.exports = router;
