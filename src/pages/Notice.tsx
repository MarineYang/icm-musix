import { motion } from 'framer-motion';

export default function Notice() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold tracking-wider"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            NOTICE
          </motion.h1>

          {/* Divider */}
          <motion.div
            className="w-32 h-1 bg-white mx-auto"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          {/* Message */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <p className="text-2xl md:text-4xl text-gray-300 font-light">
              페이지 준비중입니다.
            </p>
            <p className="text-xl md:text-2xl text-gray-400">
              조금만 기다려주세요 !
            </p>
          </motion.div>

          {/* Icon */}
          <motion.div
            className="pt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="inline-block">
              <svg 
                className="w-20 h-20 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.p
            className="text-sm md:text-base text-gray-500 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Coming Soon
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

