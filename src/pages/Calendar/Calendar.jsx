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
import { IconCheck, IconX, IconPlus, IconCalendar, IconList } from '@tabler/icons-react';
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
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [slot, setSlot] = React.useState();
  const [start, setStart] = React.useState();
  const [end, setEnd] = React.useState();
  const [color, setColor] = React.useState('default');
  const [update, setUpdate] = React.useState();
  const [currentView, setCurrentView] = React.useState('month');
  const [showMobileEventList, setShowMobileEventList] = React.useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    setTitle('');
    setDescription('');
    setLocation('');
    setColor('default');
    setUpdate(null);
  };

  const editEvent = (event) => {
    setOpen(true);
    setTitle(event.title);
    setDescription(event.description || '');
    setLocation(event.location || '');
    setColor(event.color || 'default');
    // Ensure dates are proper Date objects
    setStart(event.start instanceof Date ? event.start : new Date(event.start));
    setEnd(event.end instanceof Date ? event.end : new Date(event.end));
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
      const eventData = eventService.transformEventForAPI({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        start,
        end,
        color
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
      const eventData = eventService.transformEventForAPI({
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        start,
        end,
        color
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
    setTitle('');
    setDescription('');
    setLocation('');
    setStart(new Date());
    setEnd(new Date());
    setColor('default');
    setUpdate(null);
    setError(null);
  };

  const eventColors = (event) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
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
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={update ? updateEvent : submitHandler}>
        <DialogContent>
          {/* ------------------------------------------- */}
          {/* Add Edit title */}
          {/* ------------------------------------------- */}
          <Typography variant="h4" sx={{ mb: 2 }}>
            {update ? 'Update Event' : 'Add Event'}
          </Typography>
          <Typography variant="subtitle2" sx={{
            mb: 3
          }}>
            {!update
              ? 'To add Event kindly fillup the title and choose the event color and press the add button'
              : 'To Edit/Update Event kindly change the title and choose the event color and press the update button'}
            {slot?.title}
          </Typography>

          <TextField
            id="Event Title"
            placeholder="Enter Event Title"
            variant="outlined"
            fullWidth
            label="Event Title"
            value={title}
            sx={{ mb: 3 }}
            onChange={inputChangeHandler}
          />
          
          <TextField
            id="Event Description"
            placeholder="Enter Event Description"
            variant="outlined"
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={description}
            sx={{ mb: 3 }}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          <TextField
            id="Event Location"
            placeholder="Enter Event Location"
            variant="outlined"
            fullWidth
            label="Location"
            value={location}
            sx={{ mb: 3 }}
            onChange={(e) => setLocation(e.target.value)}
          />
          {/* ------------------------------------------- */}
          {/* Selection of Start and end date */}
          {/* ------------------------------------------- */}
          <TextField
            id="start-date"
            label="Start Date"
            type="datetime-local"
            value={start ? moment(start).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => handleStartChange(new Date(e.target.value))}
            fullWidth
            sx={{ mb: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="end-date"
            label="End Date"
            type="datetime-local"
            value={end ? moment(end).format('YYYY-MM-DDTHH:mm') : ''}
            onChange={(e) => handleEndChange(new Date(e.target.value))}
            fullWidth
            sx={{ mb: 3 }}
            error={start && end && start > end}
            helperText={start && end && start > end ? "End date must be later than start date" : ""}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* ------------------------------------------- */}
          {/* Calendar Event Color*/}
          {/* ------------------------------------------- */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              my: 2
            }}>
            Select Event Color
          </Typography>
          {/* ------------------------------------------- */}
          {/* colors for event */}
          {/* ------------------------------------------- */}
          {ColorVariation.map((mcolor) => {
            return (
              <Fab
                color="primary"
                style={{ backgroundColor: mcolor.eColor }}
                sx={{
                  marginRight: '3px',
                  transition: '0.1s ease-in',
                  scale: mcolor.value === color ? '0.9' : '0.7',
                }}
                size="small"
                key={mcolor.id}
                onClick={() => selectinputChangeHandler(mcolor.value)}
              >
                {mcolor.value === color ? <IconCheck width={16} /> : ''}
              </Fab>
            );
          })}
        </DialogContent>
        {/* ------------------------------------------- */}
        {/* Action for dialog */}
        {/* ------------------------------------------- */}
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>

          {update ? (
            <Button
              type="submit"
              variant="contained"
              color="error"
              onClick={() => deleteHandler(update)}
            >
              Delete
            </Button>
          ) : (
            ''
          )}
          <Button 
            type="submit" 
            disabled={!title} 
            variant="contained"
            color="primary"
          >
            {update ? 'Update Event' : 'Add Event'}
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
