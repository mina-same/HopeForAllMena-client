import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import '../assets/css/404-rtl.css';

const NotFoundPage = () => {
  const { t } = useTranslation('NotFound');
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === 'ar';
  
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const brandPrimary = '#2194D1';

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleButtonClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Layout pageTitle={`${t('pageTitle')} || Hope For All Mena`}>
      <HeaderTwo />
      <StickyHeader />
      
      {/* Background decorative elements */}
      <div 
        className={isRTL ? 'decorative-right' : ''}
        style={{
          position: 'absolute',
          top: '10%',
          left: isRTL ? 'auto' : '5%',
          right: isRTL ? '5%' : 'auto',
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${brandPrimary}20 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 0
        }}
      />
      <div 
        className={isRTL ? 'decorative-left' : ''}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: isRTL ? 'auto' : '10%',
          left: isRTL ? '10%' : 'auto',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, ${brandPrimary}15 0%, transparent 70%)`,
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 0
        }}
      />

      <div 
        className="d-flex align-items-center min-vh-100 position-relative"
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          overflow: 'hidden'
        }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
          <Row className="justify-content-center text-center">
            <Col lg={8} md={10}>
              {/* Main 404 Content */}
              <div 
                className={`mb-5 ${isVisible ? 'fade-in' : 'opacity-0'} ${isRTL ? 'rtl-layout' : ''}`}
                style={{
                  transition: 'all 0.8s ease-out',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                }}
              >
                {/* Animated 404 Number */}
                <div className="position-relative mb-4">
                  <h1 
                    className="display-1 fw-bold mb-0 number-display" 
                    style={{ 
                      color: brandPrimary,
                      fontSize: 'clamp(6rem, 20vw, 15rem)',
                      textShadow: '0 8px 32px rgba(33, 148, 209, 0.3)',
                      lineHeight: 0.8,
                      fontFamily: 'Jost, sans-serif',
                      fontWeight: 900,
                      animation: isVisible ? 'bounceIn 1s ease-out' : 'none'
                    }}
                    dir="ltr"
                  >
                    {t('errorCode')}
                  </h1>
                </div>

                {/* Error Message */}
                <h2 
                  className={`h2 fw-bold mb-3 ${isRTL ? 'font-arabic' : ''}`}
                  style={{ 
                    color: '#211F2D',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'Jost, sans-serif',
                    animation: isVisible ? 'slideInUp 0.8s ease-out 0.3s both' : 'none'
                  }}
                >
                  {t('title')}
                </h2>
                
                <p 
                  className={`lead text-muted mb-4 ${isRTL ? 'font-arabic' : ''}`}
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    lineHeight: 1.6,
                    animation: isVisible ? 'slideInUp 0.8s ease-out 0.5s both' : 'none',
                    fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'inherit'
                  }}
                >
                  {t('description')}
                </p>

                {/* Fun illustration */}
                <div 
                  className="mb-4"
                  style={{
                    fontSize: '4rem',
                    animation: isVisible ? 'fadeIn 1s ease-out 0.7s both' : 'none'
                  }}
                >
                  🗺️
                </div>

                {/* Action Buttons */}
                <div 
                  className={`d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5 ${isRTL ? 'rtl-button-group' : ''}`}
                  style={{
                    animation: isVisible ? 'fadeIn 1s ease-out 0.9s both' : 'none'
                  }}
                >
                  <Link to="/">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleButtonClick}
                      className={`px-5 py-3 ${isAnimating ? 'scale-95' : ''} ${isRTL ? 'font-arabic' : ''}`}
                      style={{
                        backgroundColor: brandPrimary,
                        borderColor: brandPrimary,
                        fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'Jost, sans-serif',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(33, 148, 209, 0.3)'
                      }}
                    >
                      {t('homeButton')}
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button
                      variant="outline-primary"
                      size="lg"
                      onClick={handleButtonClick}
                      className={`px-5 py-3 ${isAnimating ? 'scale-95' : ''} ${isRTL ? 'font-arabic' : ''}`}
                      style={{
                        borderColor: brandPrimary,
                        color: brandPrimary,
                        fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'Jost, sans-serif',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('contactButton')}
                    </Button>
                  </Link>
                </div>

                {/* Helpful Links */}
                <div 
                  className={`mt-5 pt-4 border-top ${isRTL ? 'rtl-links' : ''}`}
                  style={{
                    animation: isVisible ? 'fadeIn 1s ease-out 1.1s both' : 'none'
                  }}
                >
                  <h5 
                    className={`mb-3 ${isRTL ? 'font-arabic' : ''}`}
                    style={{
                      color: '#211F2D',
                      fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'Jost, sans-serif'
                    }}
                  >
                    {t('helpfulLinks')}
                  </h5>
                  <div className={`d-flex flex-wrap gap-3 justify-content-center ${isRTL ? 'rtl-grid' : ''}`}>
                    <Link 
                      to="/" 
                      className={isRTL ? 'font-arabic' : ''}
                      style={{ 
                        color: brandPrimary, 
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'inherit'
                      }}
                    >
                      {t('links.home')}
                    </Link>
                    <span style={{ color: '#dee2e6' }}>•</span>
                    <Link 
                      to="/about-us" 
                      className={isRTL ? 'font-arabic' : ''}
                      style={{ 
                        color: brandPrimary, 
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'inherit'
                      }}
                    >
                      {t('links.about')}
                    </Link>
                    <span style={{ color: '#dee2e6' }}>•</span>
                    <Link 
                      to="/evangelism-discipleship" 
                      className={isRTL ? 'font-arabic' : ''}
                      style={{ 
                        color: brandPrimary, 
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'inherit'
                      }}
                    >
                      {t('links.ministries')}
                    </Link>
                    <span style={{ color: '#dee2e6' }}>•</span>
                    <Link 
                      to="/contact" 
                      className={isRTL ? 'font-arabic' : ''}
                      style={{ 
                        color: brandPrimary, 
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontFamily: isRTL ? 'Cairo, Noto Sans Arabic, sans-serif' : 'inherit'
                      }}
                    >
                      {t('links.contact')}
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes bounceIn {
          0% { 
            transform: scale(0.3);
            opacity: 0;
          }
          50% { 
            transform: scale(1.05);
          }
          70% { 
            transform: scale(0.9);
          }
          100% { 
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes slideInUp {
          0% {
            transform: translateY(30px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        .fade-in {
          opacity: 1;
        }
      `}</style>

      <Footer />
    </Layout>
  );
};

export default NotFoundPage;

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

export const Head = () => (
  <>
    <title>404 - Page Not Found || Hope for All Mena</title>
    <meta name="description" content="The page you're looking for could not be found. Navigate back to our homepage or explore our other pages." />
    <meta name="robots" content="noindex, nofollow" />
  </>
);
