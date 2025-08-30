import React from 'react';
import { useState, useMemo } from 'react';
import { BookCard } from '../components/bookstore/BookCard';
import { ProductToolbar } from '../components/bookstore/ProductToolbar';
import { FilterSidebar } from '../components/bookstore/FilterSidebar';
import { Pagination } from '../components/bookstore/Pagination';
import { books } from '../data/books';

export const Bookstore = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState(16);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 1000],
    rating: 0
  });

  // Filter books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(book.category)) {
        return false;
      }

      // Price filter
      const bookPrice = book.priceRange ? book.priceRange.min : book.price;
      if (bookPrice < filters.priceRange[0] || bookPrice > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && book.rating < filters.rating) {
        return false;
      }

      // Stock filter
      if (filters.inStock === true && !book.inStock) {
        return false;
      }

      return true;
    });
  }, [books, filters]);

  // Sort books
  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];
    
    switch (sortBy) {
      case 'popularity':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'price-low':
        return sorted.sort((a, b) => {
          const aPrice = a.priceRange ? a.priceRange.min : a.price;
          const bPrice = b.priceRange ? b.priceRange.min : b.price;
          return aPrice - bPrice;
        });
      case 'price-high':
        return sorted.sort((a, b) => {
          const aPrice = a.priceRange ? a.priceRange.max || a.price : a.price;
          const bPrice = b.priceRange ? b.priceRange.max || b.price : b.price;
          return bPrice - aPrice;
        });
      case 'date':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [filteredBooks, sortBy]);

  // Paginate books
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedBooks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-background">
      {/* Product Toolbar */}
      <ProductToolbar
        onFilterToggle={() => setFilterOpen(true)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(count) => {
          setItemsPerPage(count);
          setCurrentPage(1);
        }}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Products Grid/List */}
      <div className="px-6 py-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedBooks.map((book) => (
              <BookCard key={book.id} book={book} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {paginatedBooks.map((book) => (
              <BookCard key={book.id} book={book} viewMode={viewMode} />
            ))}
          </div>
        )}

        {paginatedBooks.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-muted-foreground">No books found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};