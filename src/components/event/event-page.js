import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import EventCard from "./event-card";
import PostPaginations from "../post-paginations";
import eventService from "../../services/eventService";
import { useI18next } from 'gatsby-plugin-react-i18next';

// Fallback images
import image1 from "../../assets/images/events/event-1-1.jpg";

const EventPage = () => {
  const { language } = useI18next();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getPublicEvents({ page, limit });
      
      if (response.success && response.data) {
        setEvents(response.data);
        setTotalPages(response.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  const formatEventTime = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startTime = startDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    const endTime = endDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    return `${startTime} - ${endTime}`;
  };

  const transformEventForCard = (event) => {
    const isArabic = language === 'ar';
    
    return {
      image: event.image || image1,
      title: isArabic && event.title_ar ? event.title_ar : event.title,
      date: formatEventDate(event.start),
      time: formatEventTime(event.start, event.end),
      location: isArabic && event.address_ar ? event.address_ar : event.address || 'TBA',
      link: `/event-details?slug=${event.slug || event._id}`,
      slug: event.slug,
      id: event._id
    };
  };

  if (loading) {
    return (
      <section className="event-page pt-120 pb-120">
        <Container>
          <div className="text-center py-5">
            <p>Loading events...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="event-page pt-120 pb-120">
        <Container>
          <div className="text-center py-5">
            <p>No events available at the moment.</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="event-page pt-120 pb-120">
      <Container>
        <div className="event-grid">
          {events.map((event, index) => (
            <EventCard 
              data={transformEventForCard(event)} 
              key={event._id || `event-card-key-${index}`} 
            />
          ))}
        </div>
        {totalPages > 1 && (
          <PostPaginations 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </Container>
    </section>
  );
};

export default EventPage;
