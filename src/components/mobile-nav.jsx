import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import NavLinks from "./header/nav-links";
import './mobile-nav.css';

import logoLight from "../assets/images/logos/hope4AllMena.png";
import flag1 from "../assets/images/resources/flag-1-1.jpg";
import flagAr from "../assets/images/resources/flag-1-2.jpg";

const MobileNav = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  const mobileMenu = () => {
    let mobileNavToggler = document.querySelectorAll(".mobile-nav__toggler");
    if (mobileNavToggler) {
      mobileNavToggler.forEach((mobileNavTogglerBtn) => {
        mobileNavTogglerBtn.addEventListener("click", function (e) {
          console.log("clicked");
          document
            .querySelector(".mobile-nav__wrapper")
            .classList.toggle("expanded");
          e.preventDefault();
        });
      });
    }
    // search toggler
    let searchCloser = document.querySelectorAll(".search-toggler");
    if (searchCloser) {
      searchCloser.forEach((searchCloserBtn) => {
        searchCloserBtn.addEventListener("click", function (e) {
          document.querySelector(".search-popup").classList.toggle("active");
          e.preventDefault();
        });
      });
    }

    //Close Mobile Menu
    let sideMenuCloser = document.querySelectorAll(".side-menu__toggler");
    if (sideMenuCloser) {
      sideMenuCloser.forEach((sideMenuCloserBtn) => {
        sideMenuCloserBtn.addEventListener("click", function (e) {
          document
            .querySelector(".mobile-nav__wrapper")
            .classList.remove("expanded");
          e.preventDefault();
        });
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      mobileMenu();
      setHasMounted(true);
      return () => {
        mobileMenu();
      };
    }
  }, [hasMounted]);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      
      <div className={`mobile-nav__wrapper ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mobile-nav__overlay side-menu__toggler side-menu__block-overlay"></div>
        <div className={`mobile-nav__content ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
        <span className={`mobile-nav__close side-menu__toggler side-menu__close-btn ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
          <i className="far fa-times"></i>
        </span>

        <div className={`logo-box ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`}>
          <Link to="/">
            <img src={logoLight} width="101" alt="" />
          </Link>
        </div>
        
        {/* Language and Search in same line */}
        <div className={`mobile-nav__controls ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <div className="mobile-nav__language-search">
            <div className="mobile-nav__language-selector">
              <img
                src={currentLanguage === 'ar' ? flagAr : flag1}
                alt=""
                style={{ borderRadius: "50%", margin: "7px", width: "24px", height: "24px" }}
              />
              <select
                className="selectpicker"
                value={currentLanguage}
                onChange={(e) => {
                  const newLanguage = e.target.value;
                  if (typeof window !== 'undefined') {
                    const currentPath = window.location.pathname;
                    let newPath;
                    
                    if (newLanguage === 'en') {
                      newPath = currentPath.startsWith('/ar/') ? currentPath.replace('/ar/', '/') : currentPath;
                    } else {
                      if (currentPath.startsWith('/ar/')) {
                        newPath = currentPath;
                      } else {
                        newPath = currentPath === '/' ? `/${newLanguage}` : `/${newLanguage}${currentPath}`;
                      }
                    }
                    window.location.href = newPath;
                  }
                }}
                style={{
                  appearance: "none",
                  border: "none",
                  outline: "none",
                  color: "#7e7e7e",
                  backgroundColor: "transparent",
                  fontSize: "14px",
                  width: "50px"
                }}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
              <i className="fa fa-angle-down" style={{ marginLeft: "5px" }}></i>
            </div>
            
            <div className="mobile-nav__search-btn search-toggler">
              <span>
                <i className="azino-icon-magnifying-glass"></i>
              </span>
            </div>
          </div>
        </div>
        
        <div className="mobile-nav__container">
          <NavLinks hideControls={true} />
        </div>

        <ul className={`mobile-nav__contact list-unstyled ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <li className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
            <i className="azino-icon-email"></i>
            <a href="mailto:hope4allmena@gmail.com">hope4allmena@gmail.com</a>
          </li>
          <li className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
            <i className="azino-icon-telephone"></i>
            <a href="tel:+201555103774">
              {currentLanguage === 'ar' ? '+20 155 510 3774 (الإسكندرية)' : '+20 155 510 3774 (Alexandria)'}
            </a>
          </li>
          <li className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
            <i className="azino-icon-telephone"></i>
            <a href="tel:+20128141662">
              {currentLanguage === 'ar' ? '+20 128 141 6629 (القاهرة)' : '+20 128 141 6629 (Cairo)'}
            </a>
          </li>
        </ul>
        <div className="mobile-nav__top">
          <div className={`mobile-nav__social ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <a href="https://www.facebook.com/profile.php?id=61556019641884" aria-label={currentLanguage === 'ar' ? 'فيسبوك' : 'facebook'} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-square"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100083974131611" aria-label={currentLanguage === 'ar' ? 'فيسبوك' : 'facebook'} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-square"></i>
            </a>
            <a href="https://www.facebook.com/profile.php?id=100054468594764" aria-label={currentLanguage === 'ar' ? 'فيسبوك' : 'facebook'} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-square"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default MobileNav;
