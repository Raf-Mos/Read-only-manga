import React from 'react';
import { Grid3X3, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          view === 'grid'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Grid3X3 className="h-4 w-4 mr-2" />
        Grid
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          view === 'list'
            ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <List className="h-4 w-4 mr-2" />
        List
      </button>
    </div>
  );
};

export default ViewToggle;