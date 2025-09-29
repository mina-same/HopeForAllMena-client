import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { graphql } from 'gatsby';
import { Link, useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import Bookstore from '../components/bookstore';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import MainSliderBooks from '../components/slider/MainSliderBooks';
import Footer from '../components/footer';
import Layout from '../components/layout';
import { booksAPI } from '../services/api';

const getTestimonials = (t) => [
  {
    id: 1,
    title: t('testimonials.title'),
    content: t('testimonials.items.0.content'),
    name: t('testimonials.items.0.name'),
    location: t('testimonials.items.0.location')
  },
  {
    id: 2,
    title: t('testimonials.title'),
    content: t('testimonials.items.1.content'),
    name: t('testimonials.items.1.name'),
    location: t('testimonials.items.1.location')
  },
  {
    id: 3,
    title: t('testimonials.title'),
    content: t('testimonials.items.2.content'),
    name: t('testimonials.items.2.name'),
    location: t('testimonials.items.2.location')
  }
];

const StarRating = ({ rating, reviews }) => {
  const { t } = useTranslation('Books');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 mb-2 md:mb-3 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
        ))}
      </div>
      <span className={`text-xs sm:text-sm text-gray-600 ${currentLanguage === 'ar' ? 'mr-1' : 'ml-1'}`}>({reviews} {t('trending.reviews')})</span>
    </div>
  );
};

const TestimonialsCarousel = () => {
  const { t } = useTranslation('Books');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonials = getTestimonials(t);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .testimonials-carousel h3,
          .testimonials-carousel p,
          .testimonials-carousel span {
            text-align: center;
            direction: rtl;
          }
          .testimonials-carousel [dir="rtl"] .space-x-2,
          .testimonials-carousel [dir="rtl"] .space-x-3 {
            --tw-space-x-reverse: 1;
          }
        `}</style>
      )}
      <section
        className="testimonials-carousel relative w-full h-[350px] xs:h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden"
        style={{
          backgroundImage: `url('https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/h1-bg2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      >
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8">
          <div className="absolute top-[180px] xs:top-[180px] sm:top-[180px] md:top-[180px] h-full w-full">
            <div className="flex items-center justify-center md:justify-start md:pl-8 lg:pl-16">
              <div className="w-full max-w-xs xs:max-w-sm md:max-w-md lg:max-w-lg">
                <div className="bg-white rounded-xl xs:rounded-2xl md:rounded-br-none md:rounded-bl-none shadow-2xl px-4 xs:px-6 sm:px-8 md:px-10 py-6 xs:py-8 sm:py-10 md:py-12 text-center transform transition-all duration-500 ease-in-out">
                  <div className="mb-4 xs:mb-6 md:mb-8">
                    <h3 className="text-gray-500 text-sm xs:text-base sm:text-lg md:text-xl font-normal mb-2 md:mb-3">
                      {testimonials[currentSlide].title}
                    </h3>
                    <div className="w-8 xs:w-12 sm:w-16 h-0.5 bg-gray-300 mx-auto"></div>
                  </div>
                  <div className="mb-4 xs:mb-6 md:mb-8">
                    <p className="text-gray-900 text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-medium px-2 xs:px-0">
                      "{testimonials[currentSlide].content}"
                    </p>
                  </div>
                  <div className="mb-4 xs:mb-6 md:mb-8">
                    <div className="text-xs sm:text-sm md:text-base font-semibold text-gray-600 tracking-wider">
                      <span className="block">{testimonials[currentSlide].name}</span>
                      <span className="text-gray-400 font-normal text-xs sm:text-sm">/ {testimonials[currentSlide].location}</span>
                    </div>
                  </div>
                  <div className={`flex justify-center ${currentLanguage === 'ar' ? 'flex-row-reverse gap-1.5 xs:gap-2 md:gap-3' : 'space-x-1.5 xs:space-x-2 md:space-x-3'}`}>
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 cursor-pointer touch-manipulation ${currentSlide === index
                            ? 'w-4 xs:w-5 sm:w-6 md:w-8 h-1.5 md:h-2 bg-[#2194D1] rounded-full'
                            : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 rounded-full hover:bg-gray-400 active:bg-gray-500'
                          }`}
                        role="button"
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="absolute top-16 left-8 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full opacity-60"></div>
              <div className="absolute top-32 right-12 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full opacity-40"></div>
              <div className="absolute bottom-20 left-16 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full opacity-70"></div>
              <div className="absolute bottom-32 right-8 w-3 h-3 md:w-5 md:h-5 bg-white rounded-full opacity-50"></div>
              <div className="absolute top-12 left-12">
                <div className="relative w-4 h-4 md:w-6 md:h-6">
                  <div className="absolute top-1/2 left-0 w-4 md:w-6 h-0.5 bg-white opacity-80 transform -translate-y-1/2"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-4 md:h-6 bg-white opacity-80 transform -translate-x-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

const TrendingProducts = () => {
  const { t } = useTranslation('Books');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
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
        const apiParams = {
          page: 1,
          limit: 8,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          status: 'published',
          language: currentLanguage // Add language parameter for API
        };
        
        console.log('=== API CALL DEBUG ===');
        console.log('API Parameters:', apiParams);
        console.log('Current Language:', currentLanguage);
        
        const response = await booksAPI.getBooks(apiParams);
        
        console.log('=== API RESPONSE DEBUG ===');
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        if (response.data?.books?.length > 0) {
          console.log('First Book Sample:', response.data.books[0]);
          console.log('First Book Author:', response.data.books[0].author);
        }
        
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
  }, [currentLanguage]); // Re-fetch when language changes

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

      <div className="container mx-auto px-4 py-10 sm:px-8 md:px-16 lg:px-40 relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className={`flex items-center w-full sm:w-auto ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
          <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 ${currentLanguage === 'ar' ? 'ml-4' : 'mr-4'}`}>{t('trending.title')}</h2>
          <div className="h-px bg-gray-300 flex-1 sm:w-16 md:w-32"></div>
        </div>
        <Link to="/books" className="flex items-center gap-2 bg-[#2194D1] text-white px-4 md:px-6 py-2 rounded-full hover:bg-[#2194D1]/90 transition-colors cursor-pointer text-sm md:text-base">
          <span className="hidden sm:inline">{t('trending.viewAll')}</span>
          <span className="sm:hidden">{t('trending.viewAll')}</span>
          <ChevronRight className={`w-4 h-4 ${currentLanguage === 'ar' ? 'rotate-180' : ''}`} />
        </Link>
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
              <span className="ml-3 text-gray-600">{t('trending.loading')}</span>
            </div>
          ) : (
            books.map((book, index) => {
              // Handle Arabic content based on language - using correct database field names
              const bookTitle = currentLanguage === 'ar' ? 
                (book.titleAr || book.title) : 
                book.title;
              
              const bookDescription = currentLanguage === 'ar' ? 
                (book.descriptionAr || book.shortDescriptionAr || book.description || book.shortDescription) : 
                (book.description || book.shortDescription);
              
              const authorName = currentLanguage === 'ar' ? 
                (book.author?.nameAr || book.author?.name) : 
                book.author?.name;
              
              // Debug: Log complete book data to see what's being returned
              if (currentLanguage === 'ar' && index === 0) {
                console.log('=== COMPLETE BOOK DATA DEBUG ===');
                console.log('Current Language:', currentLanguage);
                console.log('Full Book Object:', book);
                console.log('Book Keys:', Object.keys(book));
                console.log('Book Title (EN):', book.title);
                console.log('Book Title (AR):', book.titleAr);
                console.log('Author Object:', book.author);
                if (book.author) {
                  console.log('Author Keys:', Object.keys(book.author));
                  console.log('Author Name (EN):', book.author.name);
                  console.log('Author Name (AR):', book.author.nameAr);
                }
                console.log('=== FINAL RENDERED VALUES ===');
                console.log('Rendered Book Title:', bookTitle);
                console.log('Rendered Author Name:', authorName);
                console.log('Rendered Description:', bookDescription);
              }
              
              return (
                <div key={book._id} className="flex-shrink-0 flex-center w-[280px] xs:w-[320px] sm:w-[380px] md:w-[450px] lg:w-[520px] xl:w-[580px] transition-transform duration-200 hover:scale-[1.02]">
                  <div className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-3 sm:p-4 md:p-6 h-[420px] xs:h-[440px] sm:h-[340px] md:h-[360px] lg:h-[380px] ${cardColors[index % cardColors.length]}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={`flex ${currentLanguage === 'ar' ? 'flex-col-reverse sm:flex-row-reverse' : 'flex-col sm:flex-row'} h-full`}>
                      <div className="w-full sm:w-44 md:w-52 lg:w-60 xl:w-64 flex-shrink-0 mb-4 sm:mb-0">
                        <Link to={`/book/${book._id}`}>
                          <img
                            src={book.coverImageUrl || '/default-book-cover.jpg'}
                            alt={bookTitle}
                            className="w-full max-w-[220px] xs:max-w-[240px] sm:w-full h-[220px] xs:h-[240px] sm:h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg sm:rounded-xl md:rounded-2xl mx-auto sm:mx-0"
                            style={{ aspectRatio: '3/4' }}
                            draggable={false}
                          />
                        </Link>
                      </div>
                      <div className={`flex-1 sm:p-4 md:p-6 lg:p-7 flex flex-col justify-between h-full sm:h-auto py-1 xs:py-2 sm:py-0 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className="flex-1 flex flex-col justify-between">
                          {/* Title - Optimized spacing */}
                          <div className="mb-1 xs:mb-2 sm:mb-3">
                            <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-tight line-clamp-2">
                              <Link to={`/book/${book._id}`} className="text-[#2194D1] hover:text-[#204b62] transition-colors">
                                {bookTitle}
                              </Link>
                            </h3>
                          </div>
                          
                          {/* Rating - Compact */}
                          <div className="mb-1 xs:mb-2 sm:mb-3">
                            <StarRating rating={book.averageRating || 0} reviews={book.totalReviews || 0} />
                          </div>
                          
                          {/* Author - Compact */}
                          <div className="mb-1 xs:mb-2 sm:mb-3">
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 font-medium line-clamp-1">
                              {t('trending.byAuthor')} <Link to={`/author/${book.author?.slug}`} className="text-[#2194D1] hover:text-[#204b62] hover:underline transition-colors">{authorName || t('trending.unknownAuthor')}</Link>
                            </p>
                          </div>
                          
                          {/* Description - Flexible */}
                          <div className="flex-1 min-h-0">
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 line-clamp-2 xs:line-clamp-3 sm:line-clamp-3 md:line-clamp-4 leading-relaxed">{bookDescription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className={`flex justify-center mt-4 md:mt-6 ${currentLanguage === 'ar' ? 'flex-row-reverse gap-1.5 sm:gap-2 md:gap-3' : 'space-x-1.5 sm:space-x-2 md:space-x-3'}`}>
          {books.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 cursor-pointer touch-manipulation ${
                currentSlide === index
                  ? 'w-4 xs:w-5 sm:w-6 md:w-8 h-1.5 md:h-2 bg-[#2194D1] rounded-full'
                  : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 rounded-full hover:bg-gray-400 active:bg-gray-500'
              }`}
              role="button"
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

const TrendingPage = () => {
  const { t } = useTranslation('Books');

  return (
    <Layout pageTitle={`${t('pageTitle')} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <div className="min-h-screen">
        {/* Header */}
        <StickyHeader />

        {/* Hero Section */}
        <MainSliderBooks />

        {/* Trending Products */}
        <TrendingProducts />
        <TestimonialsCarousel />

        {/* Shop Section */}
        <section className="container pt-8 xs:pt-12 sm:py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-6 xs:mb-8 md:mb-12">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">{t('collection.title')}</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                {t('collection.description')}
              </p>
            </div>
            <Bookstore />
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </Layout>
  );
};

export default TrendingPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;