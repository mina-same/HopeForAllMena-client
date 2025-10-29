// 'use client';
import React from 'react';
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogActions, Drawer, AppBar, Toolbar, IconButton } from '@mui/material';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
// Removed MUI date pickers - using native HTML date inputs instead
import moment from 'moment';
import eventService from '../../services/eventService';
import { IconCheck, IconX, IconPlus, IconCalendar, IconList, IconWorld, IconStar, IconPhoto, IconMail, IconPhone, IconBrandWhatsapp, IconBrandFacebook, IconBrandInstagram, IconMapPin, IconUser, IconClock, IconCategory, IconInfoCircle } from '@tabler/icons-react';
import BlankCard from '../../components/Calendar/BlankCard';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../components/Calendar/Calendar.css';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

// Mobile Event List Component
const MobileEventList = ({ events, onEventClick, onAddEvent }) => {
  const groupedEvents = events.reduce((groups, event) => {
    const date = moment(event.start).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="mobile-event-list" style={{ padding: '0 16px' }}>
      {sortedDates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
          <IconCalendar size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
          <Typography variant="body1" style={{ marginBottom: '8px' }}>No events scheduled</Typography>
          <Typography variant="body2" color="textSecondary">Tap the + button to add your first event</Typography>
        </div>
      ) : (
        sortedDates.map(date => (
          <div key={date} style={{ marginBottom: '24px' }}>
            <Typography variant="h6" style={{ 
              fontWeight: 600, 
              marginBottom: '12px',
              color: '#2194D1',
              borderBottom: '2px solid #e0e0e0',
              paddingBottom: '8px'
            }}>
              {moment(date).format('dddd, MMMM Do')}
            </Typography>
            {groupedEvents[date].map(event => (
              <div 
                key={event.id} 
                onClick={() => onEventClick(event)}
                style={{
                  backgroundColor: '#f8f9fa',
                  border: `3px solid ${getEventColor(event.color)}`,
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '4px' }}>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginBottom: '8px' }}>
                  {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                </Typography>
                {event.location && (
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '4px' }}>
                    📍 {event.location}
                  </Typography>
                )}
                {event.description && (
                  <Typography variant="body2" color="textSecondary">
                    {event.description}
                  </Typography>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

// Mobile Event Form Component
const MobileEventForm = ({ 
  title, description, location, start, end, color, update,
  onTitleChange, onDescriptionChange, onLocationChange, 
  onStartChange, onEndChange, onColorChange, onSubmit, onDelete, onCancel,
  ColorVariation 
}) => {
  return (
    <form onSubmit={onSubmit} style={{ paddingBottom: '20px' }}>
      <TextField
        placeholder="Event Title"
        variant="outlined"
        fullWidth
        label="Title"
        value={title}
        onChange={onTitleChange}
        style={{ marginBottom: '16px' }}
        size="medium"
      />
      
      <TextField
        placeholder="Event Description"
        variant="outlined"
        fullWidth
        label="Description"
        multiline
        rows={3}
        value={description}
        onChange={onDescriptionChange}
        style={{ marginBottom: '16px' }}
        size="medium"
      />
      
      <TextField
        placeholder="Event Location"
        variant="outlined"
        fullWidth
        label="Location"
        value={location}
        onChange={onLocationChange}
        style={{ marginBottom: '16px' }}
        size="medium"
      />

      <TextField
        label="Start Date & Time"
        type="datetime-local"
        value={start ? moment(start).format('YYYY-MM-DDTHH:mm') : ''}
        onChange={(e) => onStartChange(new Date(e.target.value))}
        fullWidth
        style={{ marginBottom: '16px' }}
        InputLabelProps={{ shrink: true }}
        size="medium"
      />

      <TextField
        label="End Date & Time"
        type="datetime-local"
        value={end ? moment(end).format('YYYY-MM-DDTHH:mm') : ''}
        onChange={(e) => onEndChange(new Date(e.target.value))}
        fullWidth
        style={{ marginBottom: '16px' }}
        error={start && end && start > end}
        helperText={start && end && start > end ? "End date must be later than start date" : ""}
        InputLabelProps={{ shrink: true }}
        size="medium"
      />

      <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '12px' }}>
        Event Color
      </Typography>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {ColorVariation.map((mcolor) => (
          <div
            key={mcolor.id}
            onClick={() => onColorChange(mcolor.value)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: mcolor.eColor,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: mcolor.value === color ? '3px solid #333' : '2px solid #ddd',
              transition: 'all 0.2s ease',
              transform: mcolor.value === color ? 'scale(1.1)' : 'scale(1)'
            }}
          >
            {mcolor.value === color && <IconCheck size={16} color="white" />}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
        <Button 
          onClick={onCancel} 
          variant="outlined" 
          fullWidth
          size="large"
        >
          Cancel
        </Button>
        
        {update && (
          <Button
            onClick={onDelete}
            variant="contained"
            color="error"
            fullWidth
            size="large"
          >
            Delete
          </Button>
        )}
        
        <Button 
          type="submit" 
          disabled={!title} 
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          {update ? 'Update' : 'Add Event'}
        </Button>
      </div>
    </form>
  );
};

// Helper function to get event color
const getEventColor = (colorValue) => {
  const colorMap = {
    'default': '#1a97f5',
    'green': '#39b69a',
    'red': '#fc4b6c',
    'azure': '#615dff',
    'warning': '#fdd43f'
  };
  return colorMap[colorValue] || colorMap.default;
};

const BigCalendar = () => {
  const [calevents, setCalEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  
  // Basic event fields
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [location, setLocation] = React.useState(''); // Map URL
  const [slot, setSlot] = React.useState();
  const [start, setStart] = React.useState();
  const [end, setEnd] = React.useState();
  const [color, setColor] = React.useState('default');
  const [update, setUpdate] = React.useState();
  
  // Public event fields
  const [isPublic, setIsPublic] = React.useState(false);
  const [isFeatured, setIsFeatured] = React.useState(false);
  const [titleAr, setTitleAr] = React.useState('');
  const [descriptionAr, setDescriptionAr] = React.useState('');
  const [addressAr, setAddressAr] = React.useState('');
  const [slug, setSlug] = React.useState('');
  const [image, setImage] = React.useState('');
  const [imageFile, setImageFile] = React.useState(null);
  const [contactEmail, setContactEmail] = React.useState('');
  const [contactPhone, setContactPhone] = React.useState('');
  const [contactWhatsapp, setContactWhatsapp] = React.useState('');
  const [contactFacebook, setContactFacebook] = React.useState('');
  const [contactInstagram, setContactInstagram] = React.useState('');
  const [organizerName, setOrganizerName] = React.useState('');
  const [organizerNameAr, setOrganizerNameAr] = React.useState('');
  const [organizerEmail, setOrganizerEmail] = React.useState('');
  const [organizerPhone, setOrganizerPhone] = React.useState('');
  const [category, setCategory] = React.useState('other');
  const [status, setStatus] = React.useState('scheduled');
  
  const [currentView, setCurrentView] = React.useState('month');
  const [showMobileEventList, setShowMobileEventList] = React.useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Category to Color mapping
  const categoryColorMap = {
    'other': 'default',
    'meeting': 'azure',
    'training': 'green',
    'sunday-school': 'warning',
    'workshop': 'red',
    'conference': 'default'
  };

  const ColorVariation = [
    {
      id: 1,
      eColor: '#1a97f5',
      value: 'default',
    },
    {
      id: 2,
      eColor: '#39b69a',
      value: 'green',
    },
    {
      id: 3,
      eColor: '#fc4b6c',
      value: 'red',
    },
    {
      id: 4,
      eColor: '#615dff',
      value: 'azure',
    },
    {
      id: 5,
      eColor: '#fdd43f',
      value: 'warning',
    },
  ];

  // Auto-select color when category changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    const newColor = categoryColorMap[newCategory] || 'default';
    setColor(newColor);
  };

  // Load events from API on component mount
  React.useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getAllEvents();
      const transformedEvents = response.data.map(event => 
        eventService.transformEventForCalendar(event)
      );
      setCalEvents(transformedEvents);
    } catch (err) {
      setError('Failed to load events. Please try again.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  const addNewEventAlert = (slotInfo) => {
    setOpen(true);
    setSlot(slotInfo);
    setStart(slotInfo.start);
    setEnd(slotInfo.end);
    // Reset basic fields
    setTitle('');
    setDescription('');
    setAddress('');
    setLocation('');
    
    // Set default category and its corresponding color
    const defaultCategory = 'other';
    setCategory(defaultCategory);
    setColor(categoryColorMap[defaultCategory] || 'default');
    
    setStatus('scheduled');
    // Reset public event fields
    setIsPublic(false);
    setIsFeatured(false);
    setTitleAr('');
    setDescriptionAr('');
    setAddressAr('');
    setSlug('');
    setImage('');
    setImageFile(null);
    setContactEmail('');
    setContactPhone('');
    setContactWhatsapp('');
    setContactFacebook('');
    setContactInstagram('');
    setOrganizerName('');
    setOrganizerNameAr('');
    setOrganizerEmail('');
    setOrganizerPhone('');
    setUpdate(null);
  };

  const editEvent = (event) => {
    setOpen(true);
    // Basic fields
    setTitle(event.title);
    setDescription(event.description || '');
    setAddress(event.address || '');
    setLocation(event.location || ''); // Map URL
    
    // Set category first, then color (so we can override if needed)
    const eventCategory = event.category || 'other';
    setCategory(eventCategory);
    
    // Use event's color if set, otherwise use category default
    const eventColor = event.color || categoryColorMap[eventCategory] || 'default';
    setColor(eventColor);
    
    setStatus(event.status || 'scheduled');
    // Ensure dates are proper Date objects
    setStart(event.start instanceof Date ? event.start : new Date(event.start));
    setEnd(event.end instanceof Date ? event.end : new Date(event.end));
    // Public event fields
    setIsPublic(event.isPublic || false);
    setIsFeatured(event.isFeatured || false);
    setTitleAr(event.title_ar || '');
    setDescriptionAr(event.description_ar || '');
    setAddressAr(event.address_ar || '');
    setSlug(event.slug || '');
    setImage(event.image || '');
    setImageFile(null);
    // Contact info
    setContactEmail(event.contactInfo?.email || '');
    setContactPhone(event.contactInfo?.phone || '');
    setContactWhatsapp(event.contactInfo?.whatsapp || '');
    setContactFacebook(event.contactInfo?.facebook || '');
    setContactInstagram(event.contactInfo?.instagram || '');
    // Organizer
    setOrganizerName(event.organizer?.name || event.organizer || '');
    setOrganizerNameAr(event.organizer?.name_ar || '');
    setOrganizerEmail(event.organizer?.email || '');
    setOrganizerPhone(event.organizer?.phone || '');
    setUpdate(event);
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    
    if (!start || !end) {
      setError('Start and end dates are required.');
      return;
    }
    
    if (start >= end) {
      setError('End date must be after start date.');
      return;
    }
    
    try {
      // Handle image upload if needed
      let imageUrl = image;
      let imagePublicId = update.imagePublicId;
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await fetch('http://localhost:5001/api/upload/single', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${eventService.getAuthToken()}`
          },
          body: formData
        });
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.imageUrl;
          imagePublicId = uploadData.public_id;
        }
      }
      
      const eventData = eventService.transformEventForAPI({
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        location: location.trim(), // Map URL
        start,
        end,
        color,
        category,
        status,
        // Public event fields
        isPublic,
        isFeatured,
        title_ar: titleAr.trim(),
        description_ar: descriptionAr.trim(),
        address_ar: addressAr.trim(),
        slug: slug.trim(),
        image: imageUrl,
        imagePublicId: imagePublicId,
        contactInfo: (contactEmail || contactPhone || contactWhatsapp || contactFacebook || contactInstagram) ? {
          email: contactEmail.trim(),
          phone: contactPhone.trim(),
          whatsapp: contactWhatsapp.trim(),
          facebook: contactFacebook.trim(),
          instagram: contactInstagram.trim()
        } : undefined,
        organizer: (organizerName || organizerEmail || organizerPhone) ? {
          name: organizerName.trim(),
          name_ar: organizerNameAr.trim(),
          email: organizerEmail.trim(),
          phone: organizerPhone.trim()
        } : undefined
      });

      console.log('Updating event with data:', eventData);
      await eventService.updateEvent(update.id, eventData);
      await loadEvents(); // Reload events from server
      handleClose();
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err.message || 'Failed to update event. Please try again.';
      setError(errorMessage);
      console.error('Error updating event:', err);
    }
  };
  const inputChangeHandler = (e) => setTitle(e.target.value);
  const selectinputChangeHandler = (id) => setColor(id);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }
    
    if (!start || !end) {
      setError('Start and end dates are required.');
      return;
    }
    
    if (start >= end) {
      setError('End date must be after start date.');
      return;
    }
    
    try {
      // Handle image upload if needed
      let imageUrl = '';
      let imagePublicId = '';
      
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadResponse = await fetch('http://localhost:5001/api/upload/single', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${eventService.getAuthToken()}`
          },
          body: formData
        });
        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          imageUrl = uploadData.imageUrl;
          imagePublicId = uploadData.public_id;
        }
      }
      
      const eventData = eventService.transformEventForAPI({
        title: title.trim(),
        description: description.trim(),
        address: address.trim(),
        location: location.trim(), // Map URL
        start,
        end,
        color,
        category,
        status,
        // Public event fields
        isPublic,
        isFeatured,
        title_ar: titleAr.trim(),
        description_ar: descriptionAr.trim(),
        address_ar: addressAr.trim(),
        slug: slug.trim(),
        image: imageUrl,
        imagePublicId: imagePublicId,
        contactInfo: (contactEmail || contactPhone || contactWhatsapp || contactFacebook || contactInstagram) ? {
          email: contactEmail.trim(),
          phone: contactPhone.trim(),
          whatsapp: contactWhatsapp.trim(),
          facebook: contactFacebook.trim(),
          instagram: contactInstagram.trim()
        } : undefined,
        organizer: (organizerName || organizerEmail || organizerPhone) ? {
          name: organizerName.trim(),
          name_ar: organizerNameAr.trim(),
          email: organizerEmail.trim(),
          phone: organizerPhone.trim()
        } : undefined
      });

      console.log('Creating event with data:', eventData);
      await eventService.createEvent(eventData);
      await loadEvents(); // Reload events from server
      handleClose();
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err.message || 'Failed to create event. Please try again.';
      setError(errorMessage);
      console.error('Error creating event:', err);
    }
  };

  const deleteHandler = async (event) => {
    try {
      await eventService.deleteEvent(event.id);
      await loadEvents(); // Reload events from server
      handleClose();
    } catch (err) {
      setError('Failed to delete event. Please try again.');
      console.error('Error deleting event:', err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset basic fields
    setTitle('');
    setDescription('');
    setAddress('');
    setLocation('');
    setStart(new Date());
    setEnd(new Date());
    setColor('default');
    setCategory('other');
    setStatus('scheduled');
    // Reset public event fields
    setIsPublic(false);
    setIsFeatured(false);
    setTitleAr('');
    setDescriptionAr('');
    setAddressAr('');
    setSlug('');
    setImage('');
    setImageFile(null);
    setContactEmail('');
    setContactPhone('');
    setContactWhatsapp('');
    setContactFacebook('');
    setContactInstagram('');
    setOrganizerName('');
    setOrganizerNameAr('');
    setOrganizerEmail('');
    setOrganizerPhone('');
    setUpdate(null);
    setError(null);
  };

  const eventColors = (event) => {
    const style = {};
    
    if (event.color) {
      return { 
        className: `event-${event.color}`,
        style: event.isPublic ? { 
          borderLeft: '4px solid #000',
          fontWeight: '600'
        } : {}
      };
    }

    return { 
      className: `event-default`,
      style: event.isPublic ? { 
        borderLeft: '4px solid #000',
        fontWeight: '600'
      } : {}
    };
  };

  // Custom event component to show public badge
  const CustomEvent = ({ event }) => {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '4px',
        overflow: 'hidden'
      }}>
        {event.isPublic && (
          <IconWorld 
            size={14} 
            style={{ 
              flexShrink: 0,
              color: '#667eea',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
            }} 
          />
        )}
        {event.isFeatured && (
          <IconStar 
            size={14} 
            style={{ 
              flexShrink: 0,
              color: '#ffc107',
              fill: '#ffc107',
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
            }} 
          />
        )}
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {event.title}
        </span>
      </div>
    );
  };

  const handleStartChange = (newValue) => {
    setStart(newValue);
  };
  const handleEndChange = (newValue) => {
    setEnd(newValue);
  };

  if (loading) {
    return (
      <BlankCard className="rounded-xl">
        <CardContent className="rounded-xl shadow-none">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <Typography>Loading calendar events...</Typography>
          </div>
        </CardContent>
      </BlankCard>
    );
  }

  return (<>
    <BlankCard className="rounded-xl">
      {/* ------------------------------------------- */}
      {/* Calendar */}
      {/* ------------------------------------------- */}
      <CardContent className="rounded-xl shadow-none">
        {error && (
          <div style={{ 
            backgroundColor: '#ffebee', 
            color: '#c62828', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '16px' 
          }}>
            {error}
          </div>
        )}
        
        {/* Event Legend */}
        <div style={{
          display: 'flex',
          gap: '20px',
          padding: '12px 16px',
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          borderRadius: '12px',
          border: '1px solid #e0e0e0',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#333' }}>
            Legend:
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconWorld size={16} style={{ color: '#667eea' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              Public Event (appears on Events page)
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <IconStar size={16} style={{ color: '#ffc107', fill: '#ffc107' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              Featured (appears on Home page)
            </Typography>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '4px', height: '16px', backgroundColor: '#000', borderRadius: '2px' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              Bold black border
            </Typography>
          </div>
        </div>
        
        {isMobile ? (
          <div className="mobile-calendar-container">
            {/* Mobile Calendar Header */}
            <div className="mobile-calendar-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderBottom: '1px solid #e0e0e0',
              marginBottom: '16px'
            }}>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                {moment().format('MMMM YYYY')}
              </Typography>
              <div style={{ display: 'flex', gap: '8px' }}>
                <IconButton 
                  onClick={() => setShowMobileEventList(!showMobileEventList)}
                  size="small"
                  style={{ 
                    backgroundColor: showMobileEventList ? '#2194D1' : '#f5f5f5',
                    color: showMobileEventList ? 'white' : '#666'
                  }}
                >
                  {showMobileEventList ? <IconCalendar size={20} /> : <IconList size={20} />}
                </IconButton>
                <IconButton 
                  onClick={() => addNewEventAlert({ start: new Date(), end: new Date() })}
                  size="small"
                  style={{ backgroundColor: '#2194D1', color: 'white' }}
                >
                  <IconPlus size={20} />
                </IconButton>
              </div>
            </div>

            {showMobileEventList ? (
              <MobileEventList 
                events={calevents} 
                onEventClick={editEvent}
                onAddEvent={() => addNewEventAlert({ start: new Date(), end: new Date() })}
              />
            ) : (
              <Calendar
                selectable
                events={calevents}
                view={isSmallMobile ? 'agenda' : currentView}
                onView={setCurrentView}
                views={isSmallMobile ? ['agenda'] : ['month', 'week', 'day', 'agenda']}
                localizer={localizer}
                style={{ 
                  height: isSmallMobile ? '400px' : '500px',
                  fontSize: '12px'
                }}
                onSelectEvent={(event) => editEvent(event)}
                onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
                eventPropGetter={(event) => eventColors(event)}
                components={{
                  event: CustomEvent
                }}
                toolbar={!isSmallMobile}
                popup
                popupOffset={30}
                formats={{
                  timeGutterFormat: 'HH:mm',
                  eventTimeRangeFormat: ({ start, end }) => 
                    `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
                  agendaTimeFormat: 'HH:mm',
                  agendaDateFormat: 'ddd MMM DD',
                }}
              />
            )}
          </div>
        ) : (
          <Calendar
            selectable
            events={calevents}
            view={currentView}
            onView={setCurrentView}
            views={['month', 'week', 'day', 'agenda']}
            localizer={localizer}
            style={{ height: 'calc(100vh - 400px)' }}
            onSelectEvent={(event) => editEvent(event)}
            onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
            eventPropGetter={(event) => eventColors(event)}
            components={{
              event: CustomEvent
            }}
          />
        )}
      </CardContent>
    </BlankCard>
    {/* ------------------------------------------- */}
    {/* Add Calendar Event Dialog */}
    {/* ------------------------------------------- */}
    {isMobile ? (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            maxHeight: '90vh'
          }
        }}
      >
        <AppBar position="static" color="transparent" elevation={0} style={{ borderBottom: '1px solid #e0e0e0' }}>
          <Toolbar style={{ justifyContent: 'space-between', minHeight: '56px' }}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              {update ? 'Update Event' : 'Add Event'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <IconX size={20} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ padding: '16px', overflowY: 'auto' }}>
          <MobileEventForm 
            title={title}
            description={description}
            location={location}
            start={start}
            end={end}
            color={color}
            update={update}
            onTitleChange={inputChangeHandler}
            onDescriptionChange={(e) => setDescription(e.target.value)}
            onLocationChange={(e) => setLocation(e.target.value)}
            onStartChange={handleStartChange}
            onEndChange={handleEndChange}
            onColorChange={selectinputChangeHandler}
            onSubmit={update ? updateEvent : submitHandler}
            onDelete={update ? () => deleteHandler(update) : null}
            onCancel={handleClose}
            ColorVariation={ColorVariation}
          />
        </div>
      </Drawer>
    ) : (
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          }
        }}
      >
      <form onSubmit={update ? updateEvent : submitHandler}>
        {/* Beautiful Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconCalendar size={32} />
              {update ? 'Update Event' : 'Create New Event'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, fontSize: '15px' }}>
            {!update
                ? 'Fill in the details below to create an amazing event'
                : 'Update your event information and settings'}
            </Typography>
          </div>
        </div>

        <DialogContent sx={{ p: 4, background: '#fafafa' }}>
          
          {/* Basic Information Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0',
            transition: 'all 0.3s ease'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              mb: 3, 
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IconInfoCircle size={20} color="white" />
              </div>
              Basic Information
          </Typography>

          <TextField
              placeholder="e.g., Annual Charity Gala"
            variant="outlined"
            fullWidth
            label="Event Title"
            value={title}
            onChange={inputChangeHandler}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                  }
                }
              }}
              InputProps={{
                sx: { fontSize: '15px' }
              }}
          />
          
          <TextField
              placeholder="Tell people what this event is about..."
            variant="outlined"
            fullWidth
            label="Description"
            multiline
              rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                  }
                }
              }}
          />
          
          <TextField
              placeholder="e.g., Downtown Convention Center, 123 Main St"
            variant="outlined"
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
              sx={{
                mb: 2.5,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <IconMapPin size={20} style={{ marginRight: '8px', color: '#667eea' }} />
                )
              }}
            />
            
            <TextField
              placeholder="e.g., https://maps.google.com/?q=..."
            variant="outlined"
            fullWidth
            label="Map Link (Optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <IconWorld size={20} style={{ marginRight: '8px', color: '#667eea' }} />
                )
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#999' }}>
              💡 Paste a Google Maps link to show the location on a map
            </Typography>
          </div>
          
          {/* Category Selection Card - Available for ALL events */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              mb: 3, 
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex'
              }}>
                <IconCategory size={20} color="white" />
              </div>
              Event Category & Color
            </Typography>
            
            <TextField
              select
              label="Select Category"
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              fullWidth
              SelectProps={{ native: true }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover': { boxShadow: '0 4px 12px rgba(79, 172, 254, 0.15)' },
                  '&.Mui-focused': { boxShadow: '0 4px 16px rgba(79, 172, 254, 0.25)' }
                }
              }}
            >
              <option value="other">🔹 Other</option>
              <option value="meeting">💼 Meeting</option>
              <option value="training">📚 Training</option>
              <option value="sunday-school">⛪ Sunday School</option>
              <option value="workshop">🛠️ Workshop</option>
              <option value="conference">🎤 Conference</option>
            </TextField>

            {/* Color Preview & Picker */}
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#666', display: 'flex', alignItems: 'center', gap: 1 }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                background: ColorVariation.find(c => c.value === color)?.eColor || '#1a97f5',
                border: '2px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }} />
              Selected Color for {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </Typography>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {ColorVariation.map((mcolor) => (
                <div
                  key={mcolor.id}
                  onClick={() => setColor(mcolor.value)}
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: mcolor.eColor,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: mcolor.value === color ? '4px solid #333' : '2px solid transparent',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: mcolor.value === color ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: mcolor.value === color 
                      ? `0 8px 20px ${mcolor.eColor}60`
                      : '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                >
                  {mcolor.value === color && (
                    <div style={{
                      background: 'white',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <IconCheck size={18} color={mcolor.eColor} strokeWidth={3} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#999' }}>
              💡 Color auto-selects based on category, but you can change it manually
            </Typography>
          </div>
          
          {/* Public Event Toggle Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: isPublic ? '2px solid #667eea' : '1px solid #e0e0e0',
            transition: 'all 0.4s ease'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: isPublic ? '16px' : '0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{
                  background: isPublic ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f0f0f0',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  <IconWorld size={24} color={isPublic ? 'white' : '#666'} />
                </div>
                <div style={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', fontSize: '16px' }}>
                    Public Event
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '13px' }}>
                    Make this event visible on your website
                  </Typography>
                </div>
              </div>
              <div style={{
                position: 'relative',
                width: '64px',
                height: '34px',
                borderRadius: '17px',
                background: isPublic ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ddd',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: isPublic ? '0 4px 12px rgba(102, 126, 234, 0.4)' : 'none'
              }}
              onClick={() => setIsPublic(!isPublic)}
              >
                <div style={{
                  position: 'absolute',
                  top: '3px',
                  left: isPublic ? '33px' : '3px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isPublic && <IconCheck size={16} color="#667eea" />}
                </div>
              </div>
            </div>
            
            {isPublic && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: '12px',
                border: '1px solid rgba(102, 126, 234, 0.3)',
                animation: 'fadeIn 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px',
                    padding: '8px',
                    display: 'flex'
                  }}>
                    <IconCheck size={20} color="white" />
                  </div>
                  <Typography variant="body2" sx={{ color: '#667eea', fontWeight: 600, fontSize: '14px' }}>
                    Great! This event will be displayed on /events with all the details below
                  </Typography>
                </div>
              </div>
            )}
          </div>
          
          {/* ------------------------------------------- */}
          {/* Public Event Fields (shown when isPublic is true) */}
          {/* ------------------------------------------- */}
          {isPublic && (
            <>
              {/* Multilingual Content Card */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 3, 
                  color: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconWorld size={20} color="white" />
                  </div>
                  Multilingual Content (Arabic)
                </Typography>
                
          <TextField
                  placeholder="العنوان بالعربية"
                  variant="outlined"
                  fullWidth
                  label="Title (Arabic)"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  inputProps={{ dir: 'rtl' }}
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover': { boxShadow: '0 4px 12px rgba(245, 87, 108, 0.15)' },
                      '&.Mui-focused': { boxShadow: '0 4px 16px rgba(245, 87, 108, 0.25)' }
                    }
                  }}
                />
                
                <TextField
                  placeholder="الوصف بالعربية"
                  variant="outlined"
                  fullWidth
                  label="Description (Arabic)"
                  multiline
                  rows={4}
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  inputProps={{ dir: 'rtl' }}
                  sx={{
                    mb: 2.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover': { boxShadow: '0 4px 12px rgba(245, 87, 108, 0.15)' },
                      '&.Mui-focused': { boxShadow: '0 4px 16px rgba(245, 87, 108, 0.25)' }
                    }
                  }}
                />
                
                <TextField
                  placeholder="مثال: مركز المؤتمرات، 123 شارع الرئيسي"
                  variant="outlined"
                  fullWidth
                  label="العنوان بالعربية"
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  inputProps={{ dir: 'rtl' }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover': { boxShadow: '0 4px 12px rgba(245, 87, 108, 0.15)' },
                      '&.Mui-focused': { boxShadow: '0 4px 16px rgba(245, 87, 108, 0.25)' }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <IconMapPin size={20} style={{ marginRight: '8px', color: '#f5576c' }} />
                    )
                  }}
                />
                <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#999', textAlign: 'right', direction: 'rtl' }}>
                  💡 أدخل عنوان الفعالية بالعربية
                </Typography>
              </div>
              
              {/* Status & Featured Card */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 3, 
                  color: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex'
                  }}>
                    <IconCategory size={20} color="white" />
                  </div>
                  Event Settings
                </Typography>
                
                <TextField
                  select
                  label="Event Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  fullWidth
                  SelectProps={{ native: true }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover': { boxShadow: '0 4px 12px rgba(79, 172, 254, 0.15)' }
                    }
                  }}
                >
                  <option value="scheduled">📅 Scheduled</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="completed">✔️ Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </TextField>
                
                {/* Featured Toggle */}
                <div style={{
                  padding: '16px',
                  background: isFeatured ? 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)' : '#f9f9f9',
                  borderRadius: '12px',
                  border: isFeatured ? '2px solid #ffc107' : '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setIsFeatured(!isFeatured)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      background: isFeatured ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' : '#e0e0e0',
                      borderRadius: '10px',
                      padding: '10px',
                      display: 'flex',
                      transition: 'all 0.3s ease'
                    }}>
                      <IconStar size={20} color={isFeatured ? 'white' : '#999'} />
                    </div>
                    <div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '14px' }}>
                        Featured Event
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666', fontSize: '12px' }}>
                        Highlight on homepage
                      </Typography>
                    </div>
                  </div>
                  <div style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    background: isFeatured ? 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' : '#ddd',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: isFeatured ? '0 4px 12px rgba(255, 193, 7, 0.4)' : 'none'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: isFeatured ? '26px' : '2px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'white',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {isFeatured && <IconStar size={14} color="#ffc107" />}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image Upload Card */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 3, 
                  color: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex'
                  }}>
                    <IconPhoto size={20} color="white" />
                  </div>
                  Event Image
                </Typography>
                
                <div style={{
                  border: '2px dashed #ddd',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  background: '#fafafa',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onloadend = () => setImage(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  {!image ? (
                    <>
                      <IconPhoto size={48} color="#ccc" style={{ marginBottom: '12px' }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                        Drop your image here or click to browse
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Supports: JPG, PNG, GIF (Max: 5MB)
                      </Typography>
                    </>
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={image} 
                        alt="Preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px', 
                          borderRadius: '12px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                        }} 
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage('');
                          setImageFile(null);
                        }}
                        sx={{
                          mt: 2,
                          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #fa709a 20%, #fee140 120%)',
                          }
                        }}
                      >
                        Change Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Contact Information Card */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 3, 
                  color: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex'
                  }}>
                    <IconMail size={20} color="white" />
                  </div>
                  Contact Information
                </Typography>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <TextField
                    placeholder="contact@example.com"
                    variant="outlined"
                    fullWidth
                    label="Email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(67, 233, 123, 0.15)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconMail size={20} style={{ marginRight: '8px', color: '#43e97b' }} />
                      )
                    }}
                  />
                  <TextField
                    placeholder="+1234567890"
                    variant="outlined"
                    fullWidth
                    label="Phone"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(67, 233, 123, 0.15)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconPhone size={20} style={{ marginRight: '8px', color: '#43e97b' }} />
                      )
                    }}
                  />
                  <TextField
                    placeholder="+1234567890"
                    variant="outlined"
                    fullWidth
                    label="WhatsApp"
                    value={contactWhatsapp}
                    onChange={(e) => setContactWhatsapp(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(37, 211, 102, 0.15)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconBrandWhatsapp size={20} style={{ marginRight: '8px', color: '#25d366' }} />
                      )
                    }}
                  />
                  <TextField
                    placeholder="https://facebook.com/event"
                    variant="outlined"
                    fullWidth
                    label="Facebook URL"
                    value={contactFacebook}
                    onChange={(e) => setContactFacebook(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(24, 119, 242, 0.15)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconBrandFacebook size={20} style={{ marginRight: '8px', color: '#1877f2' }} />
                      )
                    }}
                  />
                  <TextField
                    placeholder="https://instagram.com/event"
                    variant="outlined"
                    fullWidth
                    label="Instagram URL"
                    value={contactInstagram}
                    onChange={(e) => setContactInstagram(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(225, 48, 108, 0.15)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconBrandInstagram size={20} style={{ marginRight: '8px', color: '#e1306c' }} />
                      )
                    }}
                  />
                  <TextField
                    placeholder="leave empty for auto-generation"
                    variant="outlined"
                    fullWidth
                    label="URL Slug (optional)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    helperText="SEO-friendly URL"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(67, 233, 123, 0.15)' }
                      }
                    }}
                  />
                </div>
              </div>
              
              {/* Organizer Information Card */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                border: '1px solid #e0e0e0'
              }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 700, 
                  mb: 3, 
                  color: '#1a1a1a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex'
                  }}>
                    <IconUser size={20} color="#666" />
                  </div>
                  Organizer Information
                </Typography>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <TextField
                    placeholder="Organizer Name"
                    variant="outlined"
                    fullWidth
                    label="Organizer Name"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(168, 237, 234, 0.25)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconUser size={20} style={{ marginRight: '8px', color: '#a8edea' }} />
                      )
                    }}
                  />
                  <TextField
                    placeholder="اسم المنظم"
                    variant="outlined"
                    fullWidth
                    label="Organizer Name (Arabic)"
                    value={organizerNameAr}
                    onChange={(e) => setOrganizerNameAr(e.target.value)}
                    inputProps={{ dir: 'rtl' }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(168, 237, 234, 0.25)' }
                      }
                    }}
                  />
                  <TextField
                    placeholder="organizer@example.com"
                    variant="outlined"
                    fullWidth
                    label="Organizer Email"
                    type="email"
                    value={organizerEmail}
                    onChange={(e) => setOrganizerEmail(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(168, 237, 234, 0.25)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconMail size={20} style={{ marginRight: '8px', color: '#a8edea' }} />
                      )
                    }}
                  />
                  <TextField
                    placeholder="+1234567890"
                    variant="outlined"
                    fullWidth
                    label="Organizer Phone"
                    value={organizerPhone}
                    onChange={(e) => setOrganizerPhone(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover': { boxShadow: '0 4px 12px rgba(168, 237, 234, 0.25)' }
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconPhone size={20} style={{ marginRight: '8px', color: '#a8edea' }} />
                      )
                    }}
                  />
                </div>
              </div>
            </>
          )}
          
          {/* Date & Time Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #e0e0e0'
          }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              mb: 3, 
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '10px',
                display: 'flex'
              }}>
                <IconClock size={20} color="white" />
              </div>
              Date & Time
            </Typography>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <TextField
                label="Start Date & Time"
            type="datetime-local"
            value={start ? moment(start).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => handleStartChange(new Date(e.target.value))}
            fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)' },
                    '&.Mui-focused': { boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)' }
                  }
            }}
          />
          <TextField
                label="End Date & Time"
            type="datetime-local"
            value={end ? moment(end).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => handleEndChange(new Date(e.target.value))}
            fullWidth
            error={start && end && start > end}
                helperText={start && end && start > end ? "End must be after start" : ""}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover': { boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)' },
                    '&.Mui-focused': { boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)' }
                  }
                }}
              />
            </div>
          </div>
        </DialogContent>
          {/* ------------------------------------------- */}
        {/* Beautiful Footer Actions */}
        <DialogActions sx={{ 
          p: 3, 
          background: '#fafafa',
          borderTop: '1px solid #e0e0e0',
          gap: 2
        }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            size="large"
                sx={{
              borderRadius: '12px',
              borderColor: '#ddd',
              color: '#666',
              px: 4,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: '#999',
                background: '#f5f5f5'
              }
            }}
          >
            Cancel
          </Button>

          {update && (
            <Button
              type="button"
              variant="contained"
              size="large"
              onClick={() => deleteHandler(update)}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fc4b6c 0%, #f62459 100%)',
                px: 4,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(252, 75, 108, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #fc4b6c 20%, #f62459 120%)',
                  boxShadow: '0 6px 20px rgba(252, 75, 108, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              🗑️ Delete
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={!title} 
            variant="contained"
            size="large"
            sx={{
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              px: 4,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #667eea 20%, #764ba2 120%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)'
              },
              '&:disabled': {
                background: '#ccc',
                boxShadow: 'none'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {update ? '✓ Update Event' : '✨ Create Event'}
          </Button>
        </DialogActions>
        {/* ------------------------------------------- */}
        {/* End Calendar */}
        {/* ------------------------------------------- */}
      </form>
      </Dialog>
    )}
  </>);
};

export default BigCalendar;
