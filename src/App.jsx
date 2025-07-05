import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatsBar from './components/StatsBar';
import ActionButtons from './components/ActionButtons';
import SanzioneCard from './components/SanzioneCard';
import ViolazioneForm from './components/ViolazioneForm';
import { sanzioni as initialSanzioni } from './data/sanzioni';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sanzioni, setSanzioni] = useState(initialSanzioni);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingViolazione, setEditingViolazione] = useState(null);

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
        sanzione.descrizione.toLowerCase().includes(term) ||
        sanzione.articolo.toLowerCase().includes(term) ||
        sanzione.comma?.toLowerCase().includes(term) ||
        sanzione.categoria?.toLowerCase().includes(term) ||
        sanzione.sanzioniAccessorie?.toLowerCase().includes(term) ||
        sanzione.altro?.toLowerCase().includes(term)
      );
    }

    return filtered;
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

  const handleSaveViolazione = (violazioneData) => {
    if (editingViolazione) {
      setSanzioni(prev => 
        prev.map(s => s.id === editingViolazione.id ? violazioneData : s)
      );
    } else {
      setSanzioni(prev => [...prev, violazioneData]);
    }
    setIsFormOpen(false);
    setEditingViolazione(null);
  };

  const handleDeleteViolazione = (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questa violazione?')) {
      setSanzioni(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingViolazione(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          totalSanzioni={sanzioni.length}
          filteredSanzioni={filteredSanzioni.length}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

        <ActionButtons onAddViolazione={handleAddViolazione} />

        {filteredSanzioni.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {sanzioni.length === 0 ? 'Nessuna violazione presente' : 'Nessun risultato trovato'}
              </h3>
              <p className="text-gray-500 mb-4">
                {sanzioni.length === 0 
                  ? 'Inizia aggiungendo la prima violazione' 
                  : 'Prova a modificare i termini di ricerca o i filtri'
                }
              </p>
              {sanzioni.length === 0 ? (
                <button
                  onClick={handleAddViolazione}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Inserisci Prima Violazione
                </button>
              ) : (
                <button
                  onClick={handleClearSearch}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mostra tutte le violazioni
                </button>
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
            {filteredSanzioni.map((sanzione, index) => (
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
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Prontuario Sanzioni - Regolamento di Polizia Urbana e Rurale
          </p>
        </div>
      </footer>

      <ViolazioneForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveViolazione}
        violazione={editingViolazione}
      />
    </div>
  );
}

export default App;