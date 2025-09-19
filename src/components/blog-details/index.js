import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BlogContent from "./blog-content";
import Comments from "./comments";
import CommentForm from "./comment-form";
import BlogSidebar from "./blog-sidebar";
import blogAPI from "../../services/blogAPI";

const BlogDetails = ({ slug }) => {
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
  }, [slug]);

  const handleNewComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  if (loading) {
    return (
      <section className="blog-details pt-120 pb-40">
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

  if (error || !blog) {
    return (
      <section className="blog-details pt-120 pb-40">
        <Container>
          <div className="text-center">
            <h3>Blog post not found</h3>
            <p>The blog post you're looking for doesn't exist or has been removed.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="blog-details pt-120 pb-40">
      <Container>
        <Row>
          <Col md={12} lg={8}>
            <BlogContent blog={blog} />
            <Comments comments={comments} blogId={blog._id} />
            <CommentForm blogId={blog._id} onCommentAdded={handleNewComment} />
          </Col>
          <Col md={12} lg={4}>
            <BlogSidebar />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BlogDetails;
