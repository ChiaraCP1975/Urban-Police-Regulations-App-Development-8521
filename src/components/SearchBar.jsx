import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiFilter } = FiIcons;

const SearchBar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, onClear }) => {
  const categorie = [
    'Tutte',
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

  return (
    <div className="max-w-5xl mx-auto mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Barra di ricerca */}
        <div className="relative flex-1">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Cerca per parole chiave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700"
          />
          {searchTerm && (
            <button
              onClick={onClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro per categoria */}
        <div className="relative lg:w-80">
          <SafeIcon icon={FiFilter} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white text-sm"
          >
            {categorie.map(categoria => (
              <option key={categoria} value={categoria === 'Tutte' ? '' : categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;