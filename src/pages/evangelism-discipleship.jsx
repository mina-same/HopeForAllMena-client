import React from "react";
import { graphql } from "gatsby";
import { Link, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Card, CardContent } from "../components/ui/card";
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
import HeroSection from "../components/HeroSection";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import Footer from "../components/footer";
import Layout from "../components/layout";
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
  const ActionChevron = isRTL ? ChevronLeft : ChevronRight;

  const philosophyBody = t("philosophy.body");

  return (
    <Layout pageTitle={`${t("pageTitle")} || Hope for All Mena`}>
      <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
        <HeaderTwo />
        <StickyHeader />

        {/* Hero */}
        <HeroSection />

        {/* Our Mission — statement over a photo of the ministry it describes */}
        <section className="relative py-24 animate-in fade-in duration-700">
          <img
            src={missionImage}
            alt={t("mission.imageAlt")}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B3C5D]/95 via-[#0B3C5D]/90 to-[#2194D1]/85"></div>
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom duration-700">
              <div className="h-20 w-20 bg-white/15 text-white rounded-2xl flex items-center justify-center mx-auto border border-white/30">
                <Target className="h-10 w-10" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white">
                {t("mission.title")}
              </h2>
              <div className="h-1 w-20 bg-white/60 rounded-full mx-auto"></div>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                {t("mission.body")}
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
                    loading="lazy"
                  />
                </div>
                {/* Trained-teachers accent tile */}
                <div className={`absolute -bottom-6 bg-[#2194D1] text-white rounded-2xl px-6 py-4 shadow-card ${isRTL ? "-left-4" : "-right-4"}`}>
                  <GraduationCap className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Overall Objectives */}
        <section className="py-20 bg-muted/30 animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16 animate-in slide-in-from-bottom duration-700">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("objectives.title")}
              </h2>
              <div className="h-1 w-20 bg-[#2194D1] rounded-full mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-in slide-in-from-bottom duration-700 delay-150">
              {OBJECTIVE_KEYS.map((key, index) => (
                <Card
                  key={key}
                  className={`group hover:shadow-hover transition-all duration-300 bg-card border shadow-card ${
                    index === OBJECTIVE_KEYS.length - 1 ? "md:col-span-2" : ""
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="flex gap-6">
                      <div className="text-3xl font-bold text-[#2194D1] leading-none flex-shrink-0">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-bold text-foreground">
                          {t(`objectives.items.${key}.title`)}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {t(`objectives.items.${key}.description`)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Philosophy — renders once philosophy.body is filled in */}
        {philosophyBody ? (
          <section className="py-20 bg-background animate-in fade-in duration-700">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700">
                <div className="h-16 w-16 bg-[#2194D1] text-white rounded-2xl flex items-center justify-center shadow-card">
                  <Compass className="h-8 w-8" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  {t("philosophy.title")}
                </h2>
                <div className={`bg-muted/50 rounded-2xl p-8 shadow-card ${isRTL ? "border-r-4" : "border-l-4"} border-[#2194D1]`}>
                  <Quote className="h-8 w-8 text-[#2194D1] mb-4" />
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {philosophyBody}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Our Programs */}
        <section className="py-20 bg-background animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-4 animate-in slide-in-from-bottom duration-700">
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                  {t("programs.title")}
                </h2>
                <div className="h-1 w-20 bg-[#2194D1] rounded-full mx-auto"></div>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {t("programs.description")}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("programs.note")}
                </p>
              </div>

              {/* Levels and ages, framed by two photos from the lessons */}
              <div className="grid lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom duration-700 delay-150">
                <div className="rounded-2xl overflow-hidden shadow-card">
                  <img
                    src={programsImageOne}
                    alt={t("programs.imageAltOne")}
                    className="w-full h-72 object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-card border rounded-2xl p-6 shadow-card flex flex-col justify-center text-center">
                    <Layers className="h-7 w-7 text-[#2194D1] mx-auto mb-3" />
                    <div className="text-4xl font-bold text-[#2194D1] mb-1">
                      {t("programs.levelsValue")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("programs.levelsLabel")}
                    </div>
                  </div>
                  <div className="bg-card border rounded-2xl p-6 shadow-card flex flex-col justify-center text-center">
                    <Heart className="h-7 w-7 text-[#2194D1] mx-auto mb-3" />
                    <div className="text-4xl font-bold text-[#2194D1] mb-1">
                      {t("programs.agesValue")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t("programs.agesLabel")}
                    </div>
                  </div>
                  <div className="col-span-2 rounded-2xl overflow-hidden shadow-card">
                    <img
                      src={programsImageTwo}
                      alt={t("programs.imageAltTwo")}
                      className="w-full h-40 object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Core features */}
              <div className="space-y-8 animate-in slide-in-from-bottom duration-700 delay-300">
                <h3 className="text-2xl lg:text-3xl font-bold text-foreground text-center">
                  {t("programs.featuresTitle")}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PROGRAM_FEATURES.map((feature) => (
                    <div
                      key={feature.key}
                      className="flex items-center gap-4 bg-card border rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
                    >
                      <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <span className="text-lg font-medium text-foreground">
                        {t(`programs.features.${feature.key}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* From the ministry — photo strip */}
        <section className="py-20 bg-muted/30 animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-12 animate-in slide-in-from-bottom duration-700">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("gallery.title")}
              </h2>
              <div className="h-1 w-20 bg-[#2194D1] rounded-full mx-auto"></div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom duration-700 delay-150">
              {GALLERY_IMAGES.map((image) => (
                <div
                  key={image.key}
                  className="rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300"
                >
                  <img
                    src={image.src}
                    alt={t(`gallery.items.${image.key}`)}
                    className="w-full h-60 object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Mailbox Club */}
        <section className="pt-20 pb-32 bg-[#2194D1] animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-in slide-in-from-bottom duration-700">
              <div className="inline-flex bg-white rounded-2xl p-6 shadow-card">
                <img
                  src={mailboxLogo}
                  alt={t("mailbox.logoAlt")}
                  className="h-20 w-auto object-contain"
                  loading="lazy"
                />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white" dir="ltr">
                {t("mailbox.title")}
              </h2>
              <div className="h-1 w-20 bg-white/60 rounded-full mx-auto"></div>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                {t("mailbox.body")}
              </p>
            </div>
          </div>
        </section>

        {/* Page actions */}
        <section className="bg-muted/30 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto -mt-20 relative z-10 grid sm:grid-cols-2 gap-6">
              {PAGE_ACTIONS.map((action) => (
                <Link
                  key={action.key}
                  to={action.link}
                  className="group block bg-card border rounded-2xl p-6 shadow-card hover:shadow-hover hover:border-[#2194D1] transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-[#2194D1] text-white flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                      <action.icon className="h-6 w-6" />
                    </div>
                    <span className="flex-1 text-lg font-semibold text-foreground">
                      {t(`actions.${action.key}`)}
                    </span>
                    <ActionChevron className={`h-5 w-5 text-[#2194D1] flex-shrink-0 transition-transform duration-200 ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* In partnership with */}
        <section className="py-16 bg-background border-t animate-in fade-in duration-700">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-10">
              <div className="space-y-4">
                <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {t("partners.title")}
                </h2>
                <div className="h-1 w-16 bg-[#2194D1] rounded-full mx-auto"></div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
                <img
                  src={synodLogo}
                  alt={t("partners.synodAlt")}
                  className="h-32 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <img
                  src={mailboxLogo}
                  alt={t("partners.mailboxAlt")}
                  className="h-24 w-auto object-contain transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
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
