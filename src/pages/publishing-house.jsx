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
import publishingHouseWhite from "../assets/images/publishing-house-white.png";

const PublishingHouse = () => {
  return (
    <Layout pageTitle="Publishing and Distribution House || Hope For All Mena Ministry">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Publishing and Distribution House" crumbTitle="Services" />
      <>
        <section className="service-details pt-120 pb-90" style={{ backgroundImage: `url(${serviceBg})` }}>
          <Container>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-details__content">
                  <h3>Publishing and Distribution House</h3>
                  <p>
                    Our Publishing and Distribution House is dedicated to amplifying voices and sharing 
                    stories that inspire, educate, and transform lives. We believe in the power of 
                    written words to create lasting impact and bring positive change to communities.
                  </p>
                  <p>
                    We support young writers and emerging authors by providing them with the resources, 
                    guidance, and platform they need to share their messages with the world. Our 
                    publishing services include editorial support, design assistance, and distribution 
                    channels that ensure their work reaches the right audience.
                  </p>
                  <p>
                    Through strategic partnerships with bookstores, libraries, and educational institutions, 
                    we ensure that valuable content is accessible to readers everywhere, fostering a 
                    culture of learning and growth.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-details__image">
                  <img src={publishingHouseWhite} alt="Publishing and Distribution House" className="img-fluid" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <div className="service-features pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-special">
                  <div className="service-features__icon">
                    <i className="azino-icon-reading-book"></i>
                  </div>
                  <h4>Author Support</h4>
                  <p>
                    Comprehensive support for writers including manuscript review, 
                    editing, design, and publishing guidance to bring their vision to life.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-secondary">
                  <div className="service-features__icon">
                    <i className="azino-icon-dove"></i>
                  </div>
                  <h4>Quality Publishing</h4>
                  <p>
                    Professional publishing services that ensure high-quality books, 
                    articles, and educational materials that meet industry standards.
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-base">
                  <div className="service-features__icon">
                    <i className="azino-icon-charity"></i>
                  </div>
                  <h4>Wide Distribution</h4>
                  <p>
                    Extensive distribution networks that make published works available 
                    through multiple channels including online platforms and physical locations.
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
                  <p>Amplifying voices and sharing stories that change lives</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-impact__content">
                  <h4>What We've Achieved</h4>
                  <ul className="service-impact__list">
                    <li>Published over 100 books and educational materials</li>
                    <li>Supported 50+ young and emerging authors</li>
                    <li>Distributed content to 30+ countries worldwide</li>
                    <li>Established partnerships with major distribution networks</li>
                    <li>Created digital and print publishing platforms</li>
                  </ul>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-impact__stats">
                  <div className="row">
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>100+</h3>
                        <p>Books Published</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>50+</h3>
                        <p>Authors Supported</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>30+</h3>
                        <p>Countries Reached</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>1000+</h3>
                        <p>Copies Distributed</p>
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

export default PublishingHouse;
