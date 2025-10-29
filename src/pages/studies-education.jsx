import React from "react";
import { graphql, Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { BookOpen, GraduationCap, Users, MapPin } from "lucide-react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import BrandCarousel from "../components/brand-carousel";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";

import serviceBg from "../assets/images/backgrounds/service-hand-bg-1-1.png";
import studiesImage from "../assets/images/22.jpg";
import "../assets/css/studies-education-rtl.css";

const StudiesEducation = () => {
  const { t } = useTranslation("StudiesEducation");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t("pageTitle")} crumbTitle={t("crumbTitle")} />
      <div dir={isRTL ? "rtl" : "ltr"}>
        {/* Hero Section */}
        <section 
          className="service-details pt-120 pb-90" 
          style={{ backgroundImage: `url(${serviceBg})` }}
        >
          <Container>
            <Row className={isRTL ? "flex-row-reverse" : ""}>
              <Col md={12} lg={6}>
                <div className={`service-details__content ${isRTL ? "text-right" : ""}`}>
                  <h3 className={isRTL ? "font-arabic" : ""}>{t("hero.title")}</h3>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("hero.intro")}
                  </p>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("hero.mission")}
                  </p>
                  <p className={isRTL ? "text-right" : ""}>
                    {t("hero.approach")}
                  </p>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-details__image">
                  <img 
                    src={studiesImage} 
                    alt={t("pageTitle")} 
                    className="img-fluid" 
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Background Section */}
        <section className="py-20 bg-muted/30">
          <Container>
            <Row>
              <Col md={12}>
                <Card className="bg-card border shadow-card">
                  <CardContent className={`p-8 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-3 mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className={`text-2xl font-bold text-foreground m-0 ${isRTL ? "font-arabic" : ""}`}>
                        {t("background.title")}
                      </h3>
                    </div>
                    <p className={`text-lg text-muted-foreground leading-relaxed m-0 ${isRTL ? "text-right" : ""}`}>
                      {t("background.content")}
                    </p>
                  </CardContent>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section - Enhanced Modern Design */}
        <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#2194D1] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF5A3C] rounded-full blur-3xl"></div>
          </div>
          
          <Container className="relative z-10">
            {/* Section Header */}
            <div className={`text-center mb-16 space-y-4 ${isRTL ? "rtl" : ""}`}>
              <div className="inline-flex items-center gap-2 text-[#2194D1] font-semibold px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-[#2194D1]/20 shadow-sm">
                <BookOpen className="h-4 w-4" />
                <span className={isRTL ? "font-arabic" : ""}>{t("features.badge")}</span>
              </div>
              <h2 className={`text-4xl lg:text-5xl font-bold text-foreground ${isRTL ? "font-arabic" : ""}`}>
                {t("features.sectionTitle")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("features.sectionSubtitle")}
              </p>
            </div>

            {/* Feature Cards */}
            <Row className="g-6">
              {/* Academic Excellence */}
              <Col md={12} lg={4}>
                <div className="group h-full">
                  <Card className="h-full bg-card border-2 border-transparent hover:border-[#2194D1]/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2194D1]/0 via-transparent to-transparent group-hover:from-[#2194D1]/5 transition-all duration-500"></div>
                    
                    <CardContent className={`p-8 relative z-10 ${isRTL ? "text-right" : ""}`}>
                      {/* Icon Container */}
                      <div className={`mb-6 ${isRTL ? "flex flex-row-reverse" : "flex"}`}>
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#2194D1] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <div className="relative h-20 w-20 bg-gradient-to-br from-[#2194D1] to-[#1a75a8] text-white rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            <i className="azino-icon-reading-book text-3xl"></i>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h4 className={`text-2xl font-bold text-foreground mb-4 group-hover:text-[#2194D1] transition-colors duration-300 ${isRTL ? "font-arabic" : ""}`}>
                        {t("features.academic.title")}
                      </h4>
                      <p className={`text-muted-foreground leading-relaxed text-base ${isRTL ? "text-right" : ""}`}>
                        {t("features.academic.description")}
                      </p>

                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2194D1] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </CardContent>
                  </Card>
                </div>
              </Col>

              {/* Theological Training */}
              <Col md={12} lg={4}>
                <div className="group h-full">
                  <Card className="h-full bg-card border-2 border-transparent hover:border-[#FF5A3C]/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5A3C]/0 via-transparent to-transparent group-hover:from-[#FF5A3C]/5 transition-all duration-500"></div>
                    
                    <CardContent className={`p-8 relative z-10 ${isRTL ? "text-right" : ""}`}>
                      {/* Icon Container */}
                      <div className={`mb-6 ${isRTL ? "flex flex-row-reverse" : "flex"}`}>
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#FF5A3C] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <div className="relative h-20 w-20 bg-gradient-to-br from-[#FF5A3C] to-[#e04527] text-white rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            <i className="azino-icon-dove text-3xl"></i>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h4 className={`text-2xl font-bold text-foreground mb-4 group-hover:text-[#FF5A3C] transition-colors duration-300 ${isRTL ? "font-arabic" : ""}`}>
                        {t("features.theological.title")}
                      </h4>
                      <p className={`text-muted-foreground leading-relaxed text-base ${isRTL ? "text-right" : ""}`}>
                        {t("features.theological.description")}
                      </p>

                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5A3C] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </CardContent>
                  </Card>
                </div>
              </Col>

              {/* Leadership Development */}
              <Col md={12} lg={4}>
                <div className="group h-full">
                  <Card className="h-full bg-card border-2 border-transparent hover:border-[#FFBA08]/30 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FFBA08]/0 via-transparent to-transparent group-hover:from-[#FFBA08]/5 transition-all duration-500"></div>
                    
                    <CardContent className={`p-8 relative z-10 ${isRTL ? "text-right" : ""}`}>
                      {/* Icon Container */}
                      <div className={`mb-6 ${isRTL ? "flex flex-row-reverse" : "flex"}`}>
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#FFBA08] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                          <div className="relative h-20 w-20 bg-gradient-to-br from-[#FFBA08] to-[#d99b06] text-white rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                            <Users className="h-8 w-8" />
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <h4 className={`text-2xl font-bold text-foreground mb-4 group-hover:text-[#FFBA08] transition-colors duration-300 ${isRTL ? "font-arabic" : ""}`}>
                        {t("features.leadership.title")}
                      </h4>
                      <p className={`text-muted-foreground leading-relaxed text-base ${isRTL ? "text-right" : ""}`}>
                        {t("features.leadership.description")}
                      </p>

                      {/* Bottom Accent Line */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFBA08] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </CardContent>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* Bottom Statistics Row */}
            <div className="mt-16 pt-12 border-t border-border/50">
              <Row className="text-center">
                <Col xs={6} md={3}>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-[#2194D1]">10+</div>
                    <div className={`text-sm text-muted-foreground uppercase tracking-wider ${isRTL ? "font-arabic" : ""}`}>
                      {t("features.statistics.yearsExperience")}
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-[#FF5A3C]">500+</div>
                    <div className={`text-sm text-muted-foreground uppercase tracking-wider ${isRTL ? "font-arabic" : ""}`}>
                      {t("features.statistics.graduates")}
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-[#FFBA08]">30+</div>
                    <div className={`text-sm text-muted-foreground uppercase tracking-wider ${isRTL ? "font-arabic" : ""}`}>
                      {t("features.statistics.programs")}
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className="space-y-2">
                    <div className="text-4xl font-bold text-[#2194D1]">95%</div>
                    <div className={`text-sm text-muted-foreground uppercase tracking-wider ${isRTL ? "font-arabic" : ""}`}>
                      {t("features.statistics.successRate")}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
        </section>

        {/* Explore Courses Section */}
        <section className="py-20 bg-background">
          <Container>
            <div className={`text-center space-y-8 ${isRTL ? "rtl" : ""}`}>
              <div className="space-y-4">
                <h2 className={`text-4xl lg:text-5xl font-bold text-foreground ${isRTL ? "font-arabic" : ""}`}>
                  {t("exploreCourses.title")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {t("exploreCourses.subtitle")}
                </p>
              </div>
              <Link to="/courses">
                <Button size="lg" className="font-semibold px-8 !mt-5">
                  <GraduationCap className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {t("exploreCourses.button")}
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        {/* Academy Section */}
        <section className="py-20 bg-muted/30">
          <Container>
            <div className={`text-center space-y-6 mb-12 ${isRTL ? "rtl" : ""}`}>
              <div className="inline-flex items-center gap-2 text-[#2194D1] font-semibold px-4 py-2 bg-background rounded-full border">
                <Users className="h-5 w-5" />
                <span className={isRTL ? "font-arabic" : ""}>{t("academy.badge")}</span>
              </div>
              <h2 className={`text-4xl lg:text-5xl font-bold text-foreground ${isRTL ? "font-arabic" : ""}`}>
                {t("academy.title")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t("academy.subtitle")}
              </p>
            </div>

            {/* Goal and Vision Cards */}
            <Row className="g-4">
              <Col md={12} lg={6}>
                <Card className="h-100 bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                  <CardContent className={`p-8 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <h3 className={`text-2xl font-bold text-foreground m-0 ${isRTL ? "font-arabic" : ""}`}>
                        {t("goal.title")}
                      </h3>
                    </div>
                    <h4 className={`text-lg font-semibold text-[#2194D1] mb-3 ${isRTL ? "text-right font-arabic" : ""}`}>
                      {t("goal.subtitle")}
                    </h4>
                    <p className={`text-muted-foreground leading-relaxed m-0 ${isRTL ? "text-right" : ""}`}>
                      {t("goal.content")}
                    </p>
                  </CardContent>
                </Card>
              </Col>
              <Col md={12} lg={6}>
                <Card className="h-100 bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                  <CardContent className={`p-8 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-center gap-3 mb-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className={`text-2xl font-bold text-foreground m-0 ${isRTL ? "font-arabic" : ""}`}>
                        {t("vision.title")}
                      </h3>
                    </div>
                    <p className={`text-muted-foreground leading-relaxed m-0 ${isRTL ? "text-right" : ""}`}>
                      {t("vision.content")}
                    </p>
                  </CardContent>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Impact Section */}
        <section className="service-impact pt-20 pb-90">
          <Container>
            <Row>
              <Col md={12}>
                <div className={`block-title text-center ${isRTL ? "rtl-block-title" : ""}`}>
                  <h3 className={isRTL ? "font-arabic" : ""}>{t("impact.title")}</h3>
                  <p>{t("impact.subtitle")}</p>
                </div>
              </Col>
            </Row>
            <Row className={isRTL ? "flex-row-reverse" : ""}>
              <Col md={12} lg={6}>
                <div className={`service-impact__content ${isRTL ? "text-right" : ""}`}>
                  <h4 className={isRTL ? "font-arabic" : ""}>{t("impact.achievementsTitle")}</h4>
                  <ul className={`service-impact__list ${isRTL ? "rtl-list" : ""}`}>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.scholarships")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.centers")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.teachers")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.curriculum")}</li>
                    <li className={isRTL ? "text-right" : ""}>{t("impact.achievements.mentorship")}</li>
                  </ul>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="service-impact__stats">
                  <div className="row">
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>750+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.students")}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>20+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.centers")}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>100+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.teachers")}</p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className={`impact-stat ${isRTL ? "text-center" : ""}`}>
                        <h3>50+</h3>
                        <p className={isRTL ? "font-arabic" : ""}>{t("impact.stats.scholarships")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Addresses Section */}
        <section className="py-20 bg-muted/30">
          <Container>
            <div className={`text-center mb-12 ${isRTL ? "rtl" : ""}`}>
              <h2 className={`text-4xl lg:text-5xl font-bold text-foreground mb-4 ${isRTL ? "font-arabic" : ""}`}>
                {t("addresses.title")}
              </h2>
            </div>
            <Row className="g-4">
              <Col md={12} lg={6}>
                <Card className="bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                  <CardContent className={`p-8 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xl font-bold text-foreground mb-2 ${isRTL ? "text-right font-arabic" : ""}`}>
                          {t("addresses.alexandria.city")}
                        </h4>
                        <p className={`text-muted-foreground leading-relaxed m-0 ${isRTL ? "text-right" : ""}`}>
                          {t("addresses.alexandria.address")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Col>
              <Col md={12} lg={6}>
                <Card className="bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                  <CardContent className={`p-8 ${isRTL ? "text-right" : ""}`}>
                    <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                      <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-xl font-bold text-foreground mb-2 ${isRTL ? "text-right font-arabic" : ""}`}>
                          {t("addresses.cairo.city")}
                        </h4>
                        <p className={`text-muted-foreground leading-relaxed m-0 ${isRTL ? "text-right" : ""}`}>
                          {t("addresses.cairo.address")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Contact Section */}
        <section className="py-20 bg-background">
          <Container>
            <div className={`text-center space-y-8 ${isRTL ? "rtl" : ""}`}>
              <div className="space-y-4">
                <h2 className={`text-4xl lg:text-5xl font-bold text-foreground ${isRTL ? "font-arabic" : ""}`}>
                  {t("contact.title")}
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  {t("contact.subtitle")}
                </p>
              </div>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="font-semibold px-8">
                  {t("contact.button")}
                </Button>
              </Link>
            </div>
          </Container>
        </section>

        <BrandCarousel extraClass="client-carousel__has-border-top" />
      </div>
      <Footer />
    </Layout>
  );
};

export default StudiesEducation;

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
