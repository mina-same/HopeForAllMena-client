import React from "react";
import { graphql } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import {
  Building2,
  Sparkles,
  Compass,
  Stethoscope,
  Church,
  Briefcase,
  Globe,
  GraduationCap,
  HandHeart,
  Lightbulb,
  Eye,
  Target,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import { useTranslation, useI18next, Link } from "gatsby-plugin-react-i18next";

import devHall from "../assets/images/development/dev-community-gathering-hall.jpg";
import devWomen from "../assets/images/development/dev-community-gathering-women.jpg";
import devElderly from "../assets/images/development/dev-elderly-care-visit.jpg";
import devYouth from "../assets/images/development/dev-inclusion-youth.jpg";
import devParticipants from "../assets/images/development/dev-inclusion-participants.jpg";
import brandSynod from "../assets/images/resources/brand-1-4.png";
import brandPartner from "../assets/images/resources/brand-1-3.png";
import hopeLogo from "../assets/images/logos/hope4AllMena.png";
import "../assets/css/department-pages.css";

// One icon per entry in supportAreas.items, in order.
const AREA_ICONS = [
  Building2,
  Sparkles,
  Compass,
  Stethoscope,
  Church,
  Briefcase,
  Globe,
  GraduationCap,
  HandHeart,
  Lightbulb,
];

const DevelopmentDepartment = () => {
  const { t } = useTranslation("DevelopmentDepartment");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const missionItems = t("mission.items", { returnObjects: true }) || [];
  const areaItems = t("supportAreas.items", { returnObjects: true }) || [];
  const requirementItems = t("requirements.items", { returnObjects: true }) || [];

  const gallery = [
    { src: devElderly, key: "photo1" },
    { src: devYouth, key: "photo2" },
    { src: devParticipants, key: "photo3" },
  ];

  const partners = [
    { src: hopeLogo, alt: t("partners.hopeAlt"), title: t("partners.hopeTitle") },
    { src: brandSynod, alt: t("partners.brand4Alt"), title: t("partners.brand4Title") },
    { src: brandPartner, alt: t("partners.brand3Alt"), title: t("partners.brand3Title") },
  ];

  return (
    <Layout pageTitle={t("pageTitle")}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("title")} crumbTitle={t("breadcrumb")} image={devHall} />

      <div className="dept" dir={isRTL ? "rtl" : "ltr"}>
        {/* Intro */}
        <section className="dept-section dept-intro">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <span className="dept-intro__eyebrow">{t("wordmark.name")}</span>
                <h1>{t("hero.title")}</h1>
                <p className="dept-text">{t("hero.intro")}</p>
                <blockquote className="dept-verse">
                  <p>{t("verse.text")}</p>
                  <cite>{t("verse.ref")}</cite>
                </blockquote>
                <div className="dept-actions">
                  <Link to="/development-project-request" className="dept-btn dept-btn--primary">
                    <HeartHandshake />
                    {t("hero.primaryCta")}
                  </Link>
                  <Link to="/contact" className="dept-btn dept-btn--outline">
                    {t("hero.secondaryCta")}
                  </Link>
                </div>
              </Col>
              <Col lg={6}>
                <img
                  src={devWomen}
                  alt={t("heroImageAlt")}
                  title={t("heroImageTitle")}
                  className="dept-intro__img"
                  width="1280"
                  height="720"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Matching fund */}
        <section className="dept-section dept-section--alt">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={7}>
                <p className="dept-figure">{t("about.highlight")}</p>
                <p className="dept-text">{t("matchingFund.quote")}</p>
              </Col>
              <Col lg={5}>
                <div className="dept-split" aria-hidden="true">
                  <span />
                  <span />
                </div>
                <div className="dept-split-legend">
                  <span>
                    {t("matchingFund.ministryShare")} <strong>50%</strong>
                  </span>
                  <span>
                    {t("matchingFund.churchShare")} <strong>50%</strong>
                  </span>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Who we are */}
        <section className="dept-section">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className="dept-heading mb-4">
                  <h2>{t("about.title")}</h2>
                </div>
                <p className="dept-text">{t("about.p1")}</p>
                <p className="dept-text">{t("about.p2")}</p>
              </Col>
              <Col lg={6}>
                <img
                  src={devHall}
                  alt={t("about.imageAlt")}
                  title={t("about.imageTitle")}
                  className="dept-img"
                  loading="lazy"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Vision & mission */}
        <section className="dept-section dept-section--alt">
          <Container>
            <Row className="g-4">
              <Col lg={6}>
                <div className="dept-card">
                  <span className="dept-icon">
                    <Eye />
                  </span>
                  <h3>{t("vision.title")}</h3>
                  <p>{t("vision.text")}</p>
                </div>
              </Col>
              <Col lg={6}>
                <div className="dept-card">
                  <span className="dept-icon">
                    <Target />
                  </span>
                  <h3>{t("mission.title")}</h3>
                  <ul className="dept-checks">
                    {missionItems.map((item) => (
                      <li key={item}>
                        <CheckCircle2 />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Support areas */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading">
              <h2>{t("supportAreas.title")}</h2>
              <p>{t("matchingFund.text")}</p>
            </div>
            <Row className="g-4">
              {areaItems.map((item, i) => {
                const Icon = AREA_ICONS[i] || Sparkles;
                return (
                  <Col md={6} lg={4} key={item}>
                    <div className="dept-card">
                      <span className="dept-icon">
                        <Icon />
                      </span>
                      <p>{item}</p>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>

        {/* Requirements — an ordered checklist, so numbered */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading">
              <h2>{t("requirements.title")}</h2>
              <p>{t("requirements.subtitle")}</p>
            </div>
            <ol className="dept-rows dept-rows--cols">
              {requirementItems.map((item, i) => (
                <li key={item.title}>
                  <span className="dept-num">{i + 1}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* Gallery */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading">
              <h2>{t("gallery.title")}</h2>
              <p>{t("gallery.subtitle")}</p>
            </div>
            <Row className="g-4">
              {gallery.map(({ src, key }) => (
                <Col md={4} key={key}>
                  <figure className="dept-shot">
                    <img src={src} alt={t(`gallery.${key}Alt`)} loading="lazy" />
                    <figcaption>{t(`gallery.${key}Title`)}</figcaption>
                  </figure>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Call to action */}
        <section className="dept-band">
          <Container>
            <h2>{t("bottomCta.title")}</h2>
            <p>{t("bottomCta.text")}</p>
            <div className="dept-actions dept-actions--center">
              <Link to="/development-project-request" className="dept-btn dept-btn--light">
                {t("bottomCta.button")}
                <Arrow />
              </Link>
              <Link to="/contact" className="dept-btn dept-btn--ghost">
                {t("hero.secondaryCta")}
              </Link>
            </div>
          </Container>
        </section>

        {/* Partners */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading dept-heading--center">
              <h2>{t("partners.title")}</h2>
              <p>{t("partners.subtitle")}</p>
            </div>
            <div className="dept-partners">
              {partners.map((brand) => (
                <img key={brand.alt} src={brand.src} alt={brand.alt} title={brand.title} loading="lazy" />
              ))}
            </div>
          </Container>
        </section>
      </div>

      <Footer />
    </Layout>
  );
};

export default DevelopmentDepartment;

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
