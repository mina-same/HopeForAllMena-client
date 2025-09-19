import React from "react";
import { Link } from "gatsby";
import flag1 from "../../assets/images/resources/flag-1-1.jpg";

const NavLinks = ({ extraClassName }) => {
  // Temporarily disable i18n to get basic site working
  // const { t } = useTranslation();
  // const { languages, originalPath, i18n } = useI18next();
  
  const handleDropdownStatus = (e) => {
    let clickedItem = e.currentTarget.parentNode;
    clickedItem.querySelector(".dropdown-list").classList.toggle("show");
  };

  const handleLanguageChange = (e) => {
    // Temporarily disabled
    console.log('Language change:', e.target.value);
  };

  return (
    <ul className={`main-menu__list ${extraClassName}`}>
      <li className="">
        <Link to="/">Home</Link>
      </li>
      <li className="">
        <Link to="/about">About Us</Link>
      </li>
      <li className="dropdown">
        <Link to="/news">Ministry Departments</Link>
        <button aria-label="dropdown toggler" onClick={handleDropdownStatus}>
          <i className="fa fa-angle-down"></i>
        </button>
        <ul className="dropdown-list">
          <li>
            <Link to="/development-department">Development Department</Link>
          </li>
          <li>
            <Link to="/evangelism-discipleship">Evangelism & discipleship</Link>
          </li>
          <li>
            <Link to="/studies-education">Studies and Education</Link>
          </li>
          <li>
            <Link to="/publishing-house">Publishing and Distribution House</Link>
          </li>
        </ul>
      </li>
      <li className="">
        <Link to="#">Conferences</Link>
      </li>
      <li>
        <Link to="/contact">Links</Link>
      </li>
      <li>
        <Link to="/contact">Contact</Link>
      </li>
      <li className="language-switcher">
        <div className="language-switcher__inner" style={{ display: "flex", alignItems: "center" }}>
          <img 
            src={flag1} 
            alt="" 
            style={{ borderRadius: "50%", margin: "7px" }} 
          />
          <label htmlFor="language-switcher-nav" className="sr-only">
            select language
          </label>
          <select
            className="selectpicker"
            id="language-switcher-nav"
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
    </ul>
  );
};

export default NavLinks;
