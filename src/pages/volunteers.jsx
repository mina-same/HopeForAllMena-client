import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import TeamPage from "../components/team/team-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Volunteers = () => {
  return (
    <Layout pageTitle="Our Volunteers || Hope for All Mena || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Our Volunteers" crumbTitle="Our Volunteers" />
      <TeamPage />
      <Footer />
    </Layout>
  );
};

export default Volunteers;

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
