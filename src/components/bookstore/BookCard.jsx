import React, { useState } from 'react';
import { Link, useNavigate } from 'gatsby';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

export const BookCard = ({ book, viewMode }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = () => {
    alert('Quick view opened!');
  };

  const handleOrderBook = () => {
    navigate('/orderPage/', { state: { book } });
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


  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#2194D1]/30 transition-all duration-500 w-full">
        <div className="grid grid-cols-12 gap-6 p-6">
          {/* Book Image Section - 2 columns */}
          <div className="col-span-12 sm:col-span-3 lg:col-span-2">
            <Link to={`/book/${book.id}`} className="block">
              <div className="relative overflow-hidden rounded-xl group-hover:shadow-lg transition-all duration-300">
                <img
                  src={book.image}
                  alt={book.title}
                  className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-[#2194D1] text-white px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                  {book.category}
                </span>
              </div>
              
              {/* Stock status overlay */}
              {!book.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                    Out of Stock
                  </span>
                </div>
              )}
              </div>
            </Link>
          </div>

          {/* Book Information Section - 7 columns */}
          <div className="col-span-12 sm:col-span-6 lg:col-span-7">
            <div className="h-full flex flex-col justify-between">
              {/* Title and Author */}
              <div className="mb-4">
                <Link to={`/book/${book.id}`}>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 hover:text-[#2194D1] transition-colors cursor-pointer leading-tight">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-lg text-gray-600 font-medium">
                  by <span className="text-gray-800 font-semibold">{book.author}</span>
                </p>
              </div>

              {/* Rating and Reviews */}
              <div className="mb-4">
                <div className="flex items-center gap-3">
                  {renderStars(book.rating)}
                  <span className="text-sm text-gray-500 font-medium">({book.reviewCount} reviews)</span>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <span className="text-sm font-semibold text-[#2194D1]">{book.rating}/5</span>
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div className="mb-6">
                  <p className="text-gray-600 leading-relaxed line-clamp-2 lg:line-clamp-3">
                    {book.description}
                  </p>
                </div>
              )}
              
              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Available in multiple formats</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Fast delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Price and Actions Section - 3 columns */}
          <div className="col-span-12 sm:col-span-3 lg:col-span-3">
            <div className="h-full flex flex-col justify-between">
              {/* Stock Status Section */}
              <div className="mb-6">
                <div className="text-right sm:text-left">
                  {book.inStock ? (
                    <div className="flex items-center gap-2 justify-end sm:justify-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">In Stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-end sm:justify-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-red-600">Out of Stock</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleOrderBook}
                  disabled={!book.inStock}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${book.inStock
                      ? 'bg-[#2194D1] text-white hover:bg-[#1e7fb8] shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Order Book</span>
                </button>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleWishlist}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm font-medium ${isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50'
                      }`}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    <span className="hidden lg:inline">Wishlist</span>
                  </button>

                  <button
                    onClick={handleQuickView}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-[#2194D1] hover:text-[#2194D1] hover:bg-blue-50 transition-all duration-200 text-sm font-medium"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden lg:inline">Preview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-[#2194D1]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#2194D1]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
        <Link to={`/book/${book.id}`} className="block">
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

          </div>
          </div>
        </Link>
      </div>

      {/* Book Information - Enhanced spacing and typography */}
      <div className="p-4">
        {/* Book Title - Single occurrence with better typography */}
        <Link to={`/book/${book.id}`}>
          <h3 className="text-lg font-bold text-foreground mb-3 hover:text-[#2194D1] cursor-pointer transition-colors duration-200 line-clamp-2 leading-tight">
            {book.title}
          </h3>
        </Link>

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

      </div>
    </div>
  );
};