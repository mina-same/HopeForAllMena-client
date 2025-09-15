import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'gatsby';
import { ChevronRight } from 'lucide-react';
import { booksAPI } from '../../services/api';
import StarRating from './StarRating';

const TrendingProducts = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

  // Define simple background colors for cards
  const cardColors = [
    'bg-blue-50',
    'bg-green-50', 
    'bg-purple-50',
    'bg-pink-50',
    'bg-yellow-50',
    'bg-indigo-50',
    'bg-red-50',
    'bg-orange-50'
  ];

  // Calculate current slide based on scroll position
  const updateCurrentSlide = useCallback(() => {
    if (sliderRef.current && books.length > 0) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const cardWidth = sliderRef.current.scrollWidth / books.length;
      const newSlide = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(Math.min(Math.max(newSlide, 0), books.length - 1));
    }
  }, [books.length]);

  // Go to specific slide
  const goToSlide = useCallback((index) => {
    if (sliderRef.current && books.length > 0) {
      const cardWidth = sliderRef.current.scrollWidth / books.length;
      sliderRef.current.scrollTo({
        left: cardWidth * index,
        behavior: 'smooth'
      });
      setCurrentSlide(index);
    }
  }, [books.length]);

  // Fetch latest 8 books from database
  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        setLoading(true);
        const response = await booksAPI.getBooks({
          page: 1,
          limit: 8,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          status: 'published'
        });
        
        if (response.status === 'success') {
          setBooks(response.data.books);
        }
      } catch (error) {
        console.error('Error fetching latest books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  // Update current slide on scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      const handleScroll = () => {
        if (!isDragging) {
          updateCurrentSlide();
        }
      };
      
      slider.addEventListener('scroll', handleScroll);
      return () => slider.removeEventListener('scroll', handleScroll);
    }
  }, [updateCurrentSlide, isDragging]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    setLastX(e.pageX);
    setLastTime(Date.now());
    setVelocity(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(velocity) > 0.5 && sliderRef.current) {
      const momentum = velocity * 50;
      const startScroll = sliderRef.current.scrollLeft;
      
      let start = null;
      const animateScroll = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const duration = Math.min(1000, Math.abs(momentum) * 3);
        if (progress < duration) {
          const easeOut = 1 - Math.pow(1 - progress / duration, 3);
          sliderRef.current.scrollLeft = startScroll + (momentum * easeOut);
          animationRef.current = requestAnimationFrame(animateScroll);
        } else {
          // Update slide after animation completes
          updateCurrentSlide();
        }
      };
      animationRef.current = requestAnimationFrame(animateScroll);
    } else {
      // Update slide immediately if no momentum
      updateCurrentSlide();
    }
  }, [isDragging, velocity, updateCurrentSlide]);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    const distance = e.pageX - lastX;
    if (timeDelta > 0) setVelocity(distance / timeDelta);
    setLastX(e.pageX);
    setLastTime(currentTime);
  };

  const handleTouchStart = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(true);
    const touch = e.touches[0];
    setStartX(touch.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
    setLastX(touch.pageX);
    setLastTime(Date.now());
    setVelocity(0);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default scroll behavior
    e.stopPropagation(); // Prevent event bubbling
    const touch = e.touches[0];
    const x = touch.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft - walk;
    const currentTime = Date.now();
    const timeDelta = currentTime - lastTime;
    const distance = touch.pageX - lastX;
    if (timeDelta > 0) setVelocity(distance / timeDelta);
    setLastX(touch.pageX);
    setLastTime(currentTime);
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(false);
    if (Math.abs(velocity) > 2) {
      const momentum = velocity * 20;
      const startScroll = sliderRef.current.scrollLeft;
      let start = null;
      const animateScroll = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const duration = Math.min(1000, Math.abs(momentum) * 3);
        if (progress < duration) {
          const easeOut = 1 - Math.pow(1 - progress / duration, 3);
          sliderRef.current.scrollLeft = startScroll + (momentum * easeOut);
          animationRef.current = requestAnimationFrame(animateScroll);
        }
      };
      animationRef.current = requestAnimationFrame(animateScroll);
    }
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <section className="mx-auto py-4 md:py-8 px-4">

      <div className="container mx-auto px-4 py-10 sm:px-8 md:px-16 lg:px-40 relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center w-full sm:w-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mr-4">What's In Trend</h2>
          <div className="h-px bg-gray-300 flex-1 sm:w-16 md:w-32"></div>
        </div>
        <div className="flex items-center gap-2 bg-[#2194D1] text-white px-4 md:px-6 py-2 rounded-full hover:bg-[#2194D1]/90 transition-colors cursor-pointer text-sm md:text-base">
          <span className="hidden sm:inline">View All</span>
          <span className="sm:hidden">View All</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      <div className="w-full px-2 sm:px-4">
        <div
          ref={sliderRef}
          className={`flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto overflow-y-hidden scrollbar-hide pb-4 transition-all duration-200 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            scrollBehavior: isDragging ? 'auto' : 'smooth',
            touchAction: 'pan-x'
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {loading ? (
            <div className="flex items-center justify-center w-full h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2194D1]"></div>
            </div>
          ) : (
            books.map((book, index) => (
              <div key={book._id} className="flex-shrink-0 flex-center w-[280px] sm:w-[380px] md:w-[450px] lg:w-[520px] transition-transform duration-200 hover:scale-[1.02]">
                <div className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-3 sm:p-4 md:p-6 h-[380px] sm:h-[340px] md:h-[360px] ${cardColors[index % cardColors.length]}`}>
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="w-full sm:w-44 md:w-52 lg:w-60 flex-shrink-0 mb-4 sm:mb-0">
                      <Link to={`/book/${book._id}`}>
                        <img
                          src={book.coverImageUrl || '/default-book-cover.jpg'}
                          alt={book.title}
                          className="w-[240px] h-[250px] sm:h-full object-cover transition-transform duration-300 hover:scale-105 rounded-xl md:rounded-2xl"
                          style={{ aspectRatio: '3/4' }}
                          draggable={false}
                        />
                      </Link>
                    </div>
                    <div className="flex-1 sm:p-4 md:p-7 flex flex-col justify-between h-full sm:h-auto py-2 sm:py-0">
                      <div className="flex-1 flex flex-col">
                        <div className="min-h-[3rem] sm:min-h-[4rem] md:min-h-[5rem] flex items-start mb-2 md:mb-3">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-tight">
                            <Link to={`/book/${book._id}`} className="text-[#2194D1] hover:text-[#204b62] transition-colors">
                              {book.title}
                            </Link>
                          </h3>
                        </div>
                        <StarRating rating={book.averageRating || 0} reviews={book.totalReviews || 0} />
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3 font-medium line-clamp-1">
                          by <a href={`/author/${book.author?.slug}`} className="text-[#2194D1] hover:text-[#204b62] hover:underline transition-colors">{book.author?.name || 'Unknown Author'}</a>
                        </p>
                        <div className="flex-1">
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 sm:line-clamp-3 leading-relaxed">{book.description || book.shortDescription}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center mt-4 md:mt-6 space-x-2 md:space-x-3">
          {books.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 cursor-pointer ${
                currentSlide === index
                  ? 'w-6 md:w-8 h-1.5 md:h-2 bg-[#2194D1] rounded-full'
                  : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 rounded-full hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default TrendingProducts;
