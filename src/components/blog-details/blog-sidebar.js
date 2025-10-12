import React, { useState, useEffect, useCallback } from "react";
import { Link } from "gatsby-plugin-react-i18next";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import blogAPI from "../../services/blogAPI";
import postImage1 from "../../assets/images/blog/blog-s-1.jpg";
import postImage2 from "../../assets/images/blog/blog-s-2.jpg";
import postImage3 from "../../assets/images/blog/blog-s-3.jpg";
import "./blog-sidebar-rtl.css";

// Default fallback posts - moved outside component to avoid dependency issues
const defaultPosts = [
  {
    _id: 'default-1',
    title: 'Our donation is hope for poor childrens',
    titleAr: 'تبرعنا أمل للأطفال الفقراء',
    slug: 'our-donation-hope',
    image: postImage1
  },
  {
    _id: 'default-2', 
    title: 'Promoting The Rights of Children',
    titleAr: 'تعزيز حقوق الأطفال',
    slug: 'promoting-rights-children',
    image: postImage2
  },
  {
    _id: 'default-3',
    title: 'Growing Up Children in Charity Care',
    titleAr: 'نمو الأطفال في الرعاية الخيرية',
    slug: 'growing-children-charity',
    image: postImage3
  }
];

const BlogSidebar = () => {
  const { t } = useTranslation('Blog');
  const { language: currentLanguage } = useI18next();
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch categories and tags from blogs
  const fetchCategoriesAndTags = useCallback(async () => {
    try {
      // Get all published blogs to extract categories and tags
      const response = await blogAPI.getPublishedBlogs({ limit: 100 });
      const blogs = response.blogs || [];
      
      // Extract unique categories
      const uniqueCategories = [...new Set(blogs.map(blog => blog.category).filter(Boolean))];
      setCategories(uniqueCategories);
      
      // Extract unique tags
      const allTags = blogs.reduce((acc, blog) => {
        const blogTags = currentLanguage === 'ar' ? (blog.tagsAr || []) : (blog.tags || []);
        return [...acc, ...blogTags];
      }, []);
      const uniqueTags = [...new Set(allTags)].filter(Boolean);
      setTags(uniqueTags);
      
    } catch (error) {
      console.error('Error fetching categories and tags:', error);
      // Set default categories and tags on error
      setCategories(['news', 'events', 'updates', 'stories', 'announcements']);
      setTags(['charity', 'donations', 'savelives', 'education', 'poorpeople', 'health', 'cleanwater']);
    }
  }, [currentLanguage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest posts, categories, and tags in parallel
        const [postsResponse] = await Promise.all([
          blogAPI.getRecentBlogs(3),
          fetchCategoriesAndTags()
        ]);
        
        const posts = postsResponse || [];
        
        if (posts.length > 0) {
          setLatestPosts(posts);
        } else {
          // Use default posts if no data from API
          setLatestPosts(defaultPosts);
        }
      } catch (error) {
        console.error('Error fetching sidebar data:', error);
        // Use default data on error
        setLatestPosts(defaultPosts);
        setCategories(['news', 'events', 'updates', 'stories', 'announcements']);
        setTags(['charity', 'donations', 'savelives', 'education', 'poorpeople', 'health', 'cleanwater']);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLanguage, fetchCategoriesAndTags]);

  const truncateTitle = (title, maxLength = 45) => {
    return title && title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };
  return (
    <div className="blog-sidebar">
      <div className="blog-sidebar__search">
        <form action="#">
          <input 
            type="text" 
            placeholder={currentLanguage === 'ar' ? 'ابحث هنا' : 'Search here'} 
            aria-label={currentLanguage === 'ar' ? 'البحث في المدونة' : 'Search blog posts'}
          />
          <button type="submit" aria-label={currentLanguage === 'ar' ? 'بحث' : 'Search'}>
            <i className="azino-icon-magnifying-glass"></i>
          </button>
        </form>
      </div>
      <div className="blog-sidebar__single">
        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>{t('sidebar.latestPosts')}</h3>
        <ul className={`list-unstyled blog-sidebar__post ${currentLanguage === 'ar' ? 'rtl-sidebar' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {loading ? (
            // Loading state
            [1, 2, 3].map((index) => (
              <li key={`loading-${index}`} style={{ opacity: 0.6 }}>
                <img 
                  src={index === 1 ? postImage1 : index === 2 ? postImage2 : postImage3} 
                  alt="Loading..."
                  style={{
                    width: '68px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                    flexShrink: 0
                  }}
                />
                <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
                  <span>{t('sidebar.loading')}</span>
                </h3>
              </li>
            ))
          ) : (
            latestPosts.map((post, index) => {
              const title = currentLanguage === 'ar' && post.titleAr ? post.titleAr : post.title;
              const fallbackImage = index === 0 ? postImage1 : index === 1 ? postImage2 : postImage3;
              
              return (
                <li key={post._id || `post-${index}`}>
                  <img 
                    src={post.image || fallbackImage} 
                    alt={title}
                    style={{
                      width: '68px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.src = fallbackImage;
                    }}
                  />
                  <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
                    <Link to={`/news-details/${post.slug || post._id}`}>
                      {truncateTitle(title)}
                    </Link>
                  </h3>
                </li>
              );
            })
          )}
        </ul>
      </div>
      <div className="blog-sidebar__single">
        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
          {currentLanguage === 'ar' ? 'التصنيفات' : 'Categories'}
        </h3>
        <ul className={`list-unstyled blog-sidebar__category ${currentLanguage === 'ar' ? 'rtl-sidebar' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {loading ? (
            // Loading state for categories
            [1, 2, 3, 4, 5].map((index) => (
              <li key={`loading-cat-${index}`} style={{ opacity: 0.6 }}>
                <span>{currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
              </li>
            ))
          ) : (
            categories.map((category, index) => (
              <li key={`category-${index}`}>
                <Link 
                  to={`/news?category=${category}`}
                  className={currentLanguage === 'ar' ? 'text-right' : ''}
                >
                  {currentLanguage === 'ar' ? 
                    t(`categories.${category}`) || category : 
                    t(`categories.${category}`) || category.charAt(0).toUpperCase() + category.slice(1)
                  }
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="blog-sidebar__single">
        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
          {currentLanguage === 'ar' ? 'العلامات' : 'Tags'}
        </h3>
        <ul className={`list-unstyled blog-sidebar__tags ${currentLanguage === 'ar' ? 'rtl-sidebar' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {loading ? (
            // Loading state for tags
            [1, 2, 3, 4, 5, 6, 7].map((index) => (
              <li key={`loading-tag-${index}`} style={{ opacity: 0.6 }}>
                <span>{currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
              </li>
            ))
          ) : (
            tags.slice(0, 10).map((tag, index) => (
              <li key={`tag-${index}`}>
                <Link 
                  to={`/news?search=${encodeURIComponent(tag)}`}
                  className={currentLanguage === 'ar' ? 'text-right' : ''}
                >
                  {tag}
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default BlogSidebar;
