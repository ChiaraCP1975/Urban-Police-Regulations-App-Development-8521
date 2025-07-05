import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus } = FiIcons;

const ActionButtons = ({ onAddViolazione }) => {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={onAddViolazione}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
      >
        <SafeIcon icon={FiPlus} className="text-xl" />
        <span className="font-semibold">Inserisci Violazione</span>
      </button>
    </div>
  );
};

export default ActionButtons;