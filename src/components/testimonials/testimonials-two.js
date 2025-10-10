import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Autoplay, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useI18next } from "gatsby-plugin-react-i18next";
import testimonialImage1 from "../../assets/images/review/01.jpg";
import testimonialImage2 from "../../assets/images/review/02.jpg";
import testimonialImage3 from "../../assets/images/review/03.jpg";

const TestimonialsTwo = () => {
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Same testimonials data for both languages - only text changes
  const testimonialsData = [
    {
      id: 1,
      image: testimonialImage1,
      text: currentLanguage === 'ar' 
        ? "لقد كانت البرامج التعليمية لمنظمة الأمل للجميع الشرق الأوسط منارة أمل لمجتمعنا. إن نهجهم الشامل في التعلم والتطوير قد مكّن عدداً لا يحصى من الأفراد من متابعة أحلامهم وبناء مستقبل أفضل لعائلاتهم."
        : "Hope For All Mena's educational programs have been a beacon of light for our community. Their comprehensive approach to learning and development has empowered countless individuals to pursue their dreams and build better futures for their families.",
      name: currentLanguage === 'ar' ? "القس راضي عطالله" : "Pastor Radi Atallah",
      designation: currentLanguage === 'ar' ? "قائد ديني" : "Religious Leader"
    },
    {
      id: 2,
      image: testimonialImage2,
      text: currentLanguage === 'ar'
        ? "لقد جلب برنامج توزيع المجلات المعرفة القيمة والإلهام إلى المناطق النائية التي كانت محرومة من الخدمات سابقاً. إن التزام منظمة الأمل للجميع الشرق الأوسط بالوصول إلى كل ركن في منطقتنا أمر جدير بالثناء ومغيّر للحياة حقاً."
        : "The magazine distribution program has brought valuable knowledge and inspiration to remote areas that were previously underserved. Hope For All Mena's commitment to reaching every corner of our region is truly commendable and life-changing.",
      name: currentLanguage === 'ar' ? "القس اندريه ذي" : "Pastor Andre Zee",
      designation: currentLanguage === 'ar' ? "قس مجتمعي" : "Community Pastor"
    },
    {
      id: 3,
      image: testimonialImage3,
      text: currentLanguage === 'ar'
        ? "كميسر تدريب، شهدت بنفسي كيف تحوّل برامج منظمة الأمل للجميع الشرق الأوسط الحياة. إن نهجهم الشامل في التعليم والتمكين يخلق تغييراً إيجابياً دائماً في المجتمعات عبر الشرق الأوسط وشمال أفريقيا."
        : "As a training facilitator, I've witnessed firsthand how Hope For All Mena's programs transform lives. Their holistic approach to education and empowerment creates lasting positive change in communities across the Middle East and North Africa.",
      name: currentLanguage === 'ar' ? "القس سامح موريس" : "Pastor Sameh Morris",
      designation: currentLanguage === 'ar' ? "قس التدريب" : "Training Pastor"
    }
  ];

  const testimonialsThumbOptions = {
    slidesPerView: 3,
    spaceBetween: 0,
    speed: 1400,
    autoplay: {
      delay: 5000
    },
    watchSlidesProgress: true
  };
  
  const testimonialsOptions = {
    speed: 1400,
    slidesPerView: 1,
    autoplay: {
      delay: 5000
    }
  };

  return (
    <section className="testimonials-two">
      <Container>
        <Row>
          <Col xl={12}>
            <div className="testimonials-two__content">
              {/* Thumbnail Navigation - Same design for both languages */}
              <div className="testimonials-two__thumb">
                <Swiper
                  modules={[Autoplay, Thumbs]}
                  onSwiper={setThumbsSwiper}
                  {...testimonialsThumbOptions}
                  id="testimonials-two__thumb"
                >
                  {testimonialsData.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Main Content - Same design for both languages */}
              <div className="testimonials-two__main">
                <Swiper
                  modules={[Autoplay, Thumbs]}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  {...testimonialsOptions}
                  id="testimonials-two__carousel"
                >
                  {testimonialsData.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                      <div className="testimonials-two__single">
                        <p className="testimonials-two__text">
                          {testimonial.text}
                        </p>
                        <div className="testimonials-two__meta">
                          <h3 className="testimonials-two__title">{testimonial.name}</h3>
                          <p className="testimonials-two__designation">{testimonial.designation}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TestimonialsTwo;
