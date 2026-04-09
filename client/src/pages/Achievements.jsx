import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';

const Achievements = () => {
  const { t } = useTranslation();

  const achievementsData = [
    {
      year: t('achievements.year_2026'),
      sector: t('achievements.sector_2026') || 'Religious',
      achievement: t('achievements.ach_2026'),
      bestPractices: t('achievements.bp_2026')
    },
    {
      year: t('achievements.year_2025'),
      sector: t('achievements.sector_2025') || 'Religious',
      achievement: t('achievements.ach_2025'),
      bestPractices: t('achievements.bp_2025')
    }
  ];

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-16">
          {t('achievements.title')} <span className="text-saffron">{t('achievements.subtitle')}</span>
        </h1>

        <div className="relative border-l-2 border-saffron/30 ml-4 md:ml-8 pl-8 md:pl-12 flex flex-col gap-12">
          {achievementsData.map((data, index) => (
            <div key={index} className="relative">
              {/* Year Marker */}
              <div className="absolute -left-[45px] md:-left-[61px] top-0 w-12 h-12 bg-dark rounded-full border-4 border-saffron flex items-center justify-center z-10 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                <span className="text-white font-bold text-sm">{data.year}</span>
              </div>
              
              <div className="bg-dark-light border border-white/5 shadow-xl rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                  <h2 className="text-2xl font-bold text-saffron">
                    {data.year} Milestones
                  </h2>
                  <span className="bg-saffron/10 text-saffron border border-saffron/30 px-3 py-1 rounded-full text-xs font-semibold">
                    Sector: {data.sector}
                  </span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                       <FaCheckCircle className="text-green-500" /> Achievement
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {data.achievement}
                    </p>
                  </div>
                  <div className="bg-black/30 p-5 rounded-xl border border-white/5">
                    <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                       <FaCheckCircle className="text-blue-500" /> Best Practices
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {data.bestPractices}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
