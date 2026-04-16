const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getEvents, createEvent, updateEvent, deleteEvent, likeEvent, commentOnEvent, deleteComment } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { getCloudinaryStorage } = require('../config/cloudinary');

const upload = multer({ storage: getCloudinaryStorage('trust_events') });

router.route('/').get(getEvents).post(protect, upload.single('image'), createEvent);
router.route('/:id').put(protect, updateEvent).delete(protect, deleteEvent);

// Social routes
router.post('/:id/like', likeEvent);
router.post('/:id/comment', commentOnEvent);
router.delete('/:eventId/comment/:commentId', protect, deleteComment);

module.exports = router;
