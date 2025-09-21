import React, { useState } from "react";
import { Link } from "gatsby";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import image1 from "../../assets/images/resources/service-1-1.jpg";
import image2 from "../../assets/images/resources/service-1-2.jpg";
import image3 from "../../assets/images/resources/service-1-3.jpg";
import hoverImage1 from "../../assets/images/gallery/gallery-2-1.jpg";
import hoverImage2 from "../../assets/images/gallery/gallery-2-2.jpg";
import hoverImage3 from "../../assets/images/gallery/gallery-2-3.jpg";

const getServiceTwoData = (t) => [
  {
    extraClassName: "background-primary",
    image: image1,
    hoverImage: hoverImage1,
    titleKey: "serviceTwo.items.teaching.title",
    textKey: "serviceTwo.items.teaching.text",
    link: "#"
  },
  {
    extraClassName: "background-secondary",
    image: image2,
    hoverImage: hoverImage2,
    titleKey: "serviceTwo.items.preaching.title",
    textKey: "serviceTwo.items.preaching.text",
    link: "#"
  },
  {
    extraClassName: "background-base",
    image: image3,
    hoverImage: hoverImage3,
    titleKey: "serviceTwo.items.healing.title",
    textKey: "serviceTwo.items.healing.text",
    link: "#"
  }
];

const ServiceTwo = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const serviceData = getServiceTwoData(t);
  const sliderOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      375: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      575: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1199: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };
  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .service-two h3,
          .service-two p {
            text-align: center;
            direction: rtl;
          }
        `}</style>
      )}
      <section className="service-two" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
          <Swiper {...sliderOptions}>
            {serviceData.map(
              ({ extraClassName, image, hoverImage, titleKey, textKey, link }, index) => (
                <SwiperSlide key={`service-two-key-${index}`}>
                  <div
                    className={`service-two__box ${extraClassName}`}
                    style={{ backgroundImage: `url(${hoveredIndex === index ? hoverImage : image})` }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    role="button"
                    tabIndex="0"
                  >
                    <div className="service-two__box-inner">
                      <i className="fas fa-heart" style={{color: "#FFD701"}}></i>
                      <p>{t(textKey)}</p>
                      <h3>
                        <Link to={link} style={{ ':hover': { color: '#ffffff' } }}>{t(titleKey)}</Link>
                      </h3>
                      <Link className="service-two__box-link" to={link}>
                        <i className={`far ${currentLanguage === 'ar' ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              )
            )}
          </Swiper>
        </Container>
      </section>
    </>
  );
};

export default ServiceTwo;
