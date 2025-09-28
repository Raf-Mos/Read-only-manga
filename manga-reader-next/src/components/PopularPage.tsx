import { useEffect, useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import Loading from '@/components/Loading';
import ViewToggle from '@/components/ViewToggle';
import MangaGrid from '@/components/MangaGrid';
import Pagination from '@/components/Pagination';
import type { Manga } from '@/types';
import mangadexService from '@/services/mangadex';

export default function PopularPage() {
  const [manga, setManga] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [totalPages] = useState(5);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPopularManga = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await mangadexService.getPopularMangaPaginated(currentPage, itemsPerPage);
        setManga(response.data);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch popular manga');
      } finally {
        setLoading(false);
      }
    };
    fetchPopularManga();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loading className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading popular manga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={() => (typeof window !== 'undefined' ? window.location.reload() : null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
          <TrendingUp className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Popular Manga</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Discover the most followed manga on MangaDex</p>
          </div>
        </div>
        <ViewToggle view={view} onViewChange={setView} />
      </div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">Showing page {currentPage} of {totalPages} ({itemsPerPage} manga per page)</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Total: {totalPages * itemsPerPage} manga</p>
      </div>
      <MangaGrid manga={manga} view={view} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
}
