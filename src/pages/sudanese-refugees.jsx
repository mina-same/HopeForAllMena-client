import React from "react";
import { graphql } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import {
  Users,
  Eye,
  Target,
  Flag,
  Quote,
  GraduationCap,
  BookOpen,
  Baby,
  HandHeart,
  CheckCircle2,
  HeartHandshake,
} from "lucide-react";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import Layout from "../components/layout";
import heroImage from "../assets/images/resources/service-1-2.jpg";
import visionImage from "../assets/images/resources/service-1-3.jpg";
import "../assets/css/department-pages.css";

const STATEMENT_KEYS = [
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
  const align = isRTL ? "text-right" : "text-left";

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope for All Mena`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("pageTitle")} image={heroImage} />

      <div className="dept" dir={isRTL ? "rtl" : "ltr"}>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="dept-hero dept-hero--intro pt-24">
          <div className="dept-hero__beam" />
          <div className="dept-hero__grid" />
          <Container className="relative z-10">
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className={align}>
                  <span className="dept-wordmark mb-4">
                    <span className="dept-wordmark__name">{t("hero.badge")}</span>
                  </span>
                  <h1 className="dept-hero__title">
                    {t("hero.title")} <span>{t("hero.titleHighlight")}</span>
                  </h1>
                  <span className="dept-rule mb-4" />
                  <p className="dept-hero__tagline">{t("hero.tagline")}</p>
                  <p className="dept-hero__lead m-0">{t("hero.description")}</p>
                </div>
              </Col>
              <Col lg={6}>
                <img
                  src={heroImage}
                  alt={t("hero.imageAlt")}
                  className="dept-hero__image dept-hero__image--cover"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* -------------------------------------- Who We Are (over the hero) */}
        <section className="dept-paper pb-20">
          <Container>
            <div className="dept-highlight p-4 p-lg-5 text-center">
              <span className="dept-chip dept-chip--accent dept-chip--lg mb-4">
                <Users className="h-8 w-8" />
              </span>
              <div className="dept-heading mb-4">
                <h2 className="dept-title">{t("whoWeAre.title")}</h2>
                <span className="dept-rule" />
              </div>
              <p className="dept-text max-w-4xl mx-auto m-0">{t("whoWeAre.body")}</p>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------- Our Vision */}
        <section className="py-20 bg-background">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className="dept-frame">
                  <img src={visionImage} alt={t("vision.imageAlt")} loading="lazy" />
                </div>
              </Col>
              <Col lg={6}>
                <div className={align}>
                  <span className="dept-chip dept-chip--accent mb-4">
                    <Eye className="h-6 w-6" />
                  </span>
                  <h2 className="dept-title mb-4">{t("vision.title")}</h2>
                  <span className="dept-rule mb-4" />
                  <p className="dept-text m-0">{t("vision.body")}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* --------------------------------------------------------- Our Mission */}
        <section className="py-20 dept-paper">
          <Container>
            <div className="dept-heading">
              <span className="dept-chip dept-chip--accent mb-4">
                <Target className="h-6 w-6" />
              </span>
              <h2 className="dept-title">{t("mission.title")}</h2>
              <span className="dept-rule" />
            </div>
            <Row className="g-4 justify-content-center">
              {STATEMENT_KEYS.map((key) => (
                <Col lg={10} key={key}>
                  <div className={`dept-area dept-area--center ${align}`}>
                    <span className="dept-chip dept-chip--sm">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <p className="text-lg text-muted-foreground leading-relaxed m-0">
                      {t(`mission.items.${key}`)}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ----------------------------------------------------------- Our Goals */}
        <section className="py-20 bg-background">
          <Container>
            <div className="dept-heading">
              <span className="dept-chip dept-chip--accent mb-4">
                <Flag className="h-6 w-6" />
              </span>
              <h2 className="dept-title">{t("goals.title")}</h2>
              <span className="dept-rule" />
            </div>
            <Row className="g-4">
              {STATEMENT_KEYS.map((key, i) => (
                <Col md={i === STATEMENT_KEYS.length - 1 ? 12 : 6} key={key}>
                  <div className={`dept-req p-4 p-lg-5 ${align}`}>
                    <span className="dept-req__ghost" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="relative z-10 flex items-start gap-3">
                      <span className="dept-num">{i + 1}</span>
                      <p className="text-lg text-muted-foreground leading-relaxed m-0">
                        {t(`goals.items.${key}`)}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* -------------------------------------------------- Why This Ministry */}
        <section className="py-20 dept-paper">
          <Container>
            <Row className="justify-content-center">
              <Col lg={10}>
                <div className={`dept-panel p-4 p-lg-5 ${align}`}>
                  <span className="dept-chip dept-chip--accent mb-4">
                    <Quote className="h-6 w-6" />
                  </span>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t("why.title")}</h2>
                  <p className="text-white/75 text-lg leading-relaxed">{t("why.body")}</p>
                  <p className="text-white/75 text-lg leading-relaxed m-0">{t("why.bodySecondary")}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* -------------------------------------------------- Areas of Ministry */}
        <section className="py-20 bg-background">
          <Container>
            <div className="dept-heading">
              <h2 className="dept-title">{t("areas.title")}</h2>
              <span className="dept-rule" />
            </div>
            <Row className="g-4">
              {AREA_ITEMS.map((area) => (
                <Col md={6} key={area.key}>
                  <div className={`dept-card p-4 p-lg-5 ${align}`}>
                    <span className="dept-chip mb-4">
                      <area.icon className="h-6 w-6" />
                    </span>
                    <h3 className="text-2xl font-bold mb-3">{t(`areas.items.${area.key}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {t(`areas.items.${area.key}.intro`)}
                    </p>
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

        {/* ------------------------------------------------------ Closing band */}
        <section className="dept-hero py-20">
          <div className="dept-hero__beam" />
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <span className="dept-chip dept-chip--accent dept-chip--lg mb-4">
                <HeartHandshake className="h-8 w-8" />
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-3">
                {t("hero.tagline")}
              </h2>
              <p className="text-lg text-white/75 text-center m-0">{t("hero.badge")}</p>
            </div>
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
