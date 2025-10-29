import React, { useState, useEffect } from "react";
import { Link } from "gatsby-plugin-react-i18next";
import { Link as ScrollLink } from "react-scroll";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import logoLight from "../assets/images/logos/Hope4allMENADark.png";
import blogPost1 from "../assets/images/resources/footer-img-1-1.jpg";
import blogPost2 from "../assets/images/resources/footer-img-1-2.jpg";
import blogAPI from "../services/blogAPI";


const Footer = () => {
  const { t } = useTranslation();
  const { language: currentLanguage } = useI18next();
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getRecentBlogs(2, currentLanguage);
        setLatestBlogs(response.blogs || response || []);
      } catch (error) {
        console.error('Error fetching latest blogs for footer:', error);
        setLatestBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, [currentLanguage]);

  const formatDate = (dateString) => {
    const locale = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const truncateTitle = (title, maxLength = 40) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  return (
    <section className="site-footer">
      <div className="main-footer pt-142 pb-80">
        <Container>
          <Row>
            <Col lg={3} md={6} sm={12}>
              <div className="footer-widget mb-40 footer-widget__about">
                <Link to="/">
                  <img
                    src={logoLight}
                    className="footer-widget__logo"
                    width="90"
                    alt=""
                  />
                </Link>
                <h1 style={{
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "0rem",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)"
                }}>
                  {t('footer.organizationName')}
                </h1>
                <p>
                  {t('footer.tagline')}
                </p>
                <ul className={`list-unstyled footer-widget__contact ${currentLanguage === 'ar' ? 'pl-10 pr-0' : ''}`}>
                  <li>
                    <i className="azino-icon-telephone" style={{ color: "white", width: "15px", height: "15px" }}></i>
                    <a href="tel:+201555103774" title="Alexandria Office">+20 155 510 3774 <small>(Alexandria)</small></a>
                  </li>
                  <li>
                    <i className="azino-icon-telephone" style={{ color: "white", width: "15px", height: "15px" }}></i>

                    <a href="tel:+20128141662" title="Cairo Office">+20 128 141 6629 <small>(Cairo)</small></a><br />
                  </li>
                  <li>
                    <i className="azino-icon-email" style={{ color: "white" }}></i>
                    <a href="mailto:hope4allmena@gmail.com">hope4allmena@gmail.com</a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="footer-widget footer-widget__link mb-40">
                <h3 className="footer-widget__title">{t('footer.explore')}</h3>
                <ul className={`list-unstyled footer-widget__link-list ${currentLanguage === 'ar' ? 'pl-10 pr-0' : ''}`}>
                  <li>
                    <Link to="/causes">{t('footer.ourCauses')}</Link>
                  </li>
                  <li>
                    <Link to="/about">{t('footer.aboutUs')}</Link>
                  </li>
                  <li>
                    <Link to="/news">{t('footer.newCampaign')}</Link>
                  </li>
                  <li>
                    <Link to="/events">{t('footer.upcomingEvents')}</Link>
                  </li>
                  <li>
                    <Link to="/about">{t('footer.siteMap')}</Link>
                  </li>
                  <li>
                    <Link to="/contact">{t('footer.help')}</Link>
                  </li>
                  <li>
                    <Link to="/causes">{t('footer.donate')}</Link>
                  </li>
                  <li>
                    <Link to="/contact">{t('footer.contactUs')}</Link>
                  </li>
                  <li>
                    <Link to="/Admin">{t('navigation.admin')}</Link>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="footer-widget mb-40 footer-widget__blog">
                <h3 className="footer-widget__title">{t('footer.latestBlogPosts')}</h3>
                <ul className={`list-unstyled footer-widget__blog ${currentLanguage === 'ar' ? 'pl-15 pr-0' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {loading ? (
                    <>
                      <li className="footer-blog-item loading-item" style={{ opacity: 0.7, transition: 'all 0.3s ease' }}>
                        <img src={blogPost1} alt={t('footer.loading')} width="68" height="70" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                        <p className={currentLanguage === 'ar' ? 'text-right' : ''}>{t('footer.loading')}</p>
                        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
                          <span>{t('footer.loadingPosts')}</span>
                        </h3>
                      </li>
                      <li className="footer-blog-item loading-item" style={{ opacity: 0.7, transition: 'all 0.3s ease' }}>
                        <img src={blogPost2} alt={t('footer.loading')} width="68" height="70" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                        <p className={currentLanguage === 'ar' ? 'text-right' : ''}>{t('footer.loading')}</p>
                        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
                          <span>{t('footer.pleaseWait')}</span>
                        </h3>
                      </li>
                    </>
                  ) : latestBlogs.length > 0 ? (
                    latestBlogs.map((blog, index) => (
                      <li key={blog._id} className="footer-blog-item" style={{ 
                        opacity: 1, 
                        transform: 'translateY(0)', 
                        transition: 'all 0.4s ease',
                        animationDelay: `${index * 0.1}s`
                      }}>
                        <img 
                          src={blog.image || (index === 0 ? blogPost1 : blogPost2)} 
                          alt={currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title}
                          width="68"
                          height="70"
                          style={{ 
                            objectFit: 'cover', 
                            borderRadius: '4px',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={(e) => {
                            e.target.src = index === 0 ? blogPost1 : blogPost2;
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        />
                        <p className={currentLanguage === 'ar' ? 'text-right' : ''}>{formatDate(blog.publishedAt || blog.createdAt)}</p>
                        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
                          <Link 
                            to={`/news-details/${blog.slug || blog._id}`}
                            style={{ transition: 'color 0.3s ease' }}
                          >
                            {truncateTitle(currentLanguage === 'ar' && blog.titleAr ? blog.titleAr : blog.title)}
                          </Link>
                        </h3>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="footer-blog-item" style={{ opacity: 0.8, transition: 'all 0.3s ease' }}>
                        <img src={blogPost1} alt={t('footer.defaultPost')} width="68" height="70" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                        <p className={currentLanguage === 'ar' ? 'text-right' : ''}>22 May, 2020</p>
                        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
                          <Link to="/news-details">
                            {t('footer.defaultTitle1')}
                          </Link>
                        </h3>
                      </li>
                      <li className="footer-blog-item" style={{ opacity: 0.8, transition: 'all 0.3s ease' }}>
                        <img src={blogPost2} alt={t('footer.defaultPost')} width="68" height="70" style={{ objectFit: 'cover', borderRadius: '4px' }} />
                        <p className={currentLanguage === 'ar' ? 'text-right' : ''}>22 May, 2020</p>
                        <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
                          <Link to="/news-details">{t('footer.defaultTitle2')}</Link>
                        </h3>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="footer-widget mb-40 footer-widget__newsletter">
                <h3 className={`footer-widget__title ${currentLanguage === 'ar' ? 'text-right' : ''}`}>{t('footer.newsletter')}</h3>
                <p className={currentLanguage === 'ar' ? 'text-right' : ''}>{t('footer.newsletterDescription')}</p>
                <form
                  data-url="https://xyz.us18.list-manage.com/subscribe/post?u=20e91746ef818cd941998c598&id=cc0ee8140e"
                  className="footer-widget__newsletter-form mc-form"
                >
                  <label htmlFor="mc-email" className="sr-only">
                    {t('footer.emailPlaceholder')}
                  </label>
                  <input
                    type="email"
                    name="EMAIL"
                    id="mc-email"
                    className={currentLanguage === 'ar' ? 'text-right' : ''}
                    placeholder={t('footer.emailPlaceholder')}
                    dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  />
                  <div className="footer-widget__newsletter-btn-wrap d-flex justify-content-end">
                    <button type="submit" className="thm-btn">
                      {t('footer.subscribeNow')}
                    </button>
                  </div>
                </form>
                <div className="mc-form__response"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <ScrollLink
            to="wrapper"
            smooth={true}
            duration={500}
            className="scroll-to-top"
          >
            <i className="far fa-angle-up"></i>
          </ScrollLink>
          <p>
            {t('footer.copyright.text')}{' '}
            <a 
              href={t('footer.copyright.developerUrl')} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: '#2194D1', 
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'color 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.color = '#1976D2'}
              onMouseLeave={(e) => e.target.style.color = '#2194D1'}
            >
              {currentLanguage === 'ar' ? 'MinaSamy' : t('footer.copyright.developerName')}
            </a>
          </p>
          <div className="footer-social">
            <a href="https://www.facebook.com/profile.php?id=61556019641884" aria-label="facebook">
              <i className="fab fa-facebook-square"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100083974131611" aria-label="facebook">
              <i className="fab fa-facebook-square"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100054468594764" aria-label="facebook">
              <i className="fab fa-facebook-square"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
