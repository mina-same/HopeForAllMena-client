import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Link } from "gatsby";
import { booksAPI } from "../../services/api";

import banner1 from "../../assets/images/2024/2024books.png";
import banner2 from "../../assets/images/2024/2025books.png";
// Swiper v11 uses modules via props

const MainSliderBooks = () => {
  const { t } = useTranslation('Books');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';

  const [bookCount, setBookCount] = useState(30); // Default fallback

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const response = await booksAPI.getBooks({ 
          status: 'published',
          language: currentLanguage // Add language parameter for API
        });
        if (response.data?.books) {
          setBookCount(response.data.books.length);
        }
      } catch (error) {
        console.error('Error fetching book count:', error);
        // Keep default value of 30 if API fails
      }
    };

    fetchBookCount();
  }, [currentLanguage]); // Re-fetch when language changes
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
    <section className="main-slider" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Swiper modules={[Autoplay, Pagination, EffectFade]} {...mainSlideOptions}>
        <SwiperSlide>
          <div
            className="image-layer"
            style={{ backgroundImage: `url(${banner1})` }}
          ></div>

          <Container>
            <Row className="row justify-content-end">
              <Col xl={7} lg={12} className="text-right">
                <p>{t('heroSlider.slide1.subtitle', { count: bookCount })}</p>
                <h2>
                  {t('heroSlider.slide1.title')}
                </h2>
                <Link
                  to="/books#collection"
                  className="scroll-to-target thm-btn"
                >
                  {t('heroSlider.slide1.button')}
                </Link>
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
                <p>{t('heroSlider.slide2.subtitle')}</p>
                <h2>
                  {t('heroSlider.slide2.title')}
                </h2>
                <Link
                  to="/books#collection"
                  className="scroll-to-target thm-btn"
                >
                  {t('heroSlider.slide2.button')}
                </Link>
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
