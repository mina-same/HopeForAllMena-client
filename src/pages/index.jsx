import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import MainSlider from "../components/slider/main-slider";
import VideoCardTwo from "../components/videos/video-card-two";
import ServiceOne from "../components/services/service-one";
import TeamHome from "../components/team/team-home";
import CallToActionTwo from "../components/call-to-action/call-to-action-two";
import GalleryTestimonials from "../components/gallery/gallery-testimonials";
import GalleryHome from "../components/gallery/gallery-home";
import TestimonialsTwo from "../components/testimonials/testimonials-two";
import BlogHome from "../components/blog/blog-home";
import CallToAction from "../components/call-to-action/call-to-action";
import GoogleMap from "../components/google-map";
import BrandCarousel from "../components/brand-carousel";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import AboutTwo from "../components/about/about-two";
import ServiceTwo from "../components/services/service-two";
import VideoCard from "../components/videos/video-card";
import FactCounter from "../components/fact-counter";
import PriceOne from "../components/price-one";

const HomeOne = () => {
  return (
    <Layout pageTitle="Home One || Azino || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <MainSlider />
      <VideoCardTwo />
      <AboutTwo />
      <VideoCard />
      <ServiceTwo />
      <ServiceOne />
      {/* <AboutCounter /> */}
      {/* <CausesHome /> */}
      <CallToActionTwo />
      {/* <DonationOptions /> */}
      <TeamHome />
      <FactCounter />
      <PriceOne />
      <GalleryTestimonials>
        <GalleryHome />
        <TestimonialsTwo />
      </GalleryTestimonials>
      <BlogHome />
      <CallToAction />
      <GoogleMap extraClass="home" />
      <BrandCarousel extraClass="client-carousel__has-top-shadow" />
      <Footer />
    </Layout>
  );
};

export default HomeOne;
