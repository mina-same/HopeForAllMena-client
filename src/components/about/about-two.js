import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import heart from "../../assets/images/shapes/heart-2-1.png";
import welcomeImage from "../../assets/images/resources/welcome-1-1.png";
import aboutImage from "../../assets/images/shapes/about-bag-1-2.png";

const AboutTwo = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';

  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .about-two .about-two__content {
            padding-right: 60px;
          }
          .about-two .block-title h3,
          .about-two .about-two__box h3 {
            text-align: right;
          }
          .about-two .about-two__box p {
            text-align: right;
            line-height: 1.6;
          }
          .about-two .thm-btn {
            direction: rtl;
          }
        `}</style>
      )}
      <section className="about-two pt-120 pb-120" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        <Row>
          <Col xl={6}>
            <div className="about-two__image">
              <img src={welcomeImage} alt="" style={{ width: '586px', height: '666px', objectFit: 'cover' }} />
              <div className="about-two__award">
                <img src={aboutImage} alt="" />
              </div>
            </div>
          </Col>
          <Col xl={6}>
            <div className="about-two__content">
              <div className="block-title">
                <p>
                  <img src={heart} width="15" alt="" /> {t('aboutTwo.tagLine')}
                </p>
                <h3>{t('aboutTwo.title')}</h3>
              </div>
              <Row>
                <Col md={6}>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">1.</span>{t('aboutTwo.strategies.1.title')}</h3>
                    <p>
                      {t('aboutTwo.strategies.1.description')}
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">2. </span>{t('aboutTwo.strategies.2.title')}</h3>
                    <p>
                      {t('aboutTwo.strategies.2.description')}
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">3. </span>{t('aboutTwo.strategies.3.title')}</h3>
                    <p>
                      {t('aboutTwo.strategies.3.description')}
                    </p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">4. </span>{t('aboutTwo.strategies.4.title')}</h3>
                    <p>
                      {t('aboutTwo.strategies.4.description')}
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">5. </span>{t('aboutTwo.strategies.5.title')}</h3>
                    <p>
                      {t('aboutTwo.strategies.5.description')}
                    </p>
                  </div>
                  <div className="about-two__box">
                    <h3 style={{ width: '300px' }}><span className="number">6. </span>{t('aboutTwo.strategies.6.title')}</h3>
                    <p>
                      {t('aboutTwo.strategies.6.description')}
                    </p>
                  </div>
                </Col>
              </Row>
              <Link className="thm-btn dynamic-radius" to="/about">
                {t('aboutTwo.discoverButton')}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
    </>
  );
};

export default AboutTwo;
