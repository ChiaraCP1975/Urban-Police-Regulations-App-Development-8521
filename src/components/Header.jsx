import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiBook } = FiIcons;

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-600 text-white py-8 px-4 shadow-lg">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <SafeIcon icon={FiShield} className="text-4xl mr-3 drop-shadow-lg" />
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
            Prontuario Sanzioni
          </h1>
        </div>
        <div className="flex items-center justify-center mb-2">
          <SafeIcon icon={FiBook} className="text-xl mr-2 drop-shadow-sm" />
          <p className="text-lg drop-shadow-sm">Regolamento di Polizia Urbana e Rurale</p>
        </div>
        <p className="text-blue-100 text-sm drop-shadow-sm">
          Consulta rapidamente le sanzioni e le relative informazioni
        </p>
      </div>
    </header>
  );
};

export default Header;