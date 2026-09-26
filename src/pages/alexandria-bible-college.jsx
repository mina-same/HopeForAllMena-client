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
  Quote,
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
import "../assets/css/alexandria-bible-college.css";

const AlexandriaBibleCollege = () => {
  const { t } = useTranslation("AlexandriaBibleCollege");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";
  const align = isRTL ? "text-right" : "text-left";
  const arabicFont = isRTL ? "font-arabic" : "";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const pillars = [
    { key: "formulate", icon: Sparkles },
    { key: "empower", icon: Users },
    { key: "impact", icon: Target },
  ];

  const values = [
    { key: "biblical", icon: BookOpen, gold: true },
    { key: "teamwork", icon: Users, gold: false },
    { key: "empowerment", icon: Sparkles, gold: false },
    { key: "partnership", icon: Handshake, gold: true },
  ];

  const programs = ["impact", "access", "care", "shepherd"];

  const gallery = [
    { src: abcGraduation, key: "photo2", span: 7 },
    { src: abcOnline, key: "photo3", span: 5 },
    { src: abcLecture, key: "photo4", span: 12, wide: true },
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
      <PageHeader
        title={t("pageTitle")}
        crumbTitle={t("crumbTitle")}
        image={abcClassIntl}
      />

      <div className="abc" dir={isRTL ? "rtl" : "ltr"}>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="abc-hero abc-hero--intro pt-24">
          <div className="abc-hero__beam" />
          <div className="abc-hero__grid" />
          <Container className="relative z-10">
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className={align}>
                  <p className={`text-[#e2c469] uppercase tracking-[0.2em] text-xs font-semibold mb-3 ${arabicFont}`}>
                    {t("hero.eyebrow")}
                  </p>
                  <h1 className={`text-white text-4xl lg:text-[3.25rem] leading-tight font-bold mb-3 ${arabicFont}`}>
                    {t("hero.title")}
                  </h1>
                  <p className="text-white/60 text-xl font-medium mb-4">{t("hero.titleEn")}</p>
                  <span className="abc-rule mb-4" />
                  <p className={`text-white/80 text-lg leading-relaxed mb-5 ${align}`}>{t("hero.lead")}</p>

                  <div className="abc-verse rounded-xl p-5 mb-5">
                    <Quote className="h-5 w-5 text-[#c9a227] mb-2" />
                    <p className={`text-white text-lg leading-relaxed m-0 ${arabicFont}`}>{t("hero.verse")}</p>
                    <span className="text-[#e2c469] text-sm">{t("hero.verseRef")}</span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/courses" className="abc-btn abc-btn--gold">
                      <GraduationCap className="h-5 w-5" />
                      {t("cta.coursesButton")}
                    </Link>
                    <Link to="/contact" className="abc-btn abc-btn--ghost">
                      {t("cta.contactButton")}
                    </Link>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <img
                  src={abcLogo}
                  alt={t("hero.logoAlt")}
                  title={t("hero.logoTitle")}
                  className="abc-hero__logo img-fluid w-100"
                  width="1600"
                  height="900"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------------------ Pillars */}
        <section className="bg-[#f6f4ee] pb-20">
          <Container>
            <Row className="abc-pillars g-4">
              {pillars.map(({ key, icon: Icon }, i) => (
                <Col md={4} key={key}>
                  <div className={`abc-pillar h-100 p-4 p-lg-5 ${align}`}>
                    <div className={`flex items-start justify-between gap-3 mb-3 ${isRTL ? "flex-row" : ""}`}>
                      <span className="abc-chip abc-chip--gold flex-shrink-0">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="abc-pillar__index">{`0${i + 1}`}</span>
                    </div>
                    <h3 className={`text-2xl font-bold text-[#10375c] mb-1 ${arabicFont}`}>
                      {t(`pillars.${key}.title`)}
                    </h3>
                    <p className="text-sm uppercase tracking-widest text-[#c9a227] font-semibold mb-3">
                      {t(`pillars.${key}.titleEn`)}
                    </p>
                    <p className={`text-muted-foreground leading-relaxed m-0 ${align}`}>
                      {t(`pillars.${key}.text`)}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ---------------------------------------------------------- Who We Are */}
        <section className="py-20 bg-background">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <div className="abc-frame">
                  <img
                    src={abcClassAlex}
                    alt={t("about.imageAlt")}
                    title={t("about.imageTitle")}
                    loading="lazy"
                  />
                </div>
              </Col>
              <Col lg={6}>
                <div className={align}>
                  <span className="inline-flex items-center gap-2 text-[#1e6076] font-semibold text-sm px-4 py-2 bg-[#1e6076]/10 rounded-full mb-4">
                    <BookOpen className="h-4 w-4" />
                    <span className={arabicFont}>{t("about.badge")}</span>
                  </span>
                  <h2 className={`text-3xl lg:text-4xl font-bold text-[#10375c] mb-4 ${align} ${arabicFont}`}>
                    {t("about.title")}
                  </h2>
                  <span className="abc-rule mb-4" />
                  <p className={`text-lg text-muted-foreground leading-relaxed mb-4 ${align}`}>
                    {t("about.content")}
                  </p>
                  <p className={`font-semibold text-[#10375c] mb-3 ${align} ${arabicFont}`}>
                    {t("about.pillarsTitle")}
                  </p>
                  <ul className="list-none p-0 m-0 space-y-2">
                    {["pillar1", "pillar2", "pillar3"].map((k) => (
                      <li key={k} className={`flex items-center gap-3 ${isRTL ? "flex-row" : ""}`}>
                        <span className="h-2 w-2 rounded-full bg-[#c9a227] flex-shrink-0" />
                        <span className="text-muted-foreground">{t(`about.${k}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* --------------------------------------------------- Mission & Vision */}
        <section className="py-20 bg-[#f6f4ee]">
          <Container>
            <Row className="g-4">
              {[
                { key: "goal", icon: Target },
                { key: "vision", icon: Eye },
              ].map(({ key, icon: Icon }) => (
                <Col lg={6} key={key}>
                  <div className={`abc-panel p-4 p-lg-5 ${align}`}>
                    <span className="abc-chip abc-chip--gold mb-4">
                      <Icon className="h-6 w-6 text-[#10375c]" />
                    </span>
                    <h3 className={`text-2xl font-bold text-white mb-3 ${arabicFont}`}>{t(`${key}.title`)}</h3>
                    <p className={`text-white/75 text-lg leading-relaxed m-0 ${align}`}>{t(`${key}.content`)}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ----------------------------------------------------------- Values */}
        <section className="py-20 bg-background">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-[#c9a227] font-semibold text-sm px-4 py-2 bg-[#c9a227]/10 rounded-full mb-4">
                <Sparkles className="h-4 w-4" />
                <span className={arabicFont}>{t("values.badge")}</span>
              </span>
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#10375c] text-center mb-3 ${arabicFont}`}>
                {t("values.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center m-0">
                {t("values.subtitle")}
              </p>
            </div>
            <Row className="g-4">
              {values.map(({ key, icon: Icon, gold }) => (
                <Col md={6} lg={3} key={key}>
                  <div className={`abc-card p-4 p-lg-5 ${align}`}>
                    <span className={`abc-chip mb-4 ${gold ? "abc-chip--gold" : ""}`}>
                      <Icon className={`h-6 w-6 ${gold ? "text-[#10375c]" : ""}`} />
                    </span>
                    <h4 className={`text-xl font-bold text-[#10375c] mb-3 ${arabicFont}`}>
                      {t(`values.${key}.title`)}
                    </h4>
                    <p className={`text-muted-foreground leading-relaxed m-0 ${align}`}>
                      {t(`values.${key}.content`)}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* --------------------------------------------------------- Programs */}
        <section className="py-20 bg-[#f6f4ee]">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-[#1e6076] font-semibold text-sm px-4 py-2 bg-[#1e6076]/10 rounded-full mb-4">
                <GraduationCap className="h-4 w-4" />
                <span className={arabicFont}>{t("programs.badge")}</span>
              </span>
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#10375c] text-center mb-3 ${arabicFont}`}>
                {t("programs.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center m-0">
                {t("programs.subtitle")}
              </p>
            </div>
            <Row className="g-4">
              {programs.map((key, i) => (
                <Col md={6} key={key}>
                  <div className={`abc-program p-4 p-lg-5 ${align}`}>
                    <span className="abc-program__ghost" aria-hidden="true">
                      {t(`programs.${key}.name`)}
                    </span>
                    <div className="relative z-10">
                      <div className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row" : ""}`}>
                        <span className="abc-program__ordinal">{i + 1}</span>
                        <span className="text-2xl font-extrabold tracking-tight text-[#1e6076]">
                          {t(`programs.${key}.name`)}
                        </span>
                      </div>
                      <h4 className={`text-xl font-bold text-[#10375c] mb-2 ${arabicFont}`}>
                        {t(`programs.${key}.title`)}
                      </h4>
                      <p className={`text-muted-foreground leading-relaxed mb-4 ${align}`}>
                        {t(`programs.${key}.content`)}
                      </p>
                      <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 text-[#c9a227] font-semibold hover:text-[#10375c] transition-colors"
                      >
                        <span>{t("cta.coursesButton")}</span>
                        <Arrow className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ---------------------------------------------------------- Gallery */}
        <section className="py-20 bg-background">
          <Container>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-[#1e6076] font-semibold text-sm px-4 py-2 bg-[#1e6076]/10 rounded-full mb-4">
                <Users className="h-4 w-4" />
                <span className={arabicFont}>{t("gallery.badge")}</span>
              </span>
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#10375c] text-center mb-3 ${arabicFont}`}>
                {t("gallery.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-center m-0">
                {t("gallery.subtitle")}
              </p>
            </div>
            <Row className="g-4">
              {gallery.map(({ src, key, span, wide }) => (
                <Col md={span} key={key}>
                  <figure className={`abc-shot m-0 ${wide ? "abc-shot--wide" : ""}`}>
                    <img
                      src={src}
                      alt={t(`gallery.${key}Alt`)}
                      title={t(`gallery.${key}Title`)}
                      loading="lazy"
                    />
                    <figcaption className={`abc-shot__caption ${align}`}>
                      {t(`gallery.${key}Title`)}
                    </figcaption>
                  </figure>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* -------------------------------------------------------- Locations */}
        <section className="py-20 bg-[#f6f4ee]">
          <Container>
            <div className="text-center mb-12">
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#10375c] text-center m-0 ${arabicFont}`}>
                {t("addresses.title")}
              </h2>
            </div>
            <Row className="g-4">
              {["alexandria", "cairo"].map((city) => (
                <Col lg={6} key={city}>
                  <div className={`abc-card p-4 p-lg-5 ${align}`}>
                    <div className={`flex items-start gap-4 ${isRTL ? "flex-row" : ""}`}>
                      <span className="abc-chip flex-shrink-0">
                        <MapPin className="h-6 w-6" />
                      </span>
                      <div className="flex-1">
                        <h4 className={`text-xl font-bold text-[#10375c] mb-2 ${align} ${arabicFont}`}>
                          {t(`addresses.${city}.city`)}
                        </h4>
                        <p className={`text-muted-foreground leading-relaxed m-0 ${align}`}>
                          {t(`addresses.${city}.address`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* -------------------------------------------------------------- CTA */}
        <section className="abc-hero py-20">
          <div className="abc-hero__beam" />
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className={`text-3xl lg:text-4xl font-bold text-white text-center mb-3 ${arabicFont}`}>
                {t("cta.title")}
              </h2>
              <p className="text-lg text-white/75 text-center mb-4">{t("cta.subtitle")}</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/courses" className="abc-btn abc-btn--gold">
                  <GraduationCap className="h-5 w-5" />
                  {t("cta.coursesButton")}
                </Link>
                <Link to="/contact" className="abc-btn abc-btn--ghost">
                  {t("cta.contactButton")}
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* --------------------------------------------------------- Partners */}
        <section className="py-16 bg-background border-t">
          <Container>
            <div className="text-center mb-10">
              <h3 className={`text-2xl font-bold text-[#10375c] text-center mb-2 ${arabicFont}`}>
                {t("partners.title")}
              </h3>
              <p className="text-muted-foreground text-center m-0">{t("partners.subtitle")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-10 lg:gap-20">
              {partners.map((brand) => (
                <div className="abc-partner" key={brand.alt}>
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
