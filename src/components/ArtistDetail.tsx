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

  // Auto-slide images every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => 
        prev === artist.images.length - 1 ? 0 : prev + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [artist.images.length]);

  // 모바일에서는 2개, 태블릿에서는 3개, 데스크탑에서는 4개
  const [videosPerView, setVideosPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
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
    <div className="min-h-screen bg-black text-white pt-20 md:pt-24">
      {/* Main Content */}
      <div className="px-4 md:px-8 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* 모바일: 세로 레이아웃, 데스크톱: 가로 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start">

            {/* Left Side - Artist Info (모바일에서는 위에) */}
            <motion.div
              className="space-y-4 md:space-y-8 order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Artist Description */}
              {artist.description && (
                <div className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-light italic text-gray-300 leading-tight">
                  {artist.description}
                </div>
              )}

              {/* Artist Name */}
              <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white">
                {artist.name}
              </div>

              {/* Social Media Icons */}
              <div className="flex space-x-3 md:space-x-6">
                {Object.entries(artist.social).map(([platform, url]) => {
                  if (!url) return null;
                  const IconComponent = socialIcons[platform as keyof typeof socialIcons];

                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Right Side - Image Slider */}
            <motion.div
              className="relative aspect-[4/5] md:aspect-[4/5] bg-gray-800 rounded-lg overflow-hidden order-2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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
                    scale: index === currentImageIndex ? 1 : 1.1
                  }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src={image}
                    alt={`${artist.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 Placeholder 표시
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.placeholder')) {
                        const placeholder = document.createElement('div');
                        placeholder.className = 'placeholder absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center';
                        placeholder.innerHTML = `<span class="text-white text-2xl font-bold opacity-30">${artist.name} #${index + 1}</span>`;
                        parent.appendChild(placeholder);
                      }
                    }}
                  />
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
      </div>

      {/* YouTube Videos Section */}
      {artist.videos && artist.videos.length > 0 && (
        <div className="w-full bg-black py-6 md:py-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="relative">
                {/* Previous Button - Only show if more than 4 videos */}
                {showSlider && currentVideoIndex > 0 && (
                  <button
                    onClick={handlePrevVideo}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                )}

                {/* Videos Container */}
                <div className="overflow-hidden">
                  <div 
                    className="flex gap-4 transition-transform duration-500 ease-out"
                    style={{ 
                      transform: showSlider ? `translateX(-${currentVideoIndex * (100 / videosPerView)}%)` : 'none'
                    }}
                  >
                    {artist.videos.map((video) => (
                      <div
                        key={video.id}
                        className="flex-shrink-0"
                        style={{ width: `calc((100% - 3rem) / ${videosPerView})` }}
                      >
                        <a
                          href={`https://www.youtube.com/watch?v=${video.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block group"
                        >
                          <div className="relative overflow-hidden rounded-lg bg-gray-900" style={{ aspectRatio: '16/9' }}>
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Youtube className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Button - Only show if more than 4 videos */}
                {showSlider && currentVideoIndex < maxVideoIndex && (
                  <button
                    onClick={handleNextVideo}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
      
      {/* Back to List Button */}
      <div className="w-full flex justify-center py-6 md:py-8 pb-24 md:pb-8">
        <motion.button
          onClick={onClose}
          className="px-6 py-2.5 md:px-8 md:py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wider text-sm md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          BACK TO LIST
        </motion.button>
      </div>
    </div>
  );
}