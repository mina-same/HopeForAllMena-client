import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useTranslation } from "react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";

import banner1 from "../../assets/images/main-slider/slider-1-1.jpg";
import banner2 from "../../assets/images/main-slider/dev.png";
import banner3 from "../../assets/images/main-slider/slider-2-1.jpg";
import banner4 from "../../assets/images/main-slider/allBooks.png";
import "./main-slider-rtl.css";
// Swiper v11 uses modules via props

const MainSlider = () => {
  const { t } = useTranslation('MainSlider');
  const { language: currentLanguage } = useI18next();
  

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

  // Service department links
  const serviceLinks = {
    evangelism: "/services/evangelism",
    development: "/services/development", 
    education: "/services/education",
    publishing: "/services/publishing"
  };
  return (
    <section className={`main-slider ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Swiper modules={[Autoplay, Pagination, EffectFade]} {...mainSlideOptions}>
        <SwiperSlide>
          <div
            className="image-layer"
            style={{ backgroundImage: `url(${banner1})` }}
          ></div>

          <Container>
            <Row className={`row ${currentLanguage === 'ar' ? 'justify-content-start' : 'justify-content-end'}`}>
              <Col xl={7} lg={12} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-right'}`}>
                <p>{t('slides.evangelism.title')}</p>
                <h2>
                  {t('slides.evangelism.description')}
                </h2>
                <Link
                  to={serviceLinks.evangelism}
                  className="thm-btn"
                >
                  {t('slides.evangelism.button')}
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
            <Row className={`row ${currentLanguage === 'ar' ? 'justify-content-start' : 'justify-content-end'}`}>
              <Col xl={8} lg={12} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-right'}`}>
                <p>{t('slides.development.title')}</p>
                <h2>
                  {t('slides.development.description')}
                </h2>
                <Link
                  to={serviceLinks.development}
                  className="thm-btn"
                >
                  {t('slides.development.button')}
                </Link>
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
            <Row className={`${currentLanguage === 'ar' ? 'justify-content-start' : 'justify-content-end'}`}>
              <Col lg={7} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-right'}`}>
                <p>{t('slides.education.title')}</p>
                <h2>
                  {t('slides.education.description')}
                </h2>
                <Link
                  to={serviceLinks.education}
                  className="thm-btn"
                >
                  {t('slides.education.button')}
                </Link>
              </Col>
            </Row>
          </Container>
        </SwiperSlide>
        <SwiperSlide>
          <div
            className="image-layer"
            style={{ backgroundImage: `url(${banner4})` }}
          ></div>

          <Container>
            <Row className={`${currentLanguage === 'ar' ? 'justify-content-start' : 'justify-content-end'}`}>
              <Col lg={7} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-right'}`}>
                <p>{t('slides.publishing.title')}</p>
                <h2>
                  {t('slides.publishing.description')}
                </h2>
                <Link
                  to={serviceLinks.publishing}
                  className="thm-btn"
                >
                  {t('slides.publishing.button')}
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

export default MainSlider;
