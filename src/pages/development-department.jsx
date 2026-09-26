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
  Users,
  Eye,
  Target,
  Quote,
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
  const align = isRTL ? "text-right" : "text-left";
  const arabicFont = isRTL ? "font-arabic" : "";
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
        {/* ---------------------------------------------------------------- Hero */}
        <section className="dept-hero dept-hero--intro pt-24">
          <div className="dept-hero__beam" />
          <div className="dept-hero__grid" />
          <Container className="relative z-10">
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className={align}>
                  <span className="dept-wordmark mb-4">
                    <span className="dept-wordmark__name">{t("wordmark.name")}</span>
                    <span className="dept-wordmark__label">{t("wordmark.label")}</span>
                  </span>
                  <h1 className={`text-white text-4xl lg:text-[3rem] leading-tight font-bold mb-3 ${arabicFont}`}>
                    {t("hero.title")}
                  </h1>
                  <span className="dept-rule mb-4" />
                  <p className={`text-white/80 text-lg leading-relaxed mb-5 ${align}`}>{t("hero.intro")}</p>

                  <div className="dept-verse rounded-xl p-5 mb-5">
                    <Quote className="h-5 w-5 text-[#2194d1] mb-2" />
                    <p className={`text-white text-lg leading-relaxed m-0 ${arabicFont}`}>{t("verse.text")}</p>
                    <span className="text-[#5cb4e4] text-sm">{t("verse.ref")}</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/development-project-request" className="dept-btn dept-btn--accent">
                      <HeartHandshake className="h-5 w-5" />
                      {t("hero.primaryCta")}
                    </Link>
                    <Link to="/contact" className="dept-btn dept-btn--ghost">
                      {t("hero.secondaryCta")}
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <img
                  src={devWomen}
                  alt={t("heroImageAlt")}
                  title={t("heroImageTitle")}
                  className="dept-hero__image"
                  width="1280"
                  height="720"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------- Highlight over hero */}
        <section className="bg-[#f5f8fb] pb-20">
          <Container>
            <div className={`dept-highlight p-4 p-lg-5 ${align}`}>
              <Row className="align-items-center g-4">
                <Col lg={7}>
                  <p className={`dept-highlight__figure mb-2 ${arabicFont}`}>{t("about.highlight")}</p>
                  <p className={`text-muted-foreground text-lg leading-relaxed m-0 ${align}`}>
                    {t("matchingFund.quote")}
                  </p>
                </Col>
                <Col lg={5}>
                  <div className={align}>
                    <div className="dept-split mb-3">
                      <span className="dept-split__ministry" />
                      <span className="dept-split__church" />
                    </div>
                    <div className={`flex items-center justify-between gap-3 ${isRTL ? "flex-row" : ""}`}>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-3 w-3 rounded-full bg-[#32669c] flex-shrink-0" />
                        {t("matchingFund.ministryShare")} <strong className="text-[#050517]">50%</strong>
                      </span>
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-3 w-3 rounded-full bg-[#2194d1] flex-shrink-0" />
                        {t("matchingFund.churchShare")} <strong className="text-[#050517]">50%</strong>
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </section>

        {/* ---------------------------------------------------------- Who We Are */}
        <section className="py-20 bg-background">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className="dept-frame">
                  <img
                    src={devHall}
                    alt={t("about.imageAlt")}
                    title={t("about.imageTitle")}
                    loading="lazy"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className={align}>
                  <span className="inline-flex items-center gap-2 text-[#32669c] font-semibold text-sm px-4 py-2 bg-[#32669c]/10 rounded-full mb-4">
                    <Users className="h-4 w-4" />
                    <span className={arabicFont}>{t("about.badge")}</span>
                  </span>
                  <h2 className={`text-3xl lg:text-4xl font-bold text-[#050517] mb-4 ${align} ${arabicFont}`}>
                    {t("about.title")}
                  </h2>
                  <span className="dept-rule mb-4" />
                  <p className={`text-lg text-muted-foreground leading-relaxed mb-3 ${align}`}>{t("about.p1")}</p>
                  <p className={`text-lg text-muted-foreground leading-relaxed m-0 ${align}`}>{t("about.p2")}</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* --------------------------------------------------- Vision & Mission */}
        <section className="py-20 bg-[#f5f8fb]">
          <Container>
            <Row className="g-4">
              <Col lg={6}>
                <div className={`dept-panel p-4 p-lg-5 ${align}`}>
                  <span className="dept-chip dept-chip--accent mb-4">
                    <Eye className="h-6 w-6" />
                  </span>
                  <h3 className={`text-2xl font-bold text-white mb-3 ${arabicFont}`}>{t("vision.title")}</h3>
                  <p className={`text-white/75 text-lg leading-relaxed m-0 ${align}`}>{t("vision.text")}</p>
                </div>
              </Col>
              <Col lg={6}>
                <div className={`dept-panel p-4 p-lg-5 ${align}`}>
                  <span className="dept-chip dept-chip--accent mb-4">
                    <Target className="h-6 w-6" />
                  </span>
                  <h3 className={`text-2xl font-bold text-white mb-3 ${arabicFont}`}>{t("mission.title")}</h3>
                  <ul className="list-none p-0 m-0 space-y-3">
                    {missionItems.map((item, i) => (
                      <li key={i} className={`flex items-start gap-3 ${isRTL ? "flex-row" : ""}`}>
                        <span className="h-2 w-2 rounded-full bg-[#5cb4e4] flex-shrink-0 mt-2" />
                        <span className={`text-white/75 leading-relaxed ${align}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------------ Support areas */}
        <section className="py-20 bg-background">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-[#2194d1] font-semibold text-sm px-4 py-2 bg-[#2194d1]/10 rounded-full mb-4">
                <Compass className="h-4 w-4" />
                <span className={arabicFont}>{t("matchingFund.title")}</span>
              </span>
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#050517] text-center mb-3 ${arabicFont}`}>
                {t("supportAreas.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center m-0">
                {t("matchingFund.text")}
              </p>
            </div>
            <Row className="g-4">
              {areaItems.map((item, i) => {
                const Icon = AREA_ICONS[i] || Sparkles;
                return (
                  <Col md={6} lg={4} key={i}>
                    <div className={`dept-area ${align}`}>
                      <span className="dept-num">{i + 1}</span>
                      <div className="flex-1">
                        <span className="dept-chip dept-chip--sm mb-3">
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className={`text-muted-foreground leading-relaxed m-0 ${align}`}>{item}</p>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------------- Requirements */}
        <section className="py-20 bg-[#f5f8fb]">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-[#32669c] font-semibold text-sm px-4 py-2 bg-[#32669c]/10 rounded-full mb-4">
                <Building2 className="h-4 w-4" />
                <span className="tracking-[0.2em] text-xs">{t("wordmark.label")}</span>
              </span>
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#050517] text-center mb-3 ${arabicFont}`}>
                {t("requirements.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center m-0">
                {t("requirements.subtitle")}
              </p>
            </div>
            <Row className="g-4">
              {requirementItems.map((item, i) => (
                <Col md={6} lg={4} key={i}>
                  <div className={`dept-req p-4 p-lg-5 ${align}`}>
                    <span className="dept-req__ghost" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div className="relative z-10">
                      <h4 className={`text-xl font-bold text-[#050517] mb-2 ${arabicFont}`}>{item.title}</h4>
                      <p className={`text-muted-foreground leading-relaxed m-0 ${align}`}>{item.text}</p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------------------ Gallery */}
        <section className="py-20 bg-background">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-[#32669c] font-semibold text-sm px-4 py-2 bg-[#32669c]/10 rounded-full mb-4">
                <HandHeart className="h-4 w-4" />
                <span className={arabicFont}>{t("gallery.badge")}</span>
              </span>
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#050517] text-center mb-3 ${arabicFont}`}>
                {t("gallery.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center m-0">
                {t("gallery.subtitle")}
              </p>
            </div>
            <Row className="g-4">
              {gallery.map(({ src, key }) => (
                <Col md={4} key={key}>
                  <figure className="dept-shot m-0">
                    <img
                      src={src}
                      alt={t(`gallery.${key}Alt`)}
                      title={t(`gallery.${key}Title`)}
                      loading="lazy"
                    />
                    <figcaption className={`dept-shot__caption ${align}`}>{t(`gallery.${key}Title`)}</figcaption>
                  </figure>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ---------------------------------------------------------------- CTA */}
        <section className="dept-hero py-20">
          <div className="dept-hero__beam" />
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className={`text-3xl lg:text-4xl font-bold text-white text-center mb-3 ${arabicFont}`}>
                {t("bottomCta.title")}
              </h2>
              <p className="text-lg text-white/75 text-center mb-4">{t("bottomCta.text")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/development-project-request" className="dept-btn dept-btn--accent">
                  {t("bottomCta.button")}
                  <Arrow className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="dept-btn dept-btn--ghost">
                  {t("hero.secondaryCta")}
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ----------------------------------------------------------- Partners */}
        <section className="py-16 bg-background border-t">
          <Container>
            <div className="text-center mb-10">
              <h3 className={`text-2xl font-bold text-[#050517] text-center mb-2 ${arabicFont}`}>
                {t("partners.title")}
              </h3>
              <p className="text-muted-foreground text-center m-0">{t("partners.subtitle")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20">
              {partners.map((brand) => (
                <div className="dept-partner" key={brand.alt}>
                  <img src={brand.src} alt={brand.alt} title={brand.title} loading="lazy" />
                </div>
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
