import React, { useState, useMemo } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { BookOpen, RefreshCw, WifiOff } from 'lucide-react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { FilterSidebar } from './bookstore/FilterSidebar';
import { ProductToolbar } from './bookstore/ProductToolbar';
import { BookCard } from './bookstore/BookCard';
import { Pagination as PaginationComponent } from './bookstore/Pagination';
import { booksAPI, categoriesAPI } from '../services/api';

const Bookstore = () => {
  const { t } = useTranslation('Bookstore');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [sortOrder, setSortOrder] = useState('asc');
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    rating: 0,
    publicationYear: ''
  });
  // Categories rarely change: cache them for 10 minutes per language
  const categoriesQuery = useQuery({
    queryKey: ['categories', 'public', currentLanguage],
    queryFn: () => categoriesAPI.getCategories({ limit: 100, language: currentLanguage }),
    staleTime: 10 * 60 * 1000,
  });
  const categories = categoriesQuery.data?.data?.categories || [];

  const params = useMemo(() => {
    const p = { page: currentPage, limit: itemsPerPage, status: 'published', language: currentLanguage };
    if (sortBy && sortBy !== 'default') {
      p.sortBy = sortBy;
      p.sortOrder = sortOrder;
    }
    if (filters.categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.name_en === filters.categories[0]);
      if (selectedCategory) p.category = selectedCategory._id;
    }
    if (filters.rating > 0) p.minRating = filters.rating;
    if (filters.publicationYear) p.publicationYear = filters.publicationYear;
    return p;
  }, [currentPage, itemsPerPage, sortBy, sortOrder, filters, categories, currentLanguage]);

  // Each page/filter combination is cached; keepPreviousData leaves the current
  // books on screen while the next page loads instead of flashing a spinner.
  const booksQuery = useQuery({
    queryKey: ['books', 'public', params],
    queryFn: () => booksAPI.getBooks(params),
    placeholderData: keepPreviousData,
  });
  const books = booksQuery.data?.data?.books || [];
  const totalBooks = booksQuery.data?.data?.pagination?.totalBooks || 0;
  const loading = booksQuery.isPending;
  const hasFilters = filters.categories.length > 0 || filters.rating > 0 || !!filters.publicationYear;

  const errorMessage = (() => {
    const err = booksQuery.error;
    if (!err) return null;
    if (err.code === 'ECONNABORTED' || err.code === 'ECONNREFUSED' || err.message?.includes('Network Error') || err.message?.includes('timeout')) {
      return t('error.networkError');
    }
    if (err.response?.status >= 500) return t('error.serverError');
    return t('error.loadBooks');
  })();
  const error = booksQuery.isError && books.length === 0 ? errorMessage : null;
  const retryFetch = () => booksQuery.refetch();

  // Transform database books to match component expectations with Arabic support
  const transformedBooks = useMemo(() => {
    return books.map((book, index) => {
      // Handle Arabic content based on language
      const bookTitle = currentLanguage === 'ar' ? 
        (book.titleAr || book.title) : book.title;
      
      const bookDescription = currentLanguage === 'ar' ? 
        (book.descriptionAr || book.shortDescriptionAr || book.description || book.shortDescription) : 
        (book.description || book.shortDescription);
      
      const authorName = currentLanguage === 'ar' ? 
        (book.author?.nameAr || book.author?.name) : book.author?.name;
      
      const categoryName = currentLanguage === 'ar' ? 
        (book.category?.name_ar || book.category?.name_en) : book.category?.name_en;

      return {
        id: book._id,
        title: bookTitle,
        titleAr: book.titleAr, // Keep original for BookCard component
        authorName: authorName || (currentLanguage === 'ar' ? 'مؤلف غير معروف' : 'Unknown Author'),
        rating: book.averageRating || 0,
        reviewCount: book.totalReviews || 0,
        totalReviews: book.totalReviews || 0,
        image: book.coverImageUrl,
        coverImageUrl: book.coverImageUrl, // Keep original for BookCard component
        category: categoryName || (currentLanguage === 'ar' ? 'غير مصنف' : 'Uncategorized'),
        tags: book.tags || [],
        inStock: book.status === 'published',
        description: bookDescription,
        descriptionAr: book.descriptionAr, // Keep original for BookCard component
        shortDescriptionAr: book.shortDescriptionAr, // Keep original for BookCard component
        // Pass through original author object for BookCard component
        author: {
          name: book.author?.name,
          nameAr: book.author?.nameAr
        }
      };
    });
  }, [books, currentLanguage]); // Add currentLanguage dependency

  // Calculate total pages from API response
  const totalPages = Math.ceil(totalBooks / itemsPerPage);

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sort changes
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Handle items per page changes
  const handleItemsPerPageChange = (count) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .bookstore-container {
            direction: rtl;
          }
          .bookstore-container .grid {
            direction: ltr; /* Keep grid layout LTR for proper alignment */
          }
          .bookstore-container .space-y-6 {
            direction: ltr; /* Keep list layout LTR for proper alignment */
          }
        `}</style>
      )}
      <div className={`min-h-screen bg-background bookstore-container ${currentLanguage === 'ar' ? 'rtl' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Product Toolbar */}
      <ProductToolbar
        onFilterToggle={() => setFilterOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
      />

      {/* Products Grid/List */}
      <div className="px-3 xs:px-4 sm:px-6 py-4">
        {booksQuery.isError && books.length > 0 && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            <span>{t('error.showingSaved')}</span>
            <button onClick={retryFetch} className="font-semibold underline">{t('error.retry')}</button>
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6" aria-busy="true" aria-label={t('loading.books')}>
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-gray-100 bg-white p-3">
                <div className="aspect-[3/4] w-full rounded-xl bg-gray-200" />
                <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mx-auto my-8 max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#2194D1]">
              <WifiOff className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t('error.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={retryFetch}
              disabled={booksQuery.isFetching}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#2194D1] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e7fb8] disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${booksQuery.isFetching ? 'animate-spin' : ''}`} aria-hidden="true" />
              {booksQuery.isFetching ? t('loading.books') : t('error.retry')}
            </button>
          </div>
        ) : transformedBooks.length === 0 ? (
          <div className="mx-auto my-8 max-w-md rounded-2xl border border-gray-100 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
              <BookOpen className="h-7 w-7" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t('empty.noBooks')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{hasFilters ? t('empty.tryDifferentFilters') : t('empty.comingSoon')}</p>
            {hasFilters && (
              <button
                onClick={() => handleFiltersChange({ categories: [], rating: 0, publicationYear: '' })}
                className="mt-6 rounded-full border border-[#2194D1] px-6 py-2.5 text-sm font-semibold text-[#2194D1] transition-colors hover:bg-[#2194D1] hover:text-white"
              >
                {t('empty.clearFilters')}
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
                {transformedBooks.map((book) => (
                  <BookCard key={book.id} book={book} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="space-y-4 xs:space-y-6 w-full">
                {transformedBooks.map((book) => (
                  <BookCard key={book.id} book={book} viewMode={viewMode} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      </div>
    </>
  );
};

export default Bookstore;