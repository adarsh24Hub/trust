const Donation = require('../models/Donation');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getDonations = async (req, res) => {
  try {
    const { status, method } = req.query;
    const query = {};
    if (status) query.status = status;
    if (method) query.method = method;

    const donations = await Donation.find(query).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 1. Create UPI Manual Donation (Fallback)
const createUpiDonation = async (req, res) => {
  try {
    const { name, contact, amount, transactionId, note } = req.body;
    
    // Check if txn id already exists
    const exists = await Donation.findOne({ transactionId });
    if (exists) {
      return res.status(400).json({ message: 'Transaction ID already submitted' });
    }

    const donation = await Donation.create({
      name,
      contact,
      amount,
      method: 'upi',
      status: 'pending',
      transactionId,
      note
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 2. Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, name, contact, note } = req.body;

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }

    // Save pending donation
    const donation = await Donation.create({
      name,
      contact,
      amount,
      method: 'razorpay',
      status: 'pending',
      orderId: order.id,
      note
    });

    res.status(201).json({ order, donationId: donation._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Verify Razorpay Payment (from frontend success)
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Find the donation and update it
      const receiptId = `RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const donation = await Donation.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: razorpay_payment_id,
          status: 'verified',
          receiptId
        },
        { new: true }
      );

      // Send email
      if (donation && donation.contact && donation.contact.includes('@')) {
        await sendEmail({
          to: donation.contact,
          subject: 'Thank You for Your Donation - Mata Kali Sadanand Sadbhavana Trust',
          html: `
            <h3>Dear ${donation.name},</h3>
            <p>Thank you for your generous contribution of <strong>₹${donation.amount}</strong>.</p>
            <p>Your payment has been successfully verified. Your receipt ID is <strong>${receiptId}</strong>.</p>
            <br>
            <p>May Maa Kali bless you and your family.</p>
            <p>Regards,<br>Mata Kali Sadanand Sadbhavana Trust</p>
          `
        });
      }

      res.json({ message: 'Payment verified successfully', donation });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Razorpay Webhook
const webhookRazorpay = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    // Validating the webhook
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature === expectedSignature) {
      if (req.body.event === 'payment.captured') {
        const payment = req.body.payload.payment.entity;
        
        // Find existing donation by orderId
        const donation = await Donation.findOne({ orderId: payment.order_id });

        if (donation && donation.status !== 'verified') {
          const receiptId = `RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
          
          donation.status = 'verified';
          donation.paymentId = payment.id;
          donation.receiptId = receiptId;
          await donation.save();

          if (donation.contact && donation.contact.includes('@')) {
            await sendEmail({
              to: donation.contact,
              subject: 'Thank You for Your Donation - Mata Kali Sadanand Sadbhavana Trust',
              html: `
                <h3>Dear ${donation.name},</h3>
                <p>Thank you for your generous contribution of <strong>₹${donation.amount}</strong>.</p>
                <p>Your payment has been successfully verified. Your receipt ID is <strong>${receiptId}</strong>.</p>
                <br>
                <p>May Maa Kali bless you and your family.</p>
                <p>Regards,<br>Mata Kali Sadanand Sadbhavana Trust</p>
              `
            });
          }
        }
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 5. Admin Approve UPI Donation
const approveUpiDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (donation.method !== 'upi') {
      return res.status(400).json({ message: 'Only UPI payments can be manually approved' });
    }

    const receiptId = `RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
    donation.status = 'verified';
    donation.receiptId = receiptId;
    await donation.save();

    if (donation.contact && donation.contact.includes('@')) {
      await sendEmail({
        to: donation.contact,
        subject: 'UPI Payment Verified - Mata Kali Sadanand Sadbhavana Trust',
        html: `
          <h3>Dear ${donation.name},</h3>
          <p>Thank you for your generous contribution of <strong>₹${donation.amount}</strong>.</p>
          <p>Your UPI payment (Txn ID: ${donation.transactionId}) has been manually verified by our admin. Your receipt ID is <strong>${receiptId}</strong>.</p>
          <br>
          <p>May Maa Kali bless you and your family.</p>
          <p>Regards,<br>Mata Kali Sadanand Sadbhavana Trust</p>
        `
      });
    }

    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Admin Reject UPI Donation
const rejectUpiDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = 'failed';
    await donation.save();
    
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    // Only calculate stats for verified donations
    const donations = await Donation.find({ status: 'verified' }, 'amount name');
    
    // Auto Total Calculation
    const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
    const uniqueDonors = new Set(donations.map(d => d.name)).size;
    
    res.json({ totalAmount, totalDonors: uniqueDonors, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = { 
  getDonations, 
  createUpiDonation, 
  createRazorpayOrder, 
  verifyRazorpayPayment, 
  webhookRazorpay, 
  approveUpiDonation,
  rejectUpiDonation,
  deleteDonation, 
  getDonationStats 
};
