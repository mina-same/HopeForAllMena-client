import React from "react";
import { Link, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Users, Heart } from "lucide-react";
import publicationsImage from "../assets/images/resources/featured-cause.jpg";
import discipleshipImage from "../assets/images/resources/Discipleship.jpg";

const ImpactSection = () => {
  const { t } = useTranslation("EvangelismDiscipleship");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <section className="py-20 bg-muted/30 animate-in fade-in duration-700" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 space-y-20">
        
        {/* Publications Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center animate-in slide-in-from-bottom duration-700">
          <div className={`space-y-8 animate-in slide-in-from-left duration-700 delay-150 ${isRTL ? "lg:order-2" : ""}`}>
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 text-[#2194D1] font-semibold ${isRTL ? "flex-row-reverse" : ""}`}>
                <BookOpen className="h-5 w-5" />
                <span>{t("impactSection.publications.badge")}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("impactSection.publications.title")}{" "}
                <span className="text-[#2194D1]">
                  {t("impactSection.publications.titleHighlight")}
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("impactSection.publications.description")}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-6 bg-card rounded-xl shadow-card border transition-all duration-300 hover:shadow-hover">
                <div className="text-3xl font-bold text-[#2194D1] mb-2">
                  {t("impactSection.publications.stats.booksCount")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("impactSection.publications.stats.booksLabel")}
                </div>
              </div>
              <div className="text-center p-6 bg-card rounded-xl shadow-card border transition-all duration-300 hover:shadow-hover">
                <div className="text-3xl font-bold text-[#2194D1] mb-2">
                  {t("impactSection.publications.stats.magazinesCount")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("impactSection.publications.stats.magazinesLabel")}
                </div>
              </div>
              <div className="text-center p-6 bg-card rounded-xl shadow-card border transition-all duration-300 hover:shadow-hover">
                <div className="text-3xl font-bold text-[#2194D1] mb-2">
                  {t("impactSection.publications.stats.copiesCount")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("impactSection.publications.stats.copiesLabel")}
                </div>
              </div>
            </div>

            <Link to="/magazines">
              <Button size="lg" className="font-semibold">
                {t("impactSection.publications.button")}
              </Button>
            </Link>
          </div>

          <div className={`relative animate-in slide-in-from-right duration-700 delay-300 ${isRTL ? "lg:order-1" : ""}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img 
                src={publicationsImage}
                alt={t("impactSection.publications.imageAlt")}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Discipleship Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center animate-in slide-in-from-bottom duration-700 delay-150">
          <div className={`relative animate-in slide-in-from-left duration-700 delay-300 ${isRTL ? "lg:order-2" : "lg:order-1"}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img 
                src={discipleshipImage}   
                alt={t("impactSection.discipleship.imageAlt")}
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          <div className={`space-y-8 animate-in slide-in-from-right duration-700 delay-500 ${isRTL ? "lg:order-1" : "lg:order-2"}`}>
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 text-[#2194D1] font-semibold ${isRTL ? "flex-row-reverse" : ""}`}>
                <Users className="h-5 w-5" />
                <span>{t("impactSection.discipleship.badge")}</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                {t("impactSection.discipleship.title")}{" "}
                <span className="text-[#2194D1]">
                  {t("impactSection.discipleship.titleHighlight")}
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t("impactSection.discipleship.description")}
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                <CardContent className={`p-6 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <h4 className="font-semibold text-foreground mb-1">
                      {t("impactSection.discipleship.features.leadership.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("impactSection.discipleship.features.leadership.description")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                <CardContent className={`p-6 flex items-center gap-4 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <h4 className="font-semibold text-foreground mb-1">
                      {t("impactSection.discipleship.features.spiritual.title")}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t("impactSection.discipleship.features.spiritual.description")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Link to="/training">
              <Button size="lg" variant="outline" className="font-semibold">
                {t("impactSection.discipleship.button")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
