import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';
import { Manga } from '../types';
import mangadxService from '../services/mangadx';

interface MangaCardCarouselProps {
  manga: Manga;
}

const MangaCardCarousel: React.FC<MangaCardCarouselProps> = ({ manga }) => {
  const title = mangadxService.getEnglishTitle(manga);
  const description = mangadxService.getEnglishDescription(manga);
  const coverUrl = mangadxService.getCoverArt(manga);
  const authors = mangadxService.getAuthors(manga);

  // Truncate description to a shorter length for carousel
  const truncatedDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  return (
    <Link 
      to={`/manga/${manga.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:-translate-y-2"
    >
      {/* Cover Image */}
      <div className="aspect-[3/4] overflow-hidden">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/300x400/374151/9CA3AF?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {title}
        </h3>
        
        {authors.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
            <Star className="h-3 w-3 mr-1" />
            {authors[0]}
            {authors.length > 1 && ` +${authors.length - 1}`}
          </p>
        )}

        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">
          {truncatedDescription}
        </p>

        {/* Status and Year */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            manga.attributes.status === 'completed' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : manga.attributes.status === 'ongoing'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {manga.attributes.status.charAt(0).toUpperCase() + manga.attributes.status.slice(1)}
          </span>
          
          {manga.attributes.year && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              {manga.attributes.year}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {manga.attributes.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className="inline-block px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
            >
              {tag.attributes.name.en || Object.values(tag.attributes.name)[0]}
            </span>
          ))}
          {manga.attributes.tags.length > 2 && (
            <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              +{manga.attributes.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MangaCardCarousel;