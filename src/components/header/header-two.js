import React from "react";
import { Link } from "gatsby";
import { Container } from "react-bootstrap";
import NavLinks from "./nav-links";

import logoDark from "../../assets/images/logos/hope4AllMena.png";


const HeaderTwo = () => {
  return (
    <div className="main-header__two">
      <div className="main-header__top">
        <Container>
          <p>Welcome to Hope For All Mena</p>
          <div className="main-header__social">
            <a href="https://www.facebook.com/profile.php?id=61556019641884" aria-label="facebook">
              <i className="fab fa-facebook-square"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100083974131611" aria-label="facebook">
              <i className="fab fa-facebook-square"></i>
            </a>
          </div>
        </Container>
      </div>
      <div className="header-upper">
        <Container>
          <div className="logo-box">
            <Link to="/">
              <img src={logoDark} width="80" alt="" />
            </Link>
            <span className="fa fa-bars mobile-nav__toggler"></span>
          </div>

          <div className="header-info" style={{padding: '0 10px'}}>
            <div className="header-info__box" style={{padding: '0 8px'}}>
              <i className="azino-icon-email1"></i>
              <div className="header-info__box-content">
                <h3 style={{fontSize: '14px', marginBottom: '4px'}}>Email</h3>
                <p style={{fontSize: '13px'}}>
                  <a href="mailto:hope4allmena@gmail.com">hope4allmena@gmail.com</a>
                </p>
              </div>
            </div>
            <div className="header-info__box" style={{padding: '0 8px'}}>
              <i className="azino-icon-calling"></i>
              <div className="header-info__box-content">
                <h3 style={{fontSize: '14px', marginBottom: '4px'}}>Phone</h3>
                <p style={{fontSize: '13px'}}>
                  <a href="tel:+201281416629" style={{marginBottom: '5px', display: 'block'}}>
                    <span>+20 128 141 6629</span>
                    <span style={{fontSize: '11px', color: '#666', marginLeft: '6px'}}>(Alexandria)</span>
                  </a>
                  <a href="tel:+201555103774">
                    <span>+20 155 510 3774</span>
                    <span style={{fontSize: '11px', color: 'var(--thm-color)', marginLeft: '6px'}}>(Cairo)</span>
                  </a>
                </p>
              </div>
            </div>
            <div className="header-info__box" style={{ padding: '0 8px', borderTopLeftRadius: '9999px !important', borderBottomLeftRadius: '9999px !important' }}>
              <i className="azino-icon-address"></i>
              <div className="header-info__box-content">
                <h3 style={{fontSize: '14px', marginBottom: '4px'}}>Visit</h3>
                <p style={{fontSize: '13px'}}>
                  <a 
                    href="https://maps.app.goo.gl/5DTrRt5VD2jBtyfE9" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{
                      textDecoration: 'none', 
                      color: 'inherit',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--thm-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                  >
                    <span style={{display: 'block', marginBottom: '5px'}}>
                      37 Sidi El-Metwally Street
                      <span style={{fontSize: '11px', color: 'var(--thm-color)', marginLeft: '6px'}}>(Alexandria)</span>
                    </span>
                  </a>
                  <span 
                    role="button"
                    tabIndex="0"
                    style={{
                      cursor: 'pointer',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--thm-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.currentTarget.style.color = 'var(--thm-primary)';
                      }
                    }}
                  >
                    11 El-Masoud Street, off Abbasiya Street
                    <span style={{fontSize: '11px', color: '#666', marginLeft: '6px'}}>(Cairo)</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <nav className="main-menu">
        <Container>
          <NavLinks extraClassName="dynamic-radius" />
          <Link
            className="thm-btn"
            to="/donate"
            style={{
              borderRadius: "0px",
              borderBottomRightRadius: "39.5px",
              borderTopRightRadius: "39.5px",
              marginLeft: 0
            }}
          >
            Donate Now
          </Link>
        </Container>
      </nav>
    </div>
  );
};

export default HeaderTwo;
