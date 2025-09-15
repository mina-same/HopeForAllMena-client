import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FilterSidebar } from './bookstore/FilterSidebar';
import { ProductToolbar } from './bookstore/ProductToolbar';
import { BookCard } from './bookstore/BookCard';
import { Pagination as PaginationComponent } from './bookstore/Pagination';
import { booksAPI, categoriesAPI } from '../services/api';

const Bookstore = () => {
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
          status: 'published'
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
    };

    fetchBooksAndCategories();
  }, [currentPage, itemsPerPage, filters, sortBy, sortOrder]);

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

  // Transform database books to match component expectations
  const transformedBooks = useMemo(() => {
    return books.map(book => ({
      id: book._id,
      title: book.title,
      author: book.author?.name || 'Unknown Author',
      rating: book.averageRating || 0,
      reviewCount: book.totalReviews || 0,
      image: book.coverImageUrl,
      category: book.category?.name_en || 'Uncategorized',
      tags: book.tags || [],
      inStock: book.status === 'published',
      description: book.shortDescription || book.description
    }));
  }, [books]);

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
    <div className="min-h-screen bg-background">
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
      <div className="px-6 py-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2194D1] mx-auto"></div>
            <p className="text-muted-foreground mt-4">Loading books...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600">Error</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
            <button 
              onClick={retryFetch}
              className="mt-4 px-4 py-2 bg-[#2194D1] text-white rounded-lg hover:bg-[#1e7fb8]"
            >
              Try Again
            </button>
          </div>
        ) : transformedBooks.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-muted-foreground">No books found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search criteria.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {transformedBooks.map((book) => (
                  <BookCard key={book.id} book={book} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <div className="space-y-6 w-full">
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
  );
};

export default Bookstore;