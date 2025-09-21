import React, { useState } from "react";
import ModalVideo from "react-modal-video";
import { Container } from "react-bootstrap";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import bgImage from "../../assets/images/backgrounds/page-header-1-1.jpg";

const VideoCard = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .video-card h3,
          .video-card h5,
          .video-card p {
            text-align: center;
            direction: rtl;
          }
          .video-card [dir="rtl"] .space-x-2 {
            --tw-space-x-reverse: 1;
          }
        `}</style>
      )}
      <section className="video-card" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="L61p2uyiMSo"
        onClose={() => setOpen(false)}
      />
      <div
        className="video-card__bg"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>

      <Container className=" text-center pt-120 pb-120">
        <p>
          <i className="fas fa-heart" style={{color: "#FFD701", marginRight: currentLanguage === 'ar' ? "0" : "10px", marginLeft: currentLanguage === 'ar' ? "10px" : "0"}}></i>
          <span style={{fontSize: "1.25rem", fontWeight: 400}}>{t('videoCard.tagLine')}</span>
        </p>
        <h3 className="text-white text-capitalize mb-4" style={{fontSize: "2.5rem", fontWeight: 700, letterSpacing: "0.5px"}}>
          {t('videoCard.title')}
        </h3>
        <h5 className="text-white" style={{lineHeight: 1.8, fontSize: "1.25rem", fontWeight: 400}}>
          {t('videoCard.quote.text')}
          <strong style={{fontWeight: 900, color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}> {t('videoCard.quote.teaching')} </strong> 
          {t('videoCard.quote.middle1')}
          <strong style={{fontWeight: 900, color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}> {t('videoCard.quote.preaching')} </strong> 
          {t('videoCard.quote.middle2')}
          <strong style={{fontWeight: 900, color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.3)'}}> {t('videoCard.quote.healing')} </strong> 
          {t('videoCard.quote.end')}
          <span className="d-block mt-3 font-italic" style={{fontSize: "1.1rem", opacity: 0.9}}>({t('videoCard.quote.reference')})</span>
        </h5>
      </Container>
    </section>
    </>
  );
};

export default VideoCard;
