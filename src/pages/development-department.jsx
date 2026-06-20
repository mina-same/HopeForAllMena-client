import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { graphql } from "gatsby";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import { useTranslation } from "react-i18next";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import BrandCarousel from "../components/brand-carousel";
import { Button } from "../components/ui/button";
import {
  CheckCircle2,
  ArrowRight,
  Eye,
  Target,
  Building2,
  GraduationCap,
  Heart,
  Stethoscope,
  Globe,
  Briefcase,
  Users,
  BookOpen,
  Lightbulb,
  HandHeart,
} from "lucide-react";

import serviceBg from "../assets/images/backgrounds/service-hand-bg-1-1.png";
import aboutImage from "../assets/images/resources/about-1-1.jpg";
import "../assets/css/development-department-rtl.css";

const SUPPORT_ICONS = [
  Building2,
  GraduationCap,
  Target,
  Stethoscope,
  Globe,
  Briefcase,
  HandHeart,
  BookOpen,
  Heart,
  Lightbulb,
];

const DevelopmentDepartment = () => {
  const { t } = useTranslation("DevelopmentDepartment");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  const supportItems = t("supportAreas.items", { returnObjects: true });
  const requirementItems = t("requirements.items", { returnObjects: true });
  const missionItems = t("mission.items", { returnObjects: true });

  const dir = isRTL ? "rtl" : "ltr";
  const textAlign = isRTL ? "text-right" : "";
  const rowReverse = isRTL ? "flex-row-reverse" : "";

  return (
    <Layout pageTitle={t("pageTitle")}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("title")} crumbTitle={t("breadcrumb")} />
      <div
        className={isRTL ? "development-department-rtl" : ""}
        dir={dir}
      >
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section
          className="position-relative overflow-hidden py-5"
          style={{
            backgroundImage: `url(${serviceBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            paddingTop: "5rem",
            paddingBottom: "5rem",
          }}
        >
          {/* overlay */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.97) 50%, rgba(33,148,209,0.08) 100%)",
              pointerEvents: "none",
            }}
          />
          <Container className="position-relative" style={{ zIndex: 1 }}>
            <Row className={`align-items-center g-5 ${isRTL ? "flex-row-reverse" : ""}`}>
              {/* Text */}
              <Col lg={6}>
                <div className={textAlign}>
                  {/* pill badge */}
                  <div
                    className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4 ${rowReverse}`}
                    style={{
                      background: "rgba(33,148,209,0.1)",
                      color: "#2194D1",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#2194D1",
                        display: "inline-block",
                        animation: "pulse 2s infinite",
                      }}
                    />
                    Hope for All MENA Ministries
                  </div>

                  <h2
                    className={`fw-black mb-4 ${isRTL ? "font-arabic" : ""}`}
                    style={{
                      fontSize: "clamp(2rem, 4vw, 2.8rem)",
                      lineHeight: 1.2,
                      color: "#111827",
                    }}
                  >
                    {t("hero.title")}
                  </h2>
                  <p
                    style={{
                      fontSize: "1.05rem",
                      lineHeight: 1.75,
                      color: "#4B5563",
                      marginBottom: "2rem",
                    }}
                  >
                    {t("hero.intro")}
                  </p>

                  <div className={`d-flex flex-wrap gap-3 ${rowReverse}`}>
                    <Link to="/development-project-request" style={{ textDecoration: "none" }}>
                      <Button
                        className={`d-inline-flex align-items-center gap-2 ${rowReverse}`}
                        style={{
                          background: "#2194D1",
                          border: "none",
                          padding: "0.7rem 1.75rem",
                          fontWeight: 600,
                          boxShadow: "0 8px 24px rgba(33,148,209,0.28)",
                        }}
                      >
                        {t("hero.primaryCta")}
                        <ArrowRight
                          style={{ width: 16, height: 16, ...(isRTL ? { transform: "rotate(180deg)" } : {}) }}
                        />
                      </Button>
                    </Link>
                    <Link to="/contact" style={{ textDecoration: "none" }}>
                      <Button
                        variant="outline"
                        style={{ padding: "0.7rem 1.75rem", fontWeight: 600 }}
                      >
                        {t("hero.secondaryCta")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Col>

              {/* Image */}
              <Col lg={6}>
                <div className="position-relative">
                  {/* glow ring */}
                  <div
                    className="position-absolute"
                    style={{
                      inset: -16,
                      borderRadius: "1.5rem",
                      background:
                        "linear-gradient(135deg, rgba(33,148,209,0.18), rgba(255,90,60,0.1))",
                      filter: "blur(20px)",
                    }}
                  />
                  <div
                    className="position-relative overflow-hidden"
                    style={{ borderRadius: "1.25rem", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}
                  >
                    <img
                      src={aboutImage}
                      alt={t("hero.imageAlt")}
                      className="img-fluid w-100"
                      style={{ display: "block", aspectRatio: "4/3", objectFit: "cover" }}
                    />
                    {/* floating badge */}
                    <div
                      className="position-absolute bottom-0 start-0 end-0 m-3"
                    >
                      <div
                        className={`d-flex align-items-center gap-3 ${rowReverse}`}
                        style={{
                          background: "rgba(255,255,255,0.92)",
                          backdropFilter: "blur(8px)",
                          borderRadius: "0.875rem",
                          padding: "0.75rem 1rem",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "0.5rem",
                            background: "#2194D1",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Users style={{ width: 18, height: 18, color: "#fff" }} />
                        </div>
                        <div className={textAlign}>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#111827" }}>
                            Matching Fund Model
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                            50% Ministry · 50% Church
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ── Vision & Mission ─────────────────────────────────────── */}
        <section style={{ padding: "5rem 0", background: "#F9FAFB" }}>
          <Container>
            <Row className="g-4">
              {/* Vision */}
              <Col lg={6}>
                <div
                  className={`h-100 ${textAlign}`}
                  style={{
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ height: 5, background: "linear-gradient(90deg, #2194D1, rgba(33,148,209,0.3))" }} />
                  <div style={{ padding: "2rem" }}>
                    <div className={`d-flex align-items-center gap-3 mb-4 ${rowReverse}`}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "0.75rem",
                          background: "rgba(33,148,209,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Eye style={{ width: 22, height: 22, color: "#2194D1" }} />
                      </div>
                      <h3
                        className={`m-0 fw-bold ${isRTL ? "font-arabic" : ""}`}
                        style={{ fontSize: "1.35rem", color: "#111827" }}
                      >
                        {t("vision.title")}
                      </h3>
                    </div>
                    <p style={{ color: "#4B5563", lineHeight: 1.75, margin: 0 }}>
                      {t("vision.text")}
                    </p>
                  </div>
                </div>
              </Col>

              {/* Mission */}
              <Col lg={6}>
                <div
                  className={`h-100 ${textAlign}`}
                  style={{
                    borderRadius: "1.25rem",
                    overflow: "hidden",
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  <div style={{ height: 5, background: "linear-gradient(90deg, #FF5A3C, rgba(255,90,60,0.3))" }} />
                  <div style={{ padding: "2rem" }}>
                    <div className={`d-flex align-items-center gap-3 mb-4 ${rowReverse}`}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "0.75rem",
                          background: "rgba(255,90,60,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Target style={{ width: 22, height: 22, color: "#FF5A3C" }} />
                      </div>
                      <h3
                        className={`m-0 fw-bold ${isRTL ? "font-arabic" : ""}`}
                        style={{ fontSize: "1.35rem", color: "#111827" }}
                      >
                        {t("mission.title")}
                      </h3>
                    </div>
                    <ul className="list-unstyled m-0" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {missionItems.map((item, index) => (
                        <li
                          key={index}
                          className={`d-flex align-items-start gap-3 ${rowReverse}`}
                        >
                          <CheckCircle2
                            style={{ width: 18, height: 18, color: "#FF5A3C", marginTop: 2, flexShrink: 0 }}
                          />
                          <span style={{ color: "#4B5563", lineHeight: 1.7 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* ── Matching Fund / Goals ─────────────────────────────────── */}
        <section style={{ padding: "5rem 0", background: "#fff" }}>
          <Container>
            <div
              className={textAlign}
              style={{
                borderRadius: "1.5rem",
                border: "1px solid rgba(33,148,209,0.15)",
                background: "linear-gradient(135deg, rgba(33,148,209,0.04) 0%, #fff 60%)",
                boxShadow: "0 2px 16px rgba(33,148,209,0.08)",
                padding: "2.5rem",
              }}
            >
              {/* header */}
              <div style={{ marginBottom: "2rem" }}>
                <div
                  className={`d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 ${rowReverse}`}
                  style={{ background: "rgba(33,148,209,0.1)", color: "#2194D1", fontSize: "0.8rem", fontWeight: 600 }}
                >
                  <Users style={{ width: 14, height: 14 }} />
                  Partnership Model
                </div>
                <h3
                  className={`fw-bold m-0 mb-3 ${isRTL ? "font-arabic" : ""}`}
                  style={{ fontSize: "1.65rem", color: "#111827" }}
                >
                  {t("matchingFund.title")}
                </h3>
                <p style={{ color: "#4B5563", lineHeight: 1.75, margin: 0, maxWidth: "680px" }}>
                  {t("matchingFund.text")}
                </p>
              </div>

              {/* split bar + stats */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    overflow: "hidden",
                    display: "flex",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ flex: 1, background: "#2194D1" }} />
                  <div style={{ flex: 1, background: "#FF5A3C" }} />
                </div>
                <Row className="g-3">
                  <Col xs={6}>
                    <div
                      style={{
                        borderRadius: "1rem",
                        border: "1px solid rgba(33,148,209,0.2)",
                        background: "rgba(33,148,209,0.06)",
                        padding: "1.25rem 1.5rem",
                      }}
                    >
                      <div style={{ fontSize: "3rem", fontWeight: 900, color: "#2194D1", lineHeight: 1 }}>
                        50%
                      </div>
                      <div style={{ color: "#4B5563", fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: 500 }}>
                        {t("matchingFund.ministryShare")}
                      </div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div
                      style={{
                        borderRadius: "1rem",
                        border: "1px solid rgba(255,90,60,0.2)",
                        background: "rgba(255,90,60,0.06)",
                        padding: "1.25rem 1.5rem",
                      }}
                    >
                      <div style={{ fontSize: "3rem", fontWeight: 900, color: "#FF5A3C", lineHeight: 1 }}>
                        50%
                      </div>
                      <div style={{ color: "#4B5563", fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: 500 }}>
                        {t("matchingFund.churchShare")}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* quote */}
              <div
                style={{
                  borderRadius: "0.875rem",
                  border: "1px solid #E5E7EB",
                  borderLeft: isRTL ? "1px solid #E5E7EB" : "4px solid #2194D1",
                  borderRight: isRTL ? "4px solid #2194D1" : "1px solid #E5E7EB",
                  background: "#fff",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <p style={{ margin: 0, color: "#374151", fontWeight: 500, lineHeight: 1.7, fontStyle: "italic" }}>
                  &ldquo;{t("matchingFund.quote")}&rdquo;
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Support Areas ─────────────────────────────────────────── */}
        <section style={{ padding: "5rem 0", background: "#F9FAFB" }}>
          <Container>
            {/* section header */}
            <div className="text-center mb-5">
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{ background: "rgba(33,148,209,0.1)", color: "#2194D1", fontSize: "0.8rem", fontWeight: 600 }}
              >
                <Globe style={{ width: 14, height: 14 }} />
                What We Support
              </div>
              <h3
                className={`fw-bold m-0 ${isRTL ? "font-arabic" : ""}`}
                style={{ fontSize: "1.75rem", color: "#111827" }}
              >
                {t("supportAreas.title")}
              </h3>
              <p style={{ color: "#6B7280", marginTop: "0.75rem", marginBottom: 0, maxWidth: 480, marginInline: "auto" }}>
                {t("supportAreas.subtitle")}
              </p>
            </div>

            <Row className="g-3">
              {supportItems.map((item, index) => {
                const Icon = SUPPORT_ICONS[index % SUPPORT_ICONS.length];
                return (
                  <Col key={index} sm={6} lg={4}>
                    <div
                      className={`h-100 ${textAlign}`}
                      style={{
                        borderRadius: "1rem",
                        border: "1px solid #E5E7EB",
                        background: "#fff",
                        padding: "1.25rem",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                        transition: "box-shadow 0.2s, border-color 0.2s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 6px 20px rgba(33,148,209,0.12)";
                        e.currentTarget.style.borderColor = "rgba(33,148,209,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)";
                        e.currentTarget.style.borderColor = "#E5E7EB";
                      }}
                    >
                      <div className={`d-flex align-items-start gap-3 ${rowReverse}`}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "0.625rem",
                            background: "rgba(33,148,209,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Icon style={{ width: 18, height: 18, color: "#2194D1" }} />
                        </div>
                        <p style={{ margin: 0, color: "#374151", lineHeight: 1.65, fontSize: "0.9rem", flex: 1 }}>
                          {item}
                        </p>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>

        {/* ── Requirements ─────────────────────────────────────────── */}
        <section style={{ padding: "5rem 0", background: "#fff" }}>
          <Container>
            {/* section header */}
            <div className="text-center mb-5">
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{ background: "rgba(255,90,60,0.1)", color: "#FF5A3C", fontSize: "0.8rem", fontWeight: 600 }}
              >
                <CheckCircle2 style={{ width: 14, height: 14 }} />
                Criteria &amp; Eligibility
              </div>
              <h3
                className={`fw-bold m-0 ${isRTL ? "font-arabic" : ""}`}
                style={{ fontSize: "1.75rem", color: "#111827" }}
              >
                {t("requirements.title")}
              </h3>
              <p style={{ color: "#6B7280", marginTop: "0.75rem", marginBottom: 0, maxWidth: 480, marginInline: "auto" }}>
                {t("requirements.subtitle")}
              </p>
            </div>

            <Row className="g-3">
              {requirementItems.map((reqItem, index) => (
                <Col key={index} sm={6} lg={4}>
                  <div
                    className={`h-100 ${textAlign}`}
                    style={{
                      borderRadius: "1rem",
                      border: "1px solid #E5E7EB",
                      background: "#fff",
                      overflow: "hidden",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                      transition: "box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.09)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)";
                    }}
                  >
                    {/* colored top bar */}
                    <div style={{ height: 4, background: "linear-gradient(90deg, #2194D1, rgba(33,148,209,0.3))" }} />
                    <div style={{ padding: "1.25rem" }}>
                      <div className={`d-flex align-items-center gap-3 mb-2 ${rowReverse}`}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "0.5rem",
                            background: "rgba(33,148,209,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            fontWeight: 700,
                            fontSize: "0.8rem",
                            color: "#2194D1",
                          }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <h4
                          className={`m-0 fw-bold ${isRTL ? "font-arabic" : ""}`}
                          style={{ fontSize: "1rem", color: "#111827" }}
                        >
                          {reqItem.title}
                        </h4>
                      </div>
                      <p style={{ margin: 0, color: "#4B5563", lineHeight: 1.7, fontSize: "0.875rem" }}>
                        {reqItem.text}
                      </p>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <section
          className="position-relative overflow-hidden"
          style={{
            padding: "5rem 0",
            background: "linear-gradient(135deg, #2194D1 0%, #1a7ab8 50%, #1560a0 100%)",
          }}
        >
          {/* subtle texture overlay */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundImage: `url(${serviceBg})`,
              backgroundSize: "cover",
              opacity: 0.06,
              pointerEvents: "none",
            }}
          />
          {/* decorative circles */}
          <div
            className="position-absolute top-0 end-0"
            style={{
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              transform: "translate(30%, -50%)",
            }}
          />
          <div
            className="position-absolute bottom-0 start-0"
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.05)",
              transform: "translate(-30%, 50%)",
            }}
          />

          <Container className="position-relative" style={{ zIndex: 1 }}>
            <Row className={`align-items-center g-4 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Col lg={8}>
                <div className={textAlign}>
                  <h3
                    className={`fw-bold m-0 ${isRTL ? "font-arabic" : ""}`}
                    style={{ fontSize: "1.85rem", color: "#fff" }}
                  >
                    {t("bottomCta.title")}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.82)", marginTop: "0.75rem", marginBottom: 0, fontSize: "1.05rem", lineHeight: 1.7 }}>
                    {t("bottomCta.text")}
                  </p>
                </div>
              </Col>
              <Col lg={4}>
                <div className={isRTL ? "text-start" : "text-lg-end"}>
                  <Link to="/development-project-request" style={{ textDecoration: "none" }}>
                    <Button
                      className={`d-inline-flex align-items-center gap-2 ${rowReverse}`}
                      style={{
                        background: "#fff",
                        color: "#2194D1",
                        border: "none",
                        padding: "0.75rem 2rem",
                        fontWeight: 700,
                        fontSize: "1rem",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                      }}
                    >
                      {t("bottomCta.button")}
                      <ArrowRight
                        style={{ width: 16, height: 16, ...(isRTL ? { transform: "rotate(180deg)" } : {}) }}
                      />
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <BrandCarousel extraClass="client-carousel__has-border-top" />
      </div>
      <Footer />
    </Layout>
  );
};

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

export default DevelopmentDepartment;
