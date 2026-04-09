import React from 'react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  const primarySectors = [
    t('about.art_culture'),
    t('about.differently_abled'),
    t('about.rural_dev'),
    t('about.poverty_alleviation'),
    t('about.animal_welfare'),
    t('about.religious')
  ];

  const secondarySectors = [
    t('about.agriculture'),
    t('about.education'),
    t('about.health'),
    t('about.women_emp'),
    t('about.youth_skill')
  ];

  const members = [
    { name: 'Abhishek Mishra', role: t('about.president') },
    { name: 'Ganesh Prasad Mishra', role: t('about.secretary') },
    { name: 'Amrendra Kumar Mishra', role: t('about.treasurer') },
    { name: 'Meena Gupta', role: t('about.trustee') },
    { name: 'Shiv Shankar Ojha', role: t('about.trustee') },
    { name: 'Shivam Shukla', role: t('about.trustee') },
    { name: 'Ajay Vishwakarma', role: t('about.trustee') },
    { name: 'Mahesh Sitaram Bhartiya', role: t('about.trustee') },
    { name: 'Milaram Pal', role: t('about.trustee') }
  ];

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          {t('about.title')} <span className="text-saffron">{t('about.subtitle')}</span>
        </h1>
        
        {/* History Section */}
        <div className="bg-dark-light rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-saffron mb-4 border-b border-white/10 pb-4">{t('about.history_title')}</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t('about.history_p1')}
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t('about.history_p2')}
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t('about.history_p3')}
          </p>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            {t('about.history_p4')}
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            {t('about.history_p5')}
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-dark-light rounded-3xl p-8 border border-white/5 shadow-xl">
            <h3 className="text-xl font-bold text-gold mb-4">{t('about.mission_title')}</h3>
            <p className="text-gray-400">{t('about.mission_text')}</p>
          </div>
          <div className="bg-dark-light rounded-3xl p-8 border border-white/5 shadow-xl">
            <h3 className="text-xl font-bold text-gold mb-4">{t('about.vision_title')}</h3>
            <p className="text-gray-400">{t('about.vision_text')}</p>
          </div>
        </div>

        {/* Trust Information */}
        <div className="bg-dark-light rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-saffron mb-8 flex items-center gap-3">
            <div className="w-2 h-8 bg-gold rounded-full"></div>
            {t('about.trust_info_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('about.type')}</span>
              <span className="text-white font-medium">Trust</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('about.act')}</span>
              <span className="text-white font-medium">Indian Trusts Act, 1882</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('about.registration_no')}</span>
              <span className="text-white font-medium">95</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('about.registration_date')}</span>
              <span className="text-white font-medium">25-08-2025</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('about.city')} / {t('about.state')}</span>
              <span className="text-white font-medium">Prayagraj, Uttar Pradesh</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">{t('about.darpan_id')}</span>
              <span className="text-saffron font-bold">UP/2025/0906241</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2 md:col-start-2">
              <span className="text-gray-400">{t('about.darpan_date')}</span>
              <span className="text-white font-medium">30-11-2025</span>
            </div>
          </div>
        </div>

        {/* Working Sectors */}
        <div className="bg-dark-light rounded-3xl p-8 md:p-12 border border-white/5 shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-saffron mb-8 flex items-center gap-3">
            <div className="w-2 h-8 bg-gold rounded-full"></div>
            {t('about.working_sectors_title')}
          </h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-white mb-4">{t('about.primary_sectors')}</h3>
            <div className="flex flex-wrap gap-3">
              {primarySectors.map((sector, index) => (
                <span key={index} className="px-4 py-2 bg-saffron/10 border border-saffron/30 text-saffron rounded-full text-sm font-medium">
                  {sector}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-white mb-4">{t('about.secondary_sectors')}</h3>
            <div className="flex flex-wrap gap-3">
              {secondarySectors.map((sector, index) => (
                <span key={index} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
                  {sector}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Members */}
        <div>
          <h2 className="text-3xl font-bold text-center text-white mb-10 mt-20">
            {t('about.trust_members_title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member, index) => (
              <div key={index} className="bg-dark-light border border-white/5 rounded-2xl p-6 text-center shadow-lg hover:border-saffron/30 transition-colors flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-2xl text-saffron mb-4 font-bold uppercase shadow-inner border border-white/10">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                <p className="text-saffron text-sm font-medium px-4 py-1 bg-saffron/10 rounded-full inline-block mt-2">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
