import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Index from './pages/Index';
import About from './pages/About';
import Artist from './pages/Artist';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import SocialSidebar from './components/SocialSidebar';
import { useState } from 'react';
import LoadingScreen from './components/LoadingScreen';
import IcmCloud from './pages/IcmCloud';
import IcmCloudWrite from './pages/IcmCloudWrite';
import IcmCloudPost from './pages/IcmCloudPost';

const queryClient = new QueryClient();

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4,
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      <ScrollProgress />
      <SocialSidebar />
      <main className="flex-grow bg-black">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen w-full bg-black"
              >
                <Index />
              </motion.div>
            }
          />
          <Route
            path="/about"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen w-full bg-black"
              >
                <About />
              </motion.div>
            }
          />
          <Route
            path="/artist"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen w-full bg-black"
              >
                <Artist />
              </motion.div>
            }
          />
          <Route
              path="/icm-cloud"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <IcmCloud />
                </motion.div>
              }
            />
            <Route
              path="/icm-cloud/write"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <IcmCloudWrite />
                </motion.div>
              }
            />
            <Route
              path="/icm-cloud/post/:id"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <IcmCloudPost />
                </motion.div>
              }
            />
          <Route
            path="*"
            element={
              <motion.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="min-h-screen w-full bg-black"
              >
                <NotFound />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

const App = () => {
  const [showLoading, setShowLoading] = useState(true);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div className="bg-black min-h-screen">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {showLoading ? (
            <LoadingScreen onComplete={handleLoadingComplete} />
          ) : (
            <HashRouter>
              <AnimatedRoutes />
            </HashRouter>
          )}
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;