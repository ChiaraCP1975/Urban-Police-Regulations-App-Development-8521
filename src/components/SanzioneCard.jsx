import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { getCategoryColor } from '../utils/categoryUtils';

const { FiRotateCcw, FiEdit2, FiTrash2 } = FiIcons;

const SanzioneCard = ({ sanzione, index, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatPMR = (pmr) => {
    if (!pmr) return '€ 0,00';
    return `€ ${pmr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  // Ottieni il colore della categoria
  const categoryColor = getCategoryColor(sanzione.categoria);
  
  const colorMap = {
    'red': {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-500',
      badge: 'bg-red-100 text-red-700 border-red-300',
      shadow: 'shadow-red-100'
    },
    'blue': {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-500',
      badge: 'bg-blue-100 text-blue-700 border-blue-300',
      shadow: 'shadow-blue-100'
    },
    'emerald': {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      shadow: 'shadow-emerald-100'
    },
    'purple': {
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-500',
      badge: 'bg-purple-100 text-purple-700 border-purple-300',
      shadow: 'shadow-purple-100'
    },
    'orange': {
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-500',
      badge: 'bg-orange-100 text-orange-700 border-orange-300',
      shadow: 'shadow-orange-100'
    },
    'amber': {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-500',
      badge: 'bg-amber-100 text-amber-700 border-amber-300',
      shadow: 'shadow-amber-100'
    },
    'teal': {
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-500',
      badge: 'bg-teal-100 text-teal-700 border-teal-300',
      shadow: 'shadow-teal-100'
    },
    'lime': {
      bg: 'bg-lime-50',
      text: 'text-lime-800',
      border: 'border-lime-500',
      badge: 'bg-lime-100 text-lime-700 border-lime-300',
      shadow: 'shadow-lime-100'
    },
    'cyan': {
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-500',
      badge: 'bg-cyan-100 text-cyan-700 border-cyan-300',
      shadow: 'shadow-cyan-100'
    },
    'green': {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-500',
      badge: 'bg-green-100 text-green-700 border-green-300',
      shadow: 'shadow-green-100'
    },
    'indigo': {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-500',
      badge: 'bg-indigo-100 text-indigo-700 border-indigo-300',
      shadow: 'shadow-indigo-100'
    },
    'slate': {
      bg: 'bg-slate-50',
      text: 'text-slate-800',
      border: 'border-slate-500',
      badge: 'bg-slate-100 text-slate-700 border-slate-300',
      shadow: 'shadow-slate-100'
    }
  };

  const categoryClasses = colorMap[categoryColor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative w-full h-80 perspective-1000"
    >
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Fronte della carta - Sfondo più scuro */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 rounded-xl shadow-soft border border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden backdrop-blur-sm">
          <div className="p-5 h-full flex flex-col">
            {/* Header con articolo e comma */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-inner border border-blue-200">
                  <span className="text-sm font-semibold text-gray-700">
                    {sanzione.articolo}
                  </span>
                </div>
                
                {sanzione.comma && (
                  <div className="bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg shadow-inner border border-blue-200">
                    <span className="text-xs text-gray-600">
                      Comma {sanzione.comma}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-1.5 rounded-full hover:bg-white/80 transition-colors border border-blue-300">
                <SafeIcon icon={FiRotateCcw} className="text-blue-600 text-lg" />
              </div>
            </div>
            
            {/* Categoria con colori distintivi */}
            {sanzione.categoria && (
              <div className="mb-3 flex-shrink-0">
                <div className={`${categoryClasses.bg}/90 backdrop-blur-sm px-3 py-2 rounded-lg border-l-4 ${categoryClasses.border} transition-all hover:shadow-md border border-white/30`}>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${categoryClasses.badge}/90 backdrop-blur-sm border leading-relaxed`}>
                    {sanzione.categoria}
                  </div>
                </div>
              </div>
            )}
            
            {/* Descrizione con scrollbar */}
            <div className="flex-1 mb-3 min-h-0">
              <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200 hover:scrollbar-thumb-blue-600">
                <h3 className="text-sm font-semibold text-gray-800 leading-relaxed">
                  {sanzione.descrizione}
                </h3>
              </div>
            </div>
            
            {/* Footer con azioni e prezzo */}
            <div className="flex items-center justify-between pt-3 border-t border-blue-300 flex-shrink-0">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(sanzione);
                  }}
                  className="p-2 text-blue-700 hover:text-blue-800 hover:bg-blue-200/80 backdrop-blur-sm rounded-lg transition-colors border border-blue-300"
                  title="Modifica"
                >
                  <SafeIcon icon={FiEdit2} className="text-sm" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(sanzione.id);
                  }}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-200/80 backdrop-blur-sm rounded-lg transition-colors border border-red-300"
                  title="Elimina"
                >
                  <SafeIcon icon={FiTrash2} className="text-sm" />
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-green-200 to-emerald-200 backdrop-blur-sm px-3 py-2 rounded-lg shadow-inner border border-green-300">
                <span className="text-lg font-bold text-green-800">
                  {formatPMR(sanzione.pmr)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Retro della carta - Sfondo più scuro */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-sky-200 via-blue-100 to-cyan-200 rounded-xl shadow-soft border border-blue-300 overflow-hidden backdrop-blur-sm">
          <div className="p-5 h-full flex flex-col">
            {/* Header dettagli */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-inner border border-blue-200">
                  <span className="text-sm font-semibold text-gray-700">
                    {sanzione.articolo}
                  </span>
                </div>
                
                {sanzione.comma && (
                  <div className="bg-white/60 backdrop-blur-sm px-2 py-1 rounded-lg shadow-inner border border-blue-200">
                    <span className="text-xs text-gray-600">
                      Comma {sanzione.comma}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm p-1.5 rounded-full hover:bg-white/80 transition-colors border border-blue-300">
                <SafeIcon icon={FiRotateCcw} className="text-blue-600 text-lg" />
              </div>
            </div>
            
            {/* Categoria completa con colori distintivi */}
            {sanzione.categoria && (
              <div className="mb-4">
                <div className={`${categoryClasses.bg}/90 backdrop-blur-sm px-3 py-2 rounded-lg border-l-4 ${categoryClasses.border} transition-all hover:shadow-md border border-white/30`}>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${categoryClasses.badge}/90 backdrop-blur-sm border leading-relaxed`}>
                    {sanzione.categoria}
                  </div>
                </div>
              </div>
            )}
            
            {/* Contenuto dettagliato */}
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-200 hover:scrollbar-thumb-blue-600 pr-2">
              {/* PMR */}
              <div className="bg-gradient-to-r from-green-200/90 to-emerald-200/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-inner border border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-green-800">Sanzione Pecuniaria</span>
                  <span className="text-lg font-bold text-green-800">
                    {formatPMR(sanzione.pmr)}
                  </span>
                </div>
              </div>
              
              {/* Sanzioni Accessorie */}
              {sanzione.sanzioniAccessorie && (
                <div className="bg-gradient-to-r from-orange-200/90 to-amber-200/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-inner border border-orange-300">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">Sanzioni Accessorie</h4>
                  <p className="text-sm text-orange-800 leading-relaxed">
                    {sanzione.sanzioniAccessorie}
                  </p>
                </div>
              )}
              
              {/* Altro */}
              {sanzione.altro && (
                <div className="bg-gradient-to-r from-gray-200/90 to-slate-200/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-inner border border-gray-300">
                  <h4 className="text-sm font-semibold text-gray-800 mb-2">Note Aggiuntive</h4>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {sanzione.altro}
                  </p>
                </div>
              )}
              
              {/* Descrizione completa con colori categoria */}
              <div className={`${categoryClasses.bg}/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-inner border border-white/30`}>
                <h4 className={`text-sm font-semibold ${categoryClasses.text} mb-2`}>Descrizione Completa</h4>
                <p className={`text-sm text-gray-800 leading-relaxed`}>
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