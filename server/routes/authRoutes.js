const express = require('express');
const router = express.Router();
const { loginAdmin, seedAdminAccount } = require('../controllers/authController');

router.post('/login', loginAdmin);
router.get('/seed', seedAdminAccount);

module.exports = router;
