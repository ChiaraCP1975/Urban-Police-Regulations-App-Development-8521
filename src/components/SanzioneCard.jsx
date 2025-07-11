import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRotateCcw, FiEdit2, FiTrash2, FiEuro } = FiIcons;

const SanzioneCard = ({ sanzione, index, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatPMR = (pmr) => {
    if (!pmr) return '0,00';
    return pmr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Funzione per accorciare il testo
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Determina il colore di sfondo in base alla categoria
  const getCategoryColor = (categoria) => {
    if (!categoria) return 'blue';
    
    const categoryColors = {
      'SICUREZZA URBANA E PUBBLICA INCOLUMITA': 'red',
      'CONVIVENZA CIVILE': 'green',
      'VIVIBILITA': 'blue',
      'IGIENE E PUBBLICO DECORO': 'teal',
      'QUIETE PUBBLICA E TRANQUILLITA': 'purple',
      'MESTIERI, ATTIVITA': 'orange',
      'SICUREZZA E DEGRADO AMBIENTALE': 'amber',
      'MANTENIMENTO DI TERRENI': 'lime',
      'GESTIONE DELLE ACQUE': 'cyan',
      'PASCOLO E CONDUZIONE': 'emerald',
      'RISPETTO DEI BENI': 'indigo'
    };
    
    // Trova la chiave che meglio corrisponde alla categoria
    const matchingKey = Object.keys(categoryColors).find(key => 
      categoria.includes(key)
    );
    
    return matchingKey ? categoryColors[matchingKey] : 'blue';
  };
  
  const categoryColor = getCategoryColor(sanzione.categoria);
  
  // Mappa dei colori di sfondo e testo per le categorie
  const colorMap = {
    'red': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-500' },
    'blue': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-500' },
    'green': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-500' },
    'purple': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-500' },
    'orange': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-500' },
    'amber': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-500' },
    'teal': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-500' },
    'lime': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-600' },
    'cyan': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-500' },
    'emerald': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-500' },
    'indigo': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-500' }
  };

  const categoryClasses = colorMap[categoryColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative w-full h-72 perspective-1000"
    >
      <motion.div 
        className="relative w-full h-full cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Fronte della carta */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl shadow-soft border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
          <div className="p-5 h-full flex flex-col">
            {/* Header con articolo e comma */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 px-3 py-1.5 rounded-lg shadow-inner">
                  <span className="text-sm font-semibold text-gray-700">
                    {sanzione.articolo}
                  </span>
                </div>
                {sanzione.comma && (
                  <div className="bg-gray-50 px-2 py-1 rounded-lg shadow-inner">
                    <span className="text-xs text-gray-600">
                      Comma {sanzione.comma}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <SafeIcon icon={FiRotateCcw} className="text-gray-400 text-lg" />
              </div>
            </div>

            {/* Categoria */}
            {sanzione.categoria && (
              <div className="mb-4">
                <div className={`${categoryClasses.bg} px-3 py-2 rounded-lg border-l-4 ${categoryClasses.border}`}>
                  <span className={`text-xs font-medium ${categoryClasses.text} uppercase tracking-wide`}>
                    {truncateText(sanzione.categoria, 45)}
                  </span>
                </div>
              </div>
            )}

            {/* Descrizione */}
            <div className="flex-1 mb-4 overflow-hidden">
              <h3 className="text-base font-semibold text-gray-800 leading-tight mb-2">
                {truncateText(sanzione.descrizione, 120)}
              </h3>
            </div>

            {/* Footer con azioni e prezzo */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(sanzione);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Modifica"
                >
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sanzione.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Elimina"
                >
                  <SafeIcon icon={FiTrash2} className="text-sm" />
                </button>
              </div>
              <div className="bg-green-50 px-3 py-2 rounded-lg shadow-inner flex items-center space-x-1">
                <SafeIcon icon={FiEuro} className="text-green-600 text-sm" />
                <span className="text-lg font-bold text-green-700">
                  {formatPMR(sanzione.pmr)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Retro della carta */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-xl shadow-soft border border-gray-200 overflow-hidden">
          <div className="p-5 h-full flex flex-col">
            {/* Header dettagli */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 px-3 py-1.5 rounded-lg shadow-inner">
                  <span className="text-sm font-semibold text-gray-700">
                    {sanzione.articolo}
                  </span>
                </div>
                {sanzione.comma && (
                  <div className="bg-gray-50 px-2 py-1 rounded-lg shadow-inner">
                    <span className="text-xs text-gray-600">
                      Comma {sanzione.comma}
                    </span>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <SafeIcon icon={FiRotateCcw} className="text-gray-400 text-lg" />
              </div>
            </div>

            {/* Categoria completa */}
            {sanzione.categoria && (
              <div className="mb-4">
                <div className={`${categoryClasses.bg} px-3 py-2 rounded-lg border-l-4 ${categoryClasses.border}`}>
                  <span className={`text-xs font-medium ${categoryClasses.text} uppercase tracking-wide leading-relaxed`}>
                    {sanzione.categoria}
                  </span>
                </div>
              </div>
            )}

            {/* Contenuto dettagliato */}
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
              {/* PMR */}
              <div className="bg-green-50 px-4 py-3 rounded-lg shadow-inner">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Sanzione Pecuniaria</span>
                  <div className="flex items-center space-x-1">
                    <SafeIcon icon={FiEuro} className="text-green-600 text-sm" />
                    <span className="text-lg font-bold text-green-700">{formatPMR(sanzione.pmr)}</span>
                  </div>
                </div>
              </div>

              {/* Sanzioni Accessorie */}
              {sanzione.sanzioniAccessorie && (
                <div className="bg-orange-50 px-4 py-3 rounded-lg shadow-inner">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">Sanzioni Accessorie</h4>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    {sanzione.sanzioniAccessorie}
                  </p>
                </div>
              )}

              {/* Altro */}
              {sanzione.altro && (
                <div className="bg-gray-50 px-4 py-3 rounded-lg shadow-inner">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Note Aggiuntive</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {sanzione.altro}
                  </p>
                </div>
              )}

              {/* Descrizione completa */}
              <div className={`${categoryClasses.bg} px-4 py-3 rounded-lg shadow-inner`}>
                <h4 className={`text-sm font-semibold ${categoryClasses.text} mb-2`}>Descrizione Completa</h4>
                <p className={`text-sm ${categoryClasses.text} leading-relaxed`}>
                  {sanzione.descrizione}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SanzioneCard;