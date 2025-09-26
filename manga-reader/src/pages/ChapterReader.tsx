import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, AlertCircle, ZoomIn, ZoomOut } from 'lucide-react';
import Loading from '../components/Loading';
import { ChapterImagesResponse } from '../types';
import mangadxService from '../services/mangadx';

const ChapterReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [chapterData, setChapterData] = useState<ChapterImagesResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fitToWidth, setFitToWidth] = useState(true);

  useEffect(() => {
    const fetchChapterImages = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const data = await mangadxService.getChapterImages(id);
        setChapterData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChapterImages();
  }, [id]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const nextPage = useCallback(() => {
    if (chapterData && currentPage < chapterData.chapter.data.length - 1) {
      setCurrentPage(prev => prev + 1);
      setImageLoading(true);
      // Scroll to top when going to next page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [chapterData, currentPage]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      setImageLoading(true);
      // Scroll to top when going to previous page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === ' ') {
      event.preventDefault();
      nextPage();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevPage();
    }
  }, [nextPage, prevPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 300));
    setFitToWidth(false);
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
    setFitToWidth(false);
  };

  const resetZoom = () => {
    setZoomLevel(100);
    setFitToWidth(true);
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
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {error || 'Chapter not found'}
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

  const currentImageUrl = mangadxService.getChapterPageUrl(
    chapterData.baseUrl,
    chapterData.chapter.hash,
    chapterData.chapter.data[currentPage]
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button */}
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>

            {/* Page Counter */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-400">
                Page {currentPage + 1} of {chapterData.chapter.data.length}
              </span>
              
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={zoomOut}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  onClick={resetZoom}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Reset Zoom"
                >
                  {zoomLevel}%
                </button>
                <button
                  onClick={zoomIn}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage === 0
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage >= chapterData.chapter.data.length - 1}
                className={`p-2 rounded-lg transition-colors ${
                  currentPage >= chapterData.chapter.data.length - 1
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="flex justify-center items-start min-h-screen p-4">
        <div className="relative">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg z-10">
              <Loading />
            </div>
          )}
          
          <img
            src={currentImageUrl}
            alt={`Page ${currentPage + 1}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`rounded-lg shadow-lg transition-all duration-200 ${
              fitToWidth ? 'max-w-full h-auto' : ''
            }`}
            style={!fitToWidth ? { 
              width: `${zoomLevel}%`,
              maxWidth: 'none'
            } : {}}
          />
        </div>
      </div>

      {/* Navigation Overlay */}
      <div className="fixed inset-y-0 left-0 w-1/3 cursor-pointer z-5" onClick={prevPage} />
      <div className="fixed inset-y-0 right-0 w-1/3 cursor-pointer z-5" onClick={nextPage} />

      {/* Instructions */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
        Use arrow keys, spacebar, or click sides to navigate
      </div>
    </div>
  );
};

export default ChapterReader;