import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, YoutubeVideo } from '@/lib/supabase';

export default function HeroSection() {
  const [musicVideos, setMusicVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState(0);

  // Supabase에서 YouTube 비디오 가져오기
  useEffect(() => {
    fetchYoutubeVideos();
  }, []);

  const fetchYoutubeVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching youtube videos:', error);
        return;
      }

      setMusicVideos(data || []);
    } catch (error) {
      console.error('Error fetching youtube videos:', error);
    }
    setLoading(false);
  };

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % musicVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + musicVideos.length) % musicVideos.length);
  };

  const goToYouTube = () => {
    if (musicVideos[currentVideo]) {
      window.open(`https://www.youtube.com/watch?v=${musicVideos[currentVideo].video_id}`, '_blank');
    }
  };

  if (loading || musicVideos.length === 0) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <iframe
          src={`https://www.youtube.com/embed/${musicVideos[currentVideo].video_id}?autoplay=1&mute=1&loop=1&playlist=${musicVideos[currentVideo].video_id}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1`}
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
      <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 z-20 w-[calc(100%-2rem)] md:w-auto max-w-[95vw]">
        <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-3 md:p-4">
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            {/* Previous Button */}
            <button
              onClick={prevVideo}
              className="p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>

            {/* Video Thumbnails */}
            <div className="flex space-x-2 md:space-x-3 overflow-x-auto scrollbar-hide">
              {musicVideos.map((video, index) => (
                <div
                  key={video.id}
                  className={`relative cursor-pointer transition-all duration-300 flex-shrink-0 ${
                    index === currentVideo
                      ? 'ring-2 ring-red-500 scale-110'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentVideo(index)}
                >
                  <img
                    src={video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-12 h-9 md:w-16 md:h-12 object-cover rounded-lg"
                  />
                  {index === currentVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={nextVideo}
              className="p-1.5 md:p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </button>
          </div>

          {/* Current Video Title */}
          <div className="text-center mt-2 md:mt-3">
            <p className="text-white text-xs md:text-sm font-medium truncate px-2">
              {musicVideos[currentVideo].title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
