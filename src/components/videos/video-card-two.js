import React, { useState } from "react";
import ModalVideo from "react-modal-video";
import { Container, Row, Col } from "react-bootstrap";
import videoBg from "../../assets/images/shapes/video-bg-1-1.png";
import videoImage from "../../assets/images/resources/video-1-1.png";

const VideoCardTwo = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <section className="video-card-two" style={{marginBottom: "100px"}}>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="L61p2uyiMSo"
        onClose={() => setOpen(false)}
      />
      <Container>
        <div
          className="inner-container"
          style={{ backgroundImage: `url(${videoBg})` }}
        >
          <Row className="align-items-center">
            <Col lg={3}>
              <div className="video-card-two__box">
                <img src={videoImage} alt="" style={{width: "250px", height: "250px", objectFit: "cover"}} />
                <span
                  className="video-card-two__box-btn video-popup"
                  onClick={() => setOpen(true)}
                  onKeyDown={() => setOpen(true)}
                  role="button"
                  tabIndex={0}
                >
                  <i className="fa fa-play"></i>
                </span>
              </div>
            </Col>
            <Col lg={4}>
              <h3>" And in His name the Gentiles will hope " <br/>(Matthew 12:21)</h3>
            </Col>
            <Col lg={5}>
              <p>
                Hope for All Ministry, affiliated with the Educational Council of the Evangelical Synod of the Nile, was founded in 2008 by Rev. Dr. Radi Atallah to equip and train leaders and servants in the local church across the Middle East and North Africa, enabling them to train others effectively.
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default VideoCardTwo;