import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import VisibilitySensor from "react-visibility-sensor";
import CountUp from "react-countup";
import { useNavigate } from "gatsby";
import heartImage from "../../assets/images/shapes/heart-2-1.png";
import aboutImage from "../../assets/images/resources/about-counter-1-1.png";
import aboutHeart from "../../assets/images/shapes/about-count-heart-1-1.png";

const AboutCounter = () => {
  const navigate = useNavigate();
  const [counter, setCounter] = useState({
    startCounter: false
  });

  const onVisibilityChange = (isVisible) => {
    if (isVisible) {
      setCounter({ startCounter: true });
    }
  };
  return (
    <section className="about-counter pt-120">
      <Container>
        <Row>
          <Col lg={6}>
            <div className="block-title">
              <p>
                <img src={heartImage} width="15" alt="" />
                Help Share the Hope Around the Globe
              </p>
              <h3>
                Hope for the people <br />
                you care about.
              </h3>
            </div>
            <p className="about-counter__text">
              Lorem Ipsum is simply dummy text of the printing and <br />{" "}
              typesetting industry. Have you done google research which <br />{" "}
              works all the time.{" "}
            </p>
            <ul className="list-unstyled ul-list-one">
              <li>Nsectetur cing elit.</li>
              <li>Suspe ndisse suscipit sagittis leo.</li>
              <li>Entum estibulum dignissim posuere.</li>
            </ul>
            <button className="thm-btn dynamic-radius" onClick={() => navigate("/donate")}>
              Donate Now
            </button>
          </Col>
          <Col lg={6}>
            <div className="about-counter__image clearfix">
              <div className="about-counter__image-content">
                <img src={aboutHeart} alt="" />
                <p>We’re here to support you every step of the way.</p>
              </div>
              <img src={aboutImage} alt="" className="float-left max-h-[1000px]" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutCounter;
