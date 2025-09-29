import React from "react";
import { Link } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";

const BlogCard = ({ image, title, date, text, link, commentCount, author, currentLanguage }) => {
  const { t } = useTranslation('Blog');
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
              <span className={currentLanguage === 'ar' ? 'text-right pl-3' : 'pr-3'}>
                <i className="far fa-user-circle"></i> {author}
              </span>
              <span className={currentLanguage === 'ar' ? 'text-right' : ''}>
                <i className="far fa-comments"></i> {commentCount}
              </span>
            </div>
            <h3 className="blog-card__title text-center" 
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.4',
                  minHeight: "110px"
                }}>
              <Link to={link} className="hover:text-blue-600 transition-colors">{title}</Link>
            </h3>
            <p className="blog-card__text text-center"
               style={{
                 display: '-webkit-box',
                 WebkitLineClamp: 4,
                 WebkitBoxOrient: 'vertical',
                 overflow: 'hidden',
                 textOverflow: 'ellipsis',
                 lineHeight: '1.5'
               }}>{text}</p>
          </div>
          <Link className={`blog-card__more text-center cursor-pointer`} to={link}>
            {currentLanguage === 'ar' ? (
              <>{t('card.readMore')} <i className="far fa-angle-left"></i></>
            ) : (
              <><i className="far fa-angle-right"></i>{t('card.readMore')}</>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
