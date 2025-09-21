import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBooks, setTotalBooks] = useState(0);

  // Fetch books and categories on component mount and when dependencies change
  useEffect(() => {
    const fetchBooksAndCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build API parameters
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          status: 'published',
          language: currentLanguage // Add language parameter for API
        };

        // Add sorting
        if (sortBy && sortBy !== 'default') {
          params.sortBy = sortBy;
          params.sortOrder = sortOrder;
        }

        // Add filters
        if (filters.categories.length > 0) {
          // Find the category ID from the category name
          const selectedCategory = categories.find(cat => cat.name_en === filters.categories[0]);
          if (selectedCategory) {
            params.category = selectedCategory._id;
          }
        }
        if (filters.rating > 0) {
          params.minRating = filters.rating;
        }
        if (filters.publicationYear) {
          params.publicationYear = filters.publicationYear;
        }

        // Fetch books and categories in parallel
        const [booksResponse, categoriesResponse] = await Promise.all([
          booksAPI.getBooks(params),
          categoriesAPI.getCategories({ limit: 100, language: currentLanguage })
        ]);

        if (booksResponse.status === 'success') {
          setBooks(booksResponse.data.books);
          setTotalBooks(booksResponse.data.pagination.totalBooks);
        }

        if (categoriesResponse.status === 'success') {
          setCategories(categoriesResponse.data.categories);
        }

      } catch (err) {
        console.error('Error fetching books:', err);
        
        let errorMessage = t('error.loadBooks');
        if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          errorMessage = t('error.networkError');
        } else if (err.response?.status === 404) {
          errorMessage = t('error.notFound');
        } else if (err.response?.status >= 500) {
          errorMessage = t('error.serverError');
        }
        
        setError(errorMessage);
        setBooks([]);
        setTotalBooks(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndCategories();
  }, [currentPage, itemsPerPage, filters, sortBy, sortOrder, currentLanguage]); // Re-fetch when language changes

  // Manual retry function
  const retryFetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        status: 'published'
      };

      if (sortBy && sortBy !== 'default') {
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }

      if (filters.categories.length > 0) {
        // Find the category ID from the category name
        const selectedCategory = categories.find(cat => cat.name_en === filters.categories[0]);
        if (selectedCategory) {
          params.category = selectedCategory._id;
        }
      }
      if (filters.rating > 0) {
        params.minRating = filters.rating;
      }
      if (filters.publicationYear) {
        params.publicationYear = filters.publicationYear;
      }

      const [booksResponse, categoriesResponse] = await Promise.all([
        booksAPI.getBooks(params),
        categoriesAPI.getCategories({ limit: 100 })
      ]);

      if (booksResponse.status === 'success') {
        setBooks(booksResponse.data.books);
        setTotalBooks(booksResponse.data.pagination.totalBooks);
      }

      if (categoriesResponse.status === 'success') {
        setCategories(categoriesResponse.data.categories);
      }

    } catch (err) {
      console.error('Error fetching books:', err);
      
      let errorMessage = 'Failed to load books. Please try again.';
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        errorMessage = 'Unable to connect to server. Please make sure the server is running.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Books API endpoint not found.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      setBooks([]);
      setTotalBooks(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filters, sortBy, sortOrder]);

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

      // Debug: Log the first book transformation when Arabic
      if (currentLanguage === 'ar' && index === 0) {
        console.log('=== BOOKSTORE TRANSFORMATION DEBUG ===');
        console.log('Original book:', book);
        console.log('Transformed values:', {
          bookTitle,
          authorName,
          categoryName,
          bookDescription
        });
        console.log('Available Arabic fields:', {
          titleAr: book.titleAr,
          authorNameAr: book.author?.nameAr,
          categoryNameAr: book.category?.name_ar
        });
      }

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
        {loading ? (
          <div className="text-center py-8 xs:py-12">
            <div className="animate-spin rounded-full h-8 xs:h-10 sm:h-12 w-8 xs:w-10 sm:w-12 border-b-2 border-[#2194D1] mx-auto"></div>
            <p className="text-muted-foreground mt-3 xs:mt-4 text-sm xs:text-base">{t('loading.books')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 xs:py-12 px-4">
            <h3 className="text-base xs:text-lg font-semibold text-red-600">Error</h3>
            <p className="text-muted-foreground mt-2 text-sm xs:text-base max-w-md mx-auto">{error}</p>
            <button 
              onClick={retryFetch}
              className="mt-4 px-4 xs:px-6 py-2 xs:py-3 bg-[#2194D1] text-white rounded-lg hover:bg-[#1e7fb8] text-sm xs:text-base transition-colors duration-200"
            >
              {t('error.retry')}
            </button>
          </div>
        ) : transformedBooks.length === 0 ? (
          <div className="text-center py-8 xs:py-12 px-4">
            <h3 className="text-base xs:text-lg font-semibold text-muted-foreground">{t('empty.noBooks')}</h3>
            <p className="text-muted-foreground mt-2 text-sm xs:text-base max-w-md mx-auto">{t('empty.tryDifferentFilters')}</p>
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