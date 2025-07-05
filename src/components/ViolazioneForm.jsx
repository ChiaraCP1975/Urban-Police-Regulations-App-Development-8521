import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiRotateCcw } = FiIcons;

const ViolazioneForm = ({ isOpen, onClose, onSave, violazione = null }) => {
  const [formData, setFormData] = useState({
    articolo: '',
    comma: '',
    categoria: '',
    descrizione: '',
    pmr: '',
    sanzioniAccessorie: '',
    altro: ''
  });

  const [isFlipped, setIsFlipped] = useState(false);

  const categorie = [
    'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'',
    'CONVIVENZA CIVILE',
    'VIVIBILITA\'',
    'IGIENE E PUBBLICO DECORO',
    'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE',
    'MESTIERI,ATTIVITA\' LAVORATIVE E MANIFESTAZIONI',
    'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE',
    'MANTENIMENTO DI TERRENI,FOSSI,ALBERI,PIANTE E ARBUSTI',
    'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE',
    'PASCOLO E CONDUZIONE DI BESTIAME',
    'RISPETTO DEI BENI PRIVATI,COMUNALI,DEMANIALI'
  ];

  useEffect(() => {
    if (violazione) {
      setFormData({
        articolo: violazione.articolo || '',
        comma: violazione.comma || '',
        categoria: violazione.categoria || '',
        descrizione: violazione.descrizione || '',
        pmr: violazione.pmr || '',
        sanzioniAccessorie: violazione.sanzioniAccessorie || '',
        altro: violazione.altro || ''
      });
    } else {
      setFormData({
        articolo: '',
        comma: '',
        categoria: '',
        descrizione: '',
        pmr: '',
        sanzioniAccessorie: '',
        altro: ''
      });
    }
    setIsFlipped(false);
  }, [violazione, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.articolo && formData.descrizione && formData.pmr) {
      onSave({
        ...formData,
        id: violazione ? violazione.id : Date.now(),
        pmr: formData.pmr.replace(/[^\d,]/g, '')
      });
      onClose();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCardFlip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {violazione ? 'Modifica Violazione' : 'Inserisci Violazione'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <SafeIcon icon={FiX} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="relative w-full h-96 perspective-1000 mb-6">
            <motion.div
              className="relative w-full h-full preserve-3d"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Fronte della carta */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gray-50 rounded-lg border border-gray-200 p-5">
                <div className="h-full flex flex-col">
                  {/* Header con flip button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Dati Principali</h3>
                    <button
                      type="button"
                      onClick={handleCardFlip}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      title="Dettagli aggiuntivi"
                    >
                      <SafeIcon icon={FiRotateCcw} className="text-lg" />
                    </button>
                  </div>

                  {/* Campi principali */}
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Articolo *
                        </label>
                        <input
                          type="text"
                          placeholder="Art. 15"
                          value={formData.articolo}
                          onChange={(e) => handleInputChange('articolo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comma
                        </label>
                        <input
                          type="text"
                          placeholder="1"
                          value={formData.comma}
                          onChange={(e) => handleInputChange('comma', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PMR (€) *
                        </label>
                        <input
                          type="text"
                          placeholder="0,00"
                          value={formData.pmr}
                          onChange={(e) => handleInputChange('pmr', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => handleInputChange('categoria', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Seleziona categoria...</option>
                        {categorie.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrizione *
                      </label>
                      <textarea
                        placeholder="Descrivi la violazione..."
                        value={formData.descrizione}
                        onChange={(e) => handleInputChange('descrizione', e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        required
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Retro della carta */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gray-50 rounded-lg border border-gray-200 p-5">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Dettagli Aggiuntivi</h3>
                    <button
                      type="button"
                      onClick={handleCardFlip}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                      title="Torna ai dati principali"
                    >
                      <SafeIcon icon={FiRotateCcw} className="text-lg" />
                    </button>
                  </div>

                  {/* Campi aggiuntivi */}
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sanzioni Accessorie
                      </label>
                      <textarea
                        placeholder="Sequestro,fermo,punti patente..."
                        value={formData.sanzioniAccessorie}
                        onChange={(e) => handleInputChange('sanzioniAccessorie', e.target.value)}
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Note Aggiuntive
                      </label>
                      <textarea
                        placeholder="Altre informazioni..."
                        value={formData.altro}
                        onChange={(e) => handleInputChange('altro', e.target.value)}
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <SafeIcon icon={FiSave} className="mr-2" />
              Salva
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ViolazioneForm;