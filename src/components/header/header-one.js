import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import NavLinks from "./nav-links";

import flag1 from "../../assets/images/resources/flag-1-1.jpg";
import logoDark from "../../assets/images/logos/hope4AllMena.png";

const HeaderOne = () => {
  return (
    <header className="main-header">
      <Container>
        <div className="inner-container">
          <Row>
            <Col sm={12} md={12} lg={12} xl={2}>
              <div className="logo-box">
                <Link to="/">
                  <img src={logoDark} width="101" alt="" />
                </Link>
                <span className="fa fa-bars mobile-nav__toggler"></span>
              </div>
            </Col>
            <Col
              sm={12}
              md={12}
              lg={12}
              xl={10}
              className="d-none d-md-none d-lg-none d-xl-block"
            >
              <div className="main-header__top">
                <p>Welcome to non profit charity platform</p>
                <div className="main-header__social">
                  <a href="#none" aria-label="twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#none" aria-label="facebook">
                    <i className="fab fa-facebook-square"></i>
                  </a>
                  <a href="#none" aria-label="pinterest">
                    <i className="fab fa-pinterest-p"></i>
                  </a>
                  <a href="#none" aria-label="instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
              <nav className="main-menu dynamic-radius">
                <NavLinks />
              </nav>

              <div className="main-header__info">
                <ul className="list-unstyled main-header__info-list">
                  <li>
                    <i className="azino-icon-email"></i>
                    <a href="mailto:hope4allmena@gmail.com">hope4allmena@gmail.com</a>
                  </li>
                  <li>
                    <i className="azino-icon-telephone"></i>
                    <a href="tel:666-888-0000">666 888 0000</a>
                  </li>
                </ul>
                <div className="main-header__language">
                  <div className="main-header__language-image">
                    <img src={flag1} alt="" />
                  </div>
                  <label htmlFor="language-header" className="sr-only">
                    select language
                  </label>
                  <select className="selectpicker" id="language-header">
                    <option value="english">English</option>
                    <option value="arabic">Arabic</option>
                  </select>
                  <i
                    className="fa fa-angle-down
                  "
                  ></i>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </header>
  );
};

export default HeaderOne;
