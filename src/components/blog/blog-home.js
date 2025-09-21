import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";

import BlockTitle from "../block-title";
import BlogCard from "./blog-card";
import blogAPI from "../../services/blogAPI";

import blogImage1 from "../../assets/images/blog/blog-1-1.jpg";
import "../../assets/css/blog-rtl.css";

const BlogHome = () => {
  const { t } = useTranslation();
  const { language: currentLanguage } = useI18next();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getPublishedBlogs({ limit: 6, language: currentLanguage });
        console.log('Blog API response:', response);
        setBlogs(response.blogs || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
        // Fallback to static data if API fails
        setBlogs([
          {
            _id: '1',
            image: blogImage1,
            title: "Our donation is hope for poor childrens",
            publishedAt: new Date().toISOString(),
            excerpt: "Lorem ipsum is simply free text used by copytyping refreshing.",
            slug: "our-donation-hope",
            author: { name: "Admin" }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentLanguage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
    return date.toLocaleDateString(locale, { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const blogCarouselOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: false,
    autoplay: false,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 0
      },
      375: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      575: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };

  if (loading) {
    return (
      <section className={`news-page news-home pt-120 pb-120 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">{t('blog:home.loading')}</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={`news-page news-home pt-120 pb-120 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        <Row className="align-items-start align-items-md-center flex-column flex-md-row mb-60">
          <Col lg={7}>
            <BlockTitle
              title={t('blog:home.title')}
              tagLine={t('blog:home.tagLine')}
            />
          </Col>
          <Col lg={5} className="d-flex">
            <div className="my-auto">
              <p className={`block-text ${currentLanguage === 'ar' ? 'pl-10 text-right' : 'pr-10'} mb-0`}>
                {t('blog:home.description')}
              </p>
            </div>
          </Col>
        </Row>
        {blogs.length > 0 ? (
          <Swiper {...blogCarouselOptions}>
            {blogs.map((blog) => (
              <SwiperSlide key={blog._id}>
                <BlogCard
                  image={blog.image || blogImage1}
                  title={currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title}
                  date={formatDate(blog.publishedAt)}
                  text={currentLanguage === 'ar' && blog.excerptAr ? blog.excerptAr : blog.excerpt}
                  link={`/news-details/${blog.slug}`}
                  commentCount={t('blog:home.comments')}
                  author={blog.author?.name || "Admin"}
                  currentLanguage={currentLanguage}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center">
            <p>{t('blog:home.empty')}</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default BlogHome;

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
