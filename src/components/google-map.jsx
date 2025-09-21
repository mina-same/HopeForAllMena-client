import React, { useState } from "react";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";

const GoogleMap = ({ extraClass }) => {
  const { t } = useTranslation('Contact');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  const [activeLocation, setActiveLocation] = useState('alexandria');

  const locations = {
    alexandria: {
      name: 'Alexandria',
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d426.61586579748854!2d29.899343405254644!3d31.195039415736964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c3ebe1a57deb%3A0x58a6f51135b0589f!2z2YXYs9ix2K0g2KfZhNmG2YrZhCDYp9mE2KfZhtis2YrZhNmJIC0g2YXYqNmG2Ykg2LPZhtmI2K_YsyDYp9mE2YbZitmEINin2YTYp9mG2KzZitmE2Yk!5e0!3m2!1sar!2seg!4v1756249992284!5m2!1sar!2seg"
    },
    cairo: {
      name: 'Cairo',
      src: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3452.971846192444!2d31.2761630848844!3d30.066341481874304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDAzJzU4LjgiTiAzMcKwMTYnMjYuMyJF!5e0!3m2!1sar!2seg!4v1757372256316!5m2!1sar!2seg"
    }
  };

  return (
    <div className={`google-map__${extraClass}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="location-buttons" style={{ 
        position: 'relative'
      }}>
        {Object.entries(locations).map(([key, location]) => (
          <button
            key={key}
            onClick={() => setActiveLocation(key)}
            className={`location-btn ${activeLocation === key ? 'active' : ''}`}
            style={{
              padding: '12px 24px',
              border: '2px solid #2194D1',
              borderRadius: '8px',
              backgroundColor: activeLocation === key ? '#2194D1' : 'transparent',
              color: activeLocation === key ? 'white' : '#2194D1',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              minWidth: '120px',
              position: 'absolute',
              top: '20px',
              left: key === 'alexandria' ? 'calc(50% - 135px)' : 'calc(50% + 15px)'
            }}
            onMouseEnter={(e) => {
              if (activeLocation !== key) {
                e.target.style.backgroundColor = '#f0f8ff';
              }
            }}
            onMouseLeave={(e) => {
              if (activeLocation !== key) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            {t(`map.locations.${key}`)}
          </button>
        ))}
      </div>
      
      <div className="map-container">
        <iframe 
          title={`Hope For All Mena Ministry - ${locations[activeLocation].name} Location`}
          src={locations[activeLocation].src}
          width="100%" 
          height="450" 
          style={{ 
            border: 0
          }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};



export default GoogleMap;
