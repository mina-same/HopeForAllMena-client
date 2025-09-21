import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { Link, navigate, graphql } from 'gatsby';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import Layout from '../components/layout';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';
import lotiAuth from '../assets/images/auth/loti-auth.svg';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { t } = useTranslation('Login');
    const { i18n } = useI18next();
    const currentLanguage = i18n?.resolvedLanguage || 'en';
    
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const { login, isAuthenticated, loading } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && !loading) {
            navigate('/admin');
        }
    }, [isAuthenticated, loading]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation(); // Prevent any form bubbling
        
        // Clear any previous errors
        setError('');
        setIsLoading(true);

        try {
            const result = await login({
                identifier: formData.identifier.trim(),
                password: formData.password
            });

            if (result.success) {
                // Check if user has admin permissions
                const user = result.user;
                const hasAdminAccess = user.permissions?.includes('users') || 
                                     user.permissions?.includes('user-management') ||
                                     user.role?.toLowerCase().includes('admin');

                if (hasAdminAccess) {
                    // Small delay to show success state before navigation
                    setTimeout(() => {
                        navigate('/admin');
                    }, 100);
                } else {
                    setError(t('errors.accessDenied'));
                }
            } else {
                setError(result.error || t('errors.loginFailed'));
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(t('errors.unexpectedError'));
        } finally {
            setIsLoading(false);
        }
    };

    const brandPrimary = '#2194D1';
    const pageBackground = '#FEFEFE';
    const controlRadius = '12px';

    return (
        <Layout pageTitle={`${t('pageTitle')} || Hope For All Mena Ministry`}>
            <HeaderTwo />
            <StickyHeader />
            {/* RTL-specific styles for Arabic */}
            {currentLanguage === 'ar' && (
                <style jsx>{`
                    .form-control {
                        text-align: right !important;
                        direction: rtl !important;
                    }
                    .form-check-label {
                        padding-right: 0 !important;
                        padding-left: 1.25em !important;
                    }
                    .form-check-input {
                        margin-right: 0 !important;
                        margin-left: -1.25em !important;
                    }
                    .position-relative .btn {
                        left: 10px !important;
                        right: auto !important;
                    }
                    .password-field-rtl {
                        padding: 12px 16px 12px 50px !important;
                    }
                    .d-flex.flex-column.flex-sm-row {
                        flex-direction: row-reverse !important;
                    }
                    @media (max-width: 575px) {
                        .d-flex.flex-column.flex-sm-row {
                            flex-direction: column-reverse !important;
                        }
                    }
                `}</style>
            )}
            <div className="d-flex align-items-center" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <div className="w-100 py-3 py-md-5" style={{ 
                    background: "#F1F1F1", 
                    margin: "10px", 
                    borderRadius: "16px",
                    '@media (min-width: 768px)': {
                        margin: "20px",
                        borderRadius: "24px"
                    }
                }}>
                    <Container className="py-3 py-md-5">
                        <Row className="align-items-center justify-content-center g-4">
                            <Col lg={6} className="text-center mb-3 mb-lg-0 order-1 order-lg-1">
                                <div className="px-3">
                                    <img 
                                        src={lotiAuth} 
                                        alt="Auth Illustration" 
                                        className="img-fluid" 
                                        style={{ 
                                            maxWidth: '100%', 
                                            height: 'auto',
                                            maxHeight: '300px',
                                            filter: 'saturate(1.05)',
                                            '@media (min-width: 992px)': {
                                                maxWidth: '520px',
                                                maxHeight: 'none'
                                            }
                                        }} 
                                    />
                                    <div className="mt-3 mt-md-4">
                                        <h3 className="h4 h-md-3 fw-semibold mb-2 mb-md-3" style={{ color: '#211F2D' }}>{t('welcome.title')}</h3>
                                        <p className="text-muted mb-0 small">{t('welcome.description')}</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6} md={10} className="order-2 order-lg-2">
                                <Card className="shadow-sm border-0" style={{ 
                                    borderRadius: '16px', 
                                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                                    '@media (min-width: 768px)': {
                                        borderRadius: '24px'
                                    }
                                }}
                                    onMouseEnter={(e) => { 
                                        if (window.innerWidth > 768) {
                                            e.currentTarget.style.boxShadow = '0 1rem 2.5rem rgba(0,0,0,0.08)'; 
                                            e.currentTarget.style.transform = 'translateY(-2px)'; 
                                        }
                                    }}
                                    onMouseLeave={(e) => { 
                                        e.currentTarget.style.boxShadow = ''; 
                                        e.currentTarget.style.transform = 'translateY(0)'; 
                                    }}
                                >
                                    <Card.Body className="p-3 p-md-4 p-lg-5">
                                        <div className="mb-3 mb-md-4">
                                            <h3 className="h4 h-md-3 fw-semibold mb-2" style={{ color: '#211F2D' }}>{t('form.title')}</h3>
                                            <p className="text-muted mb-0 small">{t('form.subtitle')}</p>
                                        </div>
                                        
                                        {error && (
                                            <Alert variant="danger" className="mb-3 mb-md-4" style={{
                                                borderRadius: controlRadius,
                                                border: 'none',
                                                backgroundColor: '#f8d7da',
                                                color: '#721c24'
                                            }}>
                                                <div className="d-flex align-items-center">
                                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                                    <span>{error}</span>
                                                </div>
                                            </Alert>
                                        )}

                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3" controlId="identifier">
                                                <Form.Label className="fw-medium">{t('form.emailLabel')}</Form.Label>
                                                <Form.Control 
                                                    type="text" 
                                                    name="identifier"
                                                    value={formData.identifier}
                                                    onChange={handleInputChange}
                                                    placeholder={t('form.emailPlaceholder')} 
                                                    required 
                                                    disabled={isLoading}
                                                    style={{ 
                                                        borderRadius: controlRadius,
                                                        padding: '12px 16px',
                                                        fontSize: '16px',
                                                        border: '2px solid #e9ecef',
                                                        transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = brandPrimary;
                                                        e.target.style.boxShadow = `0 0 0 0.2rem ${brandPrimary}25`;
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = '#e9ecef';
                                                        e.target.style.boxShadow = 'none';
                                                    }}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label className="fw-medium">{t('form.passwordLabel')}</Form.Label>
                                                <div className="position-relative">
                                                    <Form.Control 
                                                        type={showPassword ? "text" : "password"} 
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleInputChange}
                                                        placeholder={t('form.passwordPlaceholder')} 
                                                        required 
                                                        disabled={isLoading}
                                                        className={currentLanguage === 'ar' ? 'password-field-rtl' : ''}
                                                        style={{ 
                                                            borderRadius: controlRadius,
                                                            padding: currentLanguage === 'ar' ? '12px 16px 12px 50px' : '12px 50px 12px 16px',
                                                            fontSize: '16px',
                                                            border: '2px solid #e9ecef',
                                                            transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = brandPrimary;
                                                            e.target.style.boxShadow = `0 0 0 0.2rem ${brandPrimary}25`;
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = '#e9ecef';
                                                            e.target.style.boxShadow = 'none';
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className={`btn btn-link position-absolute top-50 translate-middle-y ${currentLanguage === 'ar' ? 'start-0 ps-3' : 'end-0 pe-3'}`}
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        disabled={isLoading}
                                                        style={{
                                                            border: 'none',
                                                            background: 'none',
                                                            color: '#6c757d',
                                                            padding: '0',
                                                            fontSize: '18px',
                                                            zIndex: 10,
                                                            transition: 'color 0.15s ease-in-out'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isLoading) {
                                                                e.target.style.color = brandPrimary;
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.color = '#6c757d';
                                                        }}
                                                    >
                                                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                    </button>
                                                </div>
                                            </Form.Group>
                                            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
                                                <Form.Check 
                                                    type="checkbox" 
                                                    id="rememberMe" 
                                                    name="rememberMe"
                                                    checked={formData.rememberMe}
                                                    onChange={handleInputChange}
                                                    label={t('form.rememberMe')} 
                                                    disabled={isLoading}
                                                    style={{ fontSize: '14px' }}
                                                />
                                                <Link to="/contact" className="small text-decoration-none" style={{ color: brandPrimary }}>
                                                    {t('form.forgotPassword')}
                                                </Link>
                                            </div>
                                            <Button 
                                                type="submit" 
                                                className="w-100 fw-medium" 
                                                disabled={isLoading}
                                                style={{ 
                                                    backgroundColor: brandPrimary, 
                                                    borderColor: brandPrimary, 
                                                    borderRadius: controlRadius,
                                                    padding: '12px 24px',
                                                    fontSize: '16px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isLoading) {
                                                        e.target.style.backgroundColor = '#1e7bb8';
                                                        e.target.style.transform = 'translateY(-1px)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = brandPrimary;
                                                    e.target.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            className="me-2"
                                                        />
                                                        {t('form.signingIn')}
                                                    </>
                                                ) : (
                                                    t('form.signInButton')
                                                )}
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
            <Footer />
        </Layout>
    );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
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

export default LoginPage;