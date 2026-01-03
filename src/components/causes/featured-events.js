import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Container, Row, Col } from "react-bootstrap";
import { useI18next, useTranslation, Link } from "gatsby-plugin-react-i18next";
import heartImage from "../../assets/images/shapes/heart-2-1.png";
import defaultEventImage from "../../assets/images/events/event-details-1-1.jpg";
import eventService from "../../services/eventService";

const FeaturedEvents = () => {
  const { language } = useI18next();
  const { t } = useTranslation("FeaturedEvents");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEvents();
  }, []);

  const fetchFeaturedEvents = async () => {
    try {
      const response = await eventService.getFeaturedEvents(3);
      if (response.success && response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("Error fetching featured events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate time progress percentage
  const calculateProgress = (createdAt, startDate) => {
    const created = new Date(createdAt).getTime();
    const start = new Date(startDate).getTime();
    const now = Date.now();

    if (now >= start) return 100; // Event has started
    if (now <= created) return 0; // Not created yet (shouldn't happen)

    const totalTime = start - created;
    const elapsed = now - created;
    const percentage = Math.floor((elapsed / totalTime) * 100);

    return Math.min(100, Math.max(0, percentage));
  };

  // Calculate countdown
  const useCountdown = (targetDate) => {
    const [countdown, setCountdown] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      const interval = setInterval(() => {
        const now = Date.now();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference > 0) {
          setCountdown({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        } else {
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    return countdown;
  };

  const EventCard = ({ event }) => {
    const isArabic = language === "ar";
    const title = isArabic && event.title_ar ? event.title_ar : event.title;
    const description = isArabic && event.description_ar ? event.description_ar : event.description;
    const address = isArabic ? (event.address_ar || event.address) : event.address;
    const progressCount = calculateProgress(event.createdAt, event.start);
    const countdown = useCountdown(event.start);

    // Format date for display
    const formatDate = (date) => {
      const d = new Date(date);
      const locale = isArabic ? "ar-EG" : "en-US";
      return d.toLocaleDateString(locale, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    // Generate Google Calendar URL
    const formatGoogleCalendarDate = (date) => {
      const d = new Date(date);
      return d.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const generateGoogleCalendarUrl = () => {
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

    return (
      <div className="cause-card" style={{ height: '100%' }}>
        <div className="cause-card__inner" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="cause-card__image">
            <img src={event.image || defaultEventImage} alt={title} />
          </div>
          <div className="cause-card__content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="cause-card__top">
              <div className="cause-card__progress">
                <span
                  style={{ width: `${progressCount}%` }}
                  className="wow cardProgress"
                  data-wow-duration="1500ms"
                >
                  <b>
                    <i>{progressCount}</i>%
                  </b>
                </span>
              </div>
              <div className="cause-card__goals">
                <p>
                  <strong>{t("countdown")}:</strong>
                </p>
                <p className="countdown-timer">
                  {countdown.days > 0 && (
                    <span>
                      {countdown.days} {t("days")}{" "}
                    </span>
                  )}
                  {countdown.hours}:{String(countdown.minutes).padStart(2, "0")}:
                  {String(countdown.seconds).padStart(2, "0")}
                </p>
                <p style={{ fontSize: "12px", marginTop: "5px" }}>
                  <strong>{t("date")}:</strong> {formatDate(event.start)}
                </p>
              </div>
            </div>
            <h3 style={{ minHeight: '60px', display: 'flex', alignItems: 'center' }}>
              <Link to={`/event-details?slug=${event.slug}`}>{title}</Link>
            </h3>
            <p style={{ minHeight: '80px', flex: 1 }}>{description ? description.substring(0, 100) + "..." : ""}</p>
            <div className="cause-card__bottom" style={{ marginTop: 'auto' }}>
              <Link
                className="thm-btn"
                to={`/event-details?slug=${event.slug}`}
              >
                {t("showDetails")}
              </Link>
              <a 
                className="cause-card__share" 
                href={generateGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                title={t("addToCalendar")}
              >
                <i className="far fa-calendar-plus"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isArabic = language === "ar";

  if (loading) {
    return (
      <section className="causes-page causes-home pt-120 pb-120">
        <Container>
          <div className="text-center py-5">
            <p>{t("loading")}</p>
          </div>
        </Container>
      </section>
    );
  }

  if (events.length === 0) {
    return null; // Don't show section if no featured events
  }
  const swiperParams = {
    slidesPerView: 3,
    spaceBetween: 30,
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      375: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      575: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 30
      },
      991: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1199: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };
  return (
    <section className="causes-page causes-home pt-120 pb-120">
      <Container>
        <Row className="align-items-start align-items-md-center flex-column flex-md-row mb-60">
          <Col lg={7}>
            <div className="block-title">
              <p>
                <img src={heartImage} width="15" alt="" />
                {t("title")}
              </p>
              <h3>{t("subtitle")}</h3>
            </div>
          </Col>
          <Col lg={5} className="d-flex">
            <div className="my-auto">
              <p className="block-text pr-10 mb-0">
                {t("description")}
              </p>
            </div>
          </Col>
        </Row>
        <Swiper {...swiperParams}>
          {events.map((event, index) => (
            <SwiperSlide key={`featured-event-${event._id || index}`} style={{ height: 'auto' }}>
              <EventCard event={event} />
              </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </section>
  );
};

export default FeaturedEvents;
