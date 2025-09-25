import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [stage, setStage] = useState(0); // 0: INSPIRE COLOURS MUSIX, 1: ICM, 2: fade out

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage(1); // Show ICM
    }, 1000);

    const timer2 = setTimeout(() => {
      setStage(2); // Start fade out
    }, 3000);

    const timer3 = setTimeout(() => {
      onComplete(); // Enter main site
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="full-text"
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
              INSPIRE
              <br />
              COLOURS
              <br />
              MUSIX
            </h1>
          </motion.div>
        )}

        {stage === 1 && (
          <motion.div
            key="icm"
            className="text-center"
            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white tracking-wider">
              ICM
            </h1>
            <motion.div
              className="text-lg md:text-xl text-gray-400 mt-4 tracking-widest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              RECORDS
            </motion.div>
          </motion.div>
        )}

        {stage === 2 && (
          <motion.div
            key="fade-out"
            className="text-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black text-white tracking-wider">
              ICM
            </h1>
            <div className="text-lg md:text-xl text-gray-400 mt-4 tracking-widest">
              RECORDS
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}