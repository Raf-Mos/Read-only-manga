import Loading from '@/components/Loading';
import Carousel from '@/components/Carousel';
import MangaCard from '@/components/MangaCard';
import { TrendingUp, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import mangadexService from '@/services/mangadex';
import type { Manga } from '@/types';

export default function Homepage({ searchQuery }: { searchQuery?: string }) {
  const [popularManga, setPopularManga] = useState<Manga[]>([]);
  const [recentManga, setRecentManga] = useState<Manga[]>([]);
  const [searchResults, setSearchResults] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [popular, recent] = await Promise.all([
        mangadexService.getPopularManga(),
        mangadexService.getRecentlyUpdatedManga(),
      ]);
      setPopularManga(popular);
      setRecentManga(recent);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!searchQuery) { setSearchResults([]); return; }
      setSearchLoading(true);
      const results = await mangadexService.searchManga(searchQuery);
      setSearchResults(results);
      setSearchLoading(false);
    })();
  }, [searchQuery]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loading className="mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading manga...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {searchQuery ? (
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Search Results</h1>
              <p className="text-gray-600 dark:text-gray-400">Results for "{searchQuery}"</p>
            </div>
            {searchLoading ? (
              <div className="flex items-center justify-center py-12"><Loading /></div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-4">
                {searchResults.map((manga) => (<MangaCard key={manga.id} manga={manga} />))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">No manga found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="text-center mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-blue-200 dark:border-gray-600">
              <h1 className="text-4xl font-bold text-blue-900 dark:text-white mb-4">Welcome to MangaReader</h1>
              <p className="text-xl text-blue-700 dark:text-gray-400">Discover and read your favorite manga online</p>
            </div>
            <Carousel manga={popularManga} title="Most Popular" icon={<TrendingUp className="h-6 w-6 text-orange-500" />} />
            <section>
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-green-500 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recently Updated</h2>
              </div>
              <div className="grid gap-4">
                {recentManga.map((manga) => (<MangaCard key={manga.id} manga={manga} />))}
              </div>
            </section>
          </>
        )}
    </div>
  );
}
