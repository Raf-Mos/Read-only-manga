import React from 'react';
import { Manga } from '../types';
import MangaCardCarousel from './MangaCardCarousel';
import MangaListItem from './MangaListItem';

interface MangaGridProps {
  manga: Manga[];
  view: 'grid' | 'list';
}

const MangaGrid: React.FC<MangaGridProps> = ({ manga, view }) => {
  if (manga.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No manga found
        </p>
      </div>
    );
  }

  if (view === 'grid') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {manga.map((mangaItem) => (
          <MangaCardCarousel key={mangaItem.id} manga={mangaItem} />
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-3">
      {manga.map((mangaItem) => (
        <MangaListItem key={mangaItem.id} manga={mangaItem} />
      ))}
    </div>
  );
};

export default MangaGrid;