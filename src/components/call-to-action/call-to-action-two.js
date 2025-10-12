import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import bgImage from "../../assets/images/backgrounds/page-header-1-1.jpg";
import HeartImage from "../../assets/images/shapes/heart-2-1.png";
import "./call-to-action-two-rtl.css";

const CallToActionTwo = () => {
  const { t } = useTranslation('CallToActionTwo');
  const { language: currentLanguage } = useI18next();
  
  return (
    <section className={`call-to-action-two ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div
        className="call-to-action-two__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <Container className="container pt-80 pb-80">
        <i className="azino-icon-charity call-to-action-two__icon"></i>
        <Row className="align-items-center">
          <Col lg={7} className={`${currentLanguage === 'ar' ? '' : 'text-left'}`}>
            <div className="block-title">
              <p>
                <img src={HeartImage} width="15" alt="" />
                {t('tagLine')}
              </p>
              <h3>
                {t('title')}
              </h3>
            </div>
          </Col>
          <Col
            lg={5}
            className={`d-flex ${currentLanguage === 'ar' ? 'justify-content-start justify-content-lg-start' : 'justify-content-start justify-content-lg-end'}`}
          >
            <div className="btn-wrap">
              <Link className="scroll-to-target thm-btn" to="/donate">
                {t('button')}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CallToActionTwo;
