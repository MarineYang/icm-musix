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
  videos: {
    id: string;
    title: string;
    thumbnail: string;
    videoId: string;
  }[];
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
    },
    videos: [
      {
        id: '1',
        title: "PSY - GANGNAM STYLE(강남스타일) M/V",
        thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg",
        videoId: "9bZkp7q19f0"
      },
      {
        id: '2',
        title: "PSY - GENTLEMAN M/V",
        thumbnail: "https://img.youtube.com/vi/ASO_ypdHDuk/maxresdefault.jpg",
        videoId: "ASO_ypdHDuk"
      },
      {
        id: '3',
        title: "PSY - DADDY(feat. CL of 2NE1) M/V",
        thumbnail: "https://img.youtube.com/vi/HkMNOlYcpHg/maxresdefault.jpg",
        videoId: "HkMNOlYcpHg"
      },
      {
        id: '4',
        title: "PSY - New Face M/V",
        thumbnail: "https://img.youtube.com/vi/CH1XGdu-hzQ/maxresdefault.jpg",
        videoId: "CH1XGdu-hzQ"
      },
      {
        id: '5',
        title: "PSY - New Face M/V",
        thumbnail: "https://img.youtube.com/vi/CH1XGdu-hzQ/maxresdefault.jpg",
        videoId: "CH1XGdu-hzQ"
      },
      {
        id: '6',
        title: "PSY - New Face M/V",
        thumbnail: "https://img.youtube.com/vi/CH1XGdu-hzQ/maxresdefault.jpg",
        videoId: "CH1XGdu-hzQ"
      }
    ]
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
    },
    videos: [
      {
        id: '1',
        title: "Crush - 'Beautiful' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      },
      {
        id: '2',
        title: "Crush - 'Rush Hour' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      },
      {
        id: '3',
        title: "Crush - 'NAPPA' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      },
      {
        id: '4',
        title: "Crush - 'Lay Your Head On Me' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      }
    ]
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
    },
    videos: [
      {
        id: '1',
        title: "BIG Naughty - 'Joker' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      },
      {
        id: '2',
        title: "BIG Naughty - 'Vancouver 2' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      },
      {
        id: '3',
        title: "BIG Naughty - 'Bucket List' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      }
    ]
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
    },
    videos: [
      {
        id: '1',
        title: "pH-1 - 'NERDY LOVE' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      },
      {
        id: '2',
        title: "pH-1 - 'PACKITUP!' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      },
      {
        id: '3',
        title: "pH-1 - 'HATE YOU' Official MV",
        thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
        videoId: "dQw4w9WgXcQ"
      }
    ]
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