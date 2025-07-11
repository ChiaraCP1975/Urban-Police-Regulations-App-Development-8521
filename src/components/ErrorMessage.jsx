import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertTriangle, FiRefreshCw } = FiIcons;

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 max-w-md mx-auto shadow-soft hover:shadow-md transition-all">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <SafeIcon icon={FiAlertTriangle} className="text-red-500 text-7xl" />
          </div>
          <div className="relative z-10 bg-white/50 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto backdrop-blur-sm">
            <SafeIcon icon={FiAlertTriangle} className="text-red-500 text-3xl" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-red-800 mb-3">
          Errore di Connessione
        </h3>
        
        <p className="text-red-600 mb-6 bg-red-100/50 py-2 px-4 rounded-lg inline-block">
          {message}
        </p>
        
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center mx-auto shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SafeIcon icon={FiRefreshCw} className="mr-2" />
            Riprova
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorMessage;