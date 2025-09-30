import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, graphql, useStaticQuery } from "gatsby";
import { useTranslation } from "react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import { Autoplay, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BlockTitle from "../block-title";
import testimonialImage1 from "../../assets/images/review/01.jpg";
import testimonialImage2 from "../../assets/images/review/02.jpg";
import testimonialImage3 from "../../assets/images/review/03.jpg";
import "./testimonials-two-rtl.css";

// Swiper v11 uses modules via props

const TestimonialsTwo = () => {
  const { t } = useTranslation('TestimonialsTwo');
  const { language: currentLanguage } = useI18next();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
  // GraphQL query for i18n support
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  // Get testimonials from translation files
  const testimonials = t('testimonials', { returnObjects: true });
  
  // Images array to match with testimonials
  const images = [testimonialImage1, testimonialImage2, testimonialImage3];

  const testimonialsThumbOptions = {
    slidesPerView: 3,
    spaceBetween: 0,
    speed: 1400,
    autoplay: {
      delay: 5000
    }
  };
  
  const testimonialsOptions = {
    speed: 1400,
    mousewheel: true,
    slidesPerView: 1,
    autoplay: {
      delay: 5000
    }
  };
  return (
    <section 
      className={`testimonials-two ${currentLanguage === 'ar' ? 'rtl testimonials-two-rtl' : 'ltr'}`}
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <Container>
        <div className="team-about__top">
          <Row className="align-items-center">
            <Col md={12} lg={7}>
              <BlockTitle
                title={t('title')}
                tagLine={t('tagLine')}
              />
            </Col>
            <Col md={12} lg={5}>
              <p className={`team-about__top-text ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {t('description')}
              </p>
            </Col>
          </Row>
        </div>
        
        {/* Thumbnail Swiper */}
        <Swiper
          modules={[Autoplay, Thumbs]}
          id="testimonials-two__thumb"
          onSwiper={setThumbsSwiper}
          {...testimonialsThumbOptions}
          className={currentLanguage === 'ar' ? 'rtl-swiper' : ''}
        >
          {testimonials && testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <img 
                src={images[index]} 
                alt={testimonial.name}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '50%'
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        
        {/* Content Swiper */}
        <Swiper
          modules={[Autoplay, Thumbs]}
          id="testimonials-two__carousel"
          thumbs={{ swiper: thumbsSwiper }}
          {...testimonialsOptions}
          className={currentLanguage === 'ar' ? 'rtl-swiper' : ''}
        >
          {testimonials && testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <p className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                {testimonial.text}
              </p>
              <div className={`testimonials-two__meta ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <h3>{testimonial.name}</h3>
                <span>{testimonial.designation}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default TestimonialsTwo;
