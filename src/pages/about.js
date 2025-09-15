import React from "react";
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
  return (
    <Layout pageTitle="About Page || Azino || Charity React Next Template">
      <HeaderTwo />
      <PageHeader title="About Page" crumbTitle="About" />
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
