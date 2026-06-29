import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
}

export function Pagination({ currentPage, totalPages, onPageChange, totalItems, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  const delta = 2;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-surface-100 dark:border-surface-800">
      <p className="text-xs text-surface-400">
        {totalItems != null && pageSize != null
          ? `Showing ${Math.min((currentPage - 1) * pageSize + 1, totalItems)}–${Math.min(currentPage * pageSize, totalItems)} of ${totalItems}`
          : `Page ${currentPage} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-surface-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                page === currentPage
                  ? 'bg-nexora-600 text-white shadow-sm'
                  : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800'
              )}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
