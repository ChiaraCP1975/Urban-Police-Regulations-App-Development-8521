import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiBook } = FiIcons;

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex items-center justify-center mb-4">
          <SafeIcon icon={FiShield} className="text-4xl mr-3" />
          <h1 className="text-3xl md:text-4xl font-bold">
            Prontuario Sanzioni
          </h1>
        </div>
        <div className="flex items-center justify-center mb-2">
          <SafeIcon icon={FiBook} className="text-xl mr-2" />
          <p className="text-lg">Regolamento di Polizia Urbana e Rurale</p>
        </div>
        <p className="text-gray-300 text-sm">
          Consulta rapidamente le sanzioni e le relative informazioni
        </p>
      </div>
    </header>
  );
};

export default Header;