import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import visionImage from "../../assets/images/resources/about-1-1.jpg";
import missionImage from "../../assets/images/resources/about-1-2.jpg";

const VisionMission = () => {
  return (
    <section className="vision-mission pt-120 pb-90">
      <Container>
        <div className="block-title text-center">
          <h3>Our Vision & Mission</h3>
        </div>
        <Row className="justify-content-center">
          <Col lg={12}>
            <div className="vision-mission__content mb-5 wow fadeInLeft" data-wow-duration="1500ms" data-wow-delay="0ms">
              <div className="vision-mission__row">
                <div className="vision-mission__image">
                  <img src={visionImage} alt="Our Vision" />
                </div>
                <div className="vision-mission__text">
                  <div className="vision-mission__item">
                    <div className="vision-mission__icon">
                      <i className="azino-icon-dove"></i>
                    </div>
                    <h3>Our Vision</h3>
                    <div className="vision-mission__quote">
                      <p>"What you have heard from me in the presence of many witnesses entrust to faithful men, who will be able to teach others also."</p>
                      <p className="font-weight-bold">(2 Timothy 2:2, ESV)</p>
                    </div>
                    <p>
                      Our vision is to equip local church leaders across Egypt, the Middle East, and North Africa to become disciple-makers who multiply, establish healthy churches, and reach unreached areas—proclaiming Christ to all.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="vision-mission__content wow fadeInRight" data-wow-duration="1500ms" data-wow-delay="300ms">
              <div className="vision-mission__row">
                <div className="vision-mission__text">
                  <div className="vision-mission__item">
                    <div className="vision-mission__icon">
                      <i className="azino-icon-charity"></i>
                    </div>
                    <h3>Our Mission</h3>
                    <p>
                      We are committed to equipping and empowering local church leaders by providing comprehensive and accessible training resources for all.
                    </p>
                    <p>
                      We focus on developing a network of qualified trainers who will:
                    </p>
                    <ul className="vision-mission__list">
                      <li>Promote intentional discipleship</li>
                      <li>Support marginalized communities</li>
                      <li>Engage their societies with the hope of Christ</li>
                    </ul>
                    <p className="mt-3">
                      while maintaining the unity of the Church as the Body of Christ.
                    </p>
                  </div>
                </div>
                <div className="vision-mission__image">
                  <img src={missionImage} alt="Our Mission" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default VisionMission;