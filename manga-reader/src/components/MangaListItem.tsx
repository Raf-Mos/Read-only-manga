import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Manga } from '../types';
import mangadexService from '../services/mangadex';

interface MangaListItemProps {
  manga: Manga;
}

const MangaListItem: React.FC<MangaListItemProps> = ({ manga }) => {
  const title = mangadexService.getEnglishTitle(manga);
  const description = mangadexService.getEnglishDescription(manga);
  const coverUrl = mangadexService.getCoverArt(manga);
  const authors = mangadexService.getAuthors(manga);

  // Truncate description for list view
  const truncatedDescription = description.length > 200 
    ? `${description.substring(0, 200)}...` 
    : description;

  return (
    <Link 
      to={`/manga/${manga.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex gap-6">
        {/* Cover Image */}
        <div className="w-28 h-40 sm:w-32 sm:h-44 flex-shrink-0">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/128x176/374151/9CA3AF?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-600 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-gray-400 text-xs text-center">No Image</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1 pr-4">
              {title}
            </h3>
            
            {/* Status and Year */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              {manga.attributes.year && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {manga.attributes.year}
                </div>
              )}
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                manga.attributes.status === 'completed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : manga.attributes.status === 'ongoing'
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {manga.attributes.status.charAt(0).toUpperCase() + manga.attributes.status.slice(1)}
              </span>
              
              {/* Last updated date */}
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Updated: {new Date(manga.attributes.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          {/* Authors */}
          {authors.length > 0 && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
              <User className="h-3 w-3 mr-1" />
              <span className="truncate">
                {authors.join(', ')}
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
            {truncatedDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {manga.attributes.tags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                className="inline-block px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
              >
                {tag.attributes.name.en || Object.values(tag.attributes.name)[0]}
              </span>
            ))}
            {manga.attributes.tags.length > 4 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                +{manga.attributes.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaListItem;