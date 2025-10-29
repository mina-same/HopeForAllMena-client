import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, graphql } from "gatsby";
import Layout from "../components/layout";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import HeaderTwo from "../components/header/header-two";
import eventService from "../services/eventService";
import { useI18next, useTranslation } from 'gatsby-plugin-react-i18next';

import detailsImage from "../assets/images/events/event-details-1-1.jpg";

const EventDetails = ({ location }) => {
  const { language } = useI18next();
  const { t } = useTranslation('event-details');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, [location]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get slug or id from URL query params
      const params = new URLSearchParams(location?.search || '');
      const slug = params.get('slug');
      const id = params.get('id');
      
      if (!slug && !id) {
        setError('No event specified');
        setLoading(false);
        return;
      }

      let response;
      if (slug) {
        response = await eventService.getEventBySlug(slug);
      } else {
        response = await eventService.getEvent(id);
      }
      
      if (response.success && response.data) {
        setEvent(response.data);
      } else {
        setError('Event not found');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    return date.toLocaleDateString(locale, { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const locale = language === 'ar' ? 'ar-EG' : 'en-US';
    
    const startTime = startDate.toLocaleTimeString(locale, { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const endTime = endDate.toLocaleTimeString(locale, { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${startTime} - ${endTime}`;
  };

  if (loading) {
    return (
      <Layout pageTitle={`${t('loading')} || Hope for All Mena`}>
        <HeaderTwo />
        <StickyHeader />
        <PageHeader title={t('pageTitle')} crumbTitle={t('pageTitle')} />
        <section className="event-details pt-120 pb-120">
          <Container>
            <div className="text-center py-5">
              <p>{t('loading')}</p>
            </div>
          </Container>
        </section>
        <Footer />
      </Layout>
    );
  }

  if (error || !event) {
    return (
      <Layout pageTitle={`${t('notFound')} || Hope for All Mena`}>
        <HeaderTwo />
        <StickyHeader />
        <PageHeader title={t('pageTitle')} crumbTitle={t('pageTitle')} />
        <section className="event-details pt-120 pb-120">
          <Container>
            <div className="text-center py-5">
              <h3>{t('notFound')}</h3>
              <p>{error || t('errorMessage')}</p>
              <Link 
                to={language === 'ar' ? '/ar/events' : '/events'}
                className="thm-btn dynamic-radius"
              >
                {t('backToEvents')}
              </Link>
            </div>
          </Container>
        </section>
        <Footer />
      </Layout>
    );
  }

  // Helper function to extract URL from iframe HTML
  const extractMapUrl = (locationString) => {
    if (!locationString) return null;
    
    // Check if it's an iframe HTML string
    if (locationString.includes('<iframe') && locationString.includes('src=')) {
      // Extract the src URL from the iframe HTML
      const srcMatch = locationString.match(/src=["']([^"']+)["']/);
      return srcMatch ? srcMatch[1] : locationString;
    }
    
    // If it's already a URL, return it as is
    return locationString;
  };

  // Helper function to format date for Google Calendar
  const formatGoogleCalendarDate = (date) => {
    const d = new Date(date);
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  };

  // Generate Google Calendar URL
  const generateGoogleCalendarUrl = () => {
    if (!event) return '#';
    
    const title = isArabic && event.title_ar ? event.title_ar : event.title;
    const description = isArabic && event.description_ar ? event.description_ar : event.description;
    const address = isArabic ? (event.address_ar || event.address) : event.address;
    
    const startDate = formatGoogleCalendarDate(event.start);
    const endDate = formatGoogleCalendarDate(event.end);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title || 'Event',
      dates: `${startDate}/${endDate}`,
      details: description || '',
      location: address || '',
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const isArabic = language === 'ar';
  const title = isArabic && event.title_ar ? event.title_ar : event.title;
  const description = isArabic && event.description_ar ? event.description_ar : event.description;
  // Separate address and location
  const address = isArabic ? (event.address_ar || event.address) : event.address;
  const location_url = extractMapUrl(event.location); // Extract URL from iframe or use URL directly
  const organizerName = isArabic && event.organizer?.name_ar ? event.organizer.name_ar : event.organizer?.name;
  const organizerDesc = isArabic && event.organizer?.description_ar ? event.organizer.description_ar : event.organizer?.description;

  return (
    <Layout pageTitle={`${title} || Hope for All Mena`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t('pageTitle')} crumbTitle={t('pageTitle')} />
      <>
        <section className="event-details pt-120" dir={isArabic ? 'rtl' : 'ltr'}>
          <Container>
            <Row className={isArabic ? 'flex-row-reverse' : ''}>
              <Col md={12} lg={6}>
                <h3 className={isArabic ? 'text-right' : 'text-left'}>{title}</h3>
                {description && description.split('\n').map((paragraph, index) => (
                  <p key={index} className={isArabic ? 'text-right' : 'text-left'}>
                    {paragraph}
                  </p>
                ))}
                {!description && (
                  <p className={isArabic ? 'text-right' : 'text-left'}>
                    {t('moreDetails')}
                  </p>
                )}
                <div className={`mt-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <a 
                    href={generateGoogleCalendarUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="thm-btn dynamic-radius mx-2"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <i className="far fa-calendar-plus"></i>
                    {t('addToCalendar')}
                  </a>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <img 
                  src={event.image || detailsImage} 
                  alt={title} 
                  className="img-fluid" 
                />
              </Col>
            </Row>
          </Container>
        </section>
        <div className="event-infos pt-20 pb-90" dir={isArabic ? 'rtl' : 'ltr'}>
          <Container>
            <Row className="d-flex align-items-stretch">
              <Col md={12} lg={4} className="mb-30 d-flex">
                <div className="event-infos__single background-secondary" style={{ minHeight: '440px', display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <h3 className={isArabic ? 'text-right' : 'text-left'}>{t('venue')}</h3>
                  <p className={isArabic ? 'text-right' : 'text-left'}>
                    {address || t('venueInfo')}
                  </p>
                  <ul className={`list-unstyled event-infos__list ${isArabic ? 'text-right' : 'text-left'}`}>
                    <li>{formatDate(event.start)}</li>
                    <li>{formatTime(event.start, event.end)}</li>
                    {address && <li>{address}</li>}
                  </ul>
                  {event.contactInfo && (
                    <div className={`event-infos__social ${isArabic ? 'text-right' : 'text-left'}`}>
                      {event.contactInfo.facebook && (
                        <a href={event.contactInfo.facebook} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-facebook-square"></i>
                        </a>
                      )}
                      {event.contactInfo.instagram && (
                        <a href={event.contactInfo.instagram} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-instagram"></i>
                        </a>
                      )}
                      {event.contactInfo.whatsapp && (
                        <a href={`https://wa.me/${event.contactInfo.whatsapp}`} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-whatsapp"></i>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30 d-flex flex-column">
                <div className="google-map__event" style={{ position: 'relative', overflow: 'hidden', borderRadius: '15px', minHeight: '440px', flex: '1' }}>
                  {location_url ? (
                    <iframe
                      title={t('location')}
                      src={location_url}
                      style={{ 
                        border: 0,
                        width: '100%',
                        height: '440px',
                        display: 'block',
                        borderRadius: '15px',
                        pointerEvents: 'auto'
                      }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>
                  ) : event.venue?.coordinates?.lat && event.venue?.coordinates?.lng ? (
                    <iframe
                      title={t('location')}
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${event.venue.coordinates.lng}!3d${event.venue.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2s!4v1234567890`}
                      style={{ 
                        border: 0,
                        width: '100%',
                        height: '440px',
                        display: 'block',
                        borderRadius: '15px',
                        pointerEvents: 'auto'
                      }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>
                  ) : event.venue?.mapUrl ? (
                    <iframe
                      title={t('location')}
                      src={event.venue.mapUrl}
                      style={{ 
                        border: 0,
                        width: '100%',
                        height: '440px',
                        display: 'block',
                        borderRadius: '15px',
                        pointerEvents: 'auto'
                      }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      frameBorder="0"
                      scrolling="no"
                    ></iframe>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center bg-light" style={{ minHeight: '440px', borderRadius: '15px' }}>
                      <p className={`text-muted ${isArabic ? 'text-right' : 'text-left'}`}>{t('mapNotAvailable')}</p>
                    </div>
                  )}
                </div>
              </Col>
              <Col md={12} lg={4} className="mb-30 d-flex">
                <div className="event-infos__single background-special" style={{ minHeight: '440px', display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <h3 className={isArabic ? 'text-right' : 'text-left'}>{t('organizer')}</h3>
                  <p className={isArabic ? 'text-right' : 'text-left'}>
                    {organizerDesc || organizerName || 'Hope for All Mena'}
                  </p>
                  <ul className={`list-unstyled event-infos__list event-infos__list-has-icons ${isArabic ? 'text-right' : 'text-left'}`}>
                    {(event.organizer?.phone || event.contactInfo?.phone) && (
                      <li>
                        <i className="azino-icon-telephone"></i>
                        <a href={`tel:${event.organizer?.phone || event.contactInfo?.phone}`}>
                          {event.organizer?.phone || event.contactInfo?.phone}
                        </a>
                      </li>
                    )}
                    {(event.organizer?.email || event.contactInfo?.email) && (
                      <li>
                        <i className="azino-icon-email"></i>
                        <a href={`mailto:${event.organizer?.email || event.contactInfo?.email}`}>
                          {event.organizer?.email || event.contactInfo?.email}
                        </a>
                      </li>
                    )}
                    {address && (
                      <li>
                        <i className="azino-icon-pin"></i>
                        <span>{address}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </>
      <Footer />
    </Layout>
  );
};

export default EventDetails;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
