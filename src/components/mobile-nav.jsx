import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import NavLinks from "./header/nav-links";

import logoLight from "../assets/images/logos/hope4AllMena.png";
import flag1 from "../assets/images/resources/flag-1-1.jpg";

const MobileNav = () => {
  const [hasMounted, setHasMounted] = useState(false);
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
    <div className="mobile-nav__wrapper">
      <div className="mobile-nav__overlay side-menu__toggler side-menu__block-overlay"></div>
      <div className="mobile-nav__content">
        <span className="mobile-nav__close side-menu__toggler  side-menu__close-btn">
          <i className="far fa-times"></i>
        </span>

        <div className="logo-box">
          <Link to="/">
            <img src={logoLight} width="101" alt="" />
          </Link>
        </div>
        <div className="mobile-nav__container">
          <NavLinks />
        </div>

        <ul className="mobile-nav__contact list-unstyled">
          <li>
            <i className="azino-icon-email"></i>
            <a href="mailto:hope4allmena@gmail.com">hope4allmena@gmail.com</a>
          </li>
          <li>
            <i className="azino-icon-telephone"></i>
            <a href="tel:666-888-0000">666 888 0000</a>
          </li>
        </ul>
        <div className="mobile-nav__top">
          <div className="mobile-nav__language">
            <img src={flag1} alt="" />
            <label className="sr-only" htmlFor="language-select">
              select language
            </label>
            <select className="selectpicker" id="language-select">
              <option value="english">English</option>
              <option value="arabic">Arabic</option>
            </select>
            <i className="fa fa-caret-down select-icon"></i>
          </div>
          <div className="mobile-nav__social">
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
      </div>
    </div>
  );
};

export default MobileNav;
