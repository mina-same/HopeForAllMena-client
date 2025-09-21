import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import cardBg from "../../assets/images/shapes/contact-card-bg-1-1.png";

const ContactCardCarousel = () => {
  const { t } = useTranslation('Contact');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const swiperOptions = {
    spaceBetween: 30,
    slidesPerView: 3,
    breakpoints: {
      0: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      480: {
        spaceBetween: 0,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 30,
        slidesPerView: 2
      },
      1199: {
        spaceBetween: 30,
        slidesPerView: 3
      }
    }
  };
  return (
    <div className="contact-card-carousel" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container">
        <Swiper {...swiperOptions}>
          <SwiperSlide>
            <div
              className="contact-card d-flex flex-column text-center justify-content-center align-items-center background-secondary"
              style={{ backgroundImage: `url(${cardBg})` }}
            >
              <i aria-label="contact icon" className="azino-icon-email1"></i>
              <h3>{t('contactCards.email.title')}</h3>
              <p>
                <a href="mailto:hope4allmena@gmail.com">{t('contactCards.email.address')}</a>
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="contact-card d-flex flex-column text-center justify-content-center align-items-center background-primary"
              style={{ backgroundImage: `url(${cardBg})` }}
            >
              <i aria-label="contact icon" className="azino-icon-address"></i>
              <h3>{t('contactCards.address.title')}</h3>
              <p>
                {t('contactCards.address.alexandria')} <br /> {t('contactCards.address.alexandriaCity')} <br />
                {t('contactCards.address.cairo')}
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="contact-card d-flex flex-column text-center justify-content-center align-items-center background-special"
              style={{ backgroundImage: `url(${cardBg})` }}
            >
              <i aria-label="contact icon" className="azino-icon-calling"></i>
              <h3>{t('contactCards.phone.title')}</h3>
              <p>
                <a href="tel:+201281416629">+20 128 141 6629</a> <br />
                <a href="tel:+201555103774">+20 155 510 3774</a>
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ContactCardCarousel;
