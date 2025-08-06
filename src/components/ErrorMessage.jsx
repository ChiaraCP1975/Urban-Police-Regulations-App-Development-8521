import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertTriangle, FiRefreshCw, FiDatabase, FiWifi } = FiIcons;

const ErrorMessage = ({ message, onRetry }) => {
  // Determina il tipo di errore per mostrare un messaggio più specifico
  const isConnectionError = message && (
    message.toLowerCase().includes('connessione') ||
    message.toLowerCase().includes('connection') ||
    message.toLowerCase().includes('network')
  );
  
  const isDatabaseError = message && (
    message.toLowerCase().includes('database') ||
    message.toLowerCase().includes('supabase') ||
    message.toLowerCase().includes('query')
  );

  const getErrorIcon = () => {
    if (isConnectionError) return FiWifi;
    if (isDatabaseError) return FiDatabase;
    return FiAlertTriangle;
  };

  const getErrorTitle = () => {
    if (isConnectionError) return 'Errore di Connessione';
    if (isDatabaseError) return 'Errore del Database';
    return 'Errore';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-8 max-w-md mx-auto shadow-soft hover:shadow-md transition-all">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <SafeIcon icon={getErrorIcon()} className="text-red-500 text-7xl" />
          </div>
          <div className="relative z-10 bg-white/50 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto backdrop-blur-sm">
            <SafeIcon icon={getErrorIcon()} className="text-red-500 text-3xl" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-red-800 mb-3">
          {getErrorTitle()}
        </h3>
        
        <p className="text-red-600 mb-4 bg-red-100/50 py-2 px-4 rounded-lg inline-block">
          {message}
        </p>
        
        <div className="bg-white/50 p-4 rounded-lg mb-6 text-left">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Possibili soluzioni:</h4>
          <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
            {isConnectionError && (
              <>
                <li>Verifica la tua connessione a Internet</li>
                <li>Controlla che il server Supabase sia attivo</li>
                <li>Verifica che le credenziali di accesso siano corrette</li>
              </>
            )}
            {isDatabaseError && (
              <>
                <li>Verifica che la tabella 'sanzioni_violations' esista nel database</li>
                <li>Controlla che le credenziali abbiano i permessi necessari</li>
                <li>Assicurati che la struttura della tabella sia corretta</li>
              </>
            )}
            {!isConnectionError && !isDatabaseError && (
              <>
                <li>Ricarica la pagina e riprova</li>
                <li>Verifica la tua connessione a Internet</li>
                <li>Controlla la console per ulteriori dettagli</li>
              </>
            )}
          </ul>
        </div>

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