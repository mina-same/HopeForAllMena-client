import React from "react";
import { graphql } from "gatsby";
import { Link, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Heart, Users, MessageCircle, Calendar } from "lucide-react";
import HeroSection from "../components/HeroSection";
import MinistryCard from "../components/MinistryCard";
import ImpactSection from "../components/ImpactSection";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import Footer from "../components/footer";
import Layout from "../components/layout";

const EvangelismDiscipleship = () => {
  const { t } = useTranslation("EvangelismDiscipleship");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope for All Mena`}>
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <HeaderTwo />
        <StickyHeader />
        
        {/* Hero Section */}
        <HeroSection />

        {/* Ministry Focus Areas */}
        <section className="py-20 bg-background animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className={`!text-center space-y-4 mb-16 animate-in slide-in-from-bottom duration-700 ${isRTL ? "rtl" : ""}`}>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("ministryFocus.title")}{" "}
                <span className="text-[#2194D1]">{t("ministryFocus.titleHighlight")}</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                {t("ministryFocus.subtitle")}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700 delay-150">
              <MinistryCard
                icon={Heart}
                title={t("ministryFocus.evangelism.title")}
                description={t("ministryFocus.evangelism.description")}
                features={[
                  t("ministryFocus.evangelism.features.gospel"),
                  t("ministryFocus.evangelism.features.training"),
                  t("ministryFocus.evangelism.features.outreach"),
                  t("ministryFocus.evangelism.features.crossCultural"),
                ]}
                buttonText={t("ministryFocus.evangelism.button")}
                buttonVariant="default"
                link="/magazines"
              />

              <MinistryCard
                icon={Users}
                title={t("ministryFocus.discipleship.title")}
                description={t("ministryFocus.discipleship.description")}
                features={[
                  t("ministryFocus.discipleship.features.leadership"),
                  t("ministryFocus.discipleship.features.spiritual"),
                  t("ministryFocus.discipleship.features.mentorship"),
                  t("ministryFocus.discipleship.features.church"),
                ]}
                buttonText={t("ministryFocus.discipleship.button")}
                buttonVariant="outline"
                link="/training"
              />
            </div>
          </div>
        </section>

        {/* Impact and Publications */}
        <ImpactSection />

        {/* Community Engagement */}
        <section className="py-20 bg-background animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className={`text-center space-y-4 mb-16 animate-in slide-in-from-bottom duration-700 ${isRTL ? "rtl" : ""}`}>
              <div className={`inline-flex items-center gap-2 text-[#2194D1] font-semibold ${isRTL ? "flex-row" : ""}`}>
                <Calendar className="h-5 w-5" />
                <span>{t("communityEngagement.badge")}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("communityEngagement.title")}{" "}
                <span className="text-[#2194D1]">{t("communityEngagement.titleHighlight")}</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {t("communityEngagement.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in slide-in-from-bottom duration-700 delay-150">
              {[
                {
                  icon: Users,
                  title: t("communityEngagement.engagement.title"),
                  description: t("communityEngagement.engagement.description"),
                },
                {
                  icon: MessageCircle,
                  title: t("communityEngagement.proclamation.title"),
                  description: t("communityEngagement.proclamation.description"),
                },
                {
                  icon: Heart,
                  title: t("communityEngagement.unity.title"),
                  description: t("communityEngagement.unity.description"),
                },
              ].map((item, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-hover transition-all duration-300 bg-card border shadow-card"
                >
                  <CardContent className={`p-8 space-y-6 ${isRTL ? "text-right" : "text-center"}`}>
                    <div className="h-20 w-20 bg-[#2194D1] text-white rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-200 shadow-card">
                      <item.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-muted/30 animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700 ${isRTL ? "text-right" : "text-center"}`}>
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-bold text-foreground">
                  {t("callToAction.title")}{" "}
                  <span className="text-[#2194D1]">{t("callToAction.titleHighlight")}</span>
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                  {t("callToAction.subtitle")}
                </p>
              </div>

              <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${isRTL ? "sm:flex-row" : ""}`}>
                <Link to="/donate">
                  <Button size="lg" className="font-semibold px-8">
                    {t("callToAction.primaryButton")}
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold px-8"
                  >
                    {t("callToAction.secondaryButton")}
                  </Button>
                </Link>
              </div>

              <div className="pt-8 border-t animate-in slide-in-from-bottom duration-700 delay-300">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold text-[#2194D1] mb-2">
                      500+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("callToAction.stats.lives")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#2194D1] mb-2">
                      50+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("callToAction.stats.programs")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#2194D1] mb-2">
                      25+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("callToAction.stats.communities")}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#2194D1] mb-2">
                      100+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("callToAction.stats.publications")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
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
