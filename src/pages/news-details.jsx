import React, { useState, useEffect } from "react";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import BlogDetails from "../components/blog-details";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import blogAPI from "../services/blogAPI";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";

const NewsDetails = ({ location, pageContext }) => {
  const { t } = useTranslation();
  const { language: currentLanguage } = useI18next();
  // Extract slug from URL path
  const slug = location?.pathname?.split('/news-details/')[1]?.replace('/', '') || pageContext?.slug;
  const [blogTitle, setBlogTitle] = useState(t('blog:details.loading'));
  
  useEffect(() => {
    const fetchBlogTitle = async () => {
      if (slug) {
        try {
          const blog = await blogAPI.getBlogBySlug(slug);
          const title = currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title;
          setBlogTitle(title || t('blog:details.loading'));
        } catch (error) {
          console.error('Error fetching blog title:', error);
          setBlogTitle(t('blog:details.notFound'));
        }
      }
    };
    
    fetchBlogTitle();
  }, [slug, currentLanguage, t]);
  
  return (
    <Layout pageTitle={blogTitle}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={blogTitle} crumbTitle={t('blog:home.tagLine')} />
      <BlogDetails slug={slug} />
      <Footer />
    </Layout>
  );
};

export default NewsDetails;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
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
