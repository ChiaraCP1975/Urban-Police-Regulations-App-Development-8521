import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import supabase, { createSanzioniTable, insertExampleData } from '../lib/supabase';

const { FiDatabase, FiCheck, FiAlertTriangle, FiLoader, FiServer } = FiIcons;

const TableCreator = ({ onComplete }) => {
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [creationMethod, setCreationMethod] = useState('direct'); // 'direct', 'rpc', 'rest'

  const maxAttempts = 3;

  // Tenta di verificare la connessione prima di tutto
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Errore di autenticazione Supabase:', error.message);
        } else {
          console.log('Sessione Supabase verificata');
        }
      } catch (err) {
        console.error('Errore durante la verifica della sessione:', err);
      }
    };
    
    checkConnection();
  }, []);

  const verifyTableExists = async () => {
    try {
      // Verifica se la tabella esiste
      const { data, error } = await supabase
        .from('sanzioni_violations')
        .select('count(*)', { count: 'exact', head: true })
        .limit(1);
        
      if (error) {
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Errore nella verifica della tabella:', err);
      return false;
    }
  };

  const createTable = async () => {
    try {
      setStatus('loading');
      setError(null);
      setAttempts(prev => prev + 1);
      
      // Verifica se la tabella esiste già
      const tableExists = await verifyTableExists();
      
      if (tableExists) {
        console.log('La tabella esiste già');
        setStatus('success');
        setResult('La tabella esiste già e può essere utilizzata.');
        onComplete && onComplete(true);
        return;
      }
      
      // Tenta di creare la tabella
      const createResult = await createSanzioniTable();
      
      if (!createResult.success) {
        // Se fallisce e abbiamo esaurito i tentativi, mostra errore
        if (attempts >= maxAttempts) {
          throw new Error(`Impossibile creare la tabella dopo ${maxAttempts} tentativi.`);
        }
        
        // Altrimenti riprova con un altro metodo
        setCreationMethod(prev => prev === 'direct' ? 'rpc' : 'direct');
        setStatus('idle');
        return;
      }

      // Verifica che la tabella sia stata creata
      const tableCreated = await verifyTableExists();
      
      if (!tableCreated) {
        throw new Error('La tabella non è stata creata correttamente.');
      }
      
      // Inserisci dati di esempio
      const insertResult = await insertExampleData();
      
      if (!insertResult.success && !insertResult.skipped) {
        console.warn('Errore nell\'inserimento dei dati di esempio:', insertResult.error);
      }

      setStatus('success');
      setResult('Tabella creata con successo!');
      onComplete && onComplete(true);
    } catch (err) {
      console.error('Errore durante la creazione della tabella:', err);
      setStatus('error');
      setError(err.message || 'Si è verificato un errore durante la creazione della tabella');
    }
  };

  const getMethodLabel = () => {
    if (creationMethod === 'direct') return 'SQL diretto';
    if (creationMethod === 'rpc') return 'Funzione RPC';
    return 'Sconosciuto';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div 
        className="bg-white rounded-2xl shadow-lg max-w-lg w-full m-4 overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5">
          <h2 className="text-xl font-bold flex items-center">
            <SafeIcon icon={FiDatabase} className="mr-2" />
            Inizializzazione Database
          </h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6 text-center">
            <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <SafeIcon 
                icon={
                  status === 'loading' ? FiLoader :
                  status === 'success' ? FiCheck :
                  status === 'error' ? FiAlertTriangle :
                  FiDatabase
                } 
                className={`text-3xl ${
                  status === 'loading' ? 'text-blue-500' :
                  status === 'success' ? 'text-green-500' :
                  status === 'error' ? 'text-red-500' :
                  'text-blue-600'
                }`} 
              />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {status === 'idle' && 'Configurazione Necessaria'}
              {status === 'loading' && 'Creazione tabella in corso...'}
              {status === 'success' && 'Tabella creata con successo!'}
              {status === 'error' && 'Errore di configurazione'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {status === 'idle' && 'È necessario creare la tabella "sanzioni_violations" per memorizzare i dati delle sanzioni.'}
              {status === 'loading' && `Configurazione in corso con metodo: ${getMethodLabel()}...`}
              {status === 'success' && result}
              {status === 'error' && (
                <span className="text-red-600 bg-red-50 px-3 py-2 rounded-lg block mt-2">
                  {error || 'Si è verificato un errore imprevisto.'}
                </span>
              )}
            </p>
            
            {status === 'idle' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-left">
                <div className="flex items-center mb-2">
                  <SafeIcon icon={FiServer} className="text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-700">Stato connessione</h4>
                </div>
                <p className="text-sm text-blue-600">
                  Tentativo di connessione con metodo: <span className="font-semibold">{getMethodLabel()}</span>
                  {attempts > 0 && (
                    <span className="block mt-1">
                      Tentativi precedenti: <span className="font-semibold">{attempts}/{maxAttempts}</span>
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            {status === 'idle' && (
              <motion.button
                onClick={createTable}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiDatabase} className="mr-2" />
                {attempts > 0 ? 'Riprova' : 'Crea Tabella'}
              </motion.button>
            )}
            
            {status === 'loading' && (
              <motion.div
                className="flex items-center bg-blue-100 text-blue-700 px-6 py-2 rounded-lg"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <SafeIcon icon={FiLoader} />
                </motion.div>
                Elaborazione in corso...
              </motion.div>
            )}
            
            {status === 'success' && (
              <motion.button
                onClick={() => onComplete && onComplete(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiCheck} className="mr-2" />
                Continua
              </motion.button>
            )}
            
            {status === 'error' && (
              <motion.button
                onClick={createTable}
                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiAlertTriangle} className="mr-2" />
                Riprova
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TableCreator;