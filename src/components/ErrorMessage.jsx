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
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
        <SafeIcon icon={FiAlertTriangle} className="text-red-500 text-4xl mb-4 mx-auto" />
        <h3 className="text-xl font-semibold text-red-800 mb-2">
          Errore di Connessione
        </h3>
        <p className="text-red-600 mb-4">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
          >
            <SafeIcon icon={FiRefreshCw} className="mr-2" />
            Riprova
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorMessage;