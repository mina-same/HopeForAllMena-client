import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { booksAPI } from "../../services/api";

import banner1 from "../../assets/images/2024/2024books.png";
import banner2 from "../../assets/images/2024/2025books.png";
// Swiper v11 uses modules via props

const MainSliderBooks = () => {
  const [bookCount, setBookCount] = useState(30); // Default fallback

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const response = await booksAPI.getBooks({ status: 'published' });
        if (response.data?.books) {
          setBookCount(response.data.books.length);
        }
      } catch (error) {
        console.error('Error fetching book count:', error);
        // Keep default value of 30 if API fails
      }
    };

    fetchBookCount();
  }, []);
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
                <p>more than {bookCount} books In our library</p>
                <h2>
                  Books of <br /> 2024 <br /> 
                </h2>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn"
                >
                  Start Reading
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
                <p>more than {bookCount} books In our library</p>
                <h2>
                  Books of <br /> 2025 <br /> 
                </h2>
                <a
                  href="#none"
                  data-target=".donate-options"
                  className="scroll-to-target thm-btn "
                >
                  Start Reading
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

export default MainSliderBooks;
