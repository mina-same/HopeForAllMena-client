import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import bgImage from "../../assets/images/shapes/testimonials-map-1-1.png";
import heart from "../../assets/images/shapes/heart-2-1.png";
import reviewImage1 from "../../assets/images/review/01.jpg";
import reviewImage2 from "../../assets/images/review/02.jpg";
import reviewImage3 from "../../assets/images/review/03.jpg";
import "./testimonials-one-rtl.css";

const TestimonialsOne = () => {
  const { t } = useTranslation('TestimonialsOne');
  const { language: currentLanguage } = useI18next();
  

  // Get testimonials from translation files
  const testimonials = t('testimonials', { returnObjects: true });
  
  // Images array to match with testimonials - using review folder images
  const images = [reviewImage1, reviewImage2, reviewImage3];

  return (
    <section
      className={`testimonials-one pt-120 pb-90 ${currentLanguage === 'ar' ? 'rtl testimonials-one-rtl' : 'ltr'}`}
      style={{ backgroundImage: `url(${bgImage})` }}
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <Container>
        <div className="team-about__top">
          <Row className="align-items-center">
            <Col md={12} lg={7}>
              <div className={`block-title ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <p className={currentLanguage === 'ar' ? 'flex-row-reverse' : ''}>
                  <img src={heart} width="15" alt="" className={currentLanguage === 'ar' ? 'ml-2' : 'mr-2'} />
                  {t('badge')}
                </p>
                <h3 className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                  {t('title')}
                </h3>
              </div>
            </Col>
            <Col md={12} lg={5}>
              <p className={`team-about__top-text ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                {t('description')}
              </p>
            </Col>
          </Row>
        </div>
        <Row>
          {testimonials && testimonials.map((testimonial, index) => (
            <Col lg={4} key={`testimonials-post-key-${index}`}>
              <div className={`testimonials-one__single ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="testimonials-one__image">
                  <img 
                    src={images[index]} 
                    alt={testimonial.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                </div>
                <p className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                  {testimonial.text}
                </p>
                <h3 className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                  {testimonial.name}
                </h3>
                <span className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                  {testimonial.designation}
                </span>
              </div>
            </Col>
          ))}
        </Row>
        
        {/* Call to Action Section */}
        <Row className="mt-5">
          <Col lg={12} className="text-center">
            <div className={`testimonials-cta ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Link 
                to="/about" 
                className={`btn btn-primary ${currentLanguage === 'ar' ? 'ml-3' : 'mr-3'}`}
              >
                {currentLanguage === 'ar' ? 'اعرف المزيد عنا' : 'Learn More About Us'}
              </Link>
              <Link 
                to="/contact" 
                className="btn btn-outline-primary"
              >
                {currentLanguage === 'ar' ? 'تواصل معنا' : 'Contact Us'}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsOne;
