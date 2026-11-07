import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import { useI18next } from "gatsby-plugin-react-i18next";
import StickyHeader from "../components/header/sticky-header";
import MainSlider from "../components/slider/main-slider";
import VideoCardTwo from "../components/videos/video-card-two";
import ServiceOne from "../components/services/service-one";
import WorldMapImpact from "../components/team/WorldMapImpact";
import CallToActionTwo from "../components/call-to-action/call-to-action-two";
import GalleryTestimonials from "../components/gallery/gallery-testimonials";
import GalleryHome from "../components/gallery/gallery-home";
import BlogHome from "../components/blog/blog-home";
import GoogleMap from "../components/google-map";
import BrandCarousel from "../components/brand-carousel";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import AboutTwo from "../components/about/about-two";
import ServiceTwo from "../components/services/service-two";
import VideoCard from "../components/videos/video-card";
import FactCounter from "../components/fact-counter";
import TrendingProducts from "../components/bookstore/TrendingProducts";
import CausesHome from "../components/causes/featured-events";

const HomeOne = () => {
  const { language } = useI18next();
  return (
    <Layout pageTitle={language === "ar" ? "Hope For All Mena | مضاعفة التلاميذ عبر الشرق الأوسط" : "Hope For All Mena | Multiplying Disciples Across the Middle East"}>
      <HeaderTwo />
      <StickyHeader />
      <MainSlider />
      <VideoCardTwo />
      <AboutTwo />
      <VideoCard />
      <ServiceTwo />
      <ServiceOne />
      <CausesHome />
      <CallToActionTwo />
      <TrendingProducts />
      {/* <DonationOptions /> */}
      <FactCounter />
      <WorldMapImpact />
      <GalleryTestimonials>
        <GalleryHome />
      </GalleryTestimonials>
      {/* <PriceOne /> */}
      <BlogHome />

      <GoogleMap extraClass="home" />
      <BrandCarousel extraClass="client-carousel__has-top-shadow" />
      <Footer />
    </Layout>
  );
};

export default HomeOne;

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
