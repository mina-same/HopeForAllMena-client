import React from "react";
import { graphql } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Card, CardContent } from "../components/ui/card";
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
  Heart,
  HeartHandshake,
} from "lucide-react";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import Footer from "../components/footer";
import Layout from "../components/layout";
import heroImage from "../assets/images/resources/service-1-2.jpg";
import visionImage from "../assets/images/resources/service-1-3.jpg";

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

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope for All Mena`}>
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <HeaderTwo />
        <StickyHeader />

        {/* Hero */}
        <section className="bg-background py-20 animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`space-y-8 animate-in slide-in-from-left duration-700 delay-150 ${isRTL ? "lg:order-2" : ""}`}>
                <div className="inline-flex items-center gap-3 bg-muted rounded-full px-4 py-2 border">
                  <div className="h-2 w-2 bg-[#2194D1] rounded-full"></div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {t("hero.badge")}
                  </span>
                </div>

                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                    {t("hero.title")}{" "}
                    <span className="text-[#2194D1]">
                      {t("hero.titleHighlight")}
                    </span>
                  </h1>
                  <p className="text-2xl font-semibold text-[#2194D1]">
                    {t("hero.tagline")}
                  </p>
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                    {t("hero.description")}
                  </p>
                </div>
              </div>

              <div className={`relative animate-in slide-in-from-right duration-700 delay-300 ${isRTL ? "lg:order-1" : ""}`}>
                <div className="relative rounded-2xl overflow-hidden shadow-hover">
                  <img
                    src={heroImage}
                    alt={t("hero.imageAlt")}
                    className="w-full h-[500px] object-cover"
                  />
                </div>

                <div className={`absolute -top-4 bg-[#2194D1] text-white rounded-xl p-3 shadow-card ${isRTL ? "-right-4" : "-left-4"}`}>
                  <Heart className="h-6 w-6" />
                </div>
                <div className={`absolute -bottom-4 bg-secondary text-white rounded-xl p-3 shadow-card border ${isRTL ? "-left-4" : "-right-4"}`}>
                  <HeartHandshake className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-20 bg-muted/30 animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom duration-700">
              <div className="h-20 w-20 bg-[#2194D1] text-white rounded-2xl flex items-center justify-center mx-auto shadow-card">
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("whoWeAre.title")}
              </h2>
              <div className="h-1 w-20 bg-[#2194D1] rounded-full mx-auto"></div>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                {t("whoWeAre.body")}
              </p>
            </div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="py-20 bg-background animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className={`space-y-6 animate-in slide-in-from-bottom duration-700 ${isRTL ? "lg:order-2" : ""}`}>
                <div className="h-16 w-16 bg-[#2194D1] text-white rounded-2xl flex items-center justify-center shadow-card">
                  <Eye className="h-8 w-8" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  {t("vision.title")}
                </h2>
                <div className="h-1 w-20 bg-[#2194D1] rounded-full"></div>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t("vision.body")}
                </p>
              </div>

              <div className={`relative animate-in slide-in-from-bottom duration-700 delay-150 ${isRTL ? "lg:order-1" : ""}`}>
                <div className="rounded-2xl overflow-hidden shadow-hover">
                  <img
                    src={visionImage}
                    alt={t("vision.imageAlt")}
                    className="w-full h-[420px] object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 bg-muted/30 animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-4 animate-in slide-in-from-bottom duration-700">
                <div className="h-16 w-16 bg-[#2194D1] text-white rounded-2xl flex items-center justify-center mx-auto shadow-card">
                  <Target className="h-8 w-8" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  {t("mission.title")}
                </h2>
                <div className="h-1 w-20 bg-[#2194D1] rounded-full mx-auto"></div>
              </div>

              <div className="space-y-4 animate-in slide-in-from-bottom duration-700 delay-150">
                {STATEMENT_KEYS.map((key) => (
                  <div
                    key={key}
                    className="flex items-start gap-4 bg-card border rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
                  >
                    <CheckCircle2 className="h-6 w-6 text-[#2194D1] flex-shrink-0 mt-1" />
                    <p className="text-lg text-muted-foreground leading-relaxed m-0">
                      {t(`mission.items.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Goals */}
        <section className="py-20 bg-background animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16 animate-in slide-in-from-bottom duration-700">
              <div className="h-16 w-16 bg-[#2194D1] text-white rounded-2xl flex items-center justify-center mx-auto shadow-card">
                <Flag className="h-8 w-8" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("goals.title")}
              </h2>
              <div className="h-1 w-20 bg-[#2194D1] rounded-full mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-in slide-in-from-bottom duration-700 delay-150">
              {STATEMENT_KEYS.map((key, index) => (
                <Card
                  key={key}
                  className={`group hover:shadow-hover transition-all duration-300 bg-card border shadow-card ${
                    index === STATEMENT_KEYS.length - 1 ? "md:col-span-2" : ""
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <div className="text-3xl font-bold text-[#2194D1] leading-none flex-shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <p className="text-lg text-muted-foreground leading-relaxed m-0">
                        {t(`goals.items.${key}`)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Ministry */}
        <section className="py-20 bg-muted/30 animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("why.title")}
              </h2>
              <div className={`bg-card rounded-2xl p-8 shadow-card ${isRTL ? "border-r-4" : "border-l-4"} border-[#2194D1] space-y-4`}>
                <Quote className="h-8 w-8 text-[#2194D1]" />
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t("why.body")}
                </p>
                <p className="text-xl text-muted-foreground leading-relaxed m-0">
                  {t("why.bodySecondary")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Areas of Ministry */}
        <section className="py-20 bg-background animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16 animate-in slide-in-from-bottom duration-700">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("areas.title")}
              </h2>
              <div className="h-1 w-20 bg-[#2194D1] rounded-full mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto animate-in slide-in-from-bottom duration-700 delay-150">
              {AREA_ITEMS.map((area) => (
                <Card
                  key={area.key}
                  className="group hover:shadow-hover transition-all duration-300 bg-card border shadow-card h-full"
                >
                  <CardContent className="p-8 space-y-6">
                    <div className="h-14 w-14 bg-[#2194D1] text-white rounded-2xl flex items-center justify-center shadow-card">
                      <area.icon className="h-7 w-7" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground">
                        {t(`areas.items.${area.key}.title`)}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed m-0">
                        {t(`areas.items.${area.key}.intro`)}
                      </p>
                    </div>
                    <ul className="space-y-3 list-none p-0 m-0">
                      {POINT_KEYS.map((point) => (
                        <li key={point} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-[#2194D1] flex-shrink-0 mt-1" />
                          <span className="text-muted-foreground leading-relaxed">
                            {t(`areas.items.${area.key}.points.${point}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Closing tagline */}
        <section className="py-20 bg-[#2194D1] animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6 animate-in slide-in-from-bottom duration-700">
              <div className="h-20 w-20 bg-white/15 text-white rounded-2xl flex items-center justify-center mx-auto border border-white/30">
                <HeartHandshake className="h-10 w-10" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                {t("hero.tagline")}
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed m-0">
                {t("hero.badge")}
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
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
