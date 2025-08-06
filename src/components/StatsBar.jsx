import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { getCategoryColor, getCategoryBadgeClasses } from '../utils/categoryUtils';

const { FiFileText, FiSearch, FiFilter } = FiIcons;

const StatsBar = ({ totalSanzioni, filteredSanzioni, searchTerm, selectedCategory }) => {
  const truncateCategory = (category, maxLength = 40) => {
    if (!category) return '';
    if (category.length <= maxLength) return category;
    return category.substring(0, maxLength) + '...';
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