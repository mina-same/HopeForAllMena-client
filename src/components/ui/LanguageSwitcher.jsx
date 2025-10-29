import React from "react";
import { useI18next, useTranslation } from "gatsby-plugin-react-i18next";
import flag1 from "../../assets/images/resources/flag-1-1.jpg";
import flagAr from "../../assets/images/resources/flag-1-2.jpg";

const LanguageSwitcher = ({ variant = "default", className = "" }) => {
  const { t } = useTranslation();
  const { languages, originalPath, i18n } = useI18next();

  // Get current language with fallback
  const currentLanguage = i18n?.resolvedLanguage || i18n?.language || 'en';
  
  // Determine which flag to show
  const flagSrc = currentLanguage === 'ar' ? flagAr : flag1;
  const flagAlt = currentLanguage === 'ar' ? 'Arabic Flag' : 'English Flag';

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    const currentPath = originalPath || '/';

    // Navigate to the same page in the new language
    if (typeof window !== 'undefined') {
      const queryString = window.location.search; // Preserve query parameters
      const newPath = newLanguage === 'en'
        ? currentPath === '/' ? '/' : currentPath
        : `/${newLanguage}${currentPath === '/' ? '' : currentPath}`;

      window.location.href = newPath + queryString;
    }
  };

  // Admin variant with more compact styling
  if (variant === "admin") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <img
          src={flagSrc}
          alt={flagAlt}
          className="w-5 h-5 rounded-full"
        />
        <label htmlFor="language-switcher-admin" className="sr-only">
          select language
        </label>
        <select
          id="language-switcher-admin"
          value={currentLanguage}
          onChange={handleLanguageChange}
          className="bg-transparent border-none outline-none text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <option value="en">EN</option>
          <option value="ar">AR</option>
        </select>
      </div>
    );
  }

  // Default variant (original nav-links style)
  return (
    <div className={`language-switcher__inner flex items-center ${className}`}>
      <img
        src={flagSrc}
        alt={flagAlt}
        style={{ borderRadius: "50%", margin: "7px", width: "24px", height: "24px" }}
      />
      <label htmlFor="language-switcher-nav" className="sr-only">
        select language
      </label>
      <select
        className="selectpicker"
        id="language-switcher-nav"
        value={currentLanguage}
        onChange={handleLanguageChange}
        style={{
          appearance: "none",
          border: "none",
          outline: "none",
          color: "#7e7e7e",
          backgroundColor: "transparent",
          fontSize: "14px",
          width: "50px"
        }}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
      <i className="fa fa-angle-down" style={{ marginLeft: "5px" }}></i>
    </div>
  );
};

export default LanguageSwitcher;