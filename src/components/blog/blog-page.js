import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert, Button } from "react-bootstrap";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useLocation } from "@reach/router";

import PostPaginations from "../post-paginations";
import BlogCard from "./blog-card";
import blogAPI from "../../services/blogAPI";

// Fallback images
import blogImage1 from "../../assets/images/blog/blog-1-1.jpg";
import blogImage2 from "../../assets/images/blog/blog-1-2.jpg";
import blogImage3 from "../../assets/images/blog/blog-1-3.jpg";
import blogImage4 from "../../assets/images/blog/blog-1-4.jpg";
import blogImage5 from "../../assets/images/blog/blog-1-5.jpg";
import blogImage6 from "../../assets/images/blog/blog-1-6.jpg";

// Fallback blog data
const FALLBACK_BLOG_DATA = [
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
  },
  {
    image: blogImage4,
    title: "Our donation is hope for poor childrens",
    date: "20 May",
    text: "Lorem ipsum is simply free text used by copytyping refreshing.",
    link: "/news-details",
    commentCount: "2 Comments",
    author: "Admin"
  },
  {
    image: blogImage5,
    title: "Our donation is hope for poor childrens",
    date: "20 May",
    text: "Lorem ipsum is simply free text used by copytyping refreshing.",
    link: "/news-details",
    commentCount: "2 Comments",
    author: "Admin"
  },
  {
    image: blogImage6,
    title: "Our donation is hope for poor childrens",
    date: "20 May",
    text: "Lorem ipsum is simply free text used by copytyping refreshing.",
    link: "/news-details",
    commentCount: "2 Comments",
    author: "Admin"
  }
];

const BlogPage = () => {
  const { t } = useTranslation('Blog');
  const { language: currentLanguage } = useI18next();
  const location = useLocation();
  
  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get category from URL params
  const urlParams = new URLSearchParams(location.search);
  const urlCategory = urlParams.get('category') || 'all';
  
  // Fallback images array
  const fallbackImages = [blogImage1, blogImage2, blogImage3, blogImage4, blogImage5, blogImage6];

  // Fetch blogs from API
  const fetchBlogs = useCallback(async (page = 1, categoryFilter = 'all', search = '') => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: 6,
        status: 'published',
        language: currentLanguage
      };

      // Add category filter
      if (categoryFilter && categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      // Add search term
      if (search) {
        params.search = search;
      }

      const response = await blogAPI.getPublishedBlogs(params);
      
      if (response.status === 'success') {
        const transformedBlogs = response.data.blogs.map((blog, index) => ({
          id: blog._id,
          image: blog.image || fallbackImages[index % fallbackImages.length],
          title: currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title,
          date: new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US', {
            day: 'numeric',
            month: 'long'
          }),
          text: currentLanguage === 'ar' && blog.excerptAr ? blog.excerptAr : blog.excerpt,
          link: `/news-details/${blog.slug}`,
          commentCount: `${blog.commentsCount || 0} ${t('card.comments')}`,
          author: blog.author?.name || t('card.admin'),
          category: blog.category,
          slug: blog.slug,
          featured: blog.featured
        }));

        setBlogs(transformedBlogs);
        setTotalPages(response.data.pagination.totalPages);
        setTotalBlogs(response.data.pagination.totalBlogs);
        setCurrentPage(page);
      } else {
        throw new Error(response.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.message || 'Failed to load blogs');
      // Use fallback data on error
      setBlogs(FALLBACK_BLOG_DATA);
      setTotalPages(1);
      setTotalBlogs(FALLBACK_BLOG_DATA.length);
    } finally {
      setLoading(false);
    }
  }, [currentLanguage, t]);

  // Load blogs on component mount and when dependencies change
  useEffect(() => {
    setCategory(urlCategory);
    fetchBlogs(1, urlCategory, searchTerm);
  }, [fetchBlogs, urlCategory, searchTerm]);

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchBlogs(page, category, searchTerm);
    // Scroll to top of blog section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category change
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
    fetchBlogs(1, newCategory, searchTerm);
  };

  // Handle search
  const handleSearch = (search) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchBlogs(1, category, search);
  };

  // Retry function
  const retryFetch = () => {
    fetchBlogs(currentPage, category, searchTerm);
  };

  return (
    <section className={`news-page pt-120 pb-120 ${currentLanguage === 'ar' ? 'rtl-layout' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Container>
        {/* Category Filter */}
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {['all', 'stories', 'news', 'events', 'updates', 'announcements'].map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => handleCategoryChange(cat)}
                className="text-capitalize"
                style={{
                  transition: 'all 0.3s ease',
                  transform: category === cat ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {t(`categories.${cat}`) || cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-center">
            <div className="position-relative" style={{ maxWidth: '400px', width: '100%' }}>
              <input
                type="text"
                className="form-control"
                placeholder={t('search.placeholder') || 'Search blogs...'}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  paddingRight: '40px',
                  transition: 'all 0.3s ease'
                }}
              />
              <i className="fa fa-search position-absolute" style={{
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#666'
              }}></i>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">{t('loading.blogs') || 'Loading blogs...'}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Alert variant="danger" className="text-center">
            <Alert.Heading>{t('error.title') || 'Error Loading Blogs'}</Alert.Heading>
            <p>{error}</p>
            <Button variant="outline-danger" onClick={retryFetch}>
              {t('error.retry') || 'Try Again'}
            </Button>
          </Alert>
        )}

        {/* Blog Grid */}
        {!loading && !error && (
          <div 
            className="news-3-col"
            style={{
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            {blogs.map((blog, index) => (
              <div
                key={blog.id || index}
                style={{
                  animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
                  transform: 'translateY(20px)',
                  opacity: 0
                }}
                className="blog-card-wrapper"
              >
                <BlogCard
                  image={blog.image}
                  title={blog.title}
                  date={blog.date}
                  text={blog.text}
                  link={blog.link}
                  commentCount={blog.commentCount}
                  author={blog.author}
                  currentLanguage={currentLanguage}
                />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-5">
            <i className="fa fa-newspaper-o fa-3x text-muted mb-3"></i>
            <h4>{t('noResults.title') || 'No Blogs Found'}</h4>
            <p className="text-muted">{t('noResults.message') || 'Try adjusting your search or filter criteria.'}</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-5">
            <PostPaginations 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && blogs.length > 0 && (
          <div className="text-center mt-4">
            <p className="text-muted">
              {t('results.summary', { 
                count: totalBlogs,
                page: currentPage,
                totalPages 
              }) || `Showing ${totalBlogs} blogs`}
            </p>
          </div>
        )}
      </Container>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .blog-card-wrapper {
          animation-fill-mode: both;
        }
        
        .news-3-col {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }
        
        @media (max-width: 768px) {
          .news-3-col {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .form-control:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
          transform: scale(1.02);
        }
      `}</style>
    </section>
  );
};

export default BlogPage;

