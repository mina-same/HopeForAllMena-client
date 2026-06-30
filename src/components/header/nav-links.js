import React from "react";
import { Link, useI18next, useTranslation } from "gatsby-plugin-react-i18next";
import flag1 from "../../assets/images/resources/flag-1-1.jpg";
import flagAr from "../../assets/images/resources/flag-1-2.jpg"; // You can add Arabic flag image later

const NavLinks = ({ extraClassName, hideControls = false }) => {
  const { t } = useTranslation();
  const { i18n } = useI18next();

  const handleDropdownStatus = (e) => {
    let clickedItem = e.currentTarget.parentNode;
    clickedItem.querySelector(".dropdown-list").classList.toggle("show");
  };

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const queryString = window.location.search; // Preserve query parameters
      let newPath;
      
      if (newLanguage === 'en') {
        // Remove language prefix for English
        newPath = currentPath.startsWith('/ar/') ? currentPath.replace('/ar/', '/') : currentPath;
      } else {
        // Add language prefix for other languages
        if (currentPath.startsWith('/ar/')) {
          // Already has Arabic prefix
          newPath = currentPath;
        } else {
          // Add Arabic prefix
          newPath = currentPath === '/' ? `/${newLanguage}` : `/${newLanguage}${currentPath}`;
        }
      }

      window.location.href = newPath + queryString;
    }
  };

  return (
    <ul className={`main-menu__list ${extraClassName}`}>
        <li className="">
          <Link to="/">{t('navigation.home')}</Link>
        </li>
        <li className="">
          <Link to="/about">{t('navigation.about')}</Link>
        </li>
        <li className="dropdown">
          <Link to="/news">{t('navigation.ministryDepartments')}</Link>
          <button aria-label="dropdown toggler" onClick={handleDropdownStatus}>
            <i className="fa fa-angle-down"></i>
          </button>
          <ul className="dropdown-list">
            <li>
              <Link to="/studies-education">{t('navigation.studiesEducation')}</Link>
            </li>
            <li>
              <Link to="/development-department">{t('navigation.developmentDepartment')}</Link>
            </li>
            <li>
              <Link to="/evangelism-discipleship">{t('navigation.evangelismDiscipleship')}</Link>
            </li>
            <li>
              <Link to="/publishing-house">{t('navigation.publishingHouse')}</Link>
            </li>
          </ul>
        </li>
        <li className="">
          <Link to="/events">{t('navigation.events')}</Link>
        </li>
        <li>
          <Link to="/contact">{t('navigation.contact')}</Link>
        </li>
        {!hideControls && (
          <>
            <li className="language-switcher">
              <div className="language-switcher__inner" style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={i18n?.resolvedLanguage === 'ar' ? flagAr : flag1}
                  alt=""
                  style={{ borderRadius: "50%", margin: "7px", width: "24px", height: "24px" }}
                />
                <label htmlFor="language-switcher-nav" className="sr-only">
                  select language
                </label>
                <select
                  className="selectpicker"
                  id="language-switcher-nav"
                  value={i18n?.resolvedLanguage || 'en'}
                  onChange={handleLanguageChange}
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
            </li>
            <li className="search-btn search-toggler" style={{ marginLeft: "20px", marginRight: "15px" }}>
              <span>
                <i className="azino-icon-magnifying-glass"></i>
              </span>
            </li>
          </>
        )}
    </ul>
  );
};

export default NavLinks;
