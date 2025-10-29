import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Star, Clock, Search, Filter, X, Image as ImageIcon, Globe, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import eventService from '../../services/eventService';
import { authStorage } from '../../utils/storage';

export const EventsSection = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { language: currentLanguage } = useI18next();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [eventForm, setEventForm] = useState({
    title: '',
    title_ar: '',
    description: '',
    description_ar: '',
    start: '',
    end: '',
    location: '',
    location_ar: '',
    organizer: {
      name: '',
      name_ar: '',
      email: '',
      phone: ''
    },
    category: 'other',
    status: 'draft',
    isPublic: false,
    isFeatured: false,
    isAllDay: false,
    contactInfo: {
      email: '',
      phone: '',
      whatsapp: '',
      facebook: '',
      instagram: ''
    },
    image: '',
    slug: ''
  });

  const categories = [
    { value: 'meeting', label: 'Meeting' },
    { value: 'training', label: 'Training' },
    { value: 'sunday-school', label: 'Sunday School' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'conference', label: 'Conference' },
    { value: 'personal', label: 'Personal' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      if (response.success) {
        setEvents(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const resetForm = () => {
    setEventForm({
      title: '',
      title_ar: '',
      description: '',
      description_ar: '',
      start: '',
      end: '',
      location: '',
      location_ar: '',
      organizer: {
        name: '',
        name_ar: '',
        email: '',
        phone: ''
      },
      category: 'other',
      status: 'draft',
      isPublic: false,
      isFeatured: false,
      isAllDay: false,
      contactInfo: {
        email: '',
        phone: '',
        whatsapp: '',
        facebook: '',
        instagram: ''
      },
      image: '',
      slug: ''
    });
    setEditingEvent(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const token = authStorage.getToken();
      const response = await fetch('http://localhost:5001/api/upload/single', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        return {
          url: data.imageUrl,
          publicId: data.public_id
        };
      }
      throw new Error(data.message || 'Image upload failed');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive'
      });
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let imageData = { url: eventForm.image, publicId: eventForm.imagePublicId };
      
      if (imageFile) {
        imageData = await uploadImage();
        if (!imageData) {
          setLoading(false);
          return;
        }
      }

      const eventData = {
        ...eventForm,
        image: imageData.url,
        imagePublicId: imageData.publicId,
        organizer: eventForm.organizer.name ? eventForm.organizer : undefined,
        contactInfo: Object.values(eventForm.contactInfo).some(v => v) ? eventForm.contactInfo : undefined
      };

      if (editingEvent) {
        const response = await eventService.updateEvent(editingEvent._id, eventData);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Event updated successfully'
          });
          setIsAddDialogOpen(false);
          resetForm();
          fetchEvents();
        }
      } else {
        const response = await eventService.createEvent(eventData);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Event created successfully'
          });
          setIsAddDialogOpen(false);
          resetForm();
          fetchEvents();
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save event',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title || '',
      title_ar: event.title_ar || '',
      description: event.description || '',
      description_ar: event.description_ar || '',
      start: event.start ? new Date(event.start).toISOString().slice(0, 16) : '',
      end: event.end ? new Date(event.end).toISOString().slice(0, 16) : '',
      location: event.location || '',
      location_ar: event.location_ar || '',
      organizer: event.organizer || { name: '', name_ar: '', email: '', phone: '' },
      category: event.category || 'other',
      status: event.status || 'draft',
      isPublic: event.isPublic || false,
      isFeatured: event.isFeatured || false,
      isAllDay: event.isAllDay || false,
      contactInfo: event.contactInfo || { email: '', phone: '', whatsapp: '', facebook: '', instagram: '' },
      image: event.image || '',
      imagePublicId: event.imagePublicId || '',
      slug: event.slug || ''
    });
    setImagePreview(event.image || '');
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        setLoading(true);
        const response = await eventService.deleteEvent(eventId);
        if (response.success) {
          toast({
            title: 'Success',
            description: 'Event deleted successfully'
          });
          fetchEvents();
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete event',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'default';
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Events Management</h2>
          <p className="text-muted-foreground">Manage calendar events and public events</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="title">Title (English) *</Label>
                  <Input
                    id="title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="title_ar">Title (Arabic)</Label>
                  <Input
                    id="title_ar"
                    value={eventForm.title_ar}
                    onChange={(e) => setEventForm({ ...eventForm, title_ar: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Description (English)</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="description_ar">Description (Arabic)</Label>
                  <Textarea
                    id="description_ar"
                    value={eventForm.description_ar}
                    onChange={(e) => setEventForm({ ...eventForm, description_ar: e.target.value })}
                    rows={3}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">Start Date & Time *</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={eventForm.start}
                    onChange={(e) => setEventForm({ ...eventForm, start: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end">End Date & Time *</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={eventForm.end}
                    onChange={(e) => setEventForm({ ...eventForm, end: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location (English)</Label>
                  <Input
                    id="location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="location_ar">Location (Arabic)</Label>
                  <Input
                    id="location_ar"
                    value={eventForm.location_ar}
                    onChange={(e) => setEventForm({ ...eventForm, location_ar: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Category and Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={eventForm.category} onValueChange={(value) => setEventForm({ ...eventForm, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={eventForm.status} onValueChange={(value) => setEventForm({ ...eventForm, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(st => (
                        <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Organizer */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Organizer Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizer_name">Name (English)</Label>
                    <Input
                      id="organizer_name"
                      value={eventForm.organizer.name}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        organizer: { ...eventForm.organizer, name: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizer_name_ar">Name (Arabic)</Label>
                    <Input
                      id="organizer_name_ar"
                      value={eventForm.organizer.name_ar}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        organizer: { ...eventForm.organizer, name_ar: e.target.value }
                      })}
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizer_email">Email</Label>
                    <Input
                      id="organizer_email"
                      type="email"
                      value={eventForm.organizer.email}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        organizer: { ...eventForm.organizer, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizer_phone">Phone</Label>
                    <Input
                      id="organizer_phone"
                      value={eventForm.organizer.phone}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        organizer: { ...eventForm.organizer, phone: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Contact & Social Media</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_email">Email</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={eventForm.contactInfo.email}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        contactInfo: { ...eventForm.contactInfo, email: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_phone">Phone</Label>
                    <Input
                      id="contact_phone"
                      value={eventForm.contactInfo.phone}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        contactInfo: { ...eventForm.contactInfo, phone: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                    <Input
                      id="contact_whatsapp"
                      value={eventForm.contactInfo.whatsapp}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        contactInfo: { ...eventForm.contactInfo, whatsapp: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_facebook">Facebook</Label>
                    <Input
                      id="contact_facebook"
                      value={eventForm.contactInfo.facebook}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        contactInfo: { ...eventForm.contactInfo, facebook: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact_instagram">Instagram</Label>
                    <Input
                      id="contact_instagram"
                      value={eventForm.contactInfo.instagram}
                      onChange={(e) => setEventForm({ 
                        ...eventForm, 
                        contactInfo: { ...eventForm.contactInfo, instagram: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="font-semibold">Event Image</h4>
                <div>
                  <Label htmlFor="image">Upload Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="max-w-xs rounded" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug (optional)</Label>
                  <Input
                    id="slug"
                    value={eventForm.slug}
                    onChange={(e) => setEventForm({ ...eventForm, slug: e.target.value })}
                    placeholder="leave empty for auto-generation"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 border-t pt-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={eventForm.isPublic}
                    onChange={(e) => setEventForm({ ...eventForm, isPublic: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isPublic" className="cursor-pointer">
                    Public Event (visible on website)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={eventForm.isFeatured}
                    onChange={(e) => setEventForm({ ...eventForm, isFeatured: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    Featured Event
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isAllDay"
                    checked={eventForm.isAllDay}
                    onChange={(e) => setEventForm({ ...eventForm, isAllDay: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isAllDay" className="cursor-pointer">
                    All Day Event
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Events</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.isPublic).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.isFeatured).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => new Date(e.start) > new Date()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map(st => (
                  <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events found. Create your first event!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {event.image && (
                          <img src={event.image} alt="" className="w-10 h-10 rounded object-cover" />
                        )}
                        <div>
                          <div className="font-medium">{event.title}</div>
                          {event.title_ar && (
                            <div className="text-sm text-muted-foreground" dir="rtl">{event.title_ar}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(event.start)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{event.location || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{event.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(event.status)}>{event.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {event.isPublic && (
                          <Badge variant="default" className="gap-1">
                            <Globe className="h-3 w-3" /> Public
                          </Badge>
                        )}
                        {event.isFeatured && (
                          <Badge variant="default" className="gap-1">
                            <Star className="h-3 w-3" /> Featured
                          </Badge>
                        )}
                        {!event.isPublic && (
                          <Badge variant="secondary">Internal</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

