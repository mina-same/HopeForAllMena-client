import React, { useState, useEffect } from "react";
import { Link } from "gatsby-plugin-react-i18next";
import { Link as ScrollLink } from "react-scroll";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "gatsby-plugin-react-i18next";
import logoLight from "../assets/images/logos/Hope4allMENADark.png";
import blogPost1 from "../assets/images/resources/footer-img-1-1.jpg";
import blogPost2 from "../assets/images/resources/footer-img-1-2.jpg";
import blogAPI from "../services/blogAPI";


const Footer = () => {
  const { t } = useTranslation();
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getRecentBlogs(2);
        setLatestBlogs(response.blogs || response || []);
      } catch (error) {
        console.error('Error fetching latest blogs for footer:', error);
        setLatestBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
                <ul className="list-unstyled footer-widget__contact">
                  <li>
                    <i className="azino-icon-telephone" style={{ color: "white", width: "15px", height: "15px" }}></i>
                    <a href="tel:+201555103774" title="Alexandria Office">+20 155 510 3774 <small>(Alexandria)</small></a>
                  </li>
                  <li>
                    <i className="azino-icon-telephone" style={{ color: "white", width: "15px", height: "15px" }}></i>

                    <a href="tel:+20128141662" title="Cairo Office">+20 128 141 6629 <small>(Cairo)</small></a><br />
                  </li>
                  <li>
                    <a href="#none">
                      <i className="azino-icon-email" style={{ color: "white" }}></i>
                      <a href="mailto:hope4allmena@gmail.com">hope4allmena@gmail.com</a>
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="footer-widget footer-widget__link mb-40">
                <h3 className="footer-widget__title">{t('footer.explore')}</h3>
                <ul className="list-unstyled footer-widget__link-list">
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
                <ul className="list-unstyled footer-widget__blog">
                  {loading ? (
                    <>
                      <li>
                        <img src={blogPost1} alt="Loading..." width="68" height="70" style={{ objectFit: 'cover' }} />
                        <p>Loading...</p>
                        <h3>
                          <span>Loading latest posts...</span>
                        </h3>
                      </li>
                      <li>
                        <img src={blogPost2} alt="Loading..." width="68" height="70" style={{ objectFit: 'cover' }} />
                        <p>Loading...</p>
                        <h3>
                          <span>Please wait...</span>
                        </h3>
                      </li>
                    </>
                  ) : latestBlogs.length > 0 ? (
                    latestBlogs.map((blog, index) => (
                      <li key={blog._id}>
                        <img 
                          src={blog.image || (index === 0 ? blogPost1 : blogPost2)} 
                          alt={blog.title}
                          width="68"
                          height="70"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = index === 0 ? blogPost1 : blogPost2;
                          }}
                        />
                        <p>{formatDate(blog.createdAt)}</p>
                        <h3>
                          <Link to={`/news-details/${blog.slug || blog._id}`}>
                            {truncateTitle(blog.title)}
                          </Link>
                        </h3>
                      </li>
                    ))
                  ) : (
                    <>
                      <li>
                        <img src={blogPost1} alt="Default post" width="68" height="70" style={{ objectFit: 'cover' }} />
                        <p>22 May, 2020</p>
                        <h3>
                          <Link to="/news-details">
                            You can help the poor in need
                          </Link>
                        </h3>
                      </li>
                      <li>
                        <img src={blogPost2} alt="Default post" width="68" height="70" style={{ objectFit: 'cover' }} />
                        <p>22 May, 2020</p>
                        <h3>
                          <Link to="/news-details">Rise fund for Healthy Food</Link>
                        </h3>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </Col>
            <Col lg={3} md={6} sm={12}>
              <div className="footer-widget mb-40 footer-widget__newsletter">
                <h3 className="footer-widget__title">Newletter</h3>
                <p>Signup now to get daily latest news & updates from us</p>
                <form
                  data-url="https://xyz.us18.list-manage.com/subscribe/post?u=20e91746ef818cd941998c598&id=cc0ee8140e"
                  className="footer-widget__newsletter-form mc-form"
                >
                  <label htmlFor="mc-email" className="sr-only">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="EMAIL"
                    id="mc-email"
                    className=""
                    placeholder="Email address"
                  />
                  <div className="footer-widget__newsletter-btn-wrap d-flex justify-content-end">
                    <button type="submit" className="thm-btn ">
                      Subscribe Now
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
          <p>© Copyright 2025 by MinaSamy</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/profile.php?id=61556019641884" aria-label="facebook">
              <i className="fab fa-facebook-square"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100083974131611" aria-label="facebook">
              <i className="fab fa-facebook-square"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
