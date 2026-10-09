import React from "react";
import { graphql } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import {
  BookOpen,
  Users,
  Sparkles,
  Handshake,
  GraduationCap,
  MapPin,
  Target,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import { useTranslation, useI18next, Link } from "gatsby-plugin-react-i18next";

import abcLogo from "../assets/images/abc-academy/abc-logo-slogan.jpeg";
import abcGraduation from "../assets/images/abc-academy/abc-graduation-group.jpeg";
import abcClassAlex from "../assets/images/abc-academy/abc-class-group-alexandria.jpeg";
import abcClassIntl from "../assets/images/abc-academy/abc-class-group-international.jpeg";
import abcOnline from "../assets/images/abc-academy/abc-online-class-1.jpeg";
import abcLecture from "../assets/images/abc-academy/abc-online-lecture-slide.jpeg";
import brandSynod from "../assets/images/resources/brand-1-4.png";
import brandPartner from "../assets/images/resources/brand-1-3.png";
import hopeLogo from "../assets/images/logos/hope4AllMena.png";
import "../assets/css/department-pages.css";

const PILLARS = [
  { key: "formulate", icon: Sparkles },
  { key: "empower", icon: Users },
  { key: "impact", icon: Target },
];

const VALUES = [
  { key: "biblical", icon: BookOpen },
  { key: "teamwork", icon: Users },
  { key: "empowerment", icon: Sparkles },
  { key: "partnership", icon: Handshake },
];

const PROGRAMS = ["impact", "access", "care", "shepherd"];

// Sort items by the key order given in the translation file (falls back to the default order).
const orderBy = (items, order, getKey) =>
  Array.isArray(order) ? order.map((k) => items.find((item) => getKey(item) === k)).filter(Boolean) : items;

const AlexandriaBibleCollege = () => {
  const { t } = useTranslation("AlexandriaBibleCollege");
  const aboutPillars = ["pillar1", "pillar2", "pillar3"].map((k) => t(`about.${k}`)).filter(Boolean);
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const gallery = [
    { src: abcGraduation, key: "photo2", md: 7 },
    { src: abcOnline, key: "photo3", md: 5 },
    { src: abcLecture, key: "photo4", md: 12, wide: true },
  ];

  const partners = [
    { src: hopeLogo, alt: t("partners.hopeAlt"), title: t("partners.hopeTitle") },
    { src: brandSynod, alt: t("partners.brand4Alt"), title: t("partners.brand4Title") },
    { src: brandPartner, alt: t("partners.brand3Alt"), title: t("partners.brand3Title") },
  ];

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("crumbTitle")} image={abcClassIntl} />

      <div className="dept" dir={isRTL ? "rtl" : "ltr"}>
        {/* Intro */}
        <section className="dept-section dept-intro">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <span className="dept-intro__eyebrow">{t("hero.eyebrow")}</span>
                <h1>{t("hero.title")}</h1>
                <p className="dept-intro__sub">{t("hero.titleEn")}</p>
                <p className="dept-text">{t("hero.lead")}</p>
                <blockquote className="dept-verse">
                  <p>{t("hero.verse")}</p>
                  <cite>{t("hero.verseRef")}</cite>
                </blockquote>
                <div className="dept-actions">
                  <Link to="/courses" className="dept-btn dept-btn--primary">
                    <GraduationCap />
                    {t("cta.coursesButton")}
                  </Link>
                  <Link to="/contact" className="dept-btn dept-btn--outline">
                    {t("cta.contactButton")}
                  </Link>
                </div>
              </Col>
              <Col lg={6}>
                <img
                  src={abcLogo}
                  alt={t("hero.logoAlt")}
                  title={t("hero.logoTitle")}
                  className="dept-intro__img dept-intro__img--contain"
                  width="1600"
                  height="900"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Pillars */}
        <section className="dept-section dept-section--alt">
          <Container>
            <Row className="g-4">
              {PILLARS.map(({ key, icon: Icon }) => (
                <Col md={4} key={key}>
                  <div className="dept-card">
                    <span className="dept-icon">
                      <Icon />
                    </span>
                    <h3>{t(`pillars.${key}.title`)}</h3>
                    <p className="dept-card__sub">{t(`pillars.${key}.titleEn`)}</p>
                  </div>
                </Col>
              ))}
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
                <p className="dept-text">{t("about.content")}</p>
                {t("about.pillarsTitle") ? (
                  <p className="font-semibold mb-2">{t("about.pillarsTitle")}</p>
                ) : null}
                {aboutPillars.length ? (
                  <ul className="dept-checks mt-0">
                    {aboutPillars.map((text) => (
                      <li key={text}>
                        <CheckCircle2 />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {t("about.closing") ? (
                  <p className="dept-text font-semibold mt-3">{t("about.closing")}</p>
                ) : null}
              </Col>
              <Col lg={6}>
                <img
                  src={abcClassAlex}
                  alt={t("about.imageAlt")}
                  title={t("about.imageTitle")}
                  className="dept-img"
                  loading="lazy"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Goal & vision */}
        <section className="dept-section dept-section--alt">
          <Container>
            <Row className="g-4">
              {[
                { key: "goal", icon: Target },
                { key: "vision", icon: Eye },
              ].map(({ key, icon: Icon }) => (
                <Col lg={6} key={key}>
                  <div className="dept-card">
                    <span className="dept-icon">
                      <Icon />
                    </span>
                    <h3>{t(`${key}.title`)}</h3>
                    <p>{t(`${key}.content`)}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Values */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading">
              <h2>{t("values.title")}</h2>
              {t("values.subtitle") ? <p>{t("values.subtitle")}</p> : null}
            </div>
            <Row className="g-4">
              {orderBy(VALUES, t("values.order", { returnObjects: true }), (v) => v.key).map(({ key, icon: Icon }) => (
                <Col md={6} lg={3} key={key}>
                  <div className="dept-card">
                    <span className="dept-icon">
                      <Icon />
                    </span>
                    <h3>{t(`values.${key}.title`)}</h3>
                    <p>{t(`values.${key}.content`)}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Programs */}
        <section className="dept-section dept-section--alt">
          <Container>
            {t("programs.title") ? (
              <div className="dept-heading">
                <h2>{t("programs.title")}</h2>
                {t("programs.subtitle") ? <p>{t("programs.subtitle")}</p> : null}
              </div>
            ) : null}
            <Row className="g-4">
              {orderBy(PROGRAMS, t("programs.order", { returnObjects: true }), (k) => k).map((key, index) => (
                <Col md={6} key={key}>
                  <div className="dept-card">
                    <h3>
                      <bdi dir="ltr">{`${index + 1}. ${t(`programs.${key}.name`)}`}</bdi>
                    </h3>
                    <p className="mb-3">{t(`programs.${key}.content`)}</p>
                    <Link to="/courses" className="dept-link">
                      {t("cta.coursesButton")}
                      <Arrow />
                    </Link>
                  </div>
                </Col>
              ))}
            </Row>
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
              {gallery.map(({ src, key, md, wide }) => (
                <Col md={md} key={key}>
                  <figure className={`dept-shot ${wide ? "dept-shot--wide" : ""}`}>
                    <img src={src} alt={t(`gallery.${key}Alt`)} loading="lazy" />
                    <figcaption>{t(`gallery.${key}Title`)}</figcaption>
                  </figure>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Locations */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading">
              <h2>{t("addresses.title")}</h2>
            </div>
            <Row className="g-4">
              {["alexandria", "cairo"].map((city) => (
                <Col lg={6} key={city}>
                  <div className="dept-card">
                    <span className="dept-icon">
                      <MapPin />
                    </span>
                    <h3>{t(`addresses.${city}.city`)}</h3>
                    <p>{t(`addresses.${city}.address`)}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Call to action */}
        <section className="dept-band">
          <Container>
            <h2>{t("cta.title")}</h2>
            <p>{t("cta.subtitle")}</p>
            <div className="dept-actions dept-actions--center">
              <Link to="/courses" className="dept-btn dept-btn--light">
                <GraduationCap />
                {t("cta.coursesButton")}
              </Link>
              <Link to="/contact" className="dept-btn dept-btn--ghost">
                {t("cta.contactButton")}
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

export default AlexandriaBibleCollege;

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
