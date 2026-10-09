import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import VolunteerForm from "../components/team/volunteer-form";
import BrandCarousel from "../components/brand-carousel";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const BecomeVolunteer = () => {
  return (
    <Layout pageTitle="Become a Volunteer || Hope for All Mena || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="Become a Volunteer" crumbTitle="Become Volunteer" />
      <VolunteerForm />
      <BrandCarousel extraClass="client-carousel__has-border-top" />
      <Footer />
    </Layout>
  );
};

export default BecomeVolunteer;

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
