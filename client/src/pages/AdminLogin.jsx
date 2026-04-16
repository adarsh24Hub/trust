import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`, {
        email,
        password
      });
      
      // Store real token
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error(err);
      setError(t('admin.invalid_login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 pt-20">
      <div className="bg-dark-light p-8 rounded-3xl border border-white/10 shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">{t('admin.login_title')} <span className="text-saffron">{t('admin.login_subtitle')}</span></h2>
          <p className="text-gray-500 mt-2">{t('admin.login_desc')}</p>
        </div>

        {error && <div className="bg-red-900/50 text-red-400 p-3 rounded mb-6 text-sm text-center border border-red-500/30">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="text-gray-400 text-sm block mb-2">{t('admin.email')}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm block mb-2">{t('admin.password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-saffron text-white font-bold py-3 rounded-lg mt-4 hover:shadow-[0_0_15px_rgba(249,115,22,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : t('admin.login_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
