import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiAlertTriangle } = FiIcons;

const ViolazioneForm = ({ isOpen, onClose, onSave, violazione, isSubmitting }) => {
  // Elenco categorie standardizzato per tutto l'applicativo
  const categorie = [
    { value: 'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'', label: 'Sicurezza Urbana e Pubblica Incolumità', color: 'red' },
    { value: 'CONVIVENZA CIVILE', label: 'Convivenza Civile', color: 'emerald' },
    { value: 'VIVIBILITA\'', label: 'Vivibilità', color: 'blue' },
    { value: 'IGIENE E PUBBLICO DECORO', label: 'Igiene e Pubblico Decoro', color: 'teal' },
    { value: 'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE', label: 'Quiete Pubblica e Tranquillità', color: 'purple' },
    { value: 'MESTIERI, ATTIVITA\' LAVORATIVE E MANIFESTAZIONI', label: 'Mestieri, Attività Lavorative e Manifestazioni', color: 'orange' },
    { value: 'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE', label: 'Sicurezza e Degrado Ambientale Rurale', color: 'amber' },
    { value: 'MANTENIMENTO DI TERRENI, FOSSI, ALBERI, PIANTE E ARBUSTI', label: 'Mantenimento Terreni, Fossi, Alberi e Piante', color: 'lime' },
    { value: 'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE', label: 'Gestione delle Acque Piovane ed Irrigue', color: 'cyan' },
    { value: 'PASCOLO E CONDUZIONE DI BESTIAME', label: 'Pascolo e Conduzione di Bestiame', color: 'green' },
    { value: 'RISPETTO DEI BENI PRIVATI, COMUNALI, DEMANIALI', label: 'Rispetto dei Beni Privati, Comunali, Demaniali', color: 'indigo' }
  ];

  const [formData, setFormData] = useState({
    articolo: '',
    comma: '',
    categoria: categorie[0].value,
    descrizione: '',
    pmr: '',
    sanzioniAccessorie: '',
    altro: ''
  });

  const [errors, setErrors] = useState({});

  // Imposta i dati del form quando si sta modificando una violazione esistente
  useEffect(() => {
    if (violazione) {
      setFormData({
        articolo: violazione.articolo || '',
        comma: violazione.comma || '',
        categoria: violazione.categoria || categorie[0].value,
        descrizione: violazione.descrizione || '',
        pmr: violazione.pmr || '',
        sanzioniAccessorie: violazione.sanzioniAccessorie || violazione.sanzioni_accessorie || '',
        altro: violazione.altro || ''
      });
    } else {
      // Reset per una nuova violazione
      setFormData({
        articolo: '',
        comma: '',
        categoria: categorie[0].value,
        descrizione: '',
        pmr: '',
        sanzioniAccessorie: '',
        altro: ''
      });
    }
    setErrors({});
  }, [violazione]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Rimuovi l'errore quando l'utente modifica il campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.articolo.trim()) {
      newErrors.articolo = "L'articolo è obbligatorio";
    }
    
    if (!formData.descrizione.trim()) {
      newErrors.descrizione = "La descrizione è obbligatoria";
    }
    
    if (!formData.pmr) {
      newErrors.pmr = "L'importo PMR è obbligatorio";
    } else if (isNaN(formData.pmr) || parseFloat(formData.pmr) < 0) {
      newErrors.pmr = "Inserisci un importo valido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSave({
      ...formData,
      pmr: parseFloat(formData.pmr)
    });
  };

  const getCategoryOptionStyle = (categoria) => {
    const colorMap = {
      'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'': 'text-red-700',
      'CONVIVENZA CIVILE': 'text-emerald-700',
      'VIVIBILITA\'': 'text-blue-700',
      'IGIENE E PUBBLICO DECORO': 'text-teal-700',
      'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE': 'text-purple-700',
      'MESTIERI, ATTIVITA\' LAVORATIVE E MANIFESTAZIONI': 'text-orange-700',
      'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE': 'text-amber-700',
      'MANTENIMENTO DI TERRENI, FOSSI, ALBERI, PIANTE E ARBUSTI': 'text-lime-700',
      'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE': 'text-cyan-700',
      'PASCOLO E CONDUZIONE DI BESTIAME': 'text-green-700',
      'RISPETTO DEI BENI PRIVATI, COMUNALI, DEMANIALI': 'text-indigo-700'
    };
    
    return colorMap[categoria] || 'text-gray-700';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto">
          <motion.div 
            className="bg-white rounded-2xl shadow-lg w-full max-w-3xl m-4 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 rounded-t-2xl">
              <h2 className="text-xl font-bold">
                {violazione ? 'Modifica Violazione' : 'Nuova Violazione'}
              </h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                disabled={isSubmitting}
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Articolo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Articolo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="articolo"
                    placeholder="Es: Art. 7"
                    value={formData.articolo}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.articolo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.articolo && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <SafeIcon icon={FiAlertTriangle} className="mr-1" />
                      {errors.articolo}
                    </p>
                  )}
                </div>

                {/* Comma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comma
                  </label>
                  <input
                    type="text"
                    name="comma"
                    placeholder="Es: 1"
                    value={formData.comma}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Categoria */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    {categorie.map(cat => (
                      <option 
                        key={cat.value} 
                        value={cat.value}
                        className={getCategoryOptionStyle(cat.value)}
                      >
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descrizione */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrizione <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="descrizione"
                    placeholder="Descrizione dettagliata della violazione..."
                    value={formData.descrizione}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.descrizione ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {errors.descrizione && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <SafeIcon icon={FiAlertTriangle} className="mr-1" />
                      {errors.descrizione}
                    </p>
                  )}
                </div>

                {/* PMR */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PMR (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">€</span>
                    </div>
                    <input
                      type="number"
                      name="pmr"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.pmr}
                      onChange={handleChange}
                      className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.pmr ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.pmr && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <SafeIcon icon={FiAlertTriangle} className="mr-1" />
                      {errors.pmr}
                    </p>
                  )}
                </div>
              </div>

              {/* Campi aggiuntivi */}
              <div className="space-y-6 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Informazioni aggiuntive
                </h3>

                {/* Sanzioni Accessorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sanzioni Accessorie
                  </label>
                  <textarea
                    name="sanzioniAccessorie"
                    placeholder="Eventuali sanzioni accessorie..."
                    value={formData.sanzioniAccessorie}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>

                {/* Altro */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note Aggiuntive
                  </label>
                  <textarea
                    name="altro"
                    placeholder="Eventuali note aggiuntive..."
                    value={formData.altro}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center space-x-2 shadow-md disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  <SafeIcon icon={FiSave} />
                  <span>{isSubmitting ? 'Salvataggio...' : 'Salva'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViolazioneForm;