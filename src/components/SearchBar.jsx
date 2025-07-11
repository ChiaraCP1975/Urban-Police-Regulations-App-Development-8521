import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSearch, FiFilter, FiX } = FiIcons;

const SearchBar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, onClear }) => {
  // Elenco categorie standardizzato per tutto l'applicativo
  const categorie = [
    { value: 'Tutte', label: 'Tutte le categorie', color: 'gray' },
    { value: 'SICUREZZA URBANA E PUBBLICA INCOLUMITA\'', label: 'Sicurezza Urbana', color: 'red' },
    { value: 'CONVIVENZA CIVILE', label: 'Convivenza Civile', color: 'emerald' },
    { value: 'VIVIBILITA\'', label: 'Vivibilità', color: 'blue' },
    { value: 'IGIENE E PUBBLICO DECORO', label: 'Igiene e Decoro', color: 'teal' },
    { value: 'QUIETE PUBBLICA E TRANQUILLITA\' DELLE PERSONE', label: 'Quiete Pubblica', color: 'purple' },
    { value: 'MESTIERI, ATTIVITA\' LAVORATIVE E MANIFESTAZIONI', label: 'Mestieri e Attività', color: 'orange' },
    { value: 'SICUREZZA E DEGRADO AMBIENTALE IN AMBITO RURALE', label: 'Sicurezza Ambientale', color: 'amber' },
    { value: 'MANTENIMENTO DI TERRENI, FOSSI, ALBERI, PIANTE E ARBUSTI', label: 'Mantenimento Terreni', color: 'lime' },
    { value: 'GESTIONE DELLE ACQUE PIOVANE ED IRRIGUE', label: 'Gestione Acque', color: 'cyan' },
    { value: 'PASCOLO E CONDUZIONE DI BESTIAME', label: 'Pascolo e Bestiame', color: 'green' },
    { value: 'RISPETTO DEI BENI PRIVATI, COMUNALI, DEMANIALI', label: 'Rispetto dei Beni', color: 'indigo' }
  ];

  const getOptionColor = (color) => {
    const colorMap = {
      'red': 'text-red-700',
      'emerald': 'text-emerald-700',
      'blue': 'text-blue-700',
      'teal': 'text-teal-700',
      'purple': 'text-purple-700',
      'orange': 'text-orange-700',
      'amber': 'text-amber-700',
      'lime': 'text-lime-700',
      'cyan': 'text-cyan-700',
      'green': 'text-green-700',
      'indigo': 'text-indigo-700',
      'gray': 'text-gray-700'
    };
    return colorMap[color] || 'text-gray-700';
  };

  return (
    <div className="max-w-5xl mx-auto mb-8 slide-up">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Barra di ricerca */}
        <div className="relative flex-1 group">
          <SafeIcon 
            icon={FiSearch} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-hover:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Cerca per parole chiave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 shadow-soft hover:shadow-md"
          />
          {searchTerm && (
            <button
              onClick={onClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <SafeIcon icon={FiX} className="text-lg" />
            </button>
          )}
        </div>

        {/* Filtro per categoria con colori */}
        <div className="relative lg:w-80 group">
          <SafeIcon 
            icon={FiFilter} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg group-hover:text-blue-500 transition-colors"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 bg-white shadow-soft hover:shadow-md cursor-pointer"
          >
            {categorie.map(categoria => (
              <option
                key={categoria.value}
                value={categoria.value === 'Tutte' ? '' : categoria.value}
                className={getOptionColor(categoria.color)}
              >
                {categoria.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;