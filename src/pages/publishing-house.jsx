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

import publishingHouseLogo from "../assets/images/image.png";
import brandSynod from "../assets/images/resources/brand-1-4.png";
import brandPartner from "../assets/images/resources/brand-1-3.png";
import hopeLogo from "../assets/images/logos/hope4AllMena.png";
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

  const partners = [
    { src: hopeLogo, alt: t("partners.hopeAlt"), title: t("partners.hopeTitle") },
    { src: brandSynod, alt: t("partners.brand4Alt"), title: t("partners.brand4Title") },
    { src: brandPartner, alt: t("partners.brand3Alt"), title: t("partners.brand3Title") },
  ];

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("crumbTitle")} />

      <div className="dept" dir={isRTL ? "rtl" : "ltr"}>
        {/* Intro */}
        <section className="dept-section dept-intro">
          <Container>
            <Row className="align-items-center g-5">
              <Col lg={6}>
                <span className="dept-intro__eyebrow">{t("hero.eyebrow")}</span>
                <h1>{t("hero.title")}</h1>
                <ul className="dept-checks">
                  {taglines.map((line) => (
                    <li key={line} className="text-lg">
                      <CheckCircle2 />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <div className="dept-actions">
                  <Link to="/books" className="dept-btn dept-btn--primary">
                    <BookOpen />
                    {t("hero.primaryCta")}
                  </Link>
                  <a href="#pub-contact" className="dept-btn dept-btn--outline">
                    {t("hero.secondaryCta")}
                  </a>
                </div>
              </Col>
              <Col lg={6}>
                <div className="dept-intro__logo" style={{ background: "#fff", border: "1px solid #e5e9f0" }}>
                  <img src={publishingHouseLogo} alt={t("pageTitle")} style={{ width: "75%" }} />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Who we are / identity */}
        <section className="dept-section dept-section--alt">
          <Container>
            <div className="dept-heading">
              <h2>{t("about.title")}</h2>
            </div>
            <div style={{ maxWidth: 820 }}>
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="dept-text">
                  {paragraph}
                </p>
              ))}
            </div>
            {pillars.length > 0 && (
              <Row className="g-4 mt-3">
                {pillars.map((pillar) => (
                  <Col md={6} key={pillar.title}>
                    <div className="dept-card">
                      <h3>{pillar.title}</h3>
                      <p>{pillar.text}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </section>

        {/* Goals / strategic focus */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading">
              <h2>{t("goals.title")}</h2>
            </div>
            <ul className="dept-rows dept-rows--cols">
              {goals.map((goal) => (
                <li key={goal.title}>
                  <CheckCircle2 />
                  <div>
                    <h3>{goal.title}</h3>
                    {goal.text && <p>{goal.text}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Why it matters / impact (en) — publishing policy (ar) */}
        {lists.length > 0 && (
          <section className="dept-section dept-section--alt">
            <Container>
              <Row className="g-4">
                {lists.map((list) => (
                  <Col lg={lists.length > 1 ? 6 : 12} key={list.title}>
                    <div className="dept-card">
                      <h3>{list.title}</h3>
                      {list.intro && <p className="font-semibold">{list.intro}</p>}
                      <ul className={`dept-checks ${lists.length > 1 ? "" : "dept-checks--cols"}`}>
                        {asArray(list.items).map((item) => (
                          <li key={item}>
                            <CheckCircle2 />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      {list.outro && <p className="font-semibold mt-3">{list.outro}</p>}
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>
        )}

        {/* Publishing series */}
        <section className="dept-section">
          <Container>
            <div className="dept-heading">
              <h2>{t("series.title")}</h2>
            </div>
            <Row className="g-4">
              {series.map((item) => (
                <Col sm={6} lg={item.text && isRTL ? 4 : 3} key={item.title}>
                  <div className="dept-card">
                    <span className="dept-icon">
                      <BookOpen />
                    </span>
                    <h3>{item.title}</h3>
                    {item.text && <p>{item.text}</p>}
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Contact */}
        <section className="dept-section dept-section--alt" id="pub-contact">
          <Container>
            <div className="dept-heading">
              <h2>{t("contact.title")}</h2>
            </div>
            <Row className="g-4">
              <Col lg={4}>
                <div className="dept-card">
                  <span className="dept-icon">
                    <MapPin />
                  </span>
                  <h3>{t("contact.addressesTitle")}</h3>
                  {addresses.map((address) => (
                    <p key={address} className="mb-2">
                      {address}
                    </p>
                  ))}
                </div>
              </Col>
              <Col lg={4}>
                <div className="dept-card">
                  <span className="dept-icon">
                    <MessageCircle />
                  </span>
                  <h3>{t("contact.whatsappTitle")}</h3>
                  {person && <p className="font-semibold mb-2">{person}</p>}
                  {phones.map((phone) => (
                    <a
                      key={phone}
                      href={`https://wa.me/${toWhatsApp(phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="dept-link d-flex mb-2"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </Col>
              <Col lg={4}>
                <div className="dept-card">
                  <span className="dept-icon">
                    <Mail />
                  </span>
                  <h3>{t("contact.emailTitle")}</h3>
                  {emails.map((email) => (
                    <a key={email} href={`mailto:${email}`} dir="ltr" className="dept-link d-flex mb-2 text-break">
                      {email}
                    </a>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Browse books */}
        <section className="dept-band">
          <Container>
            <h2>{t("browseBooks.title")}</h2>
            <p>{t("browseBooks.description")}</p>
            <div className="dept-actions dept-actions--center">
              <Link to="/books" className="dept-btn dept-btn--light">
                {t("browseBooks.buttonText")}
                <Arrow />
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
