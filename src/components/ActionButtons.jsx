import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus } = FiIcons;

const ActionButtons = ({ onAddViolazione }) => {
  return (
    <div className="flex justify-center mb-8 slide-up">
      <button
        onClick={onAddViolazione}
        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-3 transform hover:scale-105 hover:from-blue-700 hover:to-blue-800"
      >
        <div className="bg-white/20 p-1 rounded-full">
          <SafeIcon icon={FiPlus} className="text-xl" />
        </div>
        <span className="font-semibold">Inserisci Violazione</span>
      </button>
    </div>
  );
};

export default ActionButtons;