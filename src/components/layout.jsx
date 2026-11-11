import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useI18next } from "gatsby-plugin-react-i18next";
import MobileNav from "./mobile-nav";
import SearchPopup from "./search-popup";

import AppleTouch from "../assets/images/favicons/apple-touch-icon.png";

import "../assets/css/tailwind.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-modal-video/css/modal-video.min.css";
import "../assets/css/animate.min.css";
import "../assets/css/azino-icons.css";
import "../assets/css/fontawesome-all.min.css";
import "../assets/css/main.css";
import "../assets/css/vision-mission.css";
import "../styles/rtl.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

const SITE_URL = "https://www.hopeforallmena.com";
// Served from /static as a real file (an imported image can be inlined as base64, breaking og:image)
const LOGO_URL = `${SITE_URL}/logo.png`;
const SITE_NAME = "Hope For All Mena"; // same as siteMetadata.title
const DEFAULT_DESCRIPTION = {
  // Taken verbatim from locales/*/About.json → visionMission.header.description
  en: "Empowering church leaders across the Middle East and North Africa to transform communities through intentional discipleship",
  ar: "تمكين قادة الكنائس في الشرق الأوسط وشمال أفريقيا لتحويل المجتمعات من خلال التلمذة المقصودة",
};

const Layout = ({ pageTitle, description, image, noindex = false, children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { i18n, language = "en", languages = ["en", "ar"], originalPath = "/", defaultLanguage = "en" } = useI18next();
  const localizedUrl = (lng) =>
    `${SITE_URL}${lng === defaultLanguage ? "" : `/${lng}`}${originalPath}`;
  const canonicalUrl = localizedUrl(language);
  const metaDescription = description || DEFAULT_DESCRIPTION[language] || DEFAULT_DESCRIPTION.en;
  const ogImage = !image || image.startsWith("data:") ? LOGO_URL : image.startsWith("http") ? image : `${SITE_URL}${image}`;
  const fullTitle = pageTitle || SITE_NAME;
  const handleRadius = () => {
    const dynamicRadius = document.querySelectorAll(".dynamic-radius");
    dynamicRadius.forEach(function (btn) {
      let btnHeight = btn.offsetHeight;
      btn.style.borderBottomLeftRadius = btnHeight / 2 + "px";
      btn.style.borderTopLeftRadius = btnHeight / 2 + "px";
    });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleRadius();
      setHasMounted(true);
      
      // Set HTML direction based on language
      const htmlElement = document.documentElement;
      if (i18n?.resolvedLanguage === 'ar') {
        htmlElement.setAttribute('dir', 'rtl');
        htmlElement.setAttribute('lang', 'ar');
      } else {
        htmlElement.setAttribute('dir', 'ltr');
        htmlElement.setAttribute('lang', 'en');
      }
      
      return () => {
        handleRadius();
      };
    }
  }, [hasMounted, i18n?.resolvedLanguage]);

  return (
    <div>
      <Helmet htmlAttributes={{ lang: language, dir: language === "ar" ? "rtl" : "ltr" }}>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{fullTitle}</title>
        <meta name="description" content={metaDescription} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        <link rel="canonical" href={canonicalUrl} />
        {languages.map((lng) => (
          <link key={lng} rel="alternate" hrefLang={lng} href={localizedUrl(lng)} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={localizedUrl(defaultLanguage)} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:locale" content={language === "ar" ? "ar_EG" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
        {/* Structured data for search + answer engines (Google, AI Overviews, ChatGPT, Perplexity).
            All values come from the existing footer / locale content. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "NGO",
                "@id": `${SITE_URL}/#organization`,
                name: SITE_NAME,
                alternateName: "الرجاء للجميع الشرق الأوسط",
                url: SITE_URL,
                logo: LOGO_URL,
                slogan: "Connecting, Equipment and Multiplying",
                description: DEFAULT_DESCRIPTION.en,
                email: "hope4allmena@gmail.com",
                areaServed: "Middle East and North Africa",
                address: [
                  { "@type": "PostalAddress", streetAddress: "37 Sidi El-Metwally Street, Attarin", addressLocality: "Alexandria", addressCountry: "EG" },
                  { "@type": "PostalAddress", streetAddress: "11 El-Masoud Street, off Abbasiya Street", addressLocality: "Cairo", addressCountry: "EG" },
                ],
                contactPoint: [
                  { "@type": "ContactPoint", telephone: "+20 155 510 3774", contactType: "customer support", areaServed: "EG", availableLanguage: ["English", "Arabic"], name: "Alexandria Office" },
                  { "@type": "ContactPoint", telephone: "+20 128 141 6629", contactType: "customer support", areaServed: "EG", availableLanguage: ["English", "Arabic"], name: "Cairo Office" },
                ],
                sameAs: [
                  "https://www.facebook.com/profile.php?id=61556019641884",
                  "https://www.facebook.com/profile.php?id=100083974131611",
                  "https://www.facebook.com/profile.php?id=100054468594764",
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: SITE_URL,
                name: SITE_NAME,
                inLanguage: ["en", "ar"],
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
              {
                "@type": "WebPage",
                "@id": `${canonicalUrl}#webpage`,
                url: canonicalUrl,
                name: fullTitle,
                description: metaDescription,
                inLanguage: language,
                isPartOf: { "@id": `${SITE_URL}/#website` },
                about: { "@id": `${SITE_URL}/#organization` },
              },
              ...(originalPath !== "/"
                ? [{
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      { "@type": "ListItem", position: 1, name: SITE_NAME, item: localizedUrl(language).replace(originalPath, "/") },
                      { "@type": "ListItem", position: 2, name: fullTitle.split(/\s*(\|\||–|-)\s*/)[0], item: canonicalUrl },
                    ],
                  }]
                : []),
            ],
          })}
        </script>
        <link rel="apple-touch-icon" sizes="180x180" href={AppleTouch} />
        {/* Real files (not inlined data: URIs) in sizes Google accepts (multiples of 48px) */}
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="page-wrapper" id="wrapper">
        {children}
      </div>
      <MobileNav />
      <SearchPopup />
    </div>
  );
};

export default Layout;
