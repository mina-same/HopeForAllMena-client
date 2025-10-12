import React, { useState } from "react";
import { useStaticQuery, graphql } from "gatsby";
import ModalVideo from "react-modal-video";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import videoBg from "../../assets/images/shapes/video-bg-1-1.png";
import videoImage from "../../assets/images/resources/video-1-1.png";
import "./video-card-two-rtl.css";

const VideoCardTwo = () => {
  const [isOpen, setOpen] = useState(false);
  const { t } = useTranslation('VideoCardTwo');
  const { language: currentLanguage } = useI18next();
  useStaticQuery(graphql`
    query {
      locales: allLocale {
        edges {
          node {
            ns
            data
            language
          }
        }
      }
    }
  `);
  return (
    <section className={`video-card-two ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} style={{marginBottom: "100px"}} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="L61p2uyiMSo"
        onClose={() => setOpen(false)}
      />
      <Container>
        <div
          className="inner-container"
          style={{ backgroundImage: `url(${videoBg})` }}
        >
          <Row className="align-items-center">
            <Col lg={3} className={`${currentLanguage === 'ar' ? 'text-center' : 'text-center'}`}>
              <div className="video-card-two__box">
                <img 
                  src={videoImage} 
                  alt={t('videoAlt')} 
                  style={{width: "250px", height: "250px", objectFit: "cover"}} 
                />
                <span
                  className="video-card-two__box-btn video-popup"
                  onClick={() => setOpen(true)}
                  onKeyDown={() => setOpen(true)}
                  role="button"
                  tabIndex={0}
                  title={t('playButton')}
                  aria-label={t('playButton')}
                >
                  <i className="fa fa-play"></i>
                </span>
              </div>
            </Col>
            <Col lg={4} className={`${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="title-section text-center">
                <h3 className="mb-0 mb-md-3">{t('title')}</h3>
                <div className="subtitle mb-0 mb-md-2">{t('subtitle')}</div>
              </div>
            </Col>
            <Col lg={5} className={`${currentLanguage === 'ar' ? 'text-right text-center text-lg-right' : 'text-left text-center text-lg-left'}`}>
              <p>
                {t('description')}
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </section>
  );
};

export default VideoCardTwo;