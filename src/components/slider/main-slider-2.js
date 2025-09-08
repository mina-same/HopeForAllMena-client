import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import banner1 from "../../assets/images/main-slider/slider-books.png";
import banner2 from "../../assets/images/main-slider/slider-books.png";
import banner3 from "../../assets/images/main-slider/slider-books.png";

// Swiper v11 uses modules via props

const MainSliderTwo = () => {
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
    <section className="main-slider main-slider__two">
      <Swiper modules={[Autoplay, Pagination, EffectFade]} {...mainSlideOptions}>
        <SwiperSlide>
          <div
            className="image-layer"
            style={{ backgroundImage: `url(${banner1})` }}
          ></div>

          <Container>
            <Row className=" justify-content-start">
              <Col xl={6} lg={12} className="text-left">
                <h2>
                  Donat<span>i</span>on <br /> Can Change <br /> Someone’s Life
                </h2>
                <p>Make a difference in families lives with just $5 a Month</p>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn dynamic-radius"
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
            <Row className=" justify-content-start">
              <Col xl={6} lg={12} className="text-left">
                <h2>
                  Donat<span>i</span>on <br /> Can Change <br /> Someone’s Life
                </h2>
                <p>Make a difference in families lives with just $5 a Month</p>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn dynamic-radius"
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
            <Row className="justify-content-start">
              <Col xl={6} lg={12} className="text-left">
                <h2>
                  Donat<span>i</span>on <br /> Can Change <br /> Someone’s Life
                </h2>
                <p>Make a difference in families lives with just $5 a Month</p>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn dynamic-radius"
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

export default MainSliderTwo;
