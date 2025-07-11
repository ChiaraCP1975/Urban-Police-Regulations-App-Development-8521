import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiFileText, FiSearch, FiFilter } = FiIcons;

const StatsBar = ({ totalSanzioni, filteredSanzioni, searchTerm, selectedCategory }) => {
  const truncateCategory = (category, maxLength = 40) => {
    if (!category) return '';
    if (category.length <= maxLength) return category;
    return category.substring(0, maxLength) + '...';
  };

  // Funzione standardizzata per ottenere il colore della categoria
  const getCategoryColor = (categoria) => {
    if (!categoria) return 'gray';
    
    const categoryColors = {
      'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'': 'red',
      'CONVIVENZA CIVILE': 'emerald',
      'VIVIBILITA\'': 'blue',
      'IGIENE E PUBBLICO DECORO': 'teal',
      'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE': 'purple',
      'MESTIERI, ATTIVITA\' LAVORATIVE E MANIFESTAZIONI': 'orange',
      'MESTIERI,ATTIVITA\' LAVORATIVE E MANIFESTAZIONI': 'orange', // Variante senza spazio
      'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE': 'amber',
      'MANTENIMENTO DI TERRENI, FOSSI, ALBERI, PIANTE E ARBUSTI': 'lime',
      'MANTENIMENTO DI TERRENI,FOSSI,ALBERI,PIANTE E ARBUSTI': 'lime', // Variante senza spazi
      'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE': 'cyan',
      'PASCOLO E CONDUZIONE DI BESTIAME': 'green',
      'RISPETTO DEI BENI PRIVATI, COMUNALI, DEMANIALI': 'indigo',
      'RISPETTO DEI BENI PRIVATI,COMUNALI,DEMANIALI': 'indigo' // Variante senza spazi
    };

    // Cerca prima una corrispondenza esatta
    if (categoryColors[categoria]) {
      return categoryColors[categoria];
    }

    // Se non trova corrispondenza esatta, cerca per parole chiave
    const normalizedCategory = categoria.toLowerCase();
    
    if (normalizedCategory.includes('mestieri') || normalizedCategory.includes('attivita') || normalizedCategory.includes('lavorative')) {
      return 'orange';
    }
    if (normalizedCategory.includes('mantenimento') || normalizedCategory.includes('terreni') || normalizedCategory.includes('fossi')) {
      return 'lime';
    }
    if (normalizedCategory.includes('rispetto') || normalizedCategory.includes('beni')) {
      return 'indigo';
    }

    return 'gray';
  };

  const getCategoryBadgeClasses = (color) => {
    const colorMap = {
      'red': 'bg-red-100 text-red-700 border-red-300',
      'emerald': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'blue': 'bg-blue-100 text-blue-700 border-blue-300',
      'teal': 'bg-teal-100 text-teal-700 border-teal-300',
      'purple': 'bg-purple-100 text-purple-700 border-purple-300',
      'orange': 'bg-orange-100 text-orange-700 border-orange-300',
      'amber': 'bg-amber-100 text-amber-700 border-amber-300',
      'lime': 'bg-lime-100 text-lime-700 border-lime-300',
      'cyan': 'bg-cyan-100 text-cyan-700 border-cyan-300',
      'green': 'bg-green-100 text-green-700 border-green-300',
      'indigo': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'gray': 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const categoryColor = getCategoryColor(selectedCategory);
  const categoryBadgeClasses = getCategoryBadgeClasses(categoryColor);

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-4 mb-6 slide-up transition-all hover:shadow-md">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-600">
            <div className="bg-blue-50 p-1.5 rounded-full mr-2">
              <SafeIcon icon={FiFileText} className="text-blue-600" />
            </div>
            <span className="text-sm">
              Totale: <span className="font-semibold text-gray-800">{totalSanzioni}</span>
            </span>
          </div>
          {(searchTerm || selectedCategory) && (
            <div className="flex items-center text-gray-600">
              <div className="bg-green-50 p-1.5 rounded-full mr-2">
                <SafeIcon icon={FiSearch} className="text-green-600" />
              </div>
              <span className="text-sm">
                Risultati: <span className="font-semibold text-gray-800">{filteredSanzioni}</span>
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 flex-wrap gap-2">
          {searchTerm && (
            <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 transition-all hover:bg-blue-100">
              <SafeIcon icon={FiSearch} className="mr-2 text-blue-600 text-sm" />
              <span className="text-sm text-blue-700">
                "{searchTerm}"
              </span>
            </div>
          )}
          {selectedCategory && (
            <div className={`flex items-center px-3 py-1.5 rounded-full border transition-all hover:shadow-sm ${categoryBadgeClasses}`}>
              <SafeIcon icon={FiFilter} className="mr-2 text-sm" />
              <span className="text-sm font-medium" title={selectedCategory}>
                {truncateCategory(selectedCategory)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsBar;