import React from "react";
import { Link } from "gatsby";

const BlogCard = ({ image, title, date, text, link, commentCount, author }) => {
  return (
    <div className="blog-card">
      <div className="blog-card__inner">
        <div className="blog-card__image">
          <img src={image} alt="" />
          <div className="blog-card__date">{date}</div>
        </div>
        <div className="blog-card__content">
          <div className="blog-card__content-wrapper">
            <div className="blog-card__meta">
              <span>
                <i className="far fa-user-circle"></i> {author}
              </span>
              <span>
                <i className="far fa-comments"></i> {commentCount}
              </span>
            </div>
            <h3>
              <Link to={link}>{title}</Link>
            </h3>
            <p>{text}</p>
          </div>
          <Link className="blog-card__more" to={link}>
            <i className="far fa-angle-right"></i>Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
