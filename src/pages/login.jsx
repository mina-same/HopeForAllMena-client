import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link, navigate } from 'gatsby';
import Layout from '../components/layout';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';
import lotiAuth from '../assets/images/auth/loti-auth.svg';

const LoginPage = () => {
    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/');
    };

    const brandPrimary = '#2194D1';
    const pageBackground = '#FEFEFE';
    const controlRadius = '12px';

    return (
        <Layout pageTitle="Sign In || Hope For All Mena Ministry">
            <HeaderTwo />
            <StickyHeader />
            <div style={{ background: pageBackground }}>
                <div className="py-5" style={{ background: "#e3e3e3", margin: "20px", borderRadius: "24px" }}>
                    <Container className="py-5">
                        <Row className="align-items-center justify-content-center">
                            <Col lg={6} className="text-center mb-4 mb-lg-0">
                                <img src={lotiAuth} alt="Auth Illustration" className="img-fluid" style={{ maxWidth: '520px', filter: 'saturate(1.05)' }} />
                                <div className="mt-4">
                                    <h3 className="h3 fw-semibold mb-3" style={{ color: '#211F2D' }}>Welcome back!</h3>
                                    <p className="text-muted mb-0">Whether you're launching a stunning online store optimizing your our object-oriented</p>
                                </div>
                            </Col>
                            <Col lg={6} md={10}>
                                <Card className="shadow-sm" style={{ borderRadius: '24px', transition: 'box-shadow 0.2s ease, transform 0.2s ease' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 1rem 2.5rem rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = 'translateY(0)'; }}
                                >
                                    <Card.Body className="p-4 p-md-5">
                                        <h3 className="h3 fw-semibold" style={{ color: '#211F2D' }}>Sign In</h3>
                                        <p className="text-muted mb-4">Welcome Back! Log in to your account</p>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3" controlId="email">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control type="email" placeholder="debra.holt@example.com" required style={{ borderRadius: controlRadius }} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="password">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control type="password" placeholder="Password" required style={{ borderRadius: controlRadius }} />
                                            </Form.Group>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <Form.Check type="checkbox" id="rememberMe" label="Remember Me" />
                                                <Link to="/contact" className="small">Forgot password?</Link>
                                            </div>
                                            <Button type="submit" className="w-100" style={{ backgroundColor: brandPrimary, borderColor: brandPrimary, borderRadius: controlRadius }}>Sign In</Button>
                                        </Form>
                                        <div className="text-center text-muted my-3">OR</div>
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

export default LoginPage;