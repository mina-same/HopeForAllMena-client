import React from "react";
import { graphql } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import {
  GraduationCap,
  BookOpen,
  Baby,
  HandHeart,
  CheckCircle2,
} from "lucide-react";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import Layout from "../components/layout";
import heroImage from "../assets/images/resources/service-1-2.jpg";
import introImage from "../assets/images/قسم التعليم و الكرازه/IMG-20250513-WA0075.jpg";
import visionImage from "../assets/images/gallery/EvangelismDiscipleship.jpg";
import "../assets/css/department-pages.css";

const GOAL_KEYS = [
  "support",
  "leaders",
  "children",
  "needs",
  "discipleship",
];

const POINT_KEYS = ["one", "two", "three"];

const AREA_ITEMS = [
  { key: "pastors", icon: GraduationCap },
  { key: "sundaySchool", icon: BookOpen },
  { key: "children", icon: Baby },
  { key: "care", icon: HandHeart },
];

const SudaneseRefugees = () => {
  const { t } = useTranslation("SudaneseRefugees");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope for All Mena`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("pageTitle")} image={heroImage} />

      <div className="dept" dir={isRTL ? "rtl" : "ltr"}>
        {/* Intro */}
        <section className="dept-section dept-intro">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <h1>{t("intro.title")}</h1>
                <p className="dept-text">{t("intro.body")}</p>
                <blockquote className="dept-verse">
                  <p>{t("intro.verse")}</p>
                  <cite>{t("intro.verseRef")}</cite>
                </blockquote>
              </Col>
              <Col lg={6}>
                <img src={introImage} alt={t("intro.imageAlt")} className="dept-intro__img" />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Vision & mission */}
        <section className="dept-section dept-section--alt">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className="dept-heading mb-4">
                  <h2>{t("vision.title")}</h2>
                </div>
                <p className="dept-text">{t("vision.body")}</p>
                <div className="dept-heading mb-4 mt-5">
                  <h2>{t("mission.title")}</h2>
                </div>
                <p className="dept-text">{t("mission.body")}</p>
              </Col>
              <Col lg={6}>
                <img src={visionImage} alt={t("vision.imageAlt")} className="dept-img" loading="lazy" />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Goals */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading mb-4">
              <h2>{t("goals.title")}</h2>
            </div>
            <ul className="dept-rows">
              {GOAL_KEYS.map((key) => (
                <li key={key}>
                  <CheckCircle2 />
                  <p>{t(`goals.items.${key}`)}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Why this ministry */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading">
              <h2>{t("why.title")}</h2>
            </div>
            <blockquote className="dept-verse" style={{ maxWidth: 820 }}>
              <p>{t("why.body")}</p>
              <p>{t("why.bodySecondary")}</p>
            </blockquote>
          </Container>
        </section>

        {/* Together */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading">
              <h2>{t("together.title")}</h2>
            </div>
            <p className="dept-text" style={{ maxWidth: 820 }}>{t("together.body")}</p>
            <blockquote className="dept-verse" style={{ maxWidth: 820 }}>
              <p>{t("together.verse")}</p>
              <cite>{t("together.verseRef")}</cite>
            </blockquote>
          </Container>
        </section>

        {/* Areas of ministry */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading">
              <h2>{t("areas.title")}</h2>
            </div>
            <Row className="g-4">
              {AREA_ITEMS.map((area) => (
                <Col md={6} key={area.key}>
                  <div className="dept-card">
                    <span className="dept-icon">
                      <area.icon />
                    </span>
                    <h3>{t(`areas.items.${area.key}.title`)}</h3>
                    <p>{t(`areas.items.${area.key}.intro`)}</p>
                    <ul className="dept-checks">
                      {POINT_KEYS.map((point) => (
                        <li key={point}>
                          <CheckCircle2 />
                          <span>{t(`areas.items.${area.key}.points.${point}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </div>

      <Footer />
    </Layout>
  );
};

export default SudaneseRefugees;

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
