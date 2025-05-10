import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

export default function NotFound() {
  const HomeIcon = getIcon('Home');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const FilesIcon = getIcon('Files');
  
  // Animation for the file icon
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    // Toggle animation state every 3 seconds
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md text-center">
        <motion.div 
          className="mb-6 inline-block"
          animate={{
            rotate: isAnimating ? [0, -10, 10, -10, 0] : 0,
            scale: isAnimating ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.5 }}
        >
          <FilesIcon size={64} className="mx-auto text-primary-light" />
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-surface-800 dark:text-surface-100 mb-4">
          404
        </h1>
        
        <h2 className="text-xl md:text-2xl font-medium mb-6 text-surface-600 dark:text-surface-300">
          Page not found
        </h2>
        
        <p className="mb-8 text-surface-500 dark:text-surface-400">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/"
            className="btn-primary group"
          >
            <HomeIcon size={18} className="mr-2 group-hover:scale-110 transition-transform" />
            Go to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="btn-outline group"
          >
            <ArrowLeftIcon size={18} className="mr-2 group-hover:translate-x-[-2px] transition-transform" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}