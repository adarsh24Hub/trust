import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          {t('contact.title')} <span className="text-saffron">{t('contact.subtitle')}</span>
        </h1>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details */}
          <div className="bg-dark-light rounded-3xl p-8 md:p-10 border border-white/5 shadow-xl flex flex-col gap-8">
            <h2 className="text-2xl font-bold text-white border-b border-saffron/30 pb-4">{t('contact.get_in_touch')}</h2>
            
            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron text-xl shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{t('contact.location')}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                  {t('contact.address1')}<br />
                  {t('contact.address2')}<br />
                  {t('contact.address3')}
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xl shrink-0">
                <FaPhoneAlt />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{t('contact.phone')}</h3>
                <a href="tel:+917505065444" className="text-gray-400 hover:text-white transition-colors">
                  +91 7505065444
                </a>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="w-12 h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron text-xl shrink-0">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{t('contact.email')}</h3>
                <a href="mailto:matakalisst@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                  matakalisst@gmail.com
                </a>
              </div>
            </div>
            
            <div className="pt-4">
              <a href="https://wa.me/917505065444" target="_blank" rel="noreferrer" className="inline-block bg-[#25D366] text-white font-bold py-3 px-8 rounded-full hover:bg-[#128C7E] transition-all shadow-lg hover:shadow-[#25D366]/50">
                {t('contact.whatsapp')}
              </a>
            </div>
          </div>

          {/* Map Embed */}
          <div className="bg-dark-light rounded-3xl p-4 border border-white/5 shadow-xl h-full min-h-[400px] overflow-hidden relative">
            <iframe 
              src="https://maps.google.com/maps?q=25.1982363,81.8472595&t=k&z=17&ie=UTF8&iwloc=&output=embed" 
              className="absolute inset-0 w-full h-full border-0 rounded-2xl grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
