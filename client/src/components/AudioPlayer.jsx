import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaMusic, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const tracks = [
  { title: "Harmonium", src: "/harmonium.mp3" },
  { title: "Om Chanting", src: "/om.mp3" },
  { title: "Maa Bhajan", src: "/maa.mp3" }
];

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [particles, setParticles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed", err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  // Automatically play when track changes
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error(e));
    }
  }, [currentIndex]);

  const handleEnded = () => {
    nextTrack();
  };

  // 🌟 Floating Emojis Animation 🌟
  useEffect(() => {
    if (!isPlaying) {
      setParticles([]); 
      return;
    }
    
    const interval = setInterval(() => {
      const emojis = ['ॐ', '🎵', '🎶', '🔱', '🌺', '🔔', '✨'];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      setParticles(prev => [
        ...prev.slice(-10), // Keep it lighter
        { id: Date.now() + Math.random(), x: Math.random() * 80 - 40, emoji: randomEmoji }
      ]);
    }, 600); 

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-4 left-4 z-[60]">
      <audio 
        ref={audioRef} 
        src={tracks[currentIndex].src} 
        onEnded={handleEnded}
        preload="auto"
      />
      
      {/* 🌟 Floating Emojis Container 🌟 */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none z-10 w-full flex justify-center">
        <AnimatePresence>
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10, x: 0, scale: 0.2 }}
              animate={{ opacity: [0, 1, 0.8, 0], y: -120, x: p.x, scale: [0.5, 1.2, 1] }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute text-xl drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] z-10"
              style={{
                 color: ['ॐ', '🔱'].includes(p.emoji) ? '#f97316' : 
                        ['🌺'].includes(p.emoji) ? '#ef4444' : 
                        ['🎵', '🎶'].includes(p.emoji) ? '#fbbf24' : '#ffffff'
              }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isOpen ? (
        <div className="bg-black/90 backdrop-blur-md border border-saffron/40 rounded-xl p-3 shadow-[0_0_15px_rgba(249,115,22,0.3)] w-56 flex flex-col gap-2 transition-all duration-300 relative z-20">
          
          <div className="flex justify-between items-center w-full">
            <h4 className="text-white font-bold text-[13px] truncate text-saffron">{tracks[currentIndex].title}</h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white text-[10px] bg-white/5 rounded px-1.5 py-0.5">
              Close
            </button>
          </div>
          
          <div className="flex items-center justify-between w-full mt-1">
            <button onClick={prevTrack} className="text-white hover:text-saffron transition-colors" title="Previous">
              <FaStepBackward size={12} />
            </button>
            <button 
              onClick={togglePlay} 
              className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-saffron to-gold shadow-[0_0_10px_rgba(249,115,22,0.4)] rounded-full text-black hover:scale-105 transition-transform"
            >
              {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} className="ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-white hover:text-saffron transition-colors" title="Next">
              <FaStepForward size={12} />
            </button>
            <button onClick={toggleMute} className="text-gray-400 hover:text-white transition-colors ml-2 border-l border-white/10 pl-2" title="Toggle Mute">
              {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className={`w-12 h-12 bg-gradient-to-br from-saffron to-gold rounded-full flex items-center justify-center text-black shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:scale-105 hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] transition-all relative z-20 ${isPlaying ? 'animate-bounce' : ''}`}
        >
          <FaMusic size={18} />
        </button>
      )}
    </div>
  );
};

export default AudioPlayer;
