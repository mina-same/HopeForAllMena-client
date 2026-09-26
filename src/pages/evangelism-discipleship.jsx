import React from "react";
import { graphql } from "gatsby";
import { Link, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import {
  Target,
  Eye,
  Compass,
  BookOpen,
  Layers,
  Quote,
  ScrollText,
  Sparkles,
  HandHeart,
  CalendarCheck,
  Heart,
  Newspaper,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
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
  const align = isRTL ? "text-right" : "text-left";
  const ActionChevron = isRTL ? ChevronLeft : ChevronRight;

  const philosophyBody = t("philosophy.body");

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope for All Mena`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("pageTitle")} image={missionImage} />

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
                    <span className="dept-wordmark__name">{t("heroSection.badge")}</span>
                  </span>
                  <h1 className="dept-hero__title">
                    {t("heroSection.title")} <span>{t("heroSection.titleHighlight")}</span>
                  </h1>
                  <span className="dept-rule mb-4" />
                  <p className="dept-hero__lead m-0">{t("heroSection.description")}</p>
                </div>
              </Col>
              <Col lg={6}>
                <img
                  src={heroImage}
                  alt={t("heroSection.imageAlt")}
                  className="dept-hero__image dept-hero__image--cover object-top"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* --------------------------------------- Our Mission (over the hero) */}
        <section className="dept-paper pb-20">
          <Container>
            <div className="dept-highlight p-4 p-lg-5 text-center">
              <span className="dept-chip dept-chip--accent dept-chip--lg mb-4">
                <Target className="h-8 w-8" />
              </span>
              <div className="dept-heading mb-4">
                <h2 className="dept-title">{t("mission.title")}</h2>
                <span className="dept-rule" />
              </div>
              <p className="dept-text max-w-4xl mx-auto m-0">{t("mission.body")}</p>
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

        {/* ------------------------------------------------ Overall Objectives */}
        <section className="py-20 dept-paper">
          <Container>
            <div className="dept-heading">
              <h2 className="dept-title">{t("objectives.title")}</h2>
              <span className="dept-rule" />
            </div>
            <Row className="g-4">
              {OBJECTIVE_KEYS.map((key, i) => (
                <Col md={i === OBJECTIVE_KEYS.length - 1 ? 12 : 6} key={key}>
                  <div className={`dept-req p-4 p-lg-5 ${align}`}>
                    <span className="dept-req__ghost" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="dept-num">{i + 1}</span>
                        <h3 className="text-xl font-bold text-[#050517] m-0">
                          {t(`objectives.items.${key}.title`)}
                        </h3>
                      </div>
                      <p className="text-muted-foreground leading-relaxed m-0">
                        {t(`objectives.items.${key}.description`)}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ------------------ Our Philosophy — renders once philosophy.body is filled in */}
        {philosophyBody ? (
          <section className="py-20 bg-background">
            <Container>
              <Row className="justify-content-center">
                <Col lg={10}>
                  <div className={`dept-panel p-4 p-lg-5 ${align}`}>
                    <span className="dept-chip dept-chip--accent mb-4">
                      <Compass className="h-6 w-6" />
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t("philosophy.title")}</h2>
                    <Quote className="h-6 w-6 text-[#5cb4e4] mb-2" />
                    <p className="text-white/75 text-lg leading-relaxed m-0">{philosophyBody}</p>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>
        ) : null}

        {/* -------------------------------------------------------- Our Programs */}
        <section className="py-20 bg-background">
          <Container>
            <div className="dept-heading">
              <h2 className="dept-title">{t("programs.title")}</h2>
              <span className="dept-rule" />
              <p className="dept-subtitle">{t("programs.description")}</p>
              <p className="dept-subtitle mt-2">{t("programs.note")}</p>
            </div>

            {/* Levels and ages, framed by two photos from the lessons */}
            <Row className="g-4 mb-5">
              <Col lg={6}>
                <figure className="dept-shot dept-shot--fill m-0">
                  <img src={programsImageOne} alt={t("programs.imageAltOne")} loading="lazy" />
                </figure>
              </Col>
              <Col lg={6}>
                <Row className="g-4">
                  <Col xs={6}>
                    <div className="dept-card p-4 text-center">
                      <span className="dept-chip dept-chip--sm mb-3">
                        <Layers className="h-5 w-5" />
                      </span>
                      <div className="text-4xl font-bold text-[#2194d1] mb-1">{t("programs.levelsValue")}</div>
                      <div className="text-sm text-muted-foreground">{t("programs.levelsLabel")}</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="dept-card p-4 text-center">
                      <span className="dept-chip dept-chip--sm mb-3">
                        <Heart className="h-5 w-5" />
                      </span>
                      <div className="text-4xl font-bold text-[#2194d1] mb-1">{t("programs.agesValue")}</div>
                      <div className="text-sm text-muted-foreground">{t("programs.agesLabel")}</div>
                    </div>
                  </Col>
                  <Col xs={12}>
                    <figure className="dept-shot dept-shot--wide m-0">
                      <img src={programsImageTwo} alt={t("programs.imageAltTwo")} loading="lazy" />
                    </figure>
                  </Col>
                </Row>
              </Col>
            </Row>

            {/* Core features */}
            <div className="dept-heading mb-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-[#050517] m-0">{t("programs.featuresTitle")}</h3>
            </div>
            <Row className="g-4">
              {PROGRAM_FEATURES.map((feature) => (
                <Col sm={6} lg={4} key={feature.key}>
                  <div className={`dept-area dept-area--center ${align}`}>
                    <span className="dept-chip dept-chip--sm">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-semibold text-[#050517]">
                      {t(`programs.features.${feature.key}`)}
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* --------------------------------------- From the ministry — gallery */}
        <section className="py-20 dept-paper">
          <Container>
            <div className="dept-heading">
              <h2 className="dept-title">{t("gallery.title")}</h2>
              <span className="dept-rule" />
            </div>
            <Row className="g-4">
              {GALLERY_IMAGES.map((image) => (
                <Col sm={6} lg={3} key={image.key}>
                  <figure className="dept-shot m-0">
                    <img src={image.src} alt={t(`gallery.items.${image.key}`)} loading="lazy" />
                    <figcaption className={`dept-shot__caption ${align}`}>
                      {t(`gallery.items.${image.key}`)}
                    </figcaption>
                  </figure>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------- The Mailbox Club */}
        <section className="dept-hero dept-hero--intro pt-20">
          <div className="dept-hero__beam" />
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex bg-white rounded-2xl p-4 mb-4">
                <img
                  src={mailboxLogo}
                  alt={t("mailbox.logoAlt")}
                  className="h-20 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-3" dir="ltr">
                {t("mailbox.title")}
              </h2>
              <span className="dept-rule mx-auto mb-4" />
              <p className="text-lg text-white/75 text-center m-0">{t("mailbox.body")}</p>
            </div>
          </Container>
        </section>

        {/* ------------------------------------- Page actions (over the band) */}
        <section className="dept-paper pb-20">
          <Container>
            <Row className="dept-overlap g-4 justify-content-center">
              {PAGE_ACTIONS.map((action) => (
                <Col sm={6} lg={5} key={action.key}>
                  <Link to={action.link} className="block no-underline hover:no-underline">
                    <div className="dept-card dept-card--raised p-4">
                      <div className="flex items-center gap-4">
                        <span className="dept-chip dept-chip--accent">
                          <action.icon className="h-6 w-6" />
                        </span>
                        <span className="flex-1 text-lg font-semibold text-[#050517]">
                          {t(`actions.${action.key}`)}
                        </span>
                        <ActionChevron className="h-5 w-5 text-[#2194d1] flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------ In partnership with */}
        <section className="py-16 bg-background border-t">
          <Container>
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-[#050517] text-center m-0">{t("partners.title")}</h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20">
              <div className="dept-partner">
                <img src={synodLogo} alt={t("partners.synodAlt")} loading="lazy" />
              </div>
              <div className="dept-partner">
                <img src={mailboxLogo} alt={t("partners.mailboxAlt")} loading="lazy" />
              </div>
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
