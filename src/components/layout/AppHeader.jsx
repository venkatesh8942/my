import React from 'react';
    import { motion } from 'framer-motion';

    const AppHeader = () => {
      return (
        <header className="text-center my-6 sm:my-10 md:my-12 w-full px-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
          >
            Cyber Security Toolkit
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 mt-2 text-sm sm:text-base md:text-lg"
          >
            Your one-stop shop for essential security utilities.
          </motion.p>
        </header>
      );
    };

    export default AppHeader;