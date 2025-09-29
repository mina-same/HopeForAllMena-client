import React, { useState, useEffect } from "react";
import { navigate, Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import blogDetailsImage from "../../assets/images/blog/blog-d-1-1.jpg";
import blogAPI from "../../services/blogAPI";
import "../../assets/css/blog-rtl.css";

const BlogContent = ({ blog, currentLanguage }) => {
  const { t } = useTranslation('Blog');
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
    
    if (currentLanguage === 'ar') {
      // Arabic month names (Gregorian calendar)
      const arabicMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      
      const day = date.getDate();
      const month = arabicMonths[date.getMonth()];
      return `${day} ${month}`;
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const formatContent = (content) => {
    // Render HTML content directly
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  return (
    <div className={currentLanguage === 'ar' ? 'rtl-content' : ''} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="blog-card__image">
        <img src={blog.image || blogDetailsImage} alt={currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title} />
        <div className="blog-card__date">
          {formatDate(blog.publishedAt || blog.createdAt)}
        </div>
      </div>
      <div className={`blog-card__meta d-flex ${currentLanguage === 'ar' ? 'justify-content-end flex-row-reverse' : 'justify-content-start'} mt-0 mb-0`}>
        <span className={currentLanguage === 'ar' ? 'text-right' : ''}>
          <i className="far fa-user-circle"></i> {blog.author?.name || t('card.admin')}
        </span>
        <span className={currentLanguage === 'ar' ? 'text-right' : ''}>
          <i className="far fa-eye"></i> {blog.views || 0} {currentLanguage === 'ar' ? 'مشاهدة' : 'Views'}
        </span>
      </div>
      <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
        {currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title}
      </h3>

      {/* Render blog content */}
      <div className={`blog-content ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
        {blog.content ? formatContent(
          currentLanguage === 'ar' && blog.contentAr ? blog.contentAr : blog.content
        ) : (
          <p>{currentLanguage === 'ar' && blog.excerptAr ? blog.excerptAr : blog.excerpt}</p>
        )}
      </div>

      <div className="blog-details__meta">
        {((currentLanguage === 'ar' && blog.tagsAr && blog.tagsAr.length > 0) || (blog.tags && blog.tags.length > 0)) && (
          <ul className={`list-unstyled blog-details__category ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
            <li>
              <span>{t('details.tags')}:</span>
            </li>
            {(currentLanguage === 'ar' && blog.tagsAr ? blog.tagsAr : blog.tags || []).map((tag, index) => (
              <li key={index}>
                <span>{tag}</span>
              </li>
            ))}
          </ul>
        )}

        <ul className={`list-unstyled blog-details__category ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
          <li>
            <span>{t('details.category')}:</span>
          </li>
          <li>
            <span>{t(`categories.${blog.category}`)}</span>
          </li>
        </ul>
      </div>

      <div className={`blog-navigations ${currentLanguage === 'ar' ? 'rtl-nav' : ''}`}>
        {adjacentBlogs.previous ? (
          <Link
            to={`/news-details/${adjacentBlogs.previous.slug}`}
            className="nav-link previous"
            title={adjacentBlogs.previous.title}
          >
            {currentLanguage === 'ar' ? (
              <>{t('navigation.previous')} <i className="fas fa-arrow-right"></i></>
            ) : (
              <><i className="fas fa-arrow-left"></i> {t('navigation.previous')}</>
            )}
          </Link>
        ) : (
          <span className="nav-link disabled">
            {currentLanguage === 'ar' ? (
              <>{t('navigation.previous')} <i className="fas fa-arrow-right"></i></>
            ) : (
              <><i className="fas fa-arrow-left"></i> {t('navigation.previous')}</>
            )}
          </span>
        )}

        {adjacentBlogs.next ? (
          <Link
            to={`/news-details/${adjacentBlogs.next.slug}`}
            className="nav-link next"
            title={adjacentBlogs.next.title}
          >
            {currentLanguage === 'ar' ? (
              <><i className="fas fa-arrow-left"></i> {t('navigation.next')}</>
            ) : (
              <>{t('navigation.next')} <i className="fas fa-arrow-right"></i></>
            )}
          </Link>
        ) : (
          <span className="nav-link disabled">
            {currentLanguage === 'ar' ? (
              <><i className="fas fa-arrow-left"></i> {t('navigation.next')}</>
            ) : (
              <>{t('navigation.next')} <i className="fas fa-arrow-right"></i></>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default BlogContent;
