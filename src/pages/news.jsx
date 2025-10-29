import React from "react";
import { graphql } from "gatsby";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import BlogPage from "../components/blog/blog-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const News = () => {
  const { t } = useTranslation("Blog");
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === "ar";

  return (
    <Layout pageTitle={`${t("page.title")} || Hope for All Mena`}>
      <div dir={isRTL ? "rtl" : "ltr"}>
        <HeaderTwo />
        <StickyHeader />
        <PageHeader 
          title={t("page.header")} 
          crumbTitle={t("page.crumb")} 
        />
        <BlogPage />
        <Footer />
      </div>
    </Layout>
  );
};

export default News;

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
