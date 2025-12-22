import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Facebook, Twitter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Artist } from '@/pages/Artist';

interface ArtistDetailProps {
  artist: Artist;
  onClose: () => void;
}

export default function ArtistDetail({ artist, onClose }: ArtistDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videosPerView, setVideosPerView] = useState(4);

  // Auto-slide images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === artist.images.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [artist.images.length]);

  // 화면 크기에 따라 비디오 개수 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setVideosPerView(1);
      } else if (window.innerWidth < 640) {
        setVideosPerView(2);
      } else if (window.innerWidth < 1024) {
        setVideosPerView(3);
      } else {
        setVideosPerView(4);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxVideoIndex = artist.videos ? Math.max(0, artist.videos.length - videosPerView) : 0;
  const showSlider = artist.videos && artist.videos.length > videosPerView;

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => Math.min(maxVideoIndex, prev + 1));
  };

  const socialIcons = {
    youtube: Youtube,
    instagram: Instagram,
    facebook: Facebook,
    twitter: Twitter,
  };

  return (
    <div className="bg-black text-white">
      {/* Main Content */}
      <div className="px-4 sm:px-6 md:px-8 pt-20 sm:pt-22 md:pt-24 pb-4 sm:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* 반응형 그리드: 모바일 1열, 태블릿/데스크톱 2열 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-start">

            {/* Left Side - Artist Info */}
            <motion.div
              className="space-y-3 sm:space-y-4 md:space-y-6 order-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Artist Description */}
              {artist.description && (
                <div className="text-base sm:text-lg md:text-2xl lg:text-3xl xl:text-4xl font-light italic text-gray-300 leading-snug">
                  {artist.description}
                </div>
              )}

              {/* Artist Name */}
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight">
                {artist.name}
              </div>

              {/* Social Media Icons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                {Object.entries(artist.social).map(([platform, url]) => {
                  if (!url) return null;
                  const IconComponent = socialIcons[platform as keyof typeof socialIcons];

                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side - Image Slider */}
            <motion.div
              className="relative w-full aspect-[3/4] sm:aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden order-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Image Container */}
              <div className="relative w-full h-full">
                {artist.images.map((image, index) => (
                  <motion.div
                    key={index}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: index === currentImageIndex ? 1 : 0,
                      scale: index === currentImageIndex ? 1 : 1.05
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <img
                      src={image}
                      alt={`${artist.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'placeholder absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center';
                          placeholder.innerHTML = `<span class="text-white text-xl font-bold opacity-30">${artist.name}</span>`;
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Slide Indicators */}
              <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 right-3 sm:right-4 md:right-6 flex space-x-1.5 sm:space-x-2">
                {artist.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
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
      </div>

      {/* YouTube Videos Section */}
      {artist.videos && artist.videos.length > 0 && (
        <div className="w-full bg-black py-4 sm:py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative">
                {/* Previous Button */}
                {showSlider && currentVideoIndex > 0 && (
                  <button
                    onClick={handlePrevVideo}
                    className="absolute -left-2 sm:-left-4 md:-left-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </button>
                )}

                {/* Videos Container */}
                <div className="overflow-hidden mx-2 sm:mx-0">
                  <div
                    className="flex gap-2 sm:gap-3 md:gap-4 transition-transform duration-500 ease-out"
                    style={{
                      transform: showSlider ? `translateX(-${currentVideoIndex * (100 / videosPerView)}%)` : 'none'
                    }}
                  >
                    {artist.videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex-shrink-0"
                        style={{ width: `calc((100% - ${(videosPerView - 1) * 8}px) / ${videosPerView})` }}
                      >
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <div className="relative overflow-hidden rounded-md sm:rounded-lg bg-gray-900 aspect-video">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Youtube className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                {showSlider && currentVideoIndex < maxVideoIndex && (
                  <button
                    onClick={handleNextVideo}
                    className="absolute -right-2 sm:-right-4 md:-right-10 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Back to List Button */}
      <div className="w-full flex justify-center py-4 sm:py-6 md:py-8 pb-20 sm:pb-24 md:pb-8">
        <motion.button
          onClick={onClose}
          className="px-5 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wider text-xs sm:text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          BACK TO LIST
        </motion.button>
      </div>
    </div>
  );
}
