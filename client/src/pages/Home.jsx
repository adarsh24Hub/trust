import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaStar, FaClock, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Home = () => {
  const [targetAmount] = useState(1000000); // 10 Lakhs
  const [currentAmount, setCurrentAmount] = useState(0); 
  const [supporters, setSupporters] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/donations/stats`);
        if (res.data && res.data.success) {
          setCurrentAmount(res.data.totalAmount || 0);
          setSupporters(res.data.totalDonors || 0);
        }
      } catch (err) {
        console.error("Stats fetching failed");
      }
    };
    fetchStats();
  }, []);

  const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100);
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      
      {/* Global Fixed Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="/temple_hero_image.png" 
          alt="Mata Kali Dham Temple Backdrop" 
          className="w-full h-full object-cover opacity-50 blur-[2px] scale-105"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content wrapper with z-index */}
      <div className="relative z-10 flex flex-col gap-0">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center pt-20 pb-10">
          {/* Hero Content */}
          <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center mt-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <span className="text-saffron font-bold tracking-widest uppercase mb-4 block">
              {t('home.trust_name')}
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
              {t('home.heading_part1')} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-gold">{t('home.heading_part2')}</span>
            </h1>
            <p className="text-base md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto drop-shadow-md">
              {t('home.description')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href="https://www.google.com/maps/place/MATA+KALI+DHAM/@25.1982411,81.8446846,629m/data=!3m1!1e3!4m12!1m5!3m4!1s0x3985388a560a6c49:0xea1dcaeb5378ad49!2sMATA+KALI+DHAM!11m1!2e1!3m5!1s0x3985388a560a6c49:0xea1dcaeb5378ad49!8m2!3d25.1982363!4d81.8472595!16s%2Fg%2F11c5fz2c48" target="_blank" rel="noreferrer" className="w-full sm:w-auto bg-gradient-to-r from-saffron to-gold text-white font-bold text-base md:text-lg px-8 py-3.5 md:py-4 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <FaMapMarkerAlt /> {t('home.get_directions')}
              </a>
              <a href="tel:+917505065444" className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-base md:text-lg px-8 py-3.5 md:py-4 rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                <FaPhoneAlt className="text-saffron" /> {t('home.call_now')}
              </a>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gold text-xl backdrop-blur-md">
                  <FaClock />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm md:text-base">{t('home.open_24_hours')}</p>
                  <p className="text-[10px] md:text-xs text-gray-400">{t('home.always_welcoming')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gold text-xl backdrop-blur-md">
                  <FaStar />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm md:text-base">{t('home.rating')}</p>
                  <p className="text-[10px] md:text-xs text-gray-400">{t('home.blessed_devotees')}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Donation Campaign Section - Polished Premium UI */}
      <section className="py-16 relative bg-transparent">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-saffron/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 z-10 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 1.2, bounce: 0.3 }}
            viewport={{ once: true, margin: "-50px" }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-black/80 to-dark-light backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden text-center my-6"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-saffron via-gold to-saffron animate-pulse"></div>
            
            <div className="w-16 h-16 mx-auto bg-saffron/10 rounded-full flex items-center justify-center mb-6 border border-saffron/20 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
              <FaHeart className="text-saffron text-2xl animate-bounce" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              {t('home.campaign')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-gold">{t('home.campaign_name')}</span>
            </h2>
            <p className="text-sm md:text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('home.campaign_subtitle')}
            </p>

            {/* Progress Container */}
            <div className="bg-black/40 p-6 md:p-8 rounded-3xl border border-white/5 mb-10 shadow-inner">
              <div className="mb-4 flex flex-col md:flex-row justify-between items-center text-lg md:text-xl font-bold gap-2">
                <span className="text-saffron drop-shadow-md">₹{currentAmount.toLocaleString()} <span className="text-sm font-medium text-gray-400 ml-1">{t('home.raised')}</span></span>
                <span className="text-white drop-shadow-md">₹{targetAmount.toLocaleString()} <span className="text-sm font-medium text-gray-400 ml-1">{t('home.goal')}</span></span>
              </div>
              
              <div className="w-full bg-dark rounded-full h-8 overflow-hidden border border-white/10 p-1 relative shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="bg-gradient-to-r from-saffron to-gold h-full rounded-full relative shadow-[0_0_15px_rgba(249,115,22,0.6)]"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-white/40 to-transparent blur-sm"></div>
                </motion.div>
              </div>
              
              <div className="text-sm md:text-base text-gray-400 flex justify-between mt-4 font-medium px-2">
                <span className="bg-black/50 px-4 py-1.5 rounded-full border border-white/10">{progressPercentage.toFixed(2)}% {t('home.completed')}</span>
                <span className="bg-black/50 px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2"><FaStar className="text-gold text-xs"/> {supporters} {t('home.supporters')}</span>
              </div>
            </div>

            <Link to="/donate" className="group inline-flex items-center justify-center bg-gradient-to-r from-saffron to-gold text-black font-extrabold px-12 py-4 rounded-full transition-all text-xl shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.7)] hover:-translate-y-1">
              <span>{t('home.contribute_now')}</span>
              <motion.span 
                className="ml-2 inline-block"
                initial={{ x: 0 }}
                animate={{ x: 5 }}
                transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
              >
                &rarr;
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-transparent pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="relative grid grid-cols-2 gap-4">
                <div className="absolute -inset-4 bg-saffron/20 rounded-3xl blur-xl"></div>
                <img src="/tree.png" alt="Old Temple Tree" className="rounded-3xl relative z-10 border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-500 w-full h-48 object-cover" />
                <img src="/ruins.png" alt="Temple Ruins" className="rounded-3xl relative z-10 border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-500 w-full h-48 object-cover" />
                <img src="/night_view.png" alt="Temple Night View" className="rounded-3xl relative z-10 border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-500 w-full col-span-2 h-40 object-cover" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-pulse">{t('home.our_sacred_mission')}</h2>
              <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed">
                {t('home.story_p1')}
              </p>
              <p className="text-gray-300 text-sm md:text-base mb-6 leading-relaxed">
                {t('home.story_p2')}
              </p>
              <Link to="/about" className="text-saffron font-bold text-lg flex items-center gap-2 hover:gap-4 transition-all inline-flex bg-saffron/10 px-6 py-2 rounded-full border border-saffron/30">
                {t('home.read_full_history')} <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* End Content Wrapper */}
      </div>
    </div>
  );
};

export default Home;
