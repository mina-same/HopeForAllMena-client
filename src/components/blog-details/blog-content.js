import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import blogDetailsImage from "../../assets/images/blog/blog-d-1-1.jpg";
import blogAPI from "../../services/blogAPI";

const BlogContent = ({ blog }) => {
  const [adjacentBlogs, setAdjacentBlogs] = useState({ previous: null, next: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdjacentBlogs = async () => {
      if (!blog || !blog.slug) return;
      
      try {
        setLoading(true);
        const adjacent = await blogAPI.getAdjacentBlogs(blog.slug);
        setAdjacentBlogs(adjacent);
      } catch (error) {
        console.error('Failed to fetch adjacent blogs:', error);
        setAdjacentBlogs({ previous: null, next: null });
      } finally {
        setLoading(false);
      }
    };

    fetchAdjacentBlogs();
  }, [blog?.slug]);

  if (!blog) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const formatContent = (content) => {
    // Render HTML content directly
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div>
      <div className="blog-card__image">
        <img src={blog.image || blogDetailsImage} alt={blog.title} />
        <div className="blog-card__date">
          {formatDate(blog.publishedAt || blog.createdAt)}
        </div>
      </div>
      <div className="blog-card__meta d-flex justify-content-start mt-0 mb-0">
        <a href="#none">
          <i className="far fa-user-circle"></i> {blog.author?.name || 'Admin'}
        </a>
        <a href="#none">
          <i className="far fa-eye"></i> {blog.views || 0} Views
        </a>
      </div>
      <h3>{blog.title}</h3>
      
      {/* Render blog content */}
      <div className="blog-content">
        {blog.content ? formatContent(blog.content) : (
          <p>{blog.excerpt}</p>
        )}
      </div>

      <div className="blog-details__meta">
        {blog.tags && blog.tags.length > 0 && (
          <ul className="list-unstyled blog-details__category">
            <li>
              <span>Tags:</span>
            </li>
            {blog.tags.map((tag, index) => (
              <li key={index}>
                <a href="#none">{tag}</a>
              </li>
            ))}
          </ul>
        )}
        
        <ul className="list-unstyled blog-details__category">
          <li>
            <span>Category:</span>
          </li>
          <li>
            <a href="#none">{blog.category}</a>
          </li>
        </ul>
      </div>
      
      <div className="blog-navigations">
        {adjacentBlogs.previous ? (
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate(`/blog/${adjacentBlogs.previous.slug}`);
            }}
            className="nav-link previous"
            title={adjacentBlogs.previous.title}
          >
            <i className="fas fa-arrow-left"></i> Previous Article
          </a>
        ) : (
          <span className="nav-link disabled">
            <i className="fas fa-arrow-left"></i> Previous Article
          </span>
        )}
        
        {adjacentBlogs.next ? (
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate(`/blog/${adjacentBlogs.next.slug}`);
            }}
            className="nav-link next"
            title={adjacentBlogs.next.title}
          >
            Next Article <i className="fas fa-arrow-right"></i>
          </a>
        ) : (
          <span className="nav-link disabled">
            Next Article <i className="fas fa-arrow-right"></i>
          </span>
        )}
      </div>
    </div>
  );
};

export default BlogContent;
