import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import CallToAction from "../components/call-to-action/call-to-action";
import BrandCarousel from "../components/brand-carousel";

import serviceBg from "../assets/images/backgrounds/service-hand-bg-1-1.png";
import serviceLine from "../assets/images/shapes/service-line-1-1.png";
import blockTitleHeart from "../assets/images/shapes/heart-2-1.png";
import discipleshipImage from "../assets/images/gallery/discipleship.png";

import publishingHouseWhite from "../assets/images/publishing-house-white.png";

const servicesData = [
  {
    icon: "azino-icon-dove",
    image: discipleshipImage,
    extraClassName: "background-secondary",
    title: "Evangelism and Discipleship",
    text: "A new generation that changes and brings change through the power of the Gospel.",
    link: "/evangelism-discipleship",
    features: ["Personal Evangelism", "Discipleship Training", "Community Outreach"]
  },
  {
    icon: "azino-icon-charity",
    title: "Development Department",
    extraClassName: "background-base",
    text: "Improving life opportunities for a better future through sustainable development.",
    link: "/development-department",
    features: ["Economic Empowerment", "Community Infrastructure", "Capacity Building"]
  },
  {
    icon: "azino-icon-reading-book",
    title: "Studies and Education",
    text: "Our goal is the mindset of the pioneers through comprehensive education.",
    link: "/studies-education",
    extraClassName: "background-primary",
    features: ["Academic Excellence", "Theological Training", "Leadership Development"]
  },
  {
    icon: "",
    image: publishingHouseWhite,
    title: "Publishing and Distribution House",
    extraClassName: "background-special",
    text: "Supporting young writers with impactful publishing and wide distribution.",
    link: "/publishing-house",
    features: ["Author Support", "Quality Publishing", "Wide Distribution"]
  }
];

const Services = () => {
  return (
    <Layout pageTitle="Our Services || Hope For All Mena Ministry">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Our Services" crumbTitle="Services" />
      <>
        <section
          className="services-overview pt-120 pb-90"
          style={{ backgroundImage: `url(${serviceBg})` }}
        >
          <Container>
            <img src={serviceLine} alt="" className="service-one__shape-1" />
            <div className="block-title text-center">
              <p>
                <img src={blockTitleHeart} width="15" alt="" />
                Welcome to Hope For All Mena Ministry
              </p>
              <h3>
                We believe that we can save <br /> more lives with you.
              </h3>
            </div>
            <Row>
              {servicesData.map(
                ({ icon, image, title, text, link, extraClassName, features }, index) => (
                  <Col md={12} lg={6} key={`service-overview-key-${index}`} className="mb-30">
                    <div className={`service-overview__box ${extraClassName}`}>
                      <div className="service-overview__icon">
                        <div className="service-overview__icon-inner">
                          {image ? (
                            <img src={image} alt={title} width="80" />
                          ) : (
                            <i className={icon}></i>
                          )}
                        </div>
                      </div>
                      <div className="service-overview__content">
                        <h3>
                          <Link to={link}>{title}</Link>
                        </h3>
                        <p>{text}</p>
                        <div className="service-overview__features">
                          <ul>
                            {features.map((feature, featureIndex) => (
                              <li key={featureIndex}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="service-overview__link">
                          <Link to={link} className="thm-btn">
                            Learn More <i className="azino-icon-right-arrow"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                )
              )}
            </Row>
          </Container>
        </section>

        <section className="services-cta pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12}>
                <div className="services-cta__content text-center">
                  <h3>Ready to Get Involved?</h3>
                  <p>
                    Join us in our mission to bring hope and transformation to communities. 
                    Whether you want to volunteer, donate, or learn more about our services, 
                    we'd love to hear from you.
                  </p>
                  <div className="services-cta__buttons">
                    <Link to="/contact" className="thm-btn background-secondary">
                      Contact Us
                    </Link>
                    <Link to="/become-volunteer" className="thm-btn background-base">
                      Become a Volunteer
                    </Link>
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

export default Services;
