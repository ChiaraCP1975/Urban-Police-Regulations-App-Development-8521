import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsBar from './components/StatsBar';
import ActionButtons from './components/ActionButtons';
import SanzioneCard from './components/SanzioneCard';
import ViolazioneForm from './components/ViolazioneForm';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import NetworkStatus from './components/NetworkStatus';
import TableCreator from './components/TableCreator';

import { useSanzioni } from './hooks/useSanzioni';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingViolazione, setEditingViolazione] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tableExists, setTableExists] = useState(true);
  
  const {
    sanzioni,
    loading,
    error,
    connected,
    saveSanzione,
    updateSanzione,
    deleteSanzione,
    refreshSanzioni,
    checkTableExists
  } = useSanzioni();

  useEffect(() => {
    const verifyTable = async () => {
      const exists = await checkTableExists();
      setTableExists(exists);
    };
    
    verifyTable();
  }, [checkTableExists]);

  // Funzione per ordinare anche i risultati filtrati
  const sortSanzioni = (sanzioniArray) => {
    if (!Array.isArray(sanzioniArray) || sanzioniArray.length === 0) {
      return [];
    }

    return sanzioniArray.sort((a, b) => {
      // Estrai il numero dell'articolo (rimuovi "Art. " e converti in numero)
      const getArticoloNumber = (articolo) => {
        if (!articolo) return 0;
        const match = articolo.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      // Estrai il numero del comma (converti in numero, se vuoto considera 0)
      const getCommaNumber = (comma) => {
        if (!comma) return 0;
        const match = comma.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };

      const articoloA = getArticoloNumber(a.articolo);
      const articoloB = getArticoloNumber(b.articolo);

      // Prima ordina per articolo
      if (articoloA !== articoloB) {
        return articoloA - articoloB;
      }

      // Se l'articolo è lo stesso, ordina per comma
      const commaA = getCommaNumber(a.comma);
      const commaB = getCommaNumber(b.comma);
      return commaA - commaB;
    });
  };

  const filteredSanzioni = useMemo(() => {
    let filtered = sanzioni;
    
    if (selectedCategory) {
      filtered = filtered.filter(sanzione => 
        sanzione.categoria === selectedCategory
      );
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sanzione => 
        (sanzione.descrizione || '').toLowerCase().includes(term) ||
        (sanzione.articolo || '').toLowerCase().includes(term) ||
        (sanzione.comma || '').toLowerCase().includes(term) ||
        (sanzione.categoria || '').toLowerCase().includes(term) ||
        (sanzione.sanzioni_accessorie || '').toLowerCase().includes(term) ||
        (sanzione.altro || '').toLowerCase().includes(term)
      );
    }
    
    // Ordina anche i risultati filtrati
    return sortSanzioni([...filtered]);
  }, [searchTerm, selectedCategory, sanzioni]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  const handleAddViolazione = () => {
    setEditingViolazione(null);
    setIsFormOpen(true);
  };

  const handleEditViolazione = (violazione) => {
    setEditingViolazione(violazione);
    setIsFormOpen(true);
  };

  const handleSaveViolazione = async (violazioneData) => {
    try {
      setIsSubmitting(true);
      
      if (editingViolazione) {
        await updateSanzione(editingViolazione.id, violazioneData);
      } else {
        await saveSanzione(violazioneData);
      }
      
      setIsFormOpen(false);
      setEditingViolazione(null);
    } catch (err) {
      console.error('Error saving violazione:', err);
      alert('Errore nel salvare la violazione. Riprova.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteViolazione = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa violazione?')) {
      try {
        await deleteSanzione(id);
      } catch (err) {
        console.error('Error deleting violazione:', err);
        alert('Errore nell\'eliminare la violazione. Riprova.');
      }
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingViolazione(null);
  };

  const handleTableCreated = () => {
    setTableExists(true);
    refreshSanzioni();
  };

  // Converti i dati per compatibilità con i componenti esistenti
  const convertedSanzioni = sanzioni.map(sanzione => ({
    ...sanzione,
    sanzioniAccessorie: sanzione.sanzioni_accessorie
  }));

  const convertedFiltered = filteredSanzioni.map(sanzione => ({
    ...sanzione,
    sanzioniAccessorie: sanzione.sanzioni_accessorie
  }));

  // Se la tabella non esiste, mostra il componente per crearla
  if (!tableExists) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSpinner />
        </main>
        <TableCreator onComplete={handleTableCreated} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSpinner />
        </main>
        <NetworkStatus />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <ErrorMessage message={error} onRetry={refreshSanzioni} />
        </main>
        <NetworkStatus />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onClear={handleClearSearch}
        />
        
        <StatsBar
          totalSanzioni={convertedSanzioni.length}
          filteredSanzioni={convertedFiltered.length}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />
        
        <ActionButtons onAddViolazione={handleAddViolazione} />
        
        <AnimatePresence>
          {convertedFiltered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-8 max-w-md mx-auto hover:shadow-md transition-all">
                <div className="bg-gray-100 p-6 rounded-full inline-block mb-4">
                  <div className="text-gray-400 text-5xl">📋</div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  {convertedSanzioni.length === 0 ? 'Nessuna violazione presente' : 'Nessun risultato trovato'}
                </h3>
                
                <p className="text-gray-500 mb-6">
                  {convertedSanzioni.length === 0 ? 
                    'Inizia aggiungendo la prima violazione' : 
                    'Prova a modificare i termini di ricerca o i filtri'}
                </p>
                
                {convertedSanzioni.length === 0 ? (
                  <motion.button
                    onClick={handleAddViolazione}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Inserisci Prima Violazione
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleClearSearch}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Mostra tutte le violazioni
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {convertedFiltered.map((sanzione, index) => (
                <SanzioneCard
                  key={sanzione.id}
                  sanzione={sanzione}
                  index={index}
                  onEdit={handleEditViolazione}
                  onDelete={handleDeleteViolazione}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Prontuario Sanzioni - Regolamento di Polizia Urbana e Rurale
          </p>
        </div>
      </footer>
      
      <AnimatePresence>
        {isFormOpen && (
          <ViolazioneForm
            isOpen={isFormOpen}
            onClose={handleCloseForm}
            onSave={handleSaveViolazione}
            violazione={editingViolazione}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
      
      <NetworkStatus />
    </div>
  );
}

export default App;