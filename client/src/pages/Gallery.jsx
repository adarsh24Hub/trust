import React from 'react';
import { useTranslation } from 'react-i18next';

const Gallery = () => {
  const { t } = useTranslation();

  const photos = [
    "/temple_hero_image.png",
    "/temple_hero_image.png",
    "/temple_hero_image.png",
    "/temple_hero_image.png",
    "/temple_hero_image.png",
    "/temple_hero_image.png"
  ];

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          {t('gallery.title')} <span className="text-saffron">{t('gallery.subtitle')}</span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div key={index} className="group relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-xl">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10 duration-500"></div>
              <img 
                src={photo} 
                alt={`Gallery ${index + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
