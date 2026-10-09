import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import CauseContent from "../components/causes/cause-content";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const CauseDetails = () => {
  return (
    <Layout pageTitle="Cause Details || Hope for All Mena || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Cause Details" crumbTitle="Cause Details" />
      <CauseContent />
      <Footer />
    </Layout>
  );
};

export default CauseDetails;

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
