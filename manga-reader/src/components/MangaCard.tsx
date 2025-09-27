import React from 'react';
import { Link } from 'react-router-dom';
import { Manga } from '../types';
import mangadexService from '../services/mangadex';
import SmartImage from './SmartImage';

interface MangaCardProps {
  manga: Manga;
}

const MangaCard: React.FC<MangaCardProps> = ({ manga }) => {
  const title = mangadexService.getEnglishTitle(manga);
  const description = mangadexService.getEnglishDescription(manga);
  const coverUrl = mangadexService.getCoverArt(manga);
  const authors = mangadexService.getAuthors(manga);
  
  // Get fallback URLs for the image
  const coverRelation = manga.relationships.find((rel: any) => rel.type === 'cover_art');
  const fallbackUrls = coverRelation?.attributes?.fileName ? 
    mangadexService.getCoverImageUrlWithFallback(manga.id, coverRelation.attributes.fileName, 'small') : [];

  // Truncate description to a reasonable length
  const truncatedDescription = description.length > 150 
    ? `${description.substring(0, 150)}...` 
    : description;

  return (
    <Link 
      to={`/manga/${manga.id}`}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="flex">
        {/* Cover Image */}
        <div className="w-24 h-32 flex-shrink-0">
          <SmartImage
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            fallbackSrcs={fallbackUrls.slice(1)} // Skip the first one since it's already used as src
            placeholder="https://via.placeholder.com/96x128/1F2937/9CA3AF?text=No+Cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {title}
          </h3>
          
          {authors.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              by {authors.join(', ')}
            </p>
          )}

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
            {truncatedDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {manga.attributes.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
              >
                {tag.attributes.name.en || Object.values(tag.attributes.name)[0]}
              </span>
            ))}
            {manga.attributes.tags.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                +{manga.attributes.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;