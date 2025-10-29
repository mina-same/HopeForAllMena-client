import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import EventPage from "../components/event/event-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Events = () => {
  return (
    <Layout pageTitle="Events || Hope For All Mena">
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
