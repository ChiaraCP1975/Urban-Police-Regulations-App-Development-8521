import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiRotateCcw, FiLoader, FiAlertCircle, FiCheck, FiEdit2, FiPlus } = FiIcons;

const ViolazioneForm = ({ isOpen, onClose, onSave, violazione = null, isSubmitting = false }) => {
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
  
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  const categorie = [
    'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'',
    'CONVIVENZA CIVILE',
    'VIVIBILITA\'',
    'IGIENE E PUBBLICO DECORO',
    'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE',
    'MESTIERI, ATTIVITA\' LAVORATIVE E MANIFESTAZIONI',
    'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE',
    'MANTENIMENTO DI TERRENI, FOSSI, ALBERI, PIANTE E ARBUSTI',
    'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE',
    'PASCOLO E CONDUZIONE DI BESTIAME',
    'RISPETTO DEI BENI PRIVATI, COMUNALI, DEMANIALI'
  ];

  useEffect(() => {
    if (violazione) {
      setFormData({
        articolo: violazione.articolo || '',
        comma: violazione.comma || '',
        categoria: violazione.categoria || '',
        descrizione: violazione.descrizione || '',
        pmr: violazione.pmr || '',
        sanzioniAccessorie: violazione.sanzioniAccessorie || violazione.sanzioni_accessorie || '',
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
    setErrors({});
    setFormTouched(false);
  }, [violazione, isOpen]);

  // Validazione del form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.articolo.trim()) {
      newErrors.articolo = 'L\'articolo è richiesto';
    }
    
    if (!formData.categoria) {
      newErrors.categoria = 'La categoria è richiesta';
    }
    
    if (!formData.descrizione.trim()) {
      newErrors.descrizione = 'La descrizione è richiesta';
    }
    
    if (!formData.pmr.trim()) {
      newErrors.pmr = 'Il PMR è richiesto';
    } else if (!/^[0-9,.]+$/.test(formData.pmr)) {
      newErrors.pmr = 'Inserire solo numeri e virgole';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormTouched(true);
    
    if (validateForm()) {
      onSave({
        ...formData,
        pmr: formData.pmr.replace(/[^\d,]/g, '')
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (formTouched) {
      // Validazione in tempo reale dopo il primo tentativo di invio
      validateForm();
    }
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            {violazione ? (
              <>
                <span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2">
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </span>
                Modifica Violazione
              </>
            ) : (
              <>
                <span className="bg-green-100 text-green-700 p-1 rounded-full mr-2">
                  <SafeIcon icon={FiPlus} className="text-sm" />
                </span>
                Inserisci Violazione
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
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
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-inner">
                <div className="h-full flex flex-col">
                  {/* Header con flip button */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="bg-blue-100 text-blue-700 p-1 rounded-full mr-2">
                        <SafeIcon icon={FiCheck} className="text-sm" />
                      </span>
                      Dati Principali
                    </h3>
                    <button
                      type="button"
                      onClick={handleCardFlip}
                      disabled={isSubmitting}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                      title="Dettagli aggiuntivi"
                    >
                      <SafeIcon icon={FiRotateCcw} className="text-lg" />
                    </button>
                  </div>

                  {/* Campi principali */}
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          Articolo *
                          {errors.articolo && (
                            <span className="ml-1 text-red-500" title={errors.articolo}>
                              <SafeIcon icon={FiAlertCircle} className="text-xs" />
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          placeholder="Art. 15"
                          value={formData.articolo}
                          onChange={(e) => handleInputChange('articolo', e.target.value)}
                          className={`w-full px-3 py-2 border ${errors.articolo ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          required
                          disabled={isSubmitting}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {errors.articolo && (
                          <p className="mt-1 text-xs text-red-500">{errors.articolo}</p>
                        )}
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          disabled={isSubmitting}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                          PMR (€) *
                          {errors.pmr && (
                            <span className="ml-1 text-red-500" title={errors.pmr}>
                              <SafeIcon icon={FiAlertCircle} className="text-xs" />
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          placeholder="0,00"
                          value={formData.pmr}
                          onChange={(e) => handleInputChange('pmr', e.target.value)}
                          className={`w-full px-3 py-2 border ${errors.pmr ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                          required
                          disabled={isSubmitting}
                          onClick={(e) => e.stopPropagation()}
                        />
                        {errors.pmr && (
                          <p className="mt-1 text-xs text-red-500">{errors.pmr}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        Categoria *
                        {errors.categoria && (
                          <span className="ml-1 text-red-500" title={errors.categoria}>
                            <SafeIcon icon={FiAlertCircle} className="text-xs" />
                          </span>
                        )}
                      </label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => handleInputChange('categoria', e.target.value)}
                        className={`w-full px-3 py-2 border ${errors.categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none`}
                        required
                        disabled={isSubmitting}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="">Seleziona categoria...</option>
                        {categorie.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.categoria && (
                        <p className="mt-1 text-xs text-red-500">{errors.categoria}</p>
                      )}
                      <div className="relative">
                        <div className="absolute right-3 top-1/2 transform -translate-y-8 pointer-events-none text-gray-500">
                          <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        Descrizione *
                        {errors.descrizione && (
                          <span className="ml-1 text-red-500" title={errors.descrizione}>
                            <SafeIcon icon={FiAlertCircle} className="text-xs" />
                          </span>
                        )}
                      </label>
                      <textarea
                        placeholder="Descrivi la violazione..."
                        value={formData.descrizione}
                        onChange={(e) => handleInputChange('descrizione', e.target.value)}
                        className={`w-full h-32 px-3 py-2 border ${errors.descrizione ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                        required
                        disabled={isSubmitting}
                        onClick={(e) => e.stopPropagation()}
                      />
                      {errors.descrizione && (
                        <p className="mt-1 text-xs text-red-500">{errors.descrizione}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Retro della carta */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gray-50 rounded-xl border border-gray-200 p-5 shadow-inner">
                <div className="h-full flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="bg-purple-100 text-purple-700 p-1 rounded-full mr-2">
                        <SafeIcon icon={FiPlus} className="text-sm" />
                      </span>
                      Dettagli Aggiuntivi
                    </h3>
                    <button
                      type="button"
                      onClick={handleCardFlip}
                      disabled={isSubmitting}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                      title="Torna ai dati principali"
                    >
                      <SafeIcon icon={FiRotateCcw} className="text-lg" />
                    </button>
                  </div>

                  {/* Campi aggiuntivi */}
                  <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sanzioni Accessorie
                      </label>
                      <textarea
                        placeholder="Sequestro, fermo, punti patente..."
                        value={formData.sanzioniAccessorie}
                        onChange={(e) => handleInputChange('sanzioniAccessorie', e.target.value)}
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        disabled={isSubmitting}
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
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 flex items-center"
            >
              <SafeIcon icon={FiX} className="mr-2" />
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <SafeIcon icon={FiLoader} className="mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiSave} className="mr-2" />
                  Salva
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ViolazioneForm;