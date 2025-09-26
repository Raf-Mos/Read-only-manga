import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, Star, Users, AlertCircle } from 'lucide-react';
import Loading from '../components/Loading';
import { Manga, Chapter } from '../types';
import mangadxService from '../services/mangadx';

const MangaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [manga, setManga] = useState<Manga | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [chaptersLoading, setChaptersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMangaDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const mangaData = await mangadxService.getMangaById(id);
        setManga(mangaData);

        // Fetch chapters
        setChaptersLoading(true);
        const chaptersResponse = await mangadxService.getMangaChapters(id);
        setChapters(chaptersResponse.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
        setChaptersLoading(false);
      }
    };

    fetchMangaDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading manga details...</p>
        </div>
      </div>
    );
  }

  if (error || !manga) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || 'Manga not found'}
          </h2>
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const title = mangadxService.getEnglishTitle(manga);
  const description = mangadxService.getEnglishDescription(manga);
  const coverUrl = mangadxService.getCoverArt(manga);
  const authors = mangadxService.getAuthors(manga);
  const artists = mangadxService.getArtists(manga);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover and Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            {/* Cover Image */}
            <div className="mb-6">
              {coverUrl ? (
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-full h-auto rounded-lg shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                  }}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">No Cover Available</span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Status</h3>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  manga.attributes.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : manga.attributes.status === 'ongoing'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {manga.attributes.status.charAt(0).toUpperCase() + manga.attributes.status.slice(1)}
                </span>
              </div>

              {manga.attributes.year && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Year</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {manga.attributes.year}
                  </div>
                </div>
              )}

              {authors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Authors</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-2" />
                    {authors.join(', ')}
                  </div>
                </div>
              )}

              {artists.length > 0 && authors.join(',') !== artists.join(',') && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Artists</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 mr-2" />
                    {artists.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Title and Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {title}
            </h1>
            
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {description}
            </p>

            {/* Tags */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {manga.attributes.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                  >
                    {tag.attributes.name.en || Object.values(tag.attributes.name)[0]}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Chapters ({chapters.length})
                </h2>
              </div>
            </div>

            <div className="p-6">
              {chaptersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loading />
                </div>
              ) : chapters.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      to={`/chapter/${chapter.id}`}
                      className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Chapter {chapter.attributes.chapter || '?'}
                            {chapter.attributes.title && `: ${chapter.attributes.title}`}
                          </h4>
                          {chapter.attributes.volume && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Volume {chapter.attributes.volume}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-500">
                            {chapter.attributes.pages} pages
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(chapter.attributes.publishAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No chapters available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;