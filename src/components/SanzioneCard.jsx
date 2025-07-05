import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiRotateCcw, FiEdit2, FiTrash2 } = FiIcons;

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
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
          <div className="p-5 h-full flex flex-col">
            {/* Header con articolo e comma */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  <span className="text-sm font-semibold text-gray-700">
                    {sanzione.articolo}
                  </span>
                </div>
                {sanzione.comma && (
                  <div className="bg-gray-50 px-2 py-1 rounded-md">
                    <span className="text-xs text-gray-600">
                      Comma {sanzione.comma}
                    </span>
                  </div>
                )}
              </div>
              <SafeIcon icon={FiRotateCcw} className="text-gray-400 text-lg" />
            </div>

            {/* Categoria */}
            {sanzione.categoria && (
              <div className="mb-4">
                <div className="bg-blue-50 px-3 py-2 rounded-md border-l-4 border-blue-500">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                    {truncateText(sanzione.categoria, 45)}
                  </span>
                </div>
              </div>
            )}

            {/* Descrizione */}
            <div className="flex-1 mb-4">
              <h3 className="text-base font-semibold text-gray-800 leading-tight mb-2">
                {truncateText(sanzione.descrizione, 120)}
              </h3>
            </div>

            {/* Footer con azioni e prezzo */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(sanzione);
                  }}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="Modifica"
                >
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sanzione.id);
                  }}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Elimina"
                >
                  <SafeIcon icon={FiTrash2} className="text-sm" />
                </button>
              </div>
              <div className="bg-green-50 px-3 py-2 rounded-md">
                <span className="text-lg font-bold text-green-700">
                  € {formatPMR(sanzione.pmr)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Retro della carta */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-5 h-full flex flex-col">
            {/* Header dettagli */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  <span className="text-sm font-semibold text-gray-700">
                    {sanzione.articolo}
                  </span>
                </div>
                {sanzione.comma && (
                  <div className="bg-gray-50 px-2 py-1 rounded-md">
                    <span className="text-xs text-gray-600">
                      Comma {sanzione.comma}
                    </span>
                  </div>
                )}
              </div>
              <SafeIcon icon={FiRotateCcw} className="text-gray-400 text-lg" />
            </div>

            {/* Categoria completa */}
            {sanzione.categoria && (
              <div className="mb-4">
                <div className="bg-blue-50 px-3 py-2 rounded-md border-l-4 border-blue-500">
                  <span className="text-xs font-medium text-blue-700 uppercase tracking-wide leading-relaxed">
                    {sanzione.categoria}
                  </span>
                </div>
              </div>
            )}

            {/* Contenuto dettagliato */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {/* PMR */}
              <div className="bg-green-50 px-4 py-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Sanzione Pecuniaria</span>
                  <span className="text-lg font-bold text-green-700">€ {formatPMR(sanzione.pmr)}</span>
                </div>
              </div>

              {/* Sanzioni Accessorie */}
              {sanzione.sanzioniAccessorie && (
                <div className="bg-orange-50 px-4 py-3 rounded-md">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">Sanzioni Accessorie</h4>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    {sanzione.sanzioniAccessorie}
                  </p>
                </div>
              )}

              {/* Altro */}
              {sanzione.altro && (
                <div className="bg-gray-50 px-4 py-3 rounded-md">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Note Aggiuntive</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {sanzione.altro}
                  </p>
                </div>
              )}

              {/* Descrizione completa */}
              <div className="bg-blue-50 px-4 py-3 rounded-md">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Descrizione Completa</h4>
                <p className="text-sm text-blue-700 leading-relaxed">
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