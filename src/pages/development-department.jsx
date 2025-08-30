import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import CallToAction from "../components/call-to-action/call-to-action";
import BrandCarousel from "../components/brand-carousel";

import serviceBg from "../assets/images/backgrounds/service-hand-bg-1-1.png";
import aboutImage from "../assets/images/resources/about-1-1.jpg";

const DevelopmentDepartment = () => {
  return (
    <Layout pageTitle="Development Department || Hope For All Mena Ministry">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Development Department" crumbTitle="Services" />
      <>
        <section className="service-details pt-120 pb-90" style={{ backgroundImage: `url(${serviceBg})` }}>
          <Container>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-details__content">
                  <h3>Development Department</h3>
                  <p>
                    Our Development Department is committed to creating sustainable change and improving 
                    life opportunities for individuals and communities. We focus on holistic development 
                    that addresses economic, social, and spiritual needs.
                  </p>
                  <p>
                    Through strategic partnerships, innovative programs, and community-driven initiatives, 
                    we work to break cycles of poverty and create pathways to prosperity. Our approach 
                    emphasizes capacity building, skill development, and creating opportunities for 
                    sustainable income generation.
                  </p>
                  <p>
                    We believe that true development happens when communities are empowered to identify 
                    their own needs and solutions, with our role being to provide support, resources, 
                    and expertise to help them achieve their goals.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-details__image">
                  <img src={aboutImage} alt="Development Department" className="img-fluid" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <div className="service-features pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-base">
                  <div className="service-features__icon">
                    <i className="azino-icon-charity"></i>
                  </div>
                  <h4>Economic Empowerment</h4>
                  <p>
                    Programs designed to create sustainable income opportunities through 
                    micro-enterprise development, vocational training, and financial literacy education.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-secondary">
                  <div className="service-features__icon">
                    <i className="azino-icon-heart"></i>
                  </div>
                  <h4>Community Infrastructure</h4>
                  <p>
                    Development of essential community facilities and services including 
                    clean water, sanitation, education centers, and healthcare access.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-primary">
                  <div className="service-features__icon">
                    <i className="azino-icon-dove"></i>
                  </div>
                  <h4>Capacity Building</h4>
                  <p>
                    Training and mentoring programs that build local leadership, 
                    organizational skills, and community management capabilities.
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <section className="service-impact pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12}>
                <div className="block-title text-center">
                  <h3>Our Impact</h3>
                  <p>Building better futures through sustainable development</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-impact__content">
                  <h4>What We've Achieved</h4>
                  <ul className="service-impact__list">
                    <li>Established micro-enterprise programs in multiple communities</li>
                    <li>Built and renovated community centers and schools</li>
                    <li>Provided clean water access to thousands of families</li>
                    <li>Trained hundreds in vocational and business skills</li>
                    <li>Created sustainable employment opportunities</li>
                  </ul>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-impact__stats">
                  <div className="row">
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>1000+</h3>
                        <p>Families Helped</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>25+</h3>
                        <p>Projects Completed</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>500+</h3>
                        <p>Jobs Created</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>15+</h3>
                        <p>Communities Served</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <CallToAction />
        <BrandCarousel extraClass="client-carousel__has-border-top" />
      </>
      <Footer />
    </Layout>
  );
};

export default DevelopmentDepartment;
