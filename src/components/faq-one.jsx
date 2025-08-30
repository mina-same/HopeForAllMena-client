import React from "react";
import { Accordion, Container, Row, Col, Card } from "react-bootstrap";
import heart from "../assets/images/shapes/heart-2-1.png";
import heart1 from "../assets/images/shapes/about-count-heart-1-1.png";
import faqImage from "../assets/images/resources/faq-box-1-1.jpg";

// Custom toggle component for the Accordion header
const ContextAwareToggle = ({ children, eventKey }) => {
  return (
    <h2 className="para-title">
      <Accordion.Toggle
        as="span"
        eventKey={eventKey}
        style={{ cursor: "pointer" }}
      >
        <i
          className={`far ${
            // Note: You may need to manage the icon state manually if needed
            // For simplicity, we're using a static icon here
            "fa-plus"
          }`}
        ></i>
        {children}
      </Accordion.Toggle>
    </h2>
  );
};

const FaqOne = () => {
  return (
    <section className="faq-one pt-120">
      <Container>
        <Row>
          <Col lg={6}>
            <div className="faq-one__content">
              <div className="block-title">
                <p>
                  <img src={heart} width="15" alt="" />
                  Help People Now
                </p>
                <h3>
                  Charity for the people <br /> you care about.
                </h3>
              </div>

              <Accordion defaultActiveKey="1" className="list-unstyled">
                <Card as="li">
                  <ContextAwareToggle eventKey="0">
                    Make a difference in their life
                  </ContextAwareToggle>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>
                      There are many variations of passages the majority have
                      suffered alteration in some fo injected humour, or
                      randomised words believable.
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card as="li">
                  <ContextAwareToggle eventKey="1">
                    Make a difference in their life
                  </ContextAwareToggle>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>
                      There are many variations of passages the majority have
                      suffered alteration in some fo injected humour, or
                      randomised words believable.
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card as="li">
                  <ContextAwareToggle eventKey="2">
                    Make a difference in their life
                  </ContextAwareToggle>
                  <Accordion.Collapse eventKey="2">
                    <Card.Body>
                      There are many variations of passages the majority have
                      suffered alteration in some fo injected humour, or
                      randomised words believable.
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-counter__image clearfix">
              <div className="about-counter__image-content">
                <img src={heart1} alt="" />
                <p>We’re here to support you every step of the way.</p>
              </div>
              <img src={faqImage} alt="" className="float-left" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FaqOne;