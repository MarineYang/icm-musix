import { motion } from 'framer-motion';
import { Artist } from '@/pages/Artist';

interface ArtistGridProps {
  artists: Artist[];
  onArtistSelect: (artist: Artist) => void;
}

export default function ArtistGrid({ artists, onArtistSelect }: ArtistGridProps) {
  return (
    <div className="min-h-screen bg-black text-white px-8 py-20">
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-wider">
          OUR ARTISTS
        </h1>
        <p className="text-xl text-gray-400 mt-4">
          만나보세요, 우리의 아티스트들을
        </p>
      </motion.div>

      {/* Artist Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              className="group cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onArtistSelect(artist)}
            >
              {/* Artist Card */}
              <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-[3/4] mb-6">
                {/* Image Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-900 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold opacity-30">
                    {artist.name}
                  </span>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{artist.name}</div>
                    <div className="text-lg text-gray-300 mb-4">{artist.description}</div>
                    <div className="px-6 py-2 border border-white text-white hover:bg-white hover:text-black transition-all duration-300">
                      VIEW DETAILS
                    </div>
                  </div>
                </div>
              </div>

              {/* Artist Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{artist.name}</h3>
                <p className="text-gray-400">{artist.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}