import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black relative z-20 border-t border-white/10 pt-16 pb-8 text-gray-300">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {t('home.trust_name').split(' ')[0]} {t('home.trust_name').split(' ')[1]} <span className="text-saffron">Dham</span>
              </h3>
              <p className="text-[10px] text-saffron tracking-widest uppercase mt-1">
                {t('footer.managed_by')}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {t('footer.description')}
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent hover:text-white transition-all text-xl">
                <FaWhatsapp />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-transparent hover:text-white transition-all text-xl">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E4405F] hover:border-transparent hover:text-white transition-all text-xl">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-transparent hover:text-white transition-all text-xl">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6 lg:pl-8">
            <h4 className="text-lg font-semibold text-white border-b-2 border-saffron inline-block pb-2">{t('footer.quick_links')}</h4>
            <ul className="flex flex-col gap-3">
              <li><Link to="/about" className="text-sm text-gray-400 hover:text-saffron transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/events" className="text-sm text-gray-400 hover:text-saffron transition-colors">{t('nav.events')}</Link></li>
              <li><Link to="/gallery" className="text-sm text-gray-400 hover:text-saffron transition-colors">{t('nav.gallery')}</Link></li>
              <li><Link to="/achievements" className="text-sm text-gray-400 hover:text-saffron transition-colors">{t('achievements.title')} {t('achievements.subtitle')}</Link></li>
              <li><Link to="/donate" className="text-sm text-gray-400 hover:text-saffron transition-colors">{t('nav.donate_now')}</Link></li>
              <li className="pt-2"><Link to="/admin" className="text-xs text-saffron/70 hover:text-saffron font-bold transition-colors">{t('footer.admin_login')}</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <h4 className="text-lg font-semibold text-white border-b-2 border-saffron inline-block pb-2">{t('footer.contact_us')}</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-4 items-start">
                <div className="text-saffron text-xl mt-1"><FaMapMarkerAlt /></div>
                <div>
                  <p className="font-medium text-white mb-1">{t('footer.location')}</p>
                  <p className="text-sm text-gray-400">{t('contact.address1')}, {t('contact.address2')}, {t('contact.address3')}</p>
                </div>
              </li>
              <div className="flex flex-col sm:flex-row gap-6 mt-2">
                <li className="flex gap-4 items-start">
                  <div className="text-saffron text-xl mt-1"><FaPhoneAlt /></div>
                  <div>
                    <p className="font-medium text-white mb-1">{t('footer.phone')}</p>
                    <p className="text-sm text-gray-400">+91 7505065444</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="text-saffron text-xl mt-1"><FaEnvelope /></div>
                  <div>
                    <p className="font-medium text-white mb-1">{t('footer.email')}</p>
                    <p className="text-sm text-gray-400">matakalisst@gmail.com</p>
                  </div>
                </li>
              </div>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t('footer.rights')}</p>
          <p className="flex items-center gap-2">{t('footer.built_with')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
