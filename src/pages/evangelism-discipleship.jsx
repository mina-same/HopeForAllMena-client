import React from "react";
import { graphql } from "gatsby";
import { Link, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import {
  BookOpen,
  ScrollText,
  Sparkles,
  HandHeart,
  CalendarCheck,
  CheckCircle2,
  Newspaper,
  GraduationCap,
} from "lucide-react";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import Layout from "../components/layout";
import heroImage from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0055.jpg";
import missionImage from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0063.jpg";
import visionImage from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0073.jpg";
import programsImageOne from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0086.jpg";
import programsImageTwo from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0065.jpg";
import galleryImageOne from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0075.jpg";
import galleryImageTwo from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0111.jpg";
import galleryImageThree from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0114.jpg";
import galleryImageFour from "../assets/images/قسم التعليم و الكرازه/IMG_20240701_185628.jpg";
import mailboxLogo from "../assets/images/resources/brand-1-1.png";
import synodLogo from "../assets/images/resources/brand-1-4.png";
import "../assets/css/department-pages.css";

const OBJECTIVE_KEYS = [
  "evangelism",
  "bible",
  "foundations",
  "discipleship",
  "values",
];

const PROGRAM_FEATURES = [
  { key: "story", icon: BookOpen },
  { key: "verse", icon: ScrollText },
  { key: "activity", icon: Sparkles },
  { key: "challenge", icon: CalendarCheck },
  { key: "prayer", icon: HandHeart },
];

const GALLERY_IMAGES = [
  { key: "one", src: galleryImageOne },
  { key: "two", src: galleryImageTwo },
  { key: "three", src: galleryImageThree },
  { key: "four", src: galleryImageFour },
];

const PAGE_ACTIONS = [
  { key: "magazines", icon: Newspaper, link: "/magazines" },
  { key: "training", icon: GraduationCap, link: "/training" },
];

const EvangelismDiscipleship = () => {
  const { t } = useTranslation("EvangelismDiscipleship");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  const philosophyBody = t("philosophy.body");

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope for All Mena`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("pageTitle")} image={missionImage} />

      <div className="dept" dir={isRTL ? "rtl" : "ltr"}>
        {/* Intro */}
        <section className="dept-section dept-intro">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <span className="dept-intro__eyebrow">{t("heroSection.badge")}</span>
                <h1>
                  {t("heroSection.title")} {t("heroSection.titleHighlight")}
                </h1>
                <p className="dept-text">{t("heroSection.description")}</p>
              </Col>
              <Col lg={6}>
                <img
                  src={heroImage}
                  alt={t("heroSection.imageAlt")}
                  className="dept-intro__img"
                  style={{ objectPosition: "top" }}
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Mission */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading dept-heading--center">
              <h2>{t("mission.title")}</h2>
              <p>{t("mission.body")}</p>
            </div>
          </Container>
        </section>

        {/* Vision (+ philosophy, once philosophy.body is filled in) */}
        <section className="dept-section">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className="dept-heading mb-4">
                  <h2>{t("vision.title")}</h2>
                </div>
                <p className="dept-text">{t("vision.body")}</p>
                {philosophyBody ? (
                  <blockquote className="dept-verse">
                    <p className="font-semibold">{t("philosophy.title")}</p>
                    <p>{philosophyBody}</p>
                  </blockquote>
                ) : null}
              </Col>
              <Col lg={6}>
                <img src={visionImage} alt={t("vision.imageAlt")} className="dept-img" loading="lazy" />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Objectives */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading">
              <h2>{t("objectives.title")}</h2>
            </div>
            <ul className="dept-rows dept-rows--cols">
              {OBJECTIVE_KEYS.map((key) => (
                <li key={key}>
                  <CheckCircle2 />
                  <div>
                    <h3>{t(`objectives.items.${key}.title`)}</h3>
                    <p>{t(`objectives.items.${key}.description`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Programs */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading">
              <h2>{t("programs.title")}</h2>
              <p>{t("programs.description")}</p>
              <p>{t("programs.note")}</p>
            </div>

            <Row className="g-4 align-items-center mb-5">
              <Col lg={6}>
                <img src={programsImageOne} alt={t("programs.imageAltOne")} className="dept-img" loading="lazy" />
              </Col>
              <Col lg={6}>
                <Row className="g-4 mb-4">
                  <Col xs={6}>
                    <div className="dept-stat">{t("programs.levelsValue")}</div>
                    <span>{t("programs.levelsLabel")}</span>
                  </Col>
                  <Col xs={6}>
                    <div className="dept-stat">{t("programs.agesValue")}</div>
                    <span>{t("programs.agesLabel")}</span>
                  </Col>
                </Row>
                <figure className="dept-shot dept-shot--wide">
                  <img src={programsImageTwo} alt={t("programs.imageAltTwo")} loading="lazy" />
                </figure>
              </Col>
            </Row>

            <div className="dept-heading mb-4">
              <h2>{t("programs.featuresTitle")}</h2>
            </div>
            <Row className="g-4">
              {PROGRAM_FEATURES.map((feature) => (
                <Col sm={6} lg={4} key={feature.key}>
                  <div className="dept-card d-flex align-items-center gap-3">
                    <span className="dept-icon m-0">
                      <feature.icon />
                    </span>
                    <h3 className="m-0">{t(`programs.features.${feature.key}`)}</h3>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Gallery */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading">
              <h2>{t("gallery.title")}</h2>
            </div>
            <Row className="g-4">
              {GALLERY_IMAGES.map((image) => (
                <Col sm={6} lg={3} key={image.key}>
                  <figure className="dept-shot">
                    <img src={image.src} alt={t(`gallery.items.${image.key}`)} loading="lazy" />
                    <figcaption>{t(`gallery.items.${image.key}`)}</figcaption>
                  </figure>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* The Mailbox Club + page actions */}
        <section className="dept-band">
          <Container>
            <span className="dept-band__logo">
              <img src={mailboxLogo} alt={t("mailbox.logoAlt")} loading="lazy" />
            </span>
            <h2 dir="ltr">{t("mailbox.title")}</h2>
            <p>{t("mailbox.body")}</p>
            <div className="dept-actions dept-actions--center">
              {PAGE_ACTIONS.map((action, i) => (
                <Link
                  key={action.key}
                  to={action.link}
                  className={`dept-btn ${i === 0 ? "dept-btn--light" : "dept-btn--ghost"}`}
                >
                  <action.icon />
                  {t(`actions.${action.key}`)}
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* Partners */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading dept-heading--center">
              <h2>{t("partners.title")}</h2>
            </div>
            <div className="dept-partners">
              <img src={synodLogo} alt={t("partners.synodAlt")} loading="lazy" />
              <img src={mailboxLogo} alt={t("partners.mailboxAlt")} loading="lazy" />
            </div>
          </Container>
        </section>
      </div>

      <Footer />
    </Layout>
  );
};

export default EvangelismDiscipleship;

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
