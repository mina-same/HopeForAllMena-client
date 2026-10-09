import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import CausesPage from "../components/causes/causes-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Causes = () => {
  return (
    <Layout pageTitle="Causes Page || Hope for All Mena || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Causes Page" crumbTitle="Causes" />
      <CausesPage />
      <Footer />
    </Layout>
  );
};

export default Causes;

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
