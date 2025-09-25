import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayLocation, setDisplayLocation] = useState(useLocation());
  const location = useLocation();

  useEffect(() => {
    if (location !== displayLocation) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}