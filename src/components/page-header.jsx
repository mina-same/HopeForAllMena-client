import React from "react";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import pageHeaderBg from "../assets/images/backgrounds/page-header-1-1.jpg";

// titleAs="h2" on pages that already have their own <h1> (one H1 per page for SEO)
const PageHeader = ({ title, crumbTitle, image, titleAs: Title = "h1" }) => {
  const { t } = useTranslation("common");

  return (
    <section className="page-header">
      <div
        className="page-header__bg"
        style={{ backgroundImage: `url(${image || pageHeaderBg})` }}
      ></div>

      <div className="container">
        <Title>{title}</Title>
        <ul className="thm-breadcrumb list-unstyled ">
          <li>
            <Link to="/">{t("navigation.home")}</Link>
          </li>
          <li>-</li>
          <li>
            <span>{crumbTitle}</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default PageHeader;
