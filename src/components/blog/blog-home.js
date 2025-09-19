import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";

import BlockTitle from "../block-title";
import BlogCard from "./blog-card";
import blogAPI from "../../services/blogAPI";

import blogImage1 from "../../assets/images/blog/blog-1-1.jpg";

const BlogHome = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getPublishedBlogs({ limit: 6 });
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
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
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
      <section className="news-page news-home pt-120 pb-120">
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="news-page news-home pt-120 pb-120">
      <Container>
        <Row className="align-items-start align-items-md-center flex-column flex-md-row mb-60">
          <Col lg={7}>
            <BlockTitle
              title={`Latest news & articles \n directly from the blog.`}
              tagLine="Blog Posts"
            />
          </Col>
          <Col lg={5} className="d-flex">
            <div className="my-auto">
              <p className="block-text pr-10 mb-0">
                Stay updated with our latest news, stories, and insights from 
                Hope For All MENA. Discover inspiring content about our mission 
                and impact in the region.
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
                  title={blog.title}
                  date={formatDate(blog.publishedAt)}
                  text={blog.excerpt}
                  link={`/news-details/${blog.slug}`}
                  commentCount="Comments"
                  author={blog.author?.name || "Admin"}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center">
            <p>No blog posts available at the moment.</p>
          </div>
        )}
      </Container>
    </section>
  );
};

export default BlogHome;
