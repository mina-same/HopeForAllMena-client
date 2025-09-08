import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import AboutOne from "../components/about/about-one";
import AboutCounter from "../components/about/about-counter";
import TeamHome from "../components/team/team-home";
import VideoCard from "../components/videos/video-card";
import TestimonialsOne from "../components/testimonials/testimonials-one";
import BrandCarousel from "../components/brand-carousel";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import VisionMission from "../components/vision-mission/vision-mission";


const About = () => {
  return (
    <Layout pageTitle="About Page || Azino || Charity React Next Template">
      <HeaderTwo />
      <PageHeader title="About Page" crumbTitle="About" />
      <StickyHeader />
      <AboutOne />
      <VisionMission/>
      <BrandCarousel extraClass="client-carousel__has-border-top" />
      <AboutCounter />
      <TeamHome />
      <VideoCard />
      <TestimonialsOne />
      <Footer />
    </Layout>
  );
};

export default About;
