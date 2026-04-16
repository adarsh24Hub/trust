import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FaHeart, FaCommentAlt, FaShareAlt, FaPaperPlane } from 'react-icons/fa';

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [commentData, setCommentData] = useState({ name: '', text: '' });

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleLike = async (id) => {
    try {
      // Optimistic update
      setEvents(events.map(ev => ev._id === id ? { ...ev, likes: (ev.likes || 0) + 1 } : ev));
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${id}/like`);
      // Refetch strictly not required due to optimistic update, but good for sync
    } catch (err) {
      console.error('Failed to like post');
    }
  };

  const handleShare = (eventTitle) => {
    if (navigator.share) {
      navigator.share({
        title: eventTitle,
        url: window.location.href,
        text: `Check out this update: ${eventTitle}`
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const submitComment = async (e, eventId) => {
    e.preventDefault();
    if (!commentData.name || !commentData.text) return;
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/events/${eventId}/comment`, commentData);
      setCommentData({ name: '', text: '' });
      setActiveCommentPost(null);
      fetchEvents(); // Refresh to get the new comment
    } catch (err) {
      console.error('Failed to post comment');
      alert('Failed to post comment.');
    }
  };

  return (
    <div className="bg-dark min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-12">
          {t('events.title')} <span className="text-saffron">{t('events.subtitle')}</span>
        </h1>

        <div className="grid gap-10">
          {loading ? (
            <p className="text-center text-gray-400 py-10">Loading events...</p>
          ) : events.length === 0 ? (
            <div className="bg-dark-light border border-white/5 rounded-2xl p-10 text-center">
              <p className="text-gray-400 text-lg">No upcoming events or updates available at the moment.</p>
              <p className="text-gray-500 text-sm mt-2">Please check back later.</p>
            </div>
          ) : (
            events.map(event => {
              const eventDate = new Date(event.date);
              const day = eventDate.getDate();
              const month = eventDate.toLocaleString('default', { month: 'short' });
              const year = eventDate.getFullYear();

              return (
                <div key={event._id} className="bg-dark-light border border-white/5 rounded-2xl p-0 hover:border-saffron/30 transition-all shadow-lg hover:shadow-saffron/10 relative overflow-hidden flex flex-col">
                  {/* Absolute Badge */}
                  <div className="absolute top-0 right-0 bg-saffron/20 z-10 text-saffron px-3 py-1 rounded-bl-lg text-xs font-bold border-l border-b border-saffron/30 backdrop-blur-sm">
                    Update / Event
                  </div>
                  
                  {/* Top Header & Photo */}
                  {event.image && (
                    <div className="w-full h-64 md:h-80 lg:h-96 relative">
                      <img src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${event.image}`} alt="Event upload" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>
                  )}

                  <div className={`p-6 md:p-8 flex flex-col md:flex-row gap-6 ${event.image ? '-mt-16 relative z-10' : ''}`}>
                    <div className="bg-black border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center min-w-[120px] max-w-[120px] self-start shadow-xl">
                      <span className="text-saffron font-bold text-3xl">{day}</span>
                      <span className="text-gray-400 font-medium">{month} {year}</span>
                    </div>
                    
                    <div className="flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-white mb-3">{event.title}</h3>
                      <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                      
                      {/* Interaction Bar */}
                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
                        <button onClick={() => handleLike(event._id)} className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
                          <FaHeart /> <span className="font-bold">{event.likes || 0}</span>
                        </button>
                        <button onClick={() => setActiveCommentPost(activeCommentPost === event._id ? null : event._id)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                          <FaCommentAlt /> <span className="font-bold">{event.comments?.length || 0}</span>
                        </button>
                        <button onClick={() => handleShare(event.title)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors ml-auto">
                          <FaShareAlt /> Share
                        </button>
                      </div>

                      {/* Comments Section */}
                      {activeCommentPost === event._id && (
                        <div className="mt-4 bg-black/40 p-4 rounded-xl border border-white/5 animate-fade-in">
                          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-2">
                            {event.comments && event.comments.length > 0 ? (
                              event.comments.map(c => (
                                <div key={c._id} className="bg-black/60 p-3 rounded-lg border border-white/5">
                                  <p className="text-saffron text-xs font-bold mb-1">{c.name}</p>
                                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{c.text}</p>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
                            )}
                          </div>
                          
                          <form onSubmit={(e) => submitComment(e, event._id)} className="flex flex-col gap-2">
                            <input 
                              type="text" 
                              placeholder="Your Name (ex: Ashvani)" 
                              value={commentData.name}
                              onChange={(e) => setCommentData({...commentData, name: e.target.value})}
                              required
                              className="bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron focus:bg-black"
                            />
                            <div className="flex gap-2">
                              <textarea 
                                placeholder="Add a sweet comment..." 
                                value={commentData.text}
                                onChange={(e) => setCommentData({...commentData, text: e.target.value})}
                                required
                                rows="1"
                                className="bg-black/50 border border-white/10 rounded w-full px-3 py-2 text-sm text-white focus:outline-none focus:border-saffron focus:bg-black"
                              />
                              <button type="submit" className="bg-saffron text-black p-3 rounded hover:bg-gold transition-colors flex items-center justify-center">
                                <FaPaperPlane />
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
