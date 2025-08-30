import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import serviceBg from "../../assets/images/backgrounds/service-hand-bg-1-1.png";
import serviceLine from "../../assets/images/shapes/service-line-1-1.png";
import blockTitleHeart from "../../assets/images/shapes/heart-2-1.png";
import publishingHouseWhite from "../../assets/images/publishing-house-white.png";
import discipleshipImage from "../../assets/images/gallery/discipleship.png";

const serviceOneData = [
  {
    icon: "azino-icon-dove",
    image: discipleshipImage,
    extraClassName: "background-secondary",
    title: "Evangelism and discipleship",
    text: "A new generation that changes and brings change.",
    link: "/evangelism-discipleship"
  },
  {
    icon: "azino-icon-charity",
    title: "Development Department",
    extraClassName: "background-base",
    text: "Improving life opportunities for a better future.",
    link: "/development-department"
  },
  {
    icon: "azino-icon-reading-book",
    title: "Studies and Education",
    text: "Our goal is the mindset of the pioneers.",
    link: "/studies-education",
    extraClassName: "background-primary"
  },
  {
    icon: "",
    image: publishingHouseWhite,
    title: "Publishing and Distribution House",
    extraClassName: "background-special",
    text: "Supporting young writers with impactful publishing.",
    link: "/publishing-house"
  }
];

const ServiceOne = () => {
  return (
    <section
      className="service-one pt-120 pb-90"
      style={{ backgroundImage: `url(${serviceBg})` }}
    >
      <Container>
        <img src={serviceLine} alt="" className="service-one__shape-1" />
        <div className="block-title">
          <p>
            <img src={blockTitleHeart} width="15" alt="" />
            Welcome to Hope For All Mena Ministry
          </p>
          <h3>
            We believe that we can save <br /> more lifes with you.
          </h3>
        </div>
        <Row>
          {serviceOneData.map(
            ({ icon, image, title, text, link, extraClassName }, index) => (
              <Col md={6} lg={3} key={`service-one-key-${index}`}>
                <div className={`service-one__box`}>
                  <div className={`service-one__icon ${extraClassName}`}>
                    <div className="service-one__icon-inner">
                      {image ? (
                        <img src={image} alt={title} width="100" />
                      ) : (
                        <i className={icon}></i>
                      )}
                    </div>
                  </div>
                  <h3>
                    <Link to={link} style={{ lineHeight: '1.5', marginTop: '10px', marginBottom: '10px', display: 'inline-block' }}>{title}</Link>
                  </h3>
                  <p>{text}</p>
                </div>
              </Col>
            )
          )}
        </Row>
      </Container>
    </section>
  );
};

export default ServiceOne;
