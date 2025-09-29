import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import { graphql } from "gatsby";
import BlockTitle from "../block-title";
import BlogCard from "./blog-card";
import blogImage1 from "../../assets/images/blog/blog-1-1.jpg";
import blogImage2 from "../../assets/images/blog/blog-1-2.jpg";
import blogImage3 from "../../assets/images/blog/blog-1-3.jpg";
import bgImage from "../../assets/images/blog/blog-top.png";

const BLOG_DATA = [
  {
    image: blogImage1,
    title: "Our donation is hope for poor childrens",
    date: "20 May",
    text: "Lorem ipsum is simply free text used by copytyping refreshing.",
    link: "/news-details",
    commentCount: "2 Comments",
    author: "Admin"
  },
  {
    image: blogImage2,
    title: "Our donation is hope for poor childrens",
    date: "20 May",
    text: "Lorem ipsum is simply free text used by copytyping refreshing.",
    link: "/news-details",
    commentCount: "2 Comments",
    author: "Admin"
  },
  {
    image: blogImage3,
    title: "Our donation is hope for poor childrens",
    date: "20 May",
    text: "Lorem ipsum is simply free text used by copytyping refreshing.",
    link: "/news-details",
    commentCount: "2 Comments",
    author: "Admin"
  }
];
const BlogHomeTwo = () => {
  const { t } = useTranslation('Blog');
  const { language: currentLanguage } = useI18next();

  const blogCarouselOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
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
        slidesPerView: 1,
        spaceBetween: 30
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1199: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };
  return (
    <>
      <section
        className={`news__top news-home pt-120 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`}
        style={{ backgroundImage: `url(${bgImage})` }}
        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      >
        <Container>
          <Row className="align-items-start align-items-md-center flex-column flex-md-row">
            <Col lg={7}>
              <BlockTitle
                title={t('home.title')}
                tagLine={t('home.tagLine')}
              />
            </Col>
            <Col lg={5} className="d-flex">
              <div className="my-auto">
                <p className={`block-text ${currentLanguage === 'ar' ? 'pl-10 text-right' : 'pr-10'} mb-0`}>
                  {t('home.description')}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className={`news-page pb-120 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
          <Swiper {...blogCarouselOptions}>
            {BLOG_DATA.map(
              (
                { image, title, date, text, link, commentCount, author },
                index
              ) => (
                <SwiperSlide key={index}>
                  <BlogCard
                    image={image}
                    title={title}
                    date={date}
                    text={text}
                    link={link}
                    commentCount={commentCount}
                    author={author === "Admin" ? t('card.admin') : author}
                    currentLanguage={currentLanguage}
                  />
                </SwiperSlide>
              )
            )}
          </Swiper>
        </Container>
      </section>
    </>
  );
};

export default BlogHomeTwo;

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
