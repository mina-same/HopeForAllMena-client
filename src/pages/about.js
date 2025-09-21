import React from "react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import AboutOne from "../components/about/about-one";
import AboutCounter from "../components/about/about-counter";
import WorldMapImpact from "../components/team/WorldMapImpact";
import VideoCard from "../components/videos/video-card";
import BrandCarousel from "../components/brand-carousel";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import VisionMission from "../components/vision-mission/vision-mission";
import ServiceTwo from "../components/services/service-two";
import ServiceOne from "../components/services/service-one";
import FactCounter from "../components/fact-counter";


const About = () => {
  const { t } = useTranslation('About');

  return (
    <Layout pageTitle={`${t('pageTitle')} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <PageHeader title={t('pageTitle')} crumbTitle={t('crumbTitle')} />
      <StickyHeader />
      <AboutOne />
      <VisionMission />
      <VideoCard />
      <ServiceTwo />
      <ServiceOne />
      <AboutCounter />
      <FactCounter />
      <WorldMapImpact />
      <BrandCarousel extraClass="client-carousel__has-border-top" />
      <Footer />
    </Layout>
  );
};

export default About;

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
