import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import {
  CalendarIcon, Clock, MapPin, Users, Plus, Tag, Bell,
  Briefcase, User, GraduationCap, Sun, Cake, CheckSquare,
  CalendarCheck, Plane, Heart, Coffee, AlertCircle, X
} from 'lucide-react';
import { format, addHours } from 'date-fns';
import { cn } from '../../lib/utils';
import { useCalendar } from '../../context/CalendarContext';
import { useToast } from '../../hooks/use-toast';

// interface EnhancedEventCreationFormProps {
//   onClose: () => void;
//   initialDate?: Date;
//   editEvent?: CalendarEvent;
// }

const categoryIcons = {
  personal: User,
  work: Briefcase,
  meeting: Users,
  training: GraduationCap,
  holiday: Sun,
  birthday: Cake,
  reminder: Bell,
  task: CheckSquare,
  appointment: CalendarCheck,
  travel: Plane,
  health: Heart,
  social: Coffee
};

const EnhancedEventCreationForm = ({
  onClose,
  initialDate,
  editEvent
}) => {
  const { addEvent, updateEvent, categories, hasConflicts } = useCalendar();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: editEvent?.title || '',
    start: editEvent?.start || initialDate || new Date(),
    end: editEvent?.end || (initialDate ? addHours(initialDate, 1) : addHours(new Date(), 1)),
    allDay: editEvent?.allDay || false,
    category: editEvent?.category || 'personal',
    priority: editEvent?.priority || 'medium',
    status: editEvent?.status || 'confirmed',
    location: editEvent?.location || '',
    description: editEvent?.description || '',
    attendees: editEvent?.attendees || [],
    tags: editEvent?.tags || [],
    reminders: editEvent?.reminders || [15],
    organizer: editEvent?.organizer || '',
    url: editEvent?.url || ''
  });

  const [newAttendee, setNewAttendee] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter an event title.",
        variant: "destructive"
      });
      return;
    }

    if (formData.start >= formData.end) {
      toast({
        title: "Invalid time range",
        description: "End time must be after start time.",
        variant: "destructive"
      });
      return;
    }

    // Check for conflicts if not editing the same event
    const eventToCheck = editEvent ? { ...formData, id: editEvent.id } : formData;
    if (hasConflicts(eventToCheck)) {
      toast({
        title: "Scheduling conflict",
        description: "This event conflicts with an existing event. Do you want to continue?",
        variant: "destructive"
      });
      // In a real app, you might show a confirmation dialog here
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        title: formData.title.trim(),
        attendees: formData.attendees.filter(email => email.trim()),
        tags: formData.tags.filter(tag => tag.trim())
      };

      if (editEvent) {
        updateEvent(editEvent.id, eventData);
        toast({
          title: "Event updated",
          description: `"${eventData.title}" has been updated successfully.`,
        });
      } else {
        addEvent(eventData);
        toast({
          title: "Event created",
          description: `"${eventData.title}" has been added to your calendar.`,
        });
      }

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      updateFormData('attendees', [...formData.attendees, newAttendee.trim()]);
      setNewAttendee('');
    }
  };

  const removeAttendee = (email) => {
    updateFormData('attendees', formData.attendees.filter(e => e !== email));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    updateFormData('tags', formData.tags.filter(t => t !== tag));
  };

  const CategoryIcon = categoryIcons[formData.category] || CalendarIcon;
  const selectedCategory = categories.find(cat => cat.id === formData.category);

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-card to-muted/20 max-h-[90vh] overflow-hidden">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 via-purple-600/5 to-blue-600/5 sticky top-0 z-10">
        <CardTitle className="flex items-center gap-3 text-foreground">
          <div
            className="p-2 rounded-lg text-white"
            style={{ background: selectedCategory?.color || 'hsl(var(--primary))' }}
          >
            <CategoryIcon className="h-5 w-5" />
          </div>
          {editEvent ? 'Edit Event' : 'Create New Event'}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Event Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Enter event title..."
                className="focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Category</Label>
                <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => {
                      const Icon = categoryIcons[category.id] || CalendarIcon;
                      return (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {category.name}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Urgent
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="tentative">Tentative</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4 p-4 rounded-lg bg-gradient-to-r from-muted/30 to-transparent border border-border/50">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Date & Time
            </h4>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="all-day"
                  checked={formData.allDay}
                  onCheckedChange={(checked) => updateFormData('allDay', checked)}
                />
                <Label htmlFor="all-day" className="text-sm">All Day</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Start {!formData.allDay && 'Date & Time'}
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.start, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.start}
                        onSelect={date => date && updateFormData('start', date)}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>

                  {!formData.allDay && (
                    <Input
                      type="time"
                      value={format(formData.start, 'HH:mm')}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newStart = new Date(formData.start);
                        newStart.setHours(parseInt(hours), parseInt(minutes));
                        updateFormData('start', newStart);
                      }}
                      className="w-32"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  End {!formData.allDay && 'Date & Time'}
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.end, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.end}
                        onSelect={(date) => date && updateFormData('end', date)}
                        disabled={(date) => date < formData.start}
                      />
                    </PopoverContent>
                  </Popover>

                  {!formData.allDay && (
                    <Input
                      type="time"
                      value={format(formData.end, 'HH:mm')}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newEnd = new Date(formData.end);
                        newEnd.setHours(parseInt(hours), parseInt(minutes));
                        updateFormData('end', newEnd);
                      }}
                      className="w-32"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="e.g., Conference Room A, 123 Main St"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Add event description..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-4 p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-transparent border border-border/50">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Attendees
            </h4>

            <div className="flex gap-2">
              <Input
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                placeholder="Enter email address..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
              />
              <Button type="button" onClick={addAttendee} size="sm">
                Add
              </Button>
            </div>

            {formData.attendees.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.attendees.map((email, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeAttendee(email)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              Tags
            </h4>

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                Add
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary via-purple-600 to-blue-600 hover:opacity-90 shadow-lg"
            >
              {isSubmitting
                ? (editEvent ? 'Updating...' : 'Creating...')
                : (editEvent ? 'Update Event' : 'Create Event')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedEventCreationForm;