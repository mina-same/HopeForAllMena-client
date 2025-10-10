// 'use client';
import React from 'react';
import { Button } from '@mui/material';
import { CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import eventService from '../../services/eventService';
import { IconCheck } from '@tabler/icons-react';
import BlankCard from '../../components/Calendar/BlankCard';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../components/Calendar/Calendar.css';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

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
    setColor(event.color);
    setStart(event.start);
    setEnd(event.end);
    setUpdate(event);
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    try {
      const eventData = eventService.transformEventForAPI({
        title,
        description,
        location,
        start,
        end,
        color
      });

      await eventService.updateEvent(update.id, eventData);
      await loadEvents(); // Reload events from server
      handleClose();
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', err);
    }
  };
  const inputChangeHandler = (e) => setTitle(e.target.value);
  const selectinputChangeHandler = (id) => setColor(id);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const eventData = eventService.transformEventForAPI({
        title,
        description,
        location,
        start,
        end,
        color
      });

      await eventService.createEvent(eventData);
      await loadEvents(); // Reload events from server
      handleClose();
    } catch (err) {
      setError('Failed to create event. Please try again.');
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
        <Calendar
          selectable
          events={calevents}
          defaultView="month"
          localizer={localizer}
          style={{ height: 'calc(100vh - 400px' }}
          onSelectEvent={(event) => editEvent(event)}
          onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
          eventPropGetter={(event) => eventColors(event)}
        />
      </CardContent>
    </BlankCard>
    {/* ------------------------------------------- */}
    {/* Add Calendar Event Dialog */}
    {/* ------------------------------------------- */}
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              inputFormat="MM/dd/yyyy"
              value={start}
              onChange={handleStartChange}
              slotProps={{
                textField: {
                  label: "Start Date",
                  fullWidth: true,
                  sx: { mb: 3 },
                },
              }}
            />
            <DatePicker
              label="End Date"
              inputFormat="MM/dd/yyyy"
              value={end}
              onChange={handleEndChange}
              slotProps={{
                textField: {
                  label: "End Date",
                  fullWidth: true,
                  sx: { mb: 3 },
                  error: start && end && start > end,
                  helperText: start && end && start > end ? "End date must be later than start date" : "",
                },
              }}
            />
          </LocalizationProvider>

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
  </>);
};

export default BigCalendar;
