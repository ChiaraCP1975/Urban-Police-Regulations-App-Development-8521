import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { testConnection } from '../lib/supabase';

const { FiWifi, FiWifiOff, FiRefreshCw } = FiIcons;

const NetworkStatus = () => {
  const [status, setStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [lastChecked, setLastChecked] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    if (isChecking) return;
    
    try {
      setIsChecking(true);
      setStatus('checking');
      
      const result = await testConnection();
      setStatus(result.success ? 'online' : 'offline');
      setLastChecked(new Date());
    } catch (error) {
      console.error('Errore durante il controllo della connessione:', error);
      setStatus('offline');
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Controlla la connessione ogni 30 secondi
    const intervalId = setInterval(checkConnection, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatLastChecked = () => {
    if (!lastChecked) return '';
    
    const now = new Date();
    const diffMs = now - lastChecked;
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) {
      return `${diffSec}s fa`;
    } else {
      const diffMin = Math.floor(diffSec / 60);
      return `${diffMin}m fa`;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        className="bg-white rounded-full shadow-lg p-2 flex items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative">
          <motion.div 
            className={`w-3 h-3 rounded-full ${getStatusColor()}`}
            animate={{ 
              boxShadow: status === 'checking' ? 
                ['0 0 0 rgba(0,0,0,0)', '0 0 10px rgba(0,0,0,0.3)', '0 0 0 rgba(0,0,0,0)'] : 
                '0 0 0 rgba(0,0,0,0)'
            }}
            transition={{ duration: 1, repeat: status === 'checking' ? Infinity : 0 }}
          />
        </div>
        
        <div className="ml-2 flex items-center">
          {status === 'online' ? (
            <SafeIcon icon={FiWifi} className="text-green-500 text-sm" />
          ) : status === 'offline' ? (
            <SafeIcon icon={FiWifiOff} className="text-red-500 text-sm" />
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <SafeIcon icon={FiRefreshCw} className="text-yellow-500 text-sm" />
            </motion.div>
          )}
          
          <span className="text-xs text-gray-600 ml-1">
            {status === 'online' ? 'Connesso' : status === 'offline' ? 'Disconnesso' : 'Verifica...'}
          </span>
          
          {lastChecked && (
            <span className="text-xs text-gray-400 ml-1">
              ({formatLastChecked()})
            </span>
          )}
        </div>
        
        <motion.button
          className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          onClick={checkConnection}
          disabled={isChecking}
          whileTap={{ scale: 0.9 }}
        >
          <SafeIcon icon={FiRefreshCw} className="text-xs text-gray-500" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default NetworkStatus;