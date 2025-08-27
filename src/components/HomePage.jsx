import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-4xl md:text-6xl font-bold text-center text-green-800 mb-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Home Page
      </motion.h1>
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl text-center">
        You've arrived at the home page after the welcome screen. Add your main content here!
      </p>
    </div>
  );
}

export default Home;