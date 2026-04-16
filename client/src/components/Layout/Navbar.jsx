import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaOm } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.events'), path: '/events' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-saffron to-gold text-white text-center py-2.5 px-4 text-xs sm:text-sm font-bold shadow-md relative z-50 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 tracking-wide pr-10">
          <span className="drop-shadow-sm">{t('announcement.text')}</span>
          <Link to="/donate" className="bg-black/20 hover:bg-black/40 px-4 py-1 rounded-full transition-colors shadow-inner flex items-center gap-1 border border-white/20 whitespace-nowrap">
            {t('announcement.linkText')} &rarr;
          </Link>
          <button 
            onClick={() => setShowAnnouncement(false)} 
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
            aria-label="Close Announcement"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <nav className={`fixed w-full z-40 transition-all duration-300 ${(scrolled || !showAnnouncement) ? 'top-0 bg-black/95 backdrop-blur-md py-3 shadow-lg shadow-saffron/10' : 'top-[auto] bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl shadow-lg shadow-saffron/50 group-hover:scale-110 transition-transform overflow-hidden bg-white">
              <img 
                src="/logo.png" 
                alt="MKSST Logo" 
                className="w-full h-full object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} 
              />
              <FaOm className="hidden text-saffron" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-wider text-white">
                MATA KALI <span className="text-saffron">DHAM</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest hidden md:block">
                SADANAND SADBHAVANA TRUST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex items-center gap-5">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-saffron ${
                      location.pathname === link.path ? 'text-saffron' : 'text-gray-200'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center gap-4 border-l border-white/20 pl-4">
              <button 
                onClick={toggleLanguage}
                className="text-sm font-bold text-gray-200 hover:text-saffron transition-colors flex items-center gap-1"
              >
                <span className={i18n.language === 'en' ? 'text-saffron font-extrabold' : ''}>EN</span>
                <span className="text-gray-500">/</span>
                <span className={i18n.language === 'hi' ? 'text-saffron font-extrabold' : ''}>हिंदी</span>
              </button>

              <Link
                to="/donate"
                className="bg-gradient-to-r from-saffron to-gold hover:from-saffron-dark hover:to-saffron text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-saffron/30 hover:shadow-saffron/50 transition-all transform hover:-translate-y-0.5 text-sm"
              >
                {t('nav.donate_now')}
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={toggleLanguage}
              className="text-xs font-bold text-gray-200"
            >
              <span className={i18n.language === 'en' ? 'text-saffron' : ''}>EN</span> / <span className={i18n.language === 'hi' ? 'text-saffron' : ''}>HI</span>
            </button>
            <button
              className="text-2xl text-white hover:text-saffron transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-white/10 py-6 px-4 flex flex-col gap-6 shadow-2xl"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium transition-colors border-b border-white/5 pb-2 ${
                    location.pathname === link.path ? 'text-saffron' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/donate"
            onClick={() => setIsOpen(false)}
            className="bg-gradient-to-r from-saffron to-gold text-center text-white w-full py-3 rounded-md font-bold text-lg shadow-lg"
          >
            {t('nav.donate_now')}
          </Link>
        </motion.div>
      )}
    </nav>
    </>
  );
};

export default Navbar;
