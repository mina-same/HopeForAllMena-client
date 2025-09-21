import React from "react";
import { Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";

const BlogCard = ({ image, title, date, text, link, commentCount, author, currentLanguage }) => {
  const { t } = useTranslation();
  return (
    <div className={`blog-card ${currentLanguage === 'ar' ? 'rtl-card' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="blog-card__inner">
        <div className="blog-card__image">
          <img src={image} alt="" />
          <div className="blog-card__date">{date}</div>
        </div>
        <div className="blog-card__content">
          <div className="blog-card__content-wrapper">
            <div className={`blog-card__meta ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span className={currentLanguage === 'ar' ? 'text-right' : ''}>
                <i className="far fa-user-circle"></i> {author}
              </span>
              <span className={currentLanguage === 'ar' ? 'text-right' : ''}>
                <i className="far fa-comments"></i> {commentCount}
              </span>
            </div>
            <h3 className={currentLanguage === 'ar' ? 'text-right' : ''}>
              <Link to={link}>{title}</Link>
            </h3>
            <p className={currentLanguage === 'ar' ? 'text-right' : ''}>{text}</p>
          </div>
          <Link className={`blog-card__more ${currentLanguage === 'ar' ? 'text-right' : ''}`} to={link}>
            {currentLanguage === 'ar' ? (
              <>{t('blog:card.readMore')} <i className="far fa-angle-left"></i></>
            ) : (
              <><i className="far fa-angle-right"></i>{t('blog:card.readMore')}</>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
