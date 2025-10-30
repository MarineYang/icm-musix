import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistGrid from '@/components/ArtistGrid';
import ArtistDetail from '@/components/ArtistDetail';
import { supabase, Artist as SupabaseArtist, ArtistImage, ArtistVideo } from '@/lib/supabase';

export type Artist = {
  id: string;
  name: string;
  images: string[];
  description: string;
  social: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  videos: {
    id: string;
    title: string;
    thumbnail: string;
    videoId: string;
  }[];
};

export default function ArtistPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  // Supabase에서 아티스트 정보 가져오기
  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      // 아티스트 기본 정보 가져오기
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (artistsError) {
        console.error('Error fetching artists:', artistsError);
        return;
      }

      // 각 아티스트의 이미지와 비디오 가져오기
      const artistsWithDetails = await Promise.all(
        (artistsData || []).map(async (artist: SupabaseArtist) => {
          // 아티스트 이미지 가져오기
          const { data: imagesData } = await supabase
            .from('artist_images')
            .select('*')
            .eq('artist_id', artist.id)
            .order('display_order', { ascending: true });

          // 아티스트 비디오 가져오기
          const { data: videosData } = await supabase
            .from('artist_videos')
            .select('*')
            .eq('artist_id', artist.id)
            .order('display_order', { ascending: true });

          // profile_image를 첫 번째 이미지로, 나머지 갤러리 이미지 추가
          const allImages = [
            artist.profile_image,
            ...(imagesData || []).map((img: ArtistImage) => img.image_url)
          ].filter(Boolean) as string[];

          return {
            id: artist.id,
            name: artist.name,
            images: allImages,
            description: artist.description || '',
            social: {
              youtube: artist.youtube_url || undefined,
              instagram: artist.instagram_url || undefined,
              facebook: artist.facebook_url || undefined,
              twitter: artist.twitter_url || undefined,
            },
            videos: (videosData || []).map((video: ArtistVideo) => ({
              id: video.id.toString(),
              title: video.title,
              thumbnail: video.thumbnail_url || `https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`,
              videoId: video.video_id,
            })),
          };
        })
      );

      setArtists(artistsWithDetails);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
    setLoading(false);
  };

  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleClose = () => {
    setSelectedArtist(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black">
      {/* Artist Grid */}
      <ArtistGrid artists={artists} onSelectArtist={handleSelectArtist} />

      {/* Artist Detail Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={handleClose}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-7xl mx-4"
            >
              <ArtistDetail artist={selectedArtist} onClose={handleClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
