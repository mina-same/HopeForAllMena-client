import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, navigate } from 'gatsby';
import Layout from '../components/layout';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const UnauthorizedPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <Layout pageTitle="Access Denied || Hope for All Mena || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      
      {/* Background decorative elements */}
      <div 
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: `radial-gradient(circle, #dc354515 0%, transparent 70%)`,
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
      >
        <Container className="py-5 position-relative" style={{ zIndex: 1 }}>
          <Row className="justify-content-center text-center">
            <Col lg={8} md={10}>
              {/* Main Unauthorized Content */}
              <div 
                className={`mb-5 ${isVisible ? 'fade-in' : 'opacity-0'}`}
                style={{
                  transition: 'all 0.8s ease-out',
                  transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
                }}
              >
                {/* Animated Icon */}
                <div className="position-relative mb-4">
                  <div 
                    style={{
                      fontSize: 'clamp(4rem, 15vw, 8rem)',
                      animation: isVisible ? 'bounceIn 1s ease-out' : 'none',
                      color: '#dc3545'
                    }}
                  >
                    🚫
                  </div>
                </div>

                {/* Error Message */}
                <h2 
                  className="h2 fw-bold mb-3" 
                  style={{ 
                    color: '#dc3545',
                    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                    fontFamily: 'Jost, sans-serif',
                    animation: isVisible ? 'slideInUp 0.8s ease-out 0.3s both' : 'none'
                  }}
                >
                  Access Denied
                </h2>
                
                <p 
                  className="lead text-muted mb-4"
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                    lineHeight: 1.6,
                    animation: isVisible ? 'slideInUp 0.8s ease-out 0.5s both' : 'none'
                  }}
                >
                  Sorry, you don't have permission to access this area. 
                  {user && (
                    <span> You are logged in as <strong>{user.name || user.username || user.email}</strong>.</span>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div 
                className={`d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center mb-5 ${isVisible ? 'fade-in' : 'opacity-0'}`}
                style={{
                  transition: 'all 0.8s ease-out 0.8s',
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <Link to="/" className="text-decoration-none">
                  <Button
                    size="lg"
                    onClick={handleButtonClick}
                    style={{
                      backgroundColor: brandPrimary,
                      borderColor: brandPrimary,
                      borderRadius: '50px',
                      padding: '15px 40px',
                      fontSize: '18px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(33, 148, 209, 0.2)',
                      transform: isAnimating ? 'scale(0.95)' : 'scale(1)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#1e7bb8';
                      e.target.style.transform = 'translateY(-3px) scale(1.05)';
                      e.target.style.boxShadow = '0 12px 30px rgba(33, 148, 209, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = brandPrimary;
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 4px 15px rgba(33, 148, 209, 0.2)';
                    }}
                  >
                    🏠 Go to Homepage
                  </Button>
                </Link>

                <Button
                  variant="outline-danger"
                  size="lg"
                  onClick={handleLogout}
                  style={{
                    borderColor: '#dc3545',
                    color: '#dc3545',
                    borderRadius: '50px',
                    padding: '15px 40px',
                    fontSize: '18px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    borderWidth: '2px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc3545';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-3px) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#dc3545';
                    e.target.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  🔐 Logout
                </Button>
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
      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        variant="warning"
        isLoading={isLoggingOut}
        icon={
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 border-yellow-200 border-2">
            <svg className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
        }
      />
    </Layout>
  );
};

export default UnauthorizedPage;

export const Head = () => (
  <>
    <title>Access Denied || Hope for All Mena</title>
    <meta name="description" content="You don't have permission to access this area. Please contact support if you believe this is an error." />
    <meta name="robots" content="noindex, nofollow" />
  </>
);
