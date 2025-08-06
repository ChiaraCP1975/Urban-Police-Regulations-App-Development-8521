import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiShield, FiBook } = FiIcons;

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-600 text-white py-8 px-4 shadow-lg relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white/20 p-3 rounded-full mr-4 shadow-inner">
            <SafeIcon icon={FiShield} className="text-3xl text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
            Prontuario Sanzioni
          </h1>
        </div>
        
        <div className="flex items-center justify-center mb-3">
          <div className="bg-white/10 px-4 py-2 rounded-full flex items-center space-x-2 backdrop-blur-sm">
            <SafeIcon icon={FiBook} className="text-xl drop-shadow-sm" />
            <p className="text-lg drop-shadow-sm">Regolamento di Polizia Urbana e Rurale</p>
          </div>
        </div>
        
        <p className="text-blue-100 text-sm drop-shadow-sm max-w-md mx-auto bg-blue-800/10 py-1 px-4 rounded-full backdrop-blur-sm">
          Consulta rapidamente le sanzioni e le relative informazioni
        </p>
      </div>
    </header>
  );
};

export default Header;