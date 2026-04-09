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
    paymentMethod: 'UPI (QR Scan)',
    note: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const UPI_ID = 'satyamstr1@okaxis';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setStatus({ type: 'info', message: 'Processing your donation...' });
      
      // Post to backend database
      await axios.post('http://localhost:5000/api/donations', formData);
      
      setStatus({ type: 'success', message: 'Donation details submitted successfully! The admin will verify your payment shortly.' });
      setFormData({ name: '', contact: '', amount: '', paymentMethod: 'UPI (QR Scan)', note: '' });
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to record donation. Please check your connection or contact admin.' });
    } finally {
      setLoading(false);
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
            <p className="text-gray-400 text-sm mb-6">After making your payment via QR or Razorpay, please leave your details below so we can keep a record of your contribution.</p>
            
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
                <label className="block text-gray-400 mb-2 text-sm font-medium">Contact (Phone/Email)</label>
                <input 
                  type="text" 
                  name="contact" 
                  value={formData.contact} 
                  onChange={handleChange} 
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
                  <option value="UPI (QR Scan)">UPI (Scanned QR above)</option>
                  <option value="Razorpay">Razorpay (Gateway Link)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-medium">Transaction ID / {t('donate.message_optional')}</label>
                <textarea 
                  name="note" 
                  value={formData.note} 
                  onChange={handleChange} 
                  rows="2"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-saffron focus:bg-black transition-all"
                  placeholder="Paste transaction ref or leave a message..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-gradient-to-r from-saffron to-gold text-black font-bold text-lg py-4 rounded-xl mt-2 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Donation Details'}
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
