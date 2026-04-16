import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaQrcode, FaCopy, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const Donate = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    amount: '',
    paymentMethod: 'razorpay',
    transactionId: '',
    note: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const UPI_ID = 'adarshofficial2408@okicici';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        setStatus({ type: 'error', message: 'Razorpay SDK failed to load. Are you online?' });
        setLoading(false);
        return;
      }

      // Create Order
      const orderResponse = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/create-order`, {
        name: formData.name,
        contact: formData.contact,
        amount: formData.amount,
        note: formData.note
      });

      const { order, donationId, razorpayKeyId } = orderResponse.data;

      const options = {
        key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Se1DTBVFvB0sFS',
        amount: order.amount,
        currency: order.currency,
        name: "Mata Kali Trust",
        description: "Donation for Mandir Nirman",
        order_id: order.id,
        handler: async function (response) {
          try {
            setStatus({ type: 'info', message: 'Verifying payment...' });
            const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            setStatus({ type: 'success', message: 'Payment verified! Thank you for your contribution. Receipt sent to your contact.' });
            setFormData({ name: '', contact: '', amount: '', paymentMethod: 'razorpay', transactionId: '', note: '' });
          } catch (err) {
            setStatus({ type: 'error', message: 'Payment verification failed. Please contact admin.' });
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.contact,
        },
        theme: {
          color: "#f97316"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on('payment.failed', function (response) {
        setStatus({ type: 'error', message: 'Payment failed. Please try again.' });
      });

    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to initialize payment gateway.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpiSubmission = async () => {
    try {
      if (!formData.transactionId) {
        setStatus({ type: 'error', message: 'Transaction ID is required for manual UPI.' });
        setLoading(false);
        return;
      }
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/upi`, {
         name: formData.name,
         contact: formData.contact,
         amount: formData.amount,
         transactionId: formData.transactionId,
         note: formData.note
      });
      setStatus({ type: 'success', message: 'Donation details submitted! Admin will verify your payment shortly.' });
      setFormData({ name: '', contact: '', amount: '', paymentMethod: 'upi', transactionId: '', note: '' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to submit UPI details.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'info', message: 'Processing your request...' });

    if (formData.paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleUpiSubmission();
    }
  };

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {t('donate.title')} <span className="text-saffron">{t('donate.subtitle')}</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('donate.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* QR Code Section */}
          <div className="bg-dark-light rounded-3xl p-8 border border-saffron/20 shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-bl-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/10 rounded-tr-full -z-10"></div>
            
            <FaQrcode className="text-saffron text-5xl mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Scan & Pay via UPI</h3>
            <p className="text-gray-400 text-center text-sm mb-6">Open any UPI app (GPay, PhonePe, Paytm) and scan the QR code to contribute directly to the Mandir Nirman.</p>
            
            <div className="bg-white p-4 rounded-2xl mb-6 shadow-lg shadow-black/50">
              {/* Note: User must place their own upi-qr.png in the public folder */}
              <img 
                src="/upi-qr.png" 
                alt="UPI QR Code" 
                className="w-48 h-48 object-cover rounded-xl border-4 border-gray-100"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/200?text=Scan+QR+Code";
                }}
              />
            </div>
            
            <div className="bg-black/50 px-6 py-3 rounded-full border border-white/10 flex items-center justify-between w-full max-w-xs">
              <span className="text-gray-300 font-mono text-sm">{UPI_ID}</span>
              <button onClick={handleCopyUPI} className="text-saffron hover:text-gold transition-colors flex items-center gap-2 text-sm font-bold">
                {copied ? <><FaCheckCircle/> Copied</> : <><FaCopy/> Copy</>}
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-dark-light rounded-3xl p-8 border border-white/10 shadow-xl relative overflow-hidden">
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Log Your Details</h3>
            <p className="text-gray-400 text-sm mb-6">Choose Razorpay for instant verification, or UPI QR scan if you prefer to upload details manually.</p>
            
            {status.message && (
              <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
                status.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 
                status.type === 'info' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' :
                'bg-red-900/30 text-red-400 border border-red-500/30'
              }`}>
                {status.type === 'success' ? <FaCheckCircle className="mt-1 flex-shrink-0" /> : <FaExclamationCircle className="mt-1 flex-shrink-0"/>}
                <span className="text-sm">{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">{t('donate.full_name')} <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Contact (Email highly recommended)</label>
                <input 
                  type="text" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleChange} 
                  required
                  placeholder="For receipt delivery"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Contributed {t('donate.amount')} (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="amount" 
                  value={formData.amount} 
                  onChange={handleChange} 
                  required 
                  min="1"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">{t('donate.payment_method')} <span className="text-red-500">*</span></label>
                <select 
                  name="paymentMethod" 
                  value={formData.paymentMethod} 
                  onChange={handleChange} 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-all appearance-none"
                >
                  <option value="razorpay">Razorpay (Cards, NetBanking, Auto-UPI)</option>
                  <option value="upi">Manual UPI (Scanned QR above)</option>
                </select>
              </div>

              {formData.paymentMethod === 'upi' && (
                 <div>
                   <label className="block text-gray-400 mb-2 text-sm font-medium">UPI Transaction ID <span className="text-red-500">*</span></label>
                   <input 
                     type="text" 
                     name="transactionId" 
                     value={formData.transactionId} 
                     onChange={handleChange} 
                     required={formData.paymentMethod === 'upi'}
                     className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-all"
                     placeholder="e.g. 324567890123"
                   />
                 </div>
              )}

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">{t('donate.message_optional')}</label>
                <textarea 
                  name="note" 
                  value={formData.note} 
                  onChange={handleChange} 
                  rows="2"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-all"
                  placeholder="Leave a message..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-saffron to-gold text-black font-bold text-lg py-4 rounded-xl mt-2 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : (formData.paymentMethod === 'razorpay' ? 'Pay & Donate Now' : 'Submit UPI Details')}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 text-xs text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-gray-500">
            {t('donate.secure')}
          </p>
          <div className="text-gray-500 text-[11px] leading-relaxed space-y-2">
            <p>At present, donations made to Mata Kali Sadanand Sadbhavana Trust are not eligible for tax exemption benefits (80G). We are working towards obtaining the necessary approvals in the future.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
