import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle, ZoomIn, ZoomOut, HelpCircle } from 'lucide-react';
import Loading from '@/components/Loading';
import type { ChapterImagesResponse, Chapter } from '@/types';
import mangadexService from '@/services/mangadex';

export default function ChapterReader({ id }: { id: string }) {
  const [chapterData, setChapterData] = useState<ChapterImagesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitToWidth, setFitToWidth] = useState(true);
  const [chapterMeta, setChapterMeta] = useState<Chapter | null>(null);
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    const fetchChapterImages = async () => {
      if (!id) { setError('No chapter ID provided'); setLoading(false); return; }
      try {
        setLoading(true); setError(null);
        const data = await mangadexService.getChapterImages(id);
        if (!data?.chapter?.data?.length) throw new Error('No image data available for this chapter');
        setChapterData(data);
        // Try to fetch minimal chapter metadata to build Back to Manga link
        try {
          const meta = await mangadexService.getChapterMeta(id);
          setChapterMeta(meta as any);
        } catch (_) {}
      } catch (err: any) {
        setError(err?.message || 'An error occurred loading chapter images');
      } finally {
        setLoading(false);
      }
    }; fetchChapterImages();
  }, [id]);

  const handleImageLoad = () => setImageLoading(false);
  const handleImageError = () => setImageLoading(false);
  const nextPage = useCallback(() => {
    if (chapterData && currentPage < chapterData.chapter.data.length - 1) {
      setCurrentPage((prev) => prev + 1); setImageLoading(true);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [chapterData, currentPage]);
  const prevPage = useCallback(() => {
    if (currentPage > 0) { setCurrentPage((prev) => prev - 1); setImageLoading(true);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' }); }
  }, [currentPage]);
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); nextPage(); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); prevPage(); }
  }, [nextPage, prevPage]);
  useEffect(() => { if (typeof window !== 'undefined') { window.addEventListener('keydown', handleKeyPress); return () => window.removeEventListener('keydown', handleKeyPress); } }, [handleKeyPress]);
  const zoomIn = () => { setZoomLevel((prev) => Math.min(prev + 25, 300)); setFitToWidth(false); };
  const zoomOut = () => { setZoomLevel((prev) => Math.max(prev - 25, 25)); setFitToWidth(false); };
  const resetZoom = () => { setZoomLevel(100); setFitToWidth(true); };
  const toggleFit = () => {
    setFitToWidth((prev) => {
      const next = !prev;
      if (next) setZoomLevel(100);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <Loading className="mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !chapterData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to fetch chapter images</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{error || 'This chapter may not have images available or the chapter ID is invalid.'}</p>
          <div className="space-y-3">
            <button onClick={() => (typeof window !== 'undefined' ? window.history.back() : null)} className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Previous Page
            </button>
            <Link href="/" className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">Back to Home</Link>
          </div>
          {id && <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">Chapter ID: {id}</p>}
        </div>
      </div>
    );
  }

  const currentImageUrl = mangadexService.getChapterPageUrl(
    chapterData.baseUrl,
    chapterData.chapter.hash,
    chapterData.chapter.data[currentPage]
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => (typeof window !== 'undefined' ? window.history.back() : null)} className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-400">Page {currentPage + 1} of {chapterData.chapter.data.length}</span>
              <div className="flex items-center space-x-2">
                <button onClick={zoomOut} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Zoom Out"><ZoomOut className="h-4 w-4" /></button>
                <button onClick={resetZoom} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Reset Zoom">{zoomLevel}%</button>
                <button onClick={toggleFit} className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Fit to width toggle">{fitToWidth ? 'Fit: Width' : 'Fit: Manual'}</button>
                <button onClick={zoomIn} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Zoom In"><ZoomIn className="h-4 w-4" /></button>
                <button onClick={() => setShowHelp((v) => !v)} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors" title="Help">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={prevPage} disabled={currentPage === 0} className={`p-2 rounded-lg transition-colors ${currentPage === 0 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`} title="Previous Page"><ChevronLeft className="h-4 w-4" /></button>
              <button onClick={nextPage} disabled={currentPage >= chapterData.chapter.data.length - 1} className={`p-2 rounded-lg transition-colors ${currentPage >= chapterData.chapter.data.length - 1 ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`} title="Next Page"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-start min-h-screen p-4">
        <div className="relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg z-10">
              <Loading />
            </div>
          )}
          <img src={currentImageUrl} alt={`Page ${currentPage + 1}`} onLoad={handleImageLoad} onError={handleImageError} className={`rounded-lg shadow-lg transition-all duration-200 ${fitToWidth ? 'max-w-full h-auto' : ''}`} style={!fitToWidth ? { width: `${zoomLevel}%`, maxWidth: 'none' } : {}} />
        </div>
      </div>
  {/* Click zones for navigation should sit below the global navbar and reader header */}
  <div className="fixed top-32 bottom-0 left-0 w-1/3 cursor-pointer z-10" onClick={prevPage} aria-hidden="true" />
  <div className="fixed top-32 bottom-0 right-0 w-1/3 cursor-pointer z-10" onClick={nextPage} aria-hidden="true" />
      {showHelp && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
          Use arrow keys, spacebar, or click sides to navigate
          <button className="ml-3 underline" onClick={() => setShowHelp(false)}>Got it</button>
        </div>
      )}
    </div>
  );
}
