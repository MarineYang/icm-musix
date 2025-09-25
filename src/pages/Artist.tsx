import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArtistGrid from '@/components/ArtistGrid';
import ArtistDetail from '@/components/ArtistDetail';

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
    weibo?: string;
  };
};

const artists: Artist[] = [
  {
    id: 'psy',
    name: 'PSY',
    images: [
      '/workspace/uploads/image (4).png',
      '/workspace/uploads/image (5).png',
      '/workspace/uploads/image (4).png'
    ],
    description: 'Go Crazy or Go Home',
    social: {
      youtube: 'https://youtube.com/@psy',
      instagram: 'https://instagram.com/42psy42',
      facebook: 'https://facebook.com/officialpsy',
      twitter: 'https://twitter.com/psy_oppa',
      weibo: 'https://weibo.com/psyoppa'
    }
  },
  {
    id: 'crush',
    name: 'CRUSH',
    images: [
      '/workspace/uploads/image (4).png',
      '/workspace/uploads/image (5).png',
      '/workspace/uploads/image (4).png'
    ],
    description: 'R&B Soul Master',
    social: {
      youtube: 'https://youtube.com/@crush',
      instagram: 'https://instagram.com/crush9244',
      facebook: 'https://facebook.com/crush9244',
      twitter: 'https://twitter.com/crush9244'
    }
  },
  {
    id: 'bignaughty',
    name: 'BIG Naughty',
    images: [
      '/workspace/uploads/image (4).png',
      '/workspace/uploads/image (5).png',
      '/workspace/uploads/image (4).png'
    ],
    description: 'Hip-hop Rising Star',
    social: {
      youtube: 'https://youtube.com/@bignaughty',
      instagram: 'https://instagram.com/bignaughty',
      facebook: 'https://facebook.com/bignaughty'
    }
  },
  {
    id: 'ph1',
    name: 'pH-1',
    images: [
      '/workspace/uploads/image (4).png',
      '/workspace/uploads/image (5).png',
      '/workspace/uploads/image (4).png'
    ],
    description: 'Korean-American Rapper',
    social: {
      youtube: 'https://youtube.com/@ph1official',
      instagram: 'https://instagram.com/ph1boyyy',
      twitter: 'https://twitter.com/ph1boyyy'
    }
  }
];

export default function Artist() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  const handleBackToList = () => {
    setSelectedArtist(null);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <AnimatePresence mode="wait">
        {!selectedArtist ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArtistGrid artists={artists} onArtistSelect={handleArtistSelect} />
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <ArtistDetail artist={selectedArtist} onBack={handleBackToList} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}