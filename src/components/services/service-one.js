import React from "react";
import { Link } from "gatsby";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import serviceBg from "../../assets/images/backgrounds/service-hand-bg-1-1.png";
import serviceLine from "../../assets/images/shapes/service-line-1-1.png";
import blockTitleHeart from "../../assets/images/shapes/heart-2-1.png";
import developmentLogo from "../../assets/images/logo/web/1.png";
import evangelismLogo from "../../assets/images/logo/web/2.png";
import abcLogo from "../../assets/images/logo/web/3.png";
import publishingLogo from "../../assets/images/logo/web/4.png";
import "./service-one-light.css";

const getServiceOneData = (t) => [
  {
    icon: "azino-icon-dove",
    image: evangelismLogo,
    extraClassName: "background-secondary",
    titleKey: "serviceOne.items.evangelism.title",
    textKey: "serviceOne.items.evangelism.text",
    link: "/evangelism-discipleship"
  },
  {
    icon: "azino-icon-charity",
    image: developmentLogo,
    titleKey: "serviceOne.items.development.title",
    extraClassName: "background-base",
    textKey: "serviceOne.items.development.text",
    link: "/development-department"
  },
  {
    icon: "azino-icon-reading-book",
    image: abcLogo,
    titleKey: "serviceOne.items.education.title",
    textKey: "serviceOne.items.education.text",
    link: "/alexandria-bible-college",
    extraClassName: "background-primary"
  },
  {
    icon: "",
    image: publishingLogo,
    titleKey: "serviceOne.items.publishing.title",
    extraClassName: "background-special",
    textKey: "serviceOne.items.publishing.text",
    link: "/publishing-house"
  },
  {
    icon: "azino-icon-family",
    titleKey: "serviceOne.items.refugees.title",
    extraClassName: "background-base",
    textKey: "serviceOne.items.refugees.text",
    link: "/sudanese-refugees"
  }
];

const ServiceOne = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';

  const serviceData = getServiceOneData(t);

  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .service-one .block-title h3,
          .service-one .block-title p {
            text-align: center;
            direction: rtl;
          }
          .service-one h3,
          .service-one p {
            text-align: center;
            direction: rtl;
          }
          .service-one [dir="rtl"] .space-x-2 {
            --tw-space-x-reverse: 1;
          }
        `}</style>
      )}
      <section
        className="service-one pt-120 pb-90"
        style={{ backgroundImage: `url(${serviceBg})` }}
        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      >
        <Container>
          <img src={serviceLine} alt="" className="service-one__shape-1" />
          <div className="block-title">
            <p>
              <img src={blockTitleHeart} width="15" alt="" />
              {t('serviceOne.header.tagLine')}
            </p>
            <h3 style={{ textAlign: "center" }}>
              {t('serviceOne.header.title')}
            </h3>
          </div>
          <Row className="justify-content-center">
            {serviceData.map(
              ({ icon, image, titleKey, textKey, link, extraClassName }, index) => (
                <Col md={6} lg={4} key={`service-one-key-${index}`}>
                  <div className={`service-one__box`}>
                    <div
                      className="service-one__icon service-one__icon--light"
                      style={{ "--accent": `var(--thm-${extraClassName.replace("background-", "")})` }}
                    >
                      <div className="service-one__icon-inner">
                        {image ? (
                          <img src={image} alt={t(titleKey)} width="100" />
                        ) : (
                          <i className={icon}></i>
                        )}
                      </div>
                    </div>
                    <h3>
                      <Link to={link} style={{ lineHeight: '1.5', marginTop: '10px', marginBottom: '10px', display: 'inline-block' }}>{t(titleKey)}</Link>
                    </h3>
                    <p>{t(textKey)}</p>
                  </div>
                </Col>
              )
            )}
          </Row>
        </Container>
      </section>
    </>
  );
};

export default ServiceOne;
