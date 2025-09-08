import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import Bookstore from './bookstore';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import MainSlider from '../components/slider/main-slider-2';
import Footer from '../components/footer';
import Layout from '../components/layout';

const testimonials = [
  {
    id: 1,
    title: "What people saying!",
    content: "This is the best book store! A wide variety. The prices are great, and there is always a sale of some kind going on. You can find just what you are looking for here.",
    name: "PAM PRUITT",
    location: "NEW YORK"
  },
  {
    id: 2,
    title: "What people saying!",
    content: "I am so happy to find a site where I can shop for unusual items. The packaging was phenomenal and my book arrived on time in perfect condition.",
    name: "JOEL M",
    location: "NEW YORK"
  },
  {
    id: 3,
    title: "What people saying!",
    content: "Excellent service. The books were wrapped securely and arrived in pristine condition. I sent an email after to books arrived to ask about the author.",
    name: "ELLIE A",
    location: "NEW YORK"
  }
];

const products = [
  {
    id: '111',
    title: 'Rich Dad Poor Dad',
    url: 'https://demo2.pavothemes.com/bookory/product/rich-dad-poor-dad/',
    img: 'https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/35.jpg',
    author: 'Misty Figueroa',
    authorUrl: 'https://demo2.pavothemes.com/bookory/book-author/misty-figueroa/',
    rating: 4.40,
    ratingWidth: '88%',
    reviews: 5,
    description: 'Est numquam harum aut ut. Pariatur cum blanditiis est delectus accusamus eveniet. Quis fugiat eligendi magni eos dignissimos numquam.',
    price: '170.03',
  },
  {
    id: '109',
    title: 'The Story of Success',
    url: 'https://demo2.pavothemes.com/bookory/product/the-story-of-success/',
    img: 'https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/34.jpg',
    author: 'Arthur Gonzalez',
    authorUrl: 'https://demo2.pavothemes.com/bookory/book-author/arthur-gonzalez/',
    rating: 3.60,
    ratingWidth: '72%',
    reviews: 5,
    description: 'Autem natus sed vero accusamus officiis cumque. Est nobis nihil cumque omnis iusto quia. Est quia qui necessitatibus quo ut.',
    price: '50.89',
  },
  {
    id: '107',
    title: 'Annie Leibovitz: Wonderland',
    url: 'https://demo2.pavothemes.com/bookory/product/annie-leibovitz-wonderland/',
    img: 'https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/33.jpg',
    author: 'Dana Chambers',
    authorUrl: 'https://demo2.pavothemes.com/bookory/book-author/dana-chambers/',
    rating: 3.75,
    ratingWidth: '75%',
    reviews: 5,
    description: 'Nesciunt repellendus culpa alias pariatur vitae temporibus. Itaque dolorum quod consequuntur aliquid reprehenderit harum architecto. Quaerat minima non quo tempora…',
    price: '316.15',
  },
  {
    id: '105',
    title: 'My Dearest Darkest',
    url: 'https://demo2.pavothemes.com/bookory/product/my-dearest-darkest/',
    img: 'https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/32.jpg',
    author: 'Enrique Wallace',
    authorUrl: 'https://demo2.pavothemes.com/bookory/book-author/enrique-wallace/',
    rating: 3.25,
    ratingWidth: '65%',
    reviews: 5,
    description: 'Sint magnam sed optio est ut. Rerum facilis eos voluptatum non. Eius asperiores nulla amet.',
    price: '914.53',
  },
  {
    id: '103',
    title: 'House of Sky and Breath',
    url: 'https://demo2.pavothemes.com/bookory/product/house-of-sky-and-breath/',
    img: 'https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/31.jpg',
    author: 'Ernesto Wade',
    authorUrl: 'https://demo2.pavothemes.com/bookory/book-author/ernesto-wade/',
    rating: 3.50,
    ratingWidth: '70%',
    reviews: 5,
    description: 'Quis est iste et aliquam similique facere. Corrupti et et laborum ab. Voluptatem ea possimus quaerat sit laborum sed non.',
    price: '72.99',
  },
  {
    id: '101',
    title: 'Surrounded by Idiots',
    url: 'https://demo2.pavothemes.com/bookory/product/surrounded-by-idiots/',
    img: 'https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/30.jpg',
    author: 'Georgia Ramirez',
    authorUrl: 'https://demo2.pavothemes.com/bookory/book-author/georgia-ramirez/',
    rating: 3.75,
    ratingWidth: '75%',
    reviews: 5,
    description: 'Cupiditate voluptatem earum iure nam laudantium. Saepe dolorem ea occaecati eius.',
    price: '825.85',
  },
];

const StarRating = ({ rating, reviews }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 mb-2 md:mb-3">
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
      <span className="text-xs sm:text-sm text-gray-600 ml-1">({reviews})</span>
    </div>
  );
};

const TestimonialsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <section
      className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden"
      style={{
        backgroundImage: `url('https://demo2.pavothemes.com/bookory/wp-content/uploads/2022/02/h1-bg2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="absolute top-[60px] sm:top-[80px] md:top-[110px] h-full w-full">
            <div className="flex items-center justify-center md:justify-start md:pl-8 lg:pl-16">
              <div className="w-full max-w-sm md:max-w-md">
                <div className="bg-white rounded-2xl md:rounded-br-none md:rounded-bl-none shadow-2xl px-6 sm:px-8 md:px-10 py-8 sm:py-10 md:py-12 text-center transform transition-all duration-500 ease-in-out">
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-gray-500 text-base sm:text-lg font-normal mb-2 md:mb-3">
                      {testimonials[currentSlide].title}
                    </h3>
                    <div className="w-12 sm:w-16 h-0.5 bg-gray-300 mx-auto"></div>
                  </div>
                  <div className="mb-6 md:mb-8">
                    <p className="text-gray-900 text-sm sm:text-base md:text-lg leading-relaxed font-medium">
                      "{testimonials[currentSlide].content}"
                    </p>
                  </div>
                  <div className="mb-6 md:mb-8">
                    <div className="text-xs sm:text-sm font-semibold text-gray-600 tracking-wider">
                      <span className="block">{testimonials[currentSlide].name}</span>
                      <span className="text-gray-400 font-normal">/ {testimonials[currentSlide].location}</span>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-2 md:space-x-3">
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 cursor-pointer ${currentSlide === index
                            ? 'w-6 md:w-8 h-1.5 md:h-2 bg-[#2194D1] rounded-full'
                            : 'w-1.5 md:w-2 h-1.5 md:h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                          }`}
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
  );
};

const TrendingProducts = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const sliderRef = useRef(null);
  const animationRef = useRef(null);

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

  const handleMouseUp = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsDragging(false);
    if (Math.abs(velocity) > 5) {
      const momentum = velocity * 15;
      const startScroll = sliderRef.current.scrollLeft;
      let start = null;
      const animateScroll = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const duration = Math.min(800, Math.abs(momentum) * 2);
        if (progress < duration) {
          const easeOut = 1 - Math.pow(1 - progress / duration, 3);
          sliderRef.current.scrollLeft = startScroll + (momentum * easeOut);
          animationRef.current = requestAnimationFrame(animateScroll);
        }
      };
      animationRef.current = requestAnimationFrame(animateScroll);
    }
  };

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

      <div className="container mx-auto px-4 sm:px-8 md:px-16 lg:px-40 relative flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-4">
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
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[380px] md:w-[450px] lg:w-[520px] transition-transform duration-200 hover:scale-[1.02]">
              <div className="rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row h-auto sm:h-64 md:h-72">
                  <div className="w-full sm:w-40 md:w-48 lg:w-56 flex-shrink-0 mb-4 sm:mb-0">
                    <a href={product.url}>
                      <img
                        src={product.img}
                        alt={product.title}
                        className="w-full h-48 sm:h-full object-cover transition-transform duration-300 hover:scale-105 rounded-xl md:rounded-2xl"
                        draggable={false}
                      />
                    </a>
                  </div>
                  <div className="flex-1 sm:p-4 md:p-7 flex flex-col gap-2 py-2 sm:py-5 justify-center">
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
                        <a href={product.url} className="text-[#2194D1] hover:text-[#204b62] transition-colors">
                          {product.title}
                        </a>
                      </h3>
                      <StarRating rating={product.rating} reviews={product.reviews} />
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3 font-medium">
                        by <a href={product.authorUrl} className="text-[#2194D1] hover:text-[#204b62] hover:underline transition-colors">{product.author}</a>
                      </p>
                      <p className="text-xs sm:text-sm text-gray-700 mb-3 md:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#2194D1] hover:text-[#204b62] hover:underline transition-colors">${product.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 md:mt-6 gap-2">
          {products.map((_, index) => (
            <div key={index} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-300 rounded-full transition-colors duration-200" />
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
  return (
    <Layout pageTitle="Books || Hope For All Mena Ministry">
      <HeaderTwo />
      <div className="min-h-screen">
        {/* Header */}
        <StickyHeader />

        {/* Hero Section */}
        <MainSlider />

        {/* Trending Products */}
        <TrendingProducts />
        <TestimonialsCarousel />

        {/* Shop Section */}
        <section className="container sm:py-12 md:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">Our Complete Book Collection</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                Discover thousands of books across all genres. Filter by category, price, or rating to find your perfect read.
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