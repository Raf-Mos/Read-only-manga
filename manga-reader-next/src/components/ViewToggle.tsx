import { Grid3X3, List } from 'lucide-react';

export default function ViewToggle({ view, onViewChange }: { view: 'grid' | 'list'; onViewChange: (v: 'grid' | 'list') => void }) {
  return (
    <div className="flex items-center bg-blue-100 dark:bg-gray-700 rounded-lg p-1 border border-blue-200 dark:border-gray-600">
      <button onClick={() => onViewChange('grid')} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'grid' ? 'bg-blue-600 dark:bg-gray-800 text-white dark:text-blue-400 shadow-sm' : 'text-blue-600 dark:text-gray-400 hover:text-blue-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-gray-600'}`}>
        <Grid3X3 className="h-4 w-4 mr-2" /> Grid
      </button>
      <button onClick={() => onViewChange('list')} className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-blue-600 dark:bg-gray-800 text-white dark:text-blue-400 shadow-sm' : 'text-blue-600 dark:text-gray-400 hover:text-blue-800 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-gray-600'}`}>
        <List className="h-4 w-4 mr-2" /> List
      </button>
    </div>
  );
}
