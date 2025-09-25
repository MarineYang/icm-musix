import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
// import ArtistsSection from '@/components/ArtistsSection';
// import ReleasesSection from '@/components/ReleasesSection';
// import MultimediaSection from '@/components/MultimediaSection';
import SocialSection from '@/components/SocialSection';

export default function Index() {
  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HeroSection />
      {/* <ArtistsSection /> */}
      {/* <ReleasesSection /> */}
      {/* <MultimediaSection /> */}
      <SocialSection />
    </motion.div>
  );
}