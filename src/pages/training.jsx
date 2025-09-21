import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Link, useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { GraduationCap, Users, BookOpen } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import StickyHeader from "../components/header/sticky-header";
import Layout from "../components/layout";
import Footer from "../components/footer";
import HeaderTwo from '../components/header/header-two';

// Import training hero slider images
import trainingImg1 from '../assets/images/Training/live training/01.jpg';
import trainingImg2 from '../assets/images/Training/live training/02.jpg';
import trainingImg3 from '../assets/images/Training/live training/03.jpg';
import trainingImg4 from '../assets/images/Training/live training/04.jpg';

// Training hero slider images array
const trainingHeroImages = [
  trainingImg1, trainingImg2, trainingImg3, trainingImg4
];

// Training Image Slider Component
const TrainingHeroSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(new Set());

  // Preload all images for smooth transitions
  useEffect(() => {
    const preloadImages = () => {
      trainingHeroImages.forEach((src, index) => {
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
        (prevIndex + 1) % trainingHeroImages.length
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0">
      {trainingHeroImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={src}
            alt={`Training Background ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index < 2 ? "eager" : "lazy"}
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


const TrainingPage = () => {
  const { t } = useTranslation('Training');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const [trainingBooks, setTrainingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch training books from backend
  useEffect(() => {
    const fetchTrainingBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/training-books');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const books = await response.json();
        
        // Format books data for display
        const formattedBooks = books.map((book) => ({
          ...book,
          image: book.coverImageUrl,
          // Keep original field names from backend
          title: book.name, // Fallback for compatibility
          description: book.description || book.descriptionAr || 'Training manual for ministry development'
        }));
        
        setTrainingBooks(formattedBooks);
      } catch (err) {
        console.error('Error fetching training books:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingBooks();
  }, []);

  return (
    <Layout pageTitle={t('pageTitle')}>
      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>

        {/* Hero Section */}
        <section className="relative h-[80vh] py-20 lg:py-32 overflow-hidden">
          <TrainingHeroSlider />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                <GraduationCap className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">{t('hero.badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight text-white">
                {t('hero.title')}{' '}
                <span className="bg-gradient-to-r from-white via-white/90 to-accent bg-clip-text text-transparent">
                  {t('hero.titleHighlight')}
                </span>
              </h1>

              <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-4 text-white/80">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-white" />
                    <span className="font-medium">{t('hero.features.localChurches')}</span>
                  </div>
                  <div className="w-px h-6 bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-accent" />
                    <span className="font-medium">{t('hero.features.provenCurricula')}</span>
                  </div>
                  <div className="w-px h-6 bg-white/30"></div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-white" />
                    <span className="font-medium">{t('hero.features.expertTraining')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training Books Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
                {t('materials.title')}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {t('materials.description')}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground">{t('materials.loading')}</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-600 font-medium">{t('materials.error')}</p>
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                </div>
              </div>
            )}

            {/* Training Books Grid */}
            {!loading && !error && trainingBooks.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trainingBooks.map((book, index) => (
                  <Card key={book._id || book.id} className="group border-0 shadow-elegant bg-card hover:shadow-glow transition-all duration-500 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Book Image */}
                        <div className="aspect-[3/4] relative overflow-hidden">
                          <img
                            src={book.image}
                            alt={book.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=center';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                          {/* Overlay Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <BookOpen className="w-3 h-3" />
                              </div>
                              <span className="text-xs font-medium opacity-90">
                                {book.parts?.length || 0} {t('materials.parts')}
                              </span>
                            </div>

                            <h3 className="text-lg text-white font-bold mb-2 leading-tight line-clamp-2">
                              {currentLanguage === 'ar' ? (book.nameAr || book.name || book.title) : (book.name || book.title)}
                            </h3>

                            <p className="text-xs opacity-90 leading-relaxed line-clamp-2 mb-3">
                              {currentLanguage === 'ar' ? (book.descriptionAr || book.description) : book.description}
                            </p>

                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-xs font-medium">{t('materials.available')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && trainingBooks.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('materials.emptyState')}</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#2194D1]">{t('cta.badge')}</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
                {t('cta.title')}{' '}
                <span className="text-[#2194D1]">{t('cta.titleHighlight')}</span>
              </h2>

              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                {t('cta.description')}
              </p>

              <Link to="/TrainingSelectionPage">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold px-12 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  {t('cta.button')}
                </Button>
              </Link>

              <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{t('cta.features.consultation')}</span>
                </div>
                <div className="w-px h-4 bg-border hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{t('cta.features.customPlans')}</span>
                </div>
                <div className="w-px h-4 bg-border hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>{t('cta.features.ongoingSupport')}</span>
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

export default TrainingPage;

// GraphQL query for i18n
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

// Gatsby head export for SEO
export const Head = ({ data }) => {
  const { t } = useTranslation('Training');
  return (
    <>
      <title>{t('pageTitle')}</title>
      <meta name="description" content={t('seoDescription')} />
    </>
  );
};