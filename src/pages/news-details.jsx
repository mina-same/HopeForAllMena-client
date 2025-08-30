import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import BlogDetails from "../components/blog-details";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const NewsDetails = () => {
  return (
    <Layout pageTitle="News Details || Azino || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="News Details" crumbTitle="News" />
      <BlogDetails />
      <Footer />
    </Layout>
  );
};

export default NewsDetails;
