import React, { useState } from "react";
import ModalVideo from "react-modal-video";
import { Container } from "react-bootstrap";
import bgImage from "../../assets/images/backgrounds/page-header-1-1.jpg";

const VideoCard = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <section className="video-card">
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="L61p2uyiMSo"
        onClose={() => setOpen(false)}
      />
      <div
        className="video-card__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <Container className=" text-center pt-120 pb-120">
        <p>
          <i className="fas fa-heart" style={{color: "#FFD701", marginRight: "10px"}}></i>
          <span style={{fontSize: "1.25rem", fontWeight: 400}}>Ministry Departments</span>
        </p>
        <h3 className="text-white text-capitalize mb-4" style={{fontSize: "2.5rem", fontWeight: 700, letterSpacing: "0.5px"}}>
          Christ's three-fold ministry centers on teaching, preaching, and healing.
        </h3>
        <h5 className="text-white" style={{lineHeight: 1.8, fontSize: "1.25rem", fontWeight: 400}}>
          "And Jesus went about all the cities and villages, 
          <strong style={{fontWeight: 900, color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}> teaching </strong> 
          in their synagogues, and 
          <strong style={{fontWeight: 900, color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}> preaching </strong> 
          the gospel of the kingdom, and 
          <strong style={{fontWeight: 900, color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}> healing </strong> 
          every sickness and every disease among the people."
          <span className="d-block mt-3 font-italic" style={{fontSize: "1.1rem", opacity: 0.9}}>(Matthew 9:35)</span>
        </h5>
      </Container>
    </section>
  );
};

export default VideoCard;
