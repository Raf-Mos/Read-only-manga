import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import MangaCard from '../components/MangaCard';
import Carousel from '../components/Carousel';
import Loading from '../components/Loading';
import { Manga } from '../types';
import mangadexService from '../services/mangadex';

const Homepage: React.FC = () => {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentManga, setRecentManga] = useState<Manga[]>([]);
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [popular, recent] = await Promise.all([
          mangadexService.getPopularManga(),
          mangadexService.getRecentlyUpdatedManga()
        ]);
        
        setPopularManga(popular);
        setRecentManga(recent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        setError(null);
        const results = await mangadexService.searchManga(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setSearchLoading(false);
      }
    };

    performSearch();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading manga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {searchQuery ? (
        // Search Results Section
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Search Results
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Results for "{searchQuery}"
            </p>
          </div>

          {searchLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid gap-4">
              {searchResults.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No manga found for "{searchQuery}"
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Try a different search term
              </p>
            </div>
          )}
        </div>
      ) : (
        // Home Content
        <>
          {/* Welcome Section */}
          <div className="text-center mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-blue-200 dark:border-gray-600">
            <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">
              Welcome to MangaReader
            </h1>
            <p className="text-xl text-blue-700 dark:text-gray-400">
              Discover and read your favorite manga online
            </p>
          </div>

          {/* Popular Manga Carousel */}
          <Carousel 
            manga={popularManga}
            title="Most Popular"
            icon={<TrendingUp className="h-6 w-6 text-orange-500" />}
          />

          {/* Recently Updated Section */}
          <section>
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recently Updated
              </h2>
            </div>
            <div className="grid gap-4">
              {recentManga.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Homepage;