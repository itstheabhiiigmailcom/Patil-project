import { useNavigate } from 'react-router-dom';
import { Rocket, Ghost, Home, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex flex-col items-center justify-center p-6 text-center">
      {/* Animated elements */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <Ghost className="h-32 w-32 text-purple-400" />
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
          className="absolute -top-6 -right-6"
        >
          <Rocket className="h-12 w-12 text-indigo-500" />
        </motion.div>
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600 mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          Oops! Page Lost in Space
        </h2>
        <p className="text-gray-600 max-w-md mb-8">
          The page you're looking for has been abducted by aliens or never
          existed. Let's get you back to safety!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            Go Home
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-colors"
          >
            <Zap className="h-5 w-5" />
            Try Again
          </motion.button>
        </div>
      </motion.div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ x: [0, 15, 0], rotate: [0, 10, 0] }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: 'easeInOut',
        }}
        className="absolute bottom-20 left-10 text-purple-300 opacity-70"
      >
        <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L4 12l8 10 8-10L12 2zm0 2.5L18 12l-6 7.5L6 12l6-7.5z" />
        </svg>
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: 'easeInOut',
          repeatType: 'reverse',
        }}
        className="absolute top-20 right-10 text-indigo-300 opacity-70"
      >
        <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
        </svg>
      </motion.div>
    </div>
  );
}
