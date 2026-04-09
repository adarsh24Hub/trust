const express = require('express');
const router = express.Router();
const { getDonations, createDonation, updateDonation, deleteDonation, getDonationStats } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.route('/stats').get(getDonationStats);
router.route('/').get(protect, getDonations).post(createDonation);
router.route('/:id').put(protect, updateDonation).delete(protect, deleteDonation);

module.exports = router;
