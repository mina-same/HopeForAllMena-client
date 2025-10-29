import React from "react";
import { Link, useI18next } from "gatsby-plugin-react-i18next";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const MinistryCard = ({
  icon: Icon,
  title,
  description,
  features,
  buttonText,
  buttonVariant = "default",
  link,
  className = ""
}) => {
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <Card className={`group hover:shadow-hover transition-all duration-300 bg-card border ${className}`}>
      <CardContent className={`p-8 space-y-6 ${isRTL ? "text-right" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
        {/* Icon */}
        <div className="relative">
          <div className="h-16 w-16 bg-[#2194D1] text-white rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-card">
            <Icon className="h-8 w-8" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
              <div className="h-2 w-2 bg-[#2194D1] rounded-full flex-shrink-0"></div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        {link ? (
          <Link to={link}>
            <Button 
              variant={buttonVariant}
              className="w-full font-semibold"
            >
              {buttonText}
            </Button>
          </Link>
        ) : (
          <Button 
            variant={buttonVariant}
            className="w-full font-semibold"
          >
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MinistryCard;
