import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLoader } = FiIcons;

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <motion.div 
          className="w-16 h-16 border-4 border-blue-200 rounded-full"
          animate={{ 
            boxShadow: [
              "0 0 0 rgba(59,130,246,0)",
              "0 0 20px rgba(59,130,246,0.5)",
              "0 0 0 rgba(59,130,246,0)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-4 h-4 bg-blue-600 rounded-full absolute top-0"></div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <SafeIcon icon={FiLoader} className="text-2xl" />
        </motion.div>
      </div>
      <motion.p 
        className="mt-4 text-blue-700 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Caricamento in corso...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;