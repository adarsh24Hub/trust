import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhoneAlt, FaStar, FaClock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const [targetAmount] = useState(1000000); // 10 Lakhs
  const [currentAmount] = useState(2); 

  const progressPercentage = Math.min((currentAmount / targetAmount) * 100, 100);
  const { t } = useTranslation();

  return (
    <div className="bg-dark min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/temple_hero_image.png" 
            alt="Mata Kali Dham Temple" 
            className="w-full h-full object-cover opacity-40 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center mt-16">
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

      {/* Donation Campaign Section */}
      <section className="py-24 relative bg-dark">
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', duration: 1, bounce: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-4xl mx-auto bg-dark-light border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shadow-saffron/5 relative overflow-hidden text-center my-12"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron to-gold"></div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('home.campaign')} <span className="text-saffron">{t('home.campaign_name')}</span></h2>
            <p className="text-sm md:text-base text-gray-400 mb-8">{t('home.campaign_subtitle')}</p>

            {/* Progress Bar */}
            <div className="mb-4 flex justify-between text-sm md:text-lg font-bold">
              <span className="text-saffron">₹{currentAmount.toLocaleString()} {t('home.raised')}</span>
              <span className="text-gray-400">{t('home.goal')} ₹{targetAmount.toLocaleString()}</span>
            </div>
            <div className="w-full bg-black rounded-full h-6 mb-6 overflow-hidden border border-white/10 p-1 relative">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="bg-gradient-to-r from-saffron to-gold h-full rounded-full relative"
              >
                {/* Glow effect */}
                <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/30 blur-md"></div>
              </motion.div>
            </div>
            <div className="text-xs md:text-sm text-gray-400 flex justify-between mb-8">
              <span>{progressPercentage.toFixed(2)}% {t('home.completed')}</span>
              <span>2 {t('home.supporters')}</span>
            </div>

            <a href="https://razorpay.me/@matakali" target="_blank" rel="noreferrer" className="inline-block bg-saffron text-white font-bold px-10 md:px-12 py-3 md:py-4 rounded-full hover:bg-saffron-dark transition-all text-lg md:text-xl shadow-lg border-b-4 border-saffron-dark active:border-b-0 active:translate-y-1">
              {t('home.contribute_now')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-dark">
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
    </div>
  );
};

export default Home;
