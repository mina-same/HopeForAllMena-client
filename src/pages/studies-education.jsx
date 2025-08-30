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
import aboutImage2 from "../assets/images/resources/about-1-2.jpg";

const StudiesEducation = () => {
  return (
    <Layout pageTitle="Studies and Education || Hope For All Mena Ministry">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Studies and Education" crumbTitle="Services" />
      <>
        <section className="service-details pt-120 pb-90" style={{ backgroundImage: `url(${serviceBg})` }}>
          <Container>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-details__content">
                  <h3>Studies and Education</h3>
                  <p>
                    Our Studies and Education program is dedicated to fostering intellectual growth and 
                    spiritual development through comprehensive educational initiatives. We believe that 
                    education is a powerful tool for transformation and empowerment.
                  </p>
                  <p>
                    Our goal is to cultivate the mindset of pioneers - individuals who think critically, 
                    act compassionately, and lead with wisdom. We provide access to quality education, 
                    theological training, and leadership development programs that equip people to make 
                    positive changes in their communities and beyond.
                  </p>
                  <p>
                    Through partnerships with educational institutions, scholarship programs, and 
                    innovative learning approaches, we ensure that education is accessible to all, 
                    regardless of their background or circumstances.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-details__image">
                  <img src={aboutImage2} alt="Studies and Education" className="img-fluid" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <div className="service-features pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-primary">
                  <div className="service-features__icon">
                    <i className="azino-icon-reading-book"></i>
                  </div>
                  <h4>Academic Excellence</h4>
                  <p>
                    High-quality educational programs that promote critical thinking, 
                    creativity, and a love for learning across all age groups and subjects.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-secondary">
                  <div className="service-features__icon">
                    <i className="azino-icon-dove"></i>
                  </div>
                  <h4>Theological Training</h4>
                  <p>
                    Comprehensive biblical studies and theological education that deepens 
                    understanding of faith and prepares leaders for ministry and service.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-base">
                  <div className="service-features__icon">
                    <i className="azino-icon-heart"></i>
                  </div>
                  <h4>Leadership Development</h4>
                  <p>
                    Programs designed to develop leadership skills, character, and vision 
                    in emerging leaders who will pioneer positive change in their communities.
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
                  <p>Empowering minds and shaping futures through education</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-impact__content">
                  <h4>What We've Achieved</h4>
                  <ul className="service-impact__list">
                    <li>Provided scholarships to hundreds of students</li>
                    <li>Established educational centers in underserved communities</li>
                    <li>Trained teachers and educational leaders</li>
                    <li>Developed innovative curriculum and learning materials</li>
                    <li>Created mentorship and tutoring programs</li>
                  </ul>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-impact__stats">
                  <div className="row">
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>750+</h3>
                        <p>Students Supported</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>20+</h3>
                        <p>Educational Centers</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>100+</h3>
                        <p>Teachers Trained</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>50+</h3>
                        <p>Scholarships Awarded</p>
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

export default StudiesEducation;
