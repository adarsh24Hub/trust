const Donation = require('../models/Donation');

const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDonation = async (req, res) => {
  try {
    const { name, contact, amount, paymentMethod, note } = req.body;
    const donation = await Donation.create({ name, contact, amount, paymentMethod, note });
    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedDonation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteDonation = async (req, res) => {
  try {
    const deleted = await Donation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json({ message: 'Donation removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDonationStats = async (req, res) => {
  try {
    const donations = await Donation.find({}, 'amount name');
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = new Set(donations.map(d => d.name)).size;
    
    res.json({ totalAmount, totalDonors: uniqueDonors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDonations, createDonation, updateDonation, deleteDonation, getDonationStats };
