import React from "react";

const GoogleMap = ({ extraClass }) => {
  return (
    <div className={`google-map__${extraClass}`}>
      <iframe 
        title="Hope For All Mena Ministry Location Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d426.61586579748854!2d29.899343405254644!3d31.195039415736964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f5c3ebe1a57deb%3A0x58a6f51135b0589f!2z2YXYs9ix2K0g2KfZhNmG2YrZhCDYp9mE2KfZhtis2YrZhNmJIC0g2YXYqNmG2Ykg2LPZhtmI2K_YsyDYp9mE2YbZitmEINin2YTYp9mG2KzZitmE2Yk!5e0!3m2!1sar!2seg!4v1756249992284!5m2!1sar!2seg" 
        width="600" 
        height="450" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};



export default GoogleMap;
