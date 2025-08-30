import React from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import BlogPage from "../components/blog/blog-page";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";

const News = () => {
  return (
    <Layout pageTitle="News Page || Azino || Charity React Next Template">
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title="News Page" crumbTitle="News" />
      <BlogPage />
      <Footer />
    </Layout>
  );
};

export default News;
