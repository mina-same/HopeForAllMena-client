import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Search, Clock, MapPin, Users, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { format } from 'date-fns';
import { useToast } from '../../hooks/use-toast';
import { useCalendar } from '../../context/CalendarContext';
import EnhancedEventCreationForm from './EnhancedEventCreationForm';
import { EnhancedCalendar } from '../calendar/EnhancedCalendar';

const CalendarSection = () => {
  const { toast } = useToast();
  const { events } = useCalendar();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-status-scheduled/10 text-status-scheduled border-status-scheduled/20';
      case 'completed': return 'bg-status-completed/10 text-status-completed border-status-completed/20';
      case 'cancelled': return 'bg-status-rejected/10 text-status-rejected border-status-rejected/20';
      case 'tentative': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'training': return 'bg-calendar-primary/10 text-calendar-primary border-calendar-primary/20';
      case 'meeting': return 'bg-calendar-secondary/10 text-calendar-secondary border-calendar-secondary/20';
      case 'personal': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'work': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      case 'health': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'social': return 'bg-pink-500/10 text-pink-700 border-pink-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const upcomingEvents = events
    .filter(event => event.start >= new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Modern Calendar
          </h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">Organize your events, meetings, and schedules with ease</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
            <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 hover:opacity-90 shadow-lg transition-all duration-300 hover:scale-105 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
              <EnhancedEventCreationForm onClose={() => setShowEventForm(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Modern Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Enhanced Calendar */}
        <div className="lg:col-span-3 space-y-6">
          <EnhancedCalendar />
        </div>

        {/* Quick Stats Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Stats */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-primary/5">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-primary to-purple-600 rounded-full"></div>
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-3">
                   <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                     <div className="text-xl md:text-2xl font-bold text-primary">
                       {events.filter(e => e.status === 'confirmed').length}
                     </div>
                     <div className="text-xs text-muted-foreground font-medium">Confirmed</div>
                   </div>
                   <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                     <div className="text-xl md:text-2xl font-bold text-green-600">
                       {events.filter(e => e.status === 'completed').length}
                     </div>
                     <div className="text-xs text-muted-foreground font-medium">Completed</div>
                   </div>
                 </div>
                 <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/5 border border-purple-500/20">
                   <div className="text-lg md:text-xl font-bold text-foreground">
                     {events.reduce((sum, e) => sum + (e.participants || 0), 0)}
                   </div>
                   <div className="text-xs text-muted-foreground font-medium">Total Participants</div>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-blue-500/5">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-primary rounded-full"></div>
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="group p-3 md:p-4 rounded-xl border border-border/30 bg-gradient-to-r from-transparent via-muted/20 to-primary/5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedDate(event.start)}
                    >
                       <div className="flex items-start gap-3">
                         <div className="flex flex-col items-center text-center">
                           <div className="text-xs text-muted-foreground uppercase font-medium">
                             {format(event.start, 'MMM')}
                           </div>
                           <div className="text-lg font-bold text-primary">
                             {format(event.start, 'd')}
                           </div>
                         </div>
                         
                         <div className="flex-1 min-w-0">
                           <h5 className="font-semibold text-foreground text-sm mb-1 truncate group-hover:text-primary transition-colors">
                             {event.title}
                           </h5>
                           <p className="text-xs text-muted-foreground mb-2 truncate">{event.organizationName || event.location}</p>
                           <div className="flex items-center gap-1 mb-2">
                             <Clock className="h-3 w-3 text-muted-foreground" />
                             <span className="text-xs text-muted-foreground">{format(event.start, 'h:mm a')}</span>
                           </div>
                           <div className="flex items-center gap-2 flex-wrap">
                             <Badge className={getCategoryColor(event.category)}>
                               {event.category}
                             </Badge>
                             <Badge className={getStatusColor(event.status)}>
                               {event.status}
                             </Badge>
                           </div>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground text-sm">No upcoming events found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <Dialog>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Event Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Event Information</h4>
                   <div className="space-y-2 text-sm">
                     <p><span className="font-medium">Title:</span> {selectedEvent.title}</p>
                     <p><span className="font-medium">Start:</span> {format(selectedEvent.start, 'PPP p')}</p>
                     <p><span className="font-medium">End:</span> {format(selectedEvent.end, 'PPP p')}</p>
                     <p><span className="font-medium">Location:</span> {selectedEvent.location}</p>
                   </div>
                 </div>
                 
                 <div>
                   <h4 className="font-semibold mb-3 text-foreground">Contact & Participants</h4>
                   <div className="space-y-2 text-sm">
                     <p><span className="font-medium">Organization:</span> {selectedEvent.organizationName}</p>
                     <p><span className="font-medium">Contact:</span> {selectedEvent.contactPerson}</p>
                     <p><span className="font-medium">Participants:</span> {selectedEvent.participants}</p>
                     <div className="flex gap-2 mt-3">
                       <Badge className={getCategoryColor(selectedEvent.category)}>
                         {selectedEvent.category}
                       </Badge>
                       <Badge className={getStatusColor(selectedEvent.status)}>
                         {selectedEvent.status}
                       </Badge>
                     </div>
                   </div>
                </div>
              </div>
              
              {selectedEvent.description && (
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CalendarSection;