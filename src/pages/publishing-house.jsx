import React from "react";
import { graphql } from "gatsby";
import { Link, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import {
  BookOpen,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Mail,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

import publishingHouseWhite from "../assets/images/publishing-house-white.png";
import "../assets/css/department-pages.css";

const asArray = (value) => (Array.isArray(value) ? value : []);

// "+2 01556745096" -> "201556745096" for wa.me links
const toWhatsApp = (phone) => {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("2") ? digits : `2${digits}`;
};

const PublishingHouse = () => {
  const { t } = useTranslation("PublishingHouse");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";
  const align = isRTL ? "text-right" : "text-left";
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  const taglines = asArray(t("hero.taglines", { returnObjects: true }));
  const aboutParagraphs = asArray(t("about.paragraphs", { returnObjects: true }));
  const pillars = asArray(t("pillars", { returnObjects: true }));
  const goals = asArray(t("goals.items", { returnObjects: true }));
  const lists = asArray(t("lists", { returnObjects: true }));
  const series = asArray(t("series.items", { returnObjects: true }));
  const addresses = asArray(t("contact.addresses", { returnObjects: true }));
  const phones = asArray(t("contact.phones", { returnObjects: true }));
  const emails = asArray(t("contact.emails", { returnObjects: true }));
  const person = t("contact.person");

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("crumbTitle")} />

      <div className="dept" dir={isRTL ? "rtl" : "ltr"}>
        {/* ---------------------------------------------------------------- Hero */}
        <section className="dept-hero dept-hero--intro pt-24">
          <div className="dept-hero__beam" />
          <div className="dept-hero__grid" />
          <Container className="relative z-10">
            <Row className="align-items-center g-5">
              <Col lg={7}>
                <div className={align}>
                  <span className="dept-wordmark mb-4">
                    <span className="dept-wordmark__name">{t("hero.eyebrow")}</span>
                  </span>
                  <h1 className="dept-hero__title">{t("hero.title")}</h1>
                  <span className="dept-rule mb-4" />
                  <ul className="dept-hero__list">
                    {taglines.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/books" className="dept-btn dept-btn--accent">
                      <BookOpen className="h-5 w-5" />
                      {t("hero.primaryCta")}
                    </Link>
                    <a href="#pub-contact" className="dept-btn dept-btn--ghost">
                      {t("hero.secondaryCta")}
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg={5}>
                <div className="dept-hero__logo">
                  <img src={publishingHouseWhite} alt={t("pageTitle")} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ---------------------------------------------- Who we are / identity */}
        <section className="dept-paper pb-20">
          <Container>
            <div className="dept-highlight p-4 p-lg-5 text-center">
              <div className="dept-heading mb-4">
                <h2 className="dept-title">{t("about.title")}</h2>
                <span className="dept-rule" />
              </div>
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="dept-text max-w-4xl mx-auto">
                  {paragraph}
                </p>
              ))}
            </div>
            {pillars.length > 0 && (
              <Row className="g-4 mt-2">
                {pillars.map((pillar, i) => (
                  <Col md={6} key={pillar.title}>
                    <div className={`dept-card p-4 p-lg-5 ${align}`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <span className="dept-chip dept-chip--accent">
                          <BookOpen className="h-6 w-6" />
                        </span>
                        <span className="dept-card__index">{`0${i + 1}`}</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{pillar.title}</h3>
                      <p className="text-muted-foreground leading-relaxed m-0">{pillar.text}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </section>

        {/* ------------------------------------------ Goals / strategic focus */}
        <section className="py-20 bg-background">
          <Container>
            <div className="dept-heading">
              <h2 className="dept-title">{t("goals.title")}</h2>
              <span className="dept-rule" />
            </div>
            <Row className="g-4 justify-content-center">
              {goals.map((goal, i) => (
                <Col md={6} lg={goal.text ? 6 : 4} key={goal.title}>
                  <div className={`dept-area ${align}`}>
                    <span className="dept-num">{i + 1}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold leading-relaxed m-0">{goal.title}</h3>
                      {goal.text && (
                        <p className="text-muted-foreground leading-relaxed mt-2 mb-0">{goal.text}</p>
                      )}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ------------- Why it matters / impact (en) — publishing policy (ar) */}
        {lists.length > 0 && (
          <section className="py-20 dept-paper">
            <Container>
              <Row className="g-4">
                {lists.map((list) => (
                  <Col lg={lists.length > 1 ? 6 : 12} key={list.title}>
                    <div className={`dept-card dept-card--raised p-4 p-lg-5 ${align}`}>
                      <div className="dept-heading dept-heading--start">
                        <h2 className="dept-title">{list.title}</h2>
                        <span className="dept-rule" />
                      </div>
                      {list.intro && <p className="font-semibold text-[#050517]">{list.intro}</p>}
                      <ul className={`dept-checks ${lists.length > 1 ? "" : "dept-checks--grid"}`}>
                        {asArray(list.items).map((item) => (
                          <li key={item}>
                            <CheckCircle2 />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {list.outro && <p className="font-semibold text-[#2194d1] mt-4 mb-0">{list.outro}</p>}
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}

        {/* ------------------------------------------------- Publishing series */}
        <section className="py-20 bg-background">
          <Container>
            <div className="dept-heading">
              <h2 className="dept-title">{t("series.title")}</h2>
              <span className="dept-rule" />
            </div>
            <Row className="g-4">
              {series.map((item) => (
                <Col sm={6} lg={item.text && isRTL ? 4 : 3} key={item.title}>
                  <div className="dept-card p-4 text-center">
                    <span className="dept-chip dept-chip--sm mb-3">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-bold m-0">{item.title}</h3>
                    {item.text && (
                      <p className="text-muted-foreground leading-relaxed mt-2 mb-0">{item.text}</p>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ----------------------------------------------------------- Contact */}
        <section className="dept-hero py-20" id="pub-contact">
          <div className="dept-hero__beam" />
          <Container className="relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">{t("contact.title")}</h2>
              <span className="dept-rule mx-auto" />
            </div>
            <Row className="g-4">
              <Col lg={4}>
                <div className="dept-panel dept-panel--glass p-4 p-lg-5 text-center">
                  <span className="dept-chip dept-chip--accent mb-4">
                    <MapPin className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold mb-3">{t("contact.addressesTitle")}</h3>
                  {addresses.map((address) => (
                    <p key={address} className="text-white/80 leading-relaxed">
                      {address}
                    </p>
                  ))}
                </div>
              </Col>
              <Col lg={4}>
                <div className="dept-panel dept-panel--glass p-4 p-lg-5 text-center">
                  <span className="dept-chip dept-chip--accent mb-4">
                    <MessageCircle className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold mb-3">{t("contact.whatsappTitle")}</h3>
                  {person && <p className="text-white font-bold mb-2">{person}</p>}
                  {phones.map((phone) => (
                    <a
                      key={phone}
                      href={`https://wa.me/${toWhatsApp(phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="block text-[#5cb4e4] font-bold text-lg mb-2 hover:text-white"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </Col>
              <Col lg={4}>
                <div className="dept-panel dept-panel--glass p-4 p-lg-5 text-center">
                  <span className="dept-chip dept-chip--accent mb-4">
                    <Mail className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl font-bold mb-3">{t("contact.emailTitle")}</h3>
                  {emails.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      dir="ltr"
                      className="block text-[#5cb4e4] font-bold mb-2 break-words hover:text-white"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ------------------------------------------------------ Browse books */}
        <section className="py-20 bg-background">
          <Container>
            <div className="dept-heading m-0">
              <h2 className="dept-title">{t("browseBooks.title")}</h2>
              <p className="dept-subtitle mb-4">{t("browseBooks.description")}</p>
              <Link to="/books" className="dept-btn dept-btn--accent">
                {t("browseBooks.buttonText")}
                <Arrow className="h-4 w-4" />
              </Link>
            </div>
          </Container>
        </section>
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
