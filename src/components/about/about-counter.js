import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import VisibilitySensor from "react-visibility-sensor";
import CountUp from "react-countup";
import { navigate } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import heartImage from "../../assets/images/shapes/heart-2-1.png";
import aboutImage from "../../assets/images/resources/about-counter-1-1.png";
import aboutHeart from "../../assets/images/shapes/about-count-heart-1-1.png";

const AboutCounter = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const [counter, setCounter] = useState({
    startCounter: false
  });

  const onVisibilityChange = (isVisible) => {
    if (isVisible) {
      setCounter({ startCounter: true });
    }
  };
  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .about-counter .block-title h3 {
            text-align: right;
          }
          .about-counter .about-counter__text {
            text-align: right;
            line-height: 1.6;
          }
          .about-counter .ul-list-one {
            text-align: right;
            padding-right: 0;
            padding-left: 20px;
          }
          .about-counter .thm-btn {
            direction: rtl;
          }
          .about-counter .about-counter__image-content p {
            text-align: right;
          }
        `}</style>
      )}
      <section className="about-counter pt-120" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        <Row>
          <Col lg={6}>
            <div className="block-title">
              <p>
                <img src={heartImage} width="15" alt="" />
                {t('aboutCounter.tagLine')}
              </p>
              <h3>
                {t('aboutCounter.title')}
              </h3>
            </div>
            <p className="about-counter__text">
              {t('aboutCounter.description')}
            </p>
            <ul className="list-unstyled ul-list-one">
              <li>{t('aboutCounter.listItems.1')}</li>
              <li>{t('aboutCounter.listItems.2')}</li>
              <li>{t('aboutCounter.listItems.3')}</li>
            </ul>
            <button className="thm-btn dynamic-radius" onClick={() => navigate("/donate")}>
              {t('aboutCounter.donateButton')}
            </button>
          </Col>
          <Col lg={6}>
            <div className="about-counter__image clearfix">
              <div className="about-counter__image-content">
                <img src={aboutHeart} alt="" />
                <p>{t('aboutCounter.supportText')}</p>
              </div>
              <img src={aboutImage} alt="" className="float-left max-h-[1000px]" />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    </>
  );
};

export default AboutCounter;
