import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import heart from "../../assets/images/shapes/heart-2-1.png";
import welcomeImage from "../../assets/images/resources/welcome-1-1.png";
import aboutImage from "../../assets/images/shapes/about-bag-1-2.png";

const AboutTwo = () => {
  return (
    <section className="about-two pt-120 pb-120">
      <Container>
        <Row>
          <Col xl={6}>
            <div className="about-two__image">
              <img src={welcomeImage} alt="" style={{ width: '586px', height: '666px', objectFit: 'cover' }} />
              <div className="about-two__award">
                <img src={aboutImage} alt="" />
              </div>
            </div>
          </Col>
          <Col xl={6}>
            <div className="about-two__content">
              <div className="block-title">
                <p>
                  <img src={heart} width="15" alt="" /> About Azino Platform
                </p>
                <h3>Our Strategy</h3>
              </div>
              <Row>
                <Col md={6}>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">1.</span>Engage with Local Churches</h3>
                    <p>
                      Building strong partnerships with local churches to strengthen communities.
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">2. </span> Empower Church Leaders</h3>
                    <p>
                      Providing curricula and resources to enhance church leadership and service.
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">3. </span> Deliver Hope</h3>
                    <p>
                      Bringing the message of hope to underserved communities and areas.
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">4. </span> Support Community Projects</h3>
                    <p>
                      Enabling churches to serve through developmental and social initiatives.
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">5. </span> Serve Refugees</h3>
                    <p>
                      Focusing on refugee support in Egypt and surrounding regions.
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">6. </span> Biblical Education</h3>
                    <p>
                      Providing biblical education and nurturing enlightened writers.
                    </p>
                  </div>
                </Col>
              </Row>
              <Link className="thm-btn dynamic-radius" to="/about">
                Discover More
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutTwo;
