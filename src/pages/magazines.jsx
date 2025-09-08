import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Import hero slider images
import img01 from '../assets/images/magazines/give away/01.jpeg';
import img02 from '../assets/images/magazines/give away/02.jpeg';
import img03 from '../assets/images/magazines/give away/03.jpeg';
import img04 from '../assets/images/magazines/give away/04.jpeg';
import img05 from '../assets/images/magazines/give away/05.jpeg';
import img06 from '../assets/images/magazines/give away/06.jpeg';
import img07 from '../assets/images/magazines/give away/07.jpeg';
import img08 from '../assets/images/magazines/give away/08.jpeg';
import img09 from '../assets/images/magazines/give away/09.jpeg';
import img10 from '../assets/images/magazines/give away/10.jpeg';
import img11 from '../assets/images/magazines/give away/11.jpeg';
import img12 from '../assets/images/magazines/give away/12.jpeg';
import img13 from '../assets/images/magazines/give away/13.jpeg';
import img14 from '../assets/images/magazines/give away/14.jpeg';
import Layout from '../components/layout';
import StickyHeader from '../components/header/sticky-header';
import HeaderTwo from '../components/header/header-two';
import Footer from "../components/footer"

// Hero slider images array
const heroImages = [
  img01, img02, img03, img04, img05, img06, img07,
  img08, img09, img10, img11, img12, img13, img14
];

const magazines = [
  {
    id: '1',
    title: 'The Great Book, the Book of Hope',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    coverImageUrl: require('../assets/images/magazines/The Great Book, the Book of Hope.jpg').default,
    publishDate: '2024-03-01',
    category: 'Lifestyle'
  },
  {
    id: '2',
    title: 'The Book of Hope',
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    coverImageUrl: require('../assets/images/magazines/The Book of Hope.jpg').default,
    publishDate: '2024-02-15',
    category: 'Devotional'
  },
  {
    id: '3',
    title: 'The Gift That Changes Everything',
    description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt.',
    coverImageUrl: require('../assets/images/magazines/The Gift That Changes Everything.jpg').default,
    publishDate: '2024-02-01',
    category: 'Youth'
  },
  {
    id: '4',
    title: 'A Journey in the World of the Bible',
    description: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    coverImageUrl: require('../assets/images/magazines/A Journey in the World of the Bible.jpg').default,
    publishDate: '2024-01-15',
    category: 'Family'
  },
  {
    id: '5',
    title: 'The Bible for Children',
    description: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio.',
    coverImageUrl: require('../assets/images/magazines/The Bible for Children.jpg').default,
    publishDate: '2024-01-01',
    category: 'Biblical Study',
    orientation: 'horizontal'
  },
  {
    id: '6',
    title: 'The Path of Hope',
    description: 'Cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus.',
    coverImageUrl: require('../assets/images/magazines/The Path of Hope.jpg').default,
    publishDate: '2023-12-15',
    category: 'Missions'
  },
  {
    id: '7',
    title: 'On the Edge',
    description: 'Saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus.',
    coverImageUrl: require('../assets/images/magazines/On the Edge.jpg').default,
    publishDate: '2023-12-01',
    category: 'Worship',
    orientation: 'horizontal'
  }
];

// Hero Image Slider Component
const HeroImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  // Preload all images for smooth transitions
  useEffect(() => {
    const preloadImages = () => {
      heroImages.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          setImagesLoaded(prev => new Set([...prev, index]));
        };
      });
    };
    preloadImages();
  }, []);

  // Auto-advance slider every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {heroImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={src}
            alt={`Magazine Hero Background ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index < 3 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
            sizes="100vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
    </div>
  );
};

// Optimized image component with lazy loading and intersection observer
const MagazineImage = ({ src, alt, className, isHorizontal = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const imgRef = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' } // Start loading 50px before the image enters viewport
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="relative">
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 bg-muted/20 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            contentVisibility: 'auto',
            containIntrinsicSize: isHorizontal ? '400px 200px' : '300px 400px'
          }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
    </div>
  );
};

const MagazinePage = () => {
  return (
    <Layout >
      <HeaderTwo />
      <StickyHeader />

      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <HeroImageSlider />

          <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
            <div className="mb-8">
              <Badge variant="secondary" className="text-sm px-4 py-2 bg-white/20 text-white border-white/30 mb-6">
                Publishing Excellence
              </Badge>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent leading-tight">
              Discover Our
              <span className="block text-accent">Magazines</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
              Inspiring content that strengthens faith, builds community, and guides spiritual growth through carefully curated articles and devotionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge variant="outline" className="text-lg px-6 py-3 bg-white/10 text-white border-white/30 backdrop-blur-sm">
                {magazines.length} Available Magazines
              </Badge>
              <Link to="/magazines/request">
                <Button size="lg" className="bg-gradient-to-r from-accent to-theme-base text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-3">
                  Request Magazines
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Magazines Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/20">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Featured Publications
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Each magazine is carefully crafted to provide meaningful content that enriches your spiritual journey
              </p>
            </div>

            <div className="space-y-24">
              {magazines.map((magazine, index) => (
                <div
                  key={magazine.id}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 items-center`}
                >
                  {/* Magazine Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative group">
                      <div className="absolute -inset-6 bg-gradient-to-r from-accent/10 via-theme-primary/10 to-theme-base/10 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60" />
                      <div className="relative bg-card rounded-3xl overflow-hidden shadow-elegant group-hover:shadow-modern transition-all duration-500 border border-border/30">
                        <div className={`overflow-hidden ${
                          magazine.orientation === 'horizontal' 
                            ? 'aspect-[4/3]' 
                            : 'aspect-[3/4]'
                        }`}>
                          <MagazineImage
                            src={magazine.coverImageUrl}
                            alt={magazine.title}
                            className={`w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700`}
                            isHorizontal={magazine.orientation === 'horizontal'}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>

                  {/* Magazine Content */}
                  <div className="w-full lg:w-1/2 space-y-8">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <Badge className="bg-gradient-to-r from-accent to-theme-base text-white px-4 py-2 text-sm font-medium">
                          {magazine.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                          <span className="text-sm font-medium">
                            {new Date(magazine.publishDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long'
                            })}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                        {magazine.title}
                      </h3>
                    </div>

                    <p className="text-lg text-muted-foreground leading-relaxed font-light">
                      {magazine.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Request Form Link */}
            <div className="mt-32">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/5 via-theme-primary/5 to-theme-base/5 border border-accent/20">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
                <div className="relative p-16 text-center">
                  <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent to-theme-base rounded-full mb-8">
                      <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                      Request Our Magazines
                    </h3>
                    <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                      Bring our inspiring publications to your church or community. Our magazines are designed to strengthen faith and build meaningful connections.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/magazines/request">
                        <Button size="lg" className="bg-gradient-to-r from-accent to-theme-base text-white shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-10 py-4">
                          Start Your Request
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </Layout>
  );
};

export default MagazinePage;