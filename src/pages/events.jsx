import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import EventPage from "../components/event/event-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Events = () => {
  const { t } = useTranslation();
  const { language } = useI18next();
  return (
    <Layout pageTitle={language === "ar" ? `${t('navigation.events', { ns: 'common' })} || Hope For All Mena` : "Events || Hope For All Mena"}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Events" crumbTitle="Events" />
      <EventPage />
      <Footer />
    </Layout>
  );
};

export default Events;

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
