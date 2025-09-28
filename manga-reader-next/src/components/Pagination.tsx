import React, { type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void; }) {
  const renderPageNumbers = () => {
    const pages: ReactNode[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) startPage = Math.max(1, endPage - maxVisiblePages + 1);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} onClick={() => onPageChange(i)} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>{i}</button>
      );
    }
    return pages;
  };
  if (totalPages <= 1) return null;
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      <button onClick={() => onPageChange(1)} disabled={!canPrev} className={`p-2 rounded-lg transition-colors ${!canPrev ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-label="First page">
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={!canPrev} className={`p-2 rounded-lg transition-colors ${!canPrev ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center space-x-2">
        {renderPageNumbers()}
      </div>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={!canNext} className={`p-2 rounded-lg transition-colors ${!canNext ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </button>
      <button onClick={() => onPageChange(totalPages)} disabled={!canNext} className={`p-2 rounded-lg transition-colors ${!canNext ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-label="Last page">
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}
