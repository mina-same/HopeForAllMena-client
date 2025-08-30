import React, { useState } from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

export const BookCard = ({ book, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = () => {
    alert('Quick view opened!');
  };

  const handleAddToCart = () => {
    alert('Added to cart!');
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${star <= Math.floor(rating) ? 'text-yellow-400 fill-current' :
                  star <= rating ? 'text-yellow-400 fill-current opacity-75' :
                    'text-muted-foreground'
                }`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">({book.reviewCount})</span>
      </div>
    );
  };

  const formatPrice = () => {
    if (book.priceRange) {
      return `$${book.priceRange.min.toFixed(2)} – $${book.priceRange.max.toFixed(2)}`;
    }
    return `$${book.price.toFixed(2)}`;
  };

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300">
        <div className="flex gap-6 p-6">
          {/* Book Image Section */}
          <div className="relative flex-shrink-0">
            <div className="relative overflow-hidden rounded-xl group-hover:shadow-lg transition-shadow duration-300">
              <img
                src={book.image}
                alt={book.title}
                className="w-24 sm:w-28 md:w-32 h-32 sm:h-36 md:h-40 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Subtle overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category Badge */}
              <div className="absolute top-2 left-2">
                <span className="bg-[#2194D1]/95 backdrop-blur-sm text-white px-2 py-1 text-xs font-medium rounded-full shadow-sm">
                  {book.category}
                </span>
              </div>
            </div>
          </div>

          {/* Book Information Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col h-full">
              {/* Title and Author */}
              <div className="mb-3">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 hover:text-[#2194D1] transition-colors cursor-pointer leading-tight line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  by <span className="text-foreground">{book.author}</span>
                </p>
              </div>

              {/* Rating */}
              <div className="mb-4">
                {renderStars(book.rating)}
              </div>

              {/* Price and Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold text-[#2194D1]">
                    {formatPrice()}
                  </span>
                  {!book.inStock && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                  {book.inStock && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Action divs */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <div
                  onClick={handleWishlist}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                      : 'bg-white border-border text-muted-foreground hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                    }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span className="hidden sm:inline">Wishlist</span>
                </div>

                <div
                  onClick={handleQuickView}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
                >
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Quick View</span>
                </div>

                <div
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${book.inStock
                      ? 'bg-[#2194D1] text-white hover:bg-[#2194D1]/90 shadow-sm hover:shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="group relative max-w-sm mx-auto bg-card rounded-2xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-border/50">
      {/* Book Cover Section */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Book Cover Image with enhanced aspect ratio */}
        <div className="aspect-[3/4.2] relative overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#2194D1]/95 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium rounded-full shadow-lg">
              {book.category}
            </span>
          </div>

          {/* Action divs - Bottom right corner with smooth animations */}
          <div className={`absolute bottom-4 right-4 flex flex-col gap-2 transition-all duration-500 ease-out ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
            <div
              onClick={handleWishlist}
              className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 ease-out transform hover:scale-110 hover:bg-white w-10 h-10 flex items-center justify-center ${isWishlisted
                  ? 'text-red-500 scale-110'
                  : 'text-gray-700 hover:text-red-400'
                } ${isHovered ? 'animate-fade-in delay-100' : ''}`}
              style={{ animationDelay: '100ms' }}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 transition-all duration-200 ${isWishlisted ? 'fill-current' : ''}`} />
            </div>

            <div
              onClick={handleQuickView}
              className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-700 hover:text-blue-400 hover:bg-white transition-all duration-300 ease-out transform hover:scale-110 w-10 h-10 flex items-center justify-center ${isHovered ? 'animate-fade-in delay-200' : ''
                }`}
              style={{ animationDelay: '200ms' }}
              aria-label="Quick view"
            >
              <Eye className="w-5 h-5" />
            </div>

            <div
              onClick={handleAddToCart}
              className={`p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-gray-700 hover:text-primary hover:bg-white transition-all duration-300 ease-out transform hover:scale-110 w-10 h-10 flex items-center justify-center ${isHovered ? 'animate-fade-in delay-300' : ''
                }`}
              style={{ animationDelay: '300ms' }}
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Book Information - Enhanced spacing and typography */}
      <div className="p-4">
        {/* Book Title - Single occurrence with better typography */}
        <h3 className="text-lg font-bold text-foreground mb-3 hover:text-[#2194D1] cursor-pointer transition-colors duration-200 line-clamp-2 leading-tight">
          {book.title}
        </h3>

        {/* Author with enhanced styling */}
        <p className="text-sm text-muted-foreground mb-3 font-medium">
          by {book.author}
        </p>

        {/* Rating with improved design */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 transition-colors ${star <= Math.floor(book.rating) ? 'text-yellow-400 fill-current' :
                    star <= book.rating ? 'text-yellow-400 fill-current opacity-75' :
                      'text-gray-300'
                  }`}
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-muted-foreground font-medium">({book.reviewCount})</span>
        </div>

        {/* Price and action section */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#2194D1]">
            {formatPrice()}
          </span>

          {/* Enhanced mobile div */}
          <div
            onClick={handleAddToCart}
            className="sm:hidden bg-primary text-primary-foreground px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </div>
        </div>
      </div>
    </div>
  );
};