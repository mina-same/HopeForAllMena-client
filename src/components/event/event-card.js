import React from "react";
import { Link } from "gatsby-plugin-react-i18next";

const EventCard = ({ data }) => {
  const { image, title, date, time, location, link } = data;
  return (
    <div className="event-card">
      <div className="event-card-inner">
        <div className="event-card-image">
          <div className="event-card-image-inner" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '20px',
            position: 'relative',
            minHeight: '200px'
          }}>
            <img 
              src={image} 
              alt={title}
              width="150"
              height="150"
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'cover',
                display: 'block',
                borderRadius: '50%',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            />
            <span style={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '50%', 
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)',
              whiteSpace: 'nowrap'
            }}>
              {date}
            </span>
          </div>
        </div>
        <div className="event-card-content">
          <h3>
            <Link to={link}>{title}</Link>
          </h3>
          <ul className="event-card-list">
            <li>
              <i className="azino-icon-clock"></i>
              <strong>Time:</strong> {time}
            </li>
            <li>
              <i className="azino-icon-pin1"></i>
              <strong>Location:</strong> {location}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
