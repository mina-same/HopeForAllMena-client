import React, { createContext, useContext, useState } from 'react';

const CalendarContext = createContext(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const categories = [
    { id: 'personal', name: 'Personal', color: 'hsl(var(--primary))', icon: 'user' },
    { id: 'work', name: 'Work', color: 'hsl(221 83% 53%)', icon: 'briefcase' },
    { id: 'meeting', name: 'Meeting', color: 'hsl(240 5% 64%)', icon: 'users' },
    { id: 'training', name: 'Training', color: 'hsl(262 83% 58%)', icon: 'graduation-cap' },
    { id: 'holiday', name: 'Holiday', color: 'hsl(142 71% 45%)', icon: 'sun' },
    { id: 'birthday', name: 'Birthday', color: 'hsl(350 89% 60%)', icon: 'cake' },
    { id: 'reminder', name: 'Reminder', color: 'hsl(45 93% 58%)', icon: 'bell' },
    { id: 'task', name: 'Task', color: 'hsl(20 90% 60%)', icon: 'check-square' },
    { id: 'appointment', name: 'Appointment', color: 'hsl(280 60% 60%)', icon: 'calendar-check' },
    { id: 'travel', name: 'Travel', color: 'hsl(200 80% 55%)', icon: 'plane' },
    { id: 'health', name: 'Health', color: 'hsl(160 60% 45%)', icon: 'heart' },
    { id: 'social', name: 'Social', color: 'hsl(320 70% 60%)', icon: 'coffee' }
  ];

  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Team Strategy Meeting',
      start: new Date(2024, 11, 15, 10, 0),
      end: new Date(2024, 11, 15, 12, 0),
      category: 'meeting',
      priority: 'high',
      status: 'confirmed',
      location: 'Conference Room A, Main Office',
      description: 'Quarterly strategy planning and goal setting session.',
      attendees: ['john.smith@company.com', 'sarah.doe@company.com'],
      organizer: 'admin@company.com',
      reminders: [15, 60],
      tags: ['quarterly', 'strategy', 'team'],
      organizationName: 'TechCorp Inc.',
      contactPerson: 'John Smith',
      participants: 12,
      requestId: '1'
    },
    {
      id: '2',
      title: 'Product Launch Workshop',
      start: new Date(2024, 11, 20, 14, 0),
      end: new Date(2024, 11, 20, 18, 0),
      category: 'training',
      priority: 'high',
      status: 'confirmed',
      location: 'Innovation Hub, Floor 3',
      description: 'Interactive workshop for new product launch preparation.',
      attendees: ['sarah.williams@startup.com'],
      organizer: 'events@startup.com',
      reminders: [30, 120],
      tags: ['product', 'launch', 'workshop'],
      organizationName: 'StartupLabs',
      contactPerson: 'Sarah Williams',
      participants: 35,
      requestId: '2'
    },
    {
      id: '3',
      title: 'Leadership Training Program',
      start: new Date(2024, 12, 1, 9, 0),
      end: new Date(2024, 12, 1, 15, 0),
      category: 'training',
      priority: 'medium',
      status: 'confirmed',
      location: 'Training Center, Building B',
      description: 'Comprehensive leadership development and team management training.',
      attendees: ['david.brown@company.com'],
      organizer: 'training@company.com',
      reminders: [60, 1440],
      tags: ['leadership', 'management', 'training'],
      organizationName: 'Professional Development Co.',
      contactPerson: 'David Brown',
      participants: 50,
      requestId: '3'
    },
    {
      id: '4',
      title: 'Dentist Appointment',
      start: new Date(2024, 11, 18, 14, 30),
      end: new Date(2024, 11, 18, 15, 30),
      category: 'health',
      priority: 'medium',
      status: 'confirmed',
      location: 'Downtown Dental Care',
      description: 'Regular checkup and cleaning',
      reminders: [60, 1440],
      tags: ['health', 'routine']
    },
    {
      id: '5',
      title: 'Mom\'s Birthday',
      start: new Date(2024, 11, 25),
      end: new Date(2024, 11, 25),
      allDay: true,
      category: 'birthday',
      priority: 'high',
      status: 'confirmed',
      description: 'Don\'t forget to call!',
      reminders: [0, 1440],
      tags: ['family', 'birthday'],
      recurring: {
        frequency: 'yearly',
        interval: 1
      }
    }
  ]);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id, updates) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const duplicateEvent = (id) => {
    const eventToDuplicate = events.find(event => event.id === id);
    if (eventToDuplicate) {
      const duplicatedEvent = {
        ...eventToDuplicate,
        id: Date.now().toString(),
        title: `${eventToDuplicate.title} (Copy)`,
        start: new Date(eventToDuplicate.start.getTime() + 24 * 60 * 60 * 1000), // Next day
        end: new Date(eventToDuplicate.end.getTime() + 24 * 60 * 60 * 1000),
      };
      setEvents(prev => [...prev, duplicatedEvent]);
    }
  };

  const getEventsByCategory = (category) => {
    return events.filter(event => event.category === category);
  };

  const getEventsInRange = (startDate, endDate) => {
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return (eventStart >= startDate && eventStart <= endDate) ||
             (eventEnd >= startDate && eventEnd <= endDate) ||
             (eventStart <= startDate && eventEnd >= endDate);
    });
  };

  const searchEvents = (query) => {
    const lowerQuery = query.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      (event.description && event.description.toLowerCase().includes(lowerQuery)) ||
      (event.location && event.location.toLowerCase().includes(lowerQuery)) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
      (event.attendees && event.attendees.some(attendee => attendee.toLowerCase().includes(lowerQuery)))
    );
  };

  const getUpcomingEvents = (limit = 5) => {
    const now = new Date();
    return events
      .filter(event => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, limit);
  };

  const hasConflicts = (event) => {
    if (!event.start || !event.end) return false;
    
    return events.some(existingEvent => {
      if (event.id && existingEvent.id === event.id) return false;
      
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      const existingStart = new Date(existingEvent.start);
      const existingEnd = new Date(existingEvent.end);
      
      return (eventStart < existingEnd && eventEnd > existingStart);
    });
  };

  const scheduleRequest = (requestData) => {
    const eventTitle = `${requestData.eventType} Session`;
    const eventDate = new Date(requestData.suggestedDate);
    const startTime = new Date(eventDate);
    startTime.setHours(10, 0, 0, 0); // 10:00 AM
    const endTime = new Date(startTime);
    endTime.setHours(13, 0, 0, 0); // 1:00 PM (3 hours)
    
    const newEvent = {
      id: `scheduled-${requestData.requestId}-${Date.now()}`,
      title: eventTitle,
      start: startTime,
      end: endTime,
      category: 'training',
      priority: 'medium',
      status: 'confirmed',
      location: requestData.location,
      description: `${requestData.eventType} session scheduled.`,
      organizationName: requestData.organizationName,
      contactPerson: requestData.contactPerson,
      participants: requestData.participants,
      requestId: requestData.requestId
    };

    setEvents(prev => [...prev, newEvent]);
  };

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        duplicateEvent,
        getEventsByCategory,
        getEventsInRange,
        searchEvents,
        getUpcomingEvents,
        hasConflicts,
        categories,
        scheduleRequest,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};