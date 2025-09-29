import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import CallToAction from "../components/call-to-action/call-to-action";
import BrandCarousel from "../components/brand-carousel";

import serviceBg from "../assets/images/backgrounds/service-hand-bg-1-1.png";
import aboutImage from "../assets/images/resources/about-1-1.jpg";
import "../assets/css/development-department-rtl.css";

const DevelopmentDepartment = () => {
  const { t } = useTranslation('DevelopmentDepartment');
  const { language: currentLanguage } = useI18next();

  return (
    <Layout pageTitle={t('pageTitle')}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t('title')} crumbTitle={t('breadcrumb')} />
      <div className={`${currentLanguage === 'ar' ? 'development-department-rtl' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <section className="service-details pt-120 pb-90" style={{ backgroundImage: `url(${serviceBg})` }}>
          <Container>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-details__content">
                  <h3>{t('hero.title')}</h3>
                  <p>
                    {t('hero.description1')}
                  </p>
                  <p>
                    {t('hero.description2')}
                  </p>
                  <p>
                    {t('hero.description3')}
                  </p>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-details__image">
                  <img src={aboutImage} alt={t('hero.imageAlt')} className="img-fluid" />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <div className="service-features pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-base">
                  <div className="service-features__icon">
                    <i className="azino-icon-charity"></i>
                  </div>
                  <h4>{t('features.economicEmpowerment.title')}</h4>
                  <p>
                    {t('features.economicEmpowerment.description')}
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-secondary">
                  <div className="service-features__icon">
                    <i className="azino-icon-heart"></i>
                  </div>
                  <h4>{t('features.communityInfrastructure.title')}</h4>
                  <p>
                    {t('features.communityInfrastructure.description')}
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className="service-features__single background-primary">
                  <div className="service-features__icon">
                    <i className="azino-icon-dove"></i>
                  </div>
                  <h4>{t('features.capacityBuilding.title')}</h4>
                  <p>
                    {t('features.capacityBuilding.description')}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <section className="service-impact pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12}>
                <div className="block-title text-center">
                  <h3>{t('impact.title')}</h3>
                  <p>{t('impact.subtitle')}</p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={6}>
                <div className="service-impact__content">
                  <h4>{t('impact.achievements.title')}</h4>
                  <ul className="service-impact__list">
                    {t('impact.achievements.list', { returnObjects: true }).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-impact__stats">
                  <div className="row">
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>{t('impact.stats.familiesHelped.number')}</h3>
                        <p>{t('impact.stats.familiesHelped.label')}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>{t('impact.stats.projectsCompleted.number')}</h3>
                        <p>{t('impact.stats.projectsCompleted.label')}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>{t('impact.stats.jobsCreated.number')}</h3>
                        <p>{t('impact.stats.jobsCreated.label')}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="impact-stat">
                        <h3>{t('impact.stats.communitiesServed.number')}</h3>
                        <p>{t('impact.stats.communitiesServed.label')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <CallToAction />
        <BrandCarousel extraClass="client-carousel__has-border-top" />
      </div>
      <Footer />
    </Layout>
  );
};

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default DevelopmentDepartment;
