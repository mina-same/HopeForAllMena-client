import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import heartImage from "../../assets/images/shapes/heart-2-1.png";
import bgImage from "../../assets/images/team/team-map-1-1.png";
import WorldVectorMap from "../map/WorldVectorMap";

const WorldMapImpact = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';

  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .world-map-impact h3,
          .world-map-impact p {
            text-align: right;
            direction: rtl;
          }
          .world-map-impact .block-title {
            text-align: right;
          }
        `}</style>
      )}
      <section className="world-map-impact team-about pt-[200px]" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
          <div className="team-about__top">
            <Row className=" align-items-center">
              <Col md={12} lg={7}>
                <div className="block-title">
                  <p>
                    <img src={heartImage} width="15" alt="" />
                    {t('worldMapImpact.tagLine')}
                  </p>
                  <h3>
                    {t('worldMapImpact.title')}
                  </h3>
                </div>
              </Col>
              <Col md={12} lg={5}>
                <p className="team-about__top-text">
                  {t('worldMapImpact.description')}
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      <section className="w-full">
          <div className="bg-transparent rounded-lg p-6 md:p-8 container">
            <div className="map-container">
              <WorldVectorMap
                value="world_mill"
                width="100%"
                color="#000"
              />
            </div>
          </div>
      </section>
    </>
  );
};

export default WorldMapImpact;
