import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import GoogleMap from "../components/google-map";
import ContactFormOne from "../components/contact/contact-form-one";
import ContactCardCarousel from "../components/contact/contact-card-carousel";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const Contact = () => {
  const { t } = useTranslation('Contact');

  return (
    <Layout pageTitle={`${t('pageTitle')} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t('pageTitle')} crumbTitle={t('crumbTitle')} />
      <ContactFormOne />
      <ContactCardCarousel />
      <GoogleMap extraClass="contact" />
      <Footer />
    </Layout>
  );
};

export default Contact;

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
