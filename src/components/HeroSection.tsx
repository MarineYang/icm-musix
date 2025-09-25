import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const musicVideos = [
  {
    id: 'jWQx2f-CErU',
    title: 'Latest Music Video',
    thumbnail: 'https://img.youtube.com/vi/jWQx2f-CErU/maxresdefault.jpg'
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Music Video 2',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: 'L_jWHffIx5E',
    title: 'Music Video 3',
    thumbnail: 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg'
  },
  {
    id: 'kJQP7kiw5Fk',
    title: 'Music Video 4',
    thumbnail: 'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg'
  }
];

export default function HeroSection() {
  const [currentVideo, setCurrentVideo] = useState(0);

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % musicVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + musicVideos.length) % musicVideos.length);
  };

  const goToYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${musicVideos[currentVideo].id}`, '_blank');
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src={`https://www.youtube.com/embed/${musicVideos[currentVideo].id}?autoplay=1&mute=1&loop=1&playlist=${musicVideos[currentVideo].id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
          className="w-full h-full object-cover scale-110"
          style={{ 
            minWidth: '100vw', 
            minHeight: '100vh',
            transform: 'scale(1.1)',
            pointerEvents: 'none'
          }}
          allow="autoplay; encrypted-media"
          allowFullScreen
          frameBorder="0"
        />
        
        {/* Click overlay for YouTube redirect (no visible play button) */}
        <button
          type="button"
          aria-label="Open video on YouTube"
          className="absolute inset-0 cursor-pointer"
          onClick={goToYouTube}
        />
      </div>

      {/* Video Slider Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center space-x-4">
            {/* Previous Button */}
            <button
              onClick={prevVideo}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Video Thumbnails */}
            <div className="flex space-x-3">
              {musicVideos.map((video, index) => (
                <div
                  key={video.id}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    index === currentVideo 
                      ? 'ring-2 ring-red-500 scale-110' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentVideo(index)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                  {index === currentVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextVideo}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Current Video Title */}
          <div className="text-center mt-3">
            <p className="text-white text-sm font-medium">
              {musicVideos[currentVideo].title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}