import React from "react";
import { graphql } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import CallToAction from "../components/call-to-action/call-to-action";
import BrandCarousel from "../components/brand-carousel";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";

import serviceBg from "../assets/images/backgrounds/service-hand-bg-1-1.png";
import publishingHouseWhite from "../assets/images/publishing-house-white.png";
import "../assets/css/publishing-house-rtl.css";

const PublishingHouse = () => {
  const { t } = useTranslation("PublishingHouse");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("crumbTitle")} />
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Hero Section */}
        <section 
          className="service-details pt-120 pb-90" 
          style={{ backgroundImage: `url(${serviceBg})` }}
        >
          <Container>
            <Row className={isRTL ? "flex-row-reverse" : ""}>
              <Col md={12} lg={6}>
                <div className={`service-details__content ${isRTL ? "text-right" : ""}`}>
                  <h3 className={isRTL ? "font-arabic" : ""}>{t("hero.title")}</h3>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("hero.intro")}
                  </p>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("hero.mission")}
                  </p>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("hero.approach")}
                  </p>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-details__image">
                  <img 
                    src={publishingHouseWhite} 
                    alt={t("pageTitle")} 
                    className="img-fluid" 
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section */}
        <div className="service-features pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12} lg={4} className="mb-30">
                <div className={`service-features__single background-special ${isRTL ? "text-right" : ""}`}>
                  <div className={`service-features__icon ${isRTL ? "ml-auto mr-0" : ""}`}>
                    <i className="azino-icon-reading-book"></i>
                  </div>
                  <h4 className={isRTL ? "font-arabic" : ""}>{t("features.authorSupport.title")}</h4>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("features.authorSupport.description")}
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className={`service-features__single background-secondary ${isRTL ? "text-right" : ""}`}>
                  <div className={`service-features__icon ${isRTL ? "ml-auto mr-0" : ""}`}>
                    <i className="azino-icon-dove"></i>
                  </div>
                  <h4 className={isRTL ? "font-arabic" : ""}>{t("features.qualityPublishing.title")}</h4>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("features.qualityPublishing.description")}
                  </p>
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30">
                <div className={`service-features__single background-base ${isRTL ? "text-right" : ""}`}>
                  <div className={`service-features__icon ${isRTL ? "ml-auto mr-0" : ""}`}>
                    <i className="azino-icon-charity"></i>
                  </div>
                  <h4 className={isRTL ? "font-arabic" : ""}>{t("features.wideDistribution.title")}</h4>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("features.wideDistribution.description")}
                  </p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        {/* Impact Section */}
        <section className="service-impact pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12}>
                <div className={`block-title text-center ${isRTL ? "rtl-block-title" : ""}`}>
                  <h3 className={isRTL ? "font-arabic" : ""}>{t("impact.title")}</h3>
                  <p>{t("impact.subtitle")}</p>
                </div>
              </Col>
            </Row>
            <Row className={isRTL ? "flex-row-reverse" : ""}>
              <Col md={12} lg={6}>
                <div className={`service-impact__content ${isRTL ? "text-right" : ""}`}>
                  <h4 className={isRTL ? "font-arabic" : ""}>{t("impact.achievementsTitle")}</h4>
                  <ul className={`service-impact__list ${isRTL ? "rtl-list" : ""}`}>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.booksPublished")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.authorsSupported")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.countriesReached")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.partnerships")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.platforms")}</li>
                  </ul>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-impact__stats">
                  <div className="row">
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>100+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.books")}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>50+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.authors")}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>30+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.countries")}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>1000+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.copies")}</p>
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

export default PublishingHouse;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
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
