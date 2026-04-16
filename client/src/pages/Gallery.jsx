import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Gallery = () => {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery`);
        setPhotos(res.data);
      } catch (err) {
        console.error('Failed to fetch gallery', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          {t('gallery.title')} <span className="text-saffron">{t('gallery.subtitle')}</span>
        </h1>

        {loading ? (
          <div className="text-center text-gray-400">Loading gallery...</div>
        ) : photos.length === 0 ? (
          <div className="text-center text-gray-500">No photos available yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div key={photo._id || index} className="group relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-xl">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all z-10 duration-500"></div>
                <img 
                  src={photo.imageUrl.startsWith('http') ? photo.imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${photo.imageUrl}`} 
                  alt={photo.description || `Gallery ${index + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                {photo.description && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium drop-shadow-md">{photo.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
