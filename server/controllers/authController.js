const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin.id,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const seedAdminAccount = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'matakalisst@gmail.com' });
    if (existingAdmin) {
      return res.json({ message: 'Admin already exists. No need to seed again.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Admin({
      email: 'matakalisst@gmail.com',
      password: hashedPassword
    });

    await admin.save();
    res.json({ message: 'Success! Admin user seeded successfully with email matakalisst@gmail.com and password admin123' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginAdmin, seedAdminAccount };
