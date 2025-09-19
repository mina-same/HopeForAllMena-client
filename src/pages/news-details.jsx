import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import BlogDetails from "../components/blog-details";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import blogAPI from "../services/blogAPI";

const NewsDetails = ({ location, pageContext }) => {
  // Extract slug from URL path
  const slug = location?.pathname?.split('/news-details/')[1]?.replace('/', '') || pageContext?.slug;
  const [blogTitle, setBlogTitle] = useState("News Details");
  
  useEffect(() => {
    const fetchBlogTitle = async () => {
      if (slug) {
        try {
          const blog = await blogAPI.getBlogBySlug(slug);
          setBlogTitle(blog.title || "News Details");
        } catch (error) {
          console.error('Error fetching blog title:', error);
        }
      }
    };
    
    fetchBlogTitle();
  }, [slug]);
  
  return (
    <Layout pageTitle={blogTitle}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={blogTitle} crumbTitle="News" />
      <BlogDetails slug={slug} />
      <Footer />
    </Layout>
  );
};

export default NewsDetails;
