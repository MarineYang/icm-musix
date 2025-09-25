import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-12 right-12 z-50">
      <div className="w-1.5 h-32 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
        <motion.div 
          className="w-full bg-gradient-to-b from-red-500 to-purple-500 rounded-full transition-all duration-300"
          style={{ height: `${scrollProgress * 100}%` }}
          initial={{ height: 0 }}
          animate={{ height: `${scrollProgress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
