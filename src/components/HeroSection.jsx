import React from "react";
import { Link, useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Button } from "./ui/button";
import { Heart, BookOpen } from "lucide-react";
import heroImage from "../assets/images/gallery/EvangelismDiscipleship.jpg";

const HeroSection = () => {
  const { t } = useTranslation("EvangelismDiscipleship");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <section className="bg-background py-20 animate-in fade-in duration-700" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Content */}
          <div className={`space-y-8 animate-in slide-in-from-left duration-700 delay-150 ${isRTL ? "lg:order-2" : ""}`}>
            <div className={`inline-flex items-center gap-3 bg-muted rounded-full px-4 py-2 border ${isRTL ? "flex-row" : ""}`}>
              <div className="h-2 w-2 bg-[#2194D1] rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground">
                {t("heroSection.badge")}
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                {t("heroSection.title")}{" "}
                <span className="text-[#2194D1]">
                  {t("heroSection.titleHighlight")}
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                {t("heroSection.description")}
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? "sm:flex-row" : ""}`}>
              <Link to="/about">
                <Button size="lg" className="font-semibold bg-[#007BFF] w-full sm:w-auto">
                  {t("heroSection.button")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className={`grid grid-cols-3 gap-8 pt-8 border-t ${isRTL ? "text-center" : "text-center"}`}>
              <div>
                <div className="text-3xl font-bold text-[#2194D1] mb-2">
                  {t("heroSection.stats.livesCount")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("heroSection.stats.livesLabel")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2194D1] mb-2">
                  {t("heroSection.stats.groupsCount")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("heroSection.stats.groupsLabel")}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#2194D1] mb-2">
                  {t("heroSection.stats.communitiesCount")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("heroSection.stats.communitiesLabel")}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className={`relative animate-in slide-in-from-right duration-700 delay-300 ${isRTL ? "lg:order-1" : ""}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img 
                src={heroImage}
                alt={t("heroSection.imageAlt")}
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className={`absolute -top-4 bg-[#2194D1] text-white rounded-xl p-3 shadow-card ${isRTL ? "-right-4" : "-left-4"}`}>
              <Heart className="h-6 w-6" />
            </div>
            <div className={`absolute -bottom-4 bg-secondary text-white rounded-xl p-3 shadow-card border ${isRTL ? "-left-4" : "-right-4"}`}>
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
