import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Facebook, Twitter } from 'lucide-react';
import { Artist } from '@/pages/Artist';

interface ArtistDetailProps {
  artist: Artist;
  onBack: () => void;
}

export default function ArtistDetail({ artist, onBack }: ArtistDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === artist.images.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [artist.images.length]);

  const socialIcons = {
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
    weibo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.31 8.17c-.36 0-.69.29-.69.65 0 .36.33.65.69.65.36 0 .69-.29.69-.65 0-.36-.33-.65-.69-.65zm2.54 2.05c-.14 0-.25.11-.25.25s.11.25.25.25.25-.11.25-.25-.11-.25-.25-.25z"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 12.5c0 1.93-2.13 3.5-4.75 3.5s-4.75-1.57-4.75-3.5c0-1.93 2.13-3.5 4.75-3.5s4.75 1.57 4.75 3.5z"/>
      </svg>
    )
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
          ARTIST INTRODUCTION
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-8">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Artist Info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Artist Description */}
            <div className="text-4xl md:text-6xl lg:text-7xl font-light italic text-gray-300 leading-tight">
              {artist.description}
            </div>

            {/* Artist Name */}
            <div className="text-6xl md:text-8xl lg:text-9xl font-black text-white">
              {artist.name}
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-6">
              {Object.entries(artist.social).map(([platform, url]) => {
                if (!url) return null;
                const IconComponent = socialIcons[platform as keyof typeof socialIcons];
                
                return (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side - Image Slider */}
          <motion.div
            className="relative aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Image Container */}
            <div className="relative w-full h-full">
              {artist.images.map((image, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: index === currentImageIndex ? 1 : 0,
                    scale: index === currentImageIndex ? 1 : 1.1
                  }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Placeholder for actual image */}
                  <span className="text-white text-2xl font-bold opacity-30">
                    {artist.name} #{index + 1}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 right-6 flex space-x-2">
              {artist.images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Back to List Button */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <button
          onClick={onBack}
          className="px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wider"
        >
          BACK TO LIST
        </button>
      </motion.div>
    </div>
  );
}