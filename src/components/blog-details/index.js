import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BlogContent from "./blog-content";
import Comments from "./comments";
import CommentForm from "./comment-form";
import BlogSidebar from "./blog-sidebar";
import blogAPI from "../../services/blogAPI";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";

const BlogDetails = ({ slug }) => {
  const { t } = useTranslation('Blog');
  const { language: currentLanguage } = useI18next();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        // First fetch the blog data
        const blogData = await blogAPI.getBlogBySlug(slug);
        setBlog(blogData);
        
        // Then fetch comments using the blog ID
        if (blogData && blogData._id) {
          try {
            const commentsData = await blogAPI.getBlogComments(blogData._id, { limit: 20 });
            setComments(commentsData.comments || []);
          } catch (commentErr) {
            console.warn('Failed to fetch comments:', commentErr);
            setComments([]);
          }
        }
      } catch (err) {
        console.error('Error fetching blog data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug, currentLanguage]);

  const handleNewComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  if (loading) {
    return (
      <section className={`blog-details pt-120 pb-40 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">{t('details.loading')}</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className={`blog-details pt-120 pb-40 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <Container>
          <div className="text-center">
            <h3>{t('details.notFound')}</h3>
            <p>{t('details.notFoundMessage')}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className={`blog-details pt-120 pb-40 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        <Row>
          <Col md={12} lg={8}>
            <BlogContent blog={blog} currentLanguage={currentLanguage} />
            <Comments comments={comments} blogId={blog._id} currentLanguage={currentLanguage} />
            <CommentForm blogId={blog._id} onCommentAdded={handleNewComment} currentLanguage={currentLanguage} />
          </Col>
          <Col md={12} lg={4}>
            <BlogSidebar currentLanguage={currentLanguage} />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BlogDetails;
