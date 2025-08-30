import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import banner1 from "../../assets/images/main-slider/slider-1-1.jpg";
import banner2 from "../../assets/images/main-slider/slider-1-2.jpg";
import banner3 from "../../assets/images/main-slider/slider-2-1.jpg";
// Swiper v11 uses modules via props

const MainSlider = () => {
  const mainSlideOptions = {
    slidesPerView: 1,
    loop: true,
    effect: "fade",
    pagination: {
      el: "#main-slider-pagination",
      type: "bullets",
      clickable: true
    },
    autoplay: {
      delay: 5000
    }
  };
  return (
    <section className="main-slider">
      <Swiper modules={[Autoplay, Pagination, EffectFade]} {...mainSlideOptions}>
        <SwiperSlide>
          <div
            className="image-layer"
            style={{ backgroundImage: `url(${banner1})` }}
          ></div>

          <Container>
            <Row className="row justify-content-end">
              <Col xl={7} lg={12} className="text-right">
                <p>Help the poor in need</p>
                <h2>
                  Lend the <br /> helping hand <br /> get involved.
                </h2>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn"
                >
                  Start Donating
                </a>
              </Col>
            </Row>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="image-layer"
            style={{ backgroundImage: `url(${banner2})` }}
          ></div>

          <Container>
            <Row className="row justify-content-end">
              <Col xl={8} lg={12} className="text-right">
                <p>Help the poor in need</p>
                <h2>
                  Donat<span className="iconic-text">i</span>on <br /> Can
                  Change <br /> Life
                </h2>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn "
                >
                  Start Donating
                </a>
              </Col>
            </Row>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="image-layer"
            style={{ backgroundImage: `url(${banner3})` }}
          ></div>

          <Container>
            <Row className="justify-content-end">
              <Col lg={7} className=" text-right">
                <p>Help the poor in need</p>
                <h2>
                  Lend the <br /> helping hand <br /> get involved.
                </h2>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn "
                >
                  Start Donating
                </a>
              </Col>
            </Row>
          </Container>
        </SwiperSlide>
        <div className="swiper-pagination" id="main-slider-pagination"></div>
      </Swiper>
    </section>
  );
};

export default MainSlider;
