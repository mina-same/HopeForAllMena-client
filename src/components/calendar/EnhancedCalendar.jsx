import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { 
  Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Filter, Plus, MoreHorizontal, Grid3X3, List, Clock,
  MapPin, Users, Tag, Bell, ChevronDown, Settings,
  Briefcase, User, GraduationCap, Sun, Cake, CheckSquare,
  CalendarCheck, Plane, Heart, Coffee, AlertCircle
} from 'lucide-react';
import { useCalendar} from '../../context/CalendarContext';
import { cn } from '../../lib/utils';
import { useToast } from '../../hooks/use-toast';

// Calendar views enum replacement
const VIEWS = {
  MONTH: 'month',
  WEEK: 'week', 
  DAY: 'day',
  AGENDA: 'agenda'
};

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

export const EnhancedCalendar = () => {
  const { events, categories, addEvent, updateEvent, deleteEvent, hasConflicts } = useCalendar();
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState(VIEWS.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState(new Date());

  // Filter events based on search and categories
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(event.category);

      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategories]);

  // Convert events for react-big-calendar
  const calendarEvents = useMemo(() => {
    return filteredEvents.map(event => ({
      ...event,
      resource: {
        category: event.category,
        priority: event.priority,
        status: event.status
      }
    }));
  }, [filteredEvents]);

  // Event styling based on category and priority
  const eventStyleGetter = useCallback((event) => {
    const category = categories.find(cat => cat.id === event.category);
    const baseColor = category?.color || 'hsl(var(--primary))';
    
    let opacity = 1;
    let borderStyle = 'solid';
    
    // Status-based styling
    switch (event.status) {
      case 'tentative':
        opacity = 0.7;
        borderStyle = 'dashed';
        break;
      case 'cancelled':
        opacity = 0.4;
        break;
      case 'completed':
        opacity = 0.6;
        break;
    }

    // Priority-based styling
    let borderWidth = '2px';
    if (event.priority === 'urgent') {
      borderWidth = '3px';
    } else if (event.priority === 'low') {
      borderWidth = '1px';
    }

    return {
      style: {
        backgroundColor: baseColor,
        borderColor: baseColor,
        color: 'white',
        border: `${borderWidth} ${borderStyle}`,
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        padding: '2px 8px',
        opacity,
        boxShadow: event.priority === 'urgent' 
          ? `0 0 0 2px ${baseColor}40, 0 2px 8px rgba(0,0,0,0.15)` 
          : '0 2px 8px rgba(0,0,0,0.1)',
      }
    };
  }, [categories]);

  // Handle event selection
  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  // Handle slot selection for quick add
  const handleSelectSlot = useCallback(({ start }) => {
    setQuickAddDate(start);
    setShowQuickAdd(true);
  }, []);

  // Quick add event
  const handleQuickAdd = useCallback((title, category = 'personal') => {
    const newEvent = {
      title,
      start: quickAddDate,
      end: new Date(quickAddDate.getTime() + 60 * 60 * 1000), // 1 hour default
      category: category,
      priority: 'medium',
      status: 'confirmed',
      reminders: [15],
      tags: []
    };

    addEvent(newEvent);
    setShowQuickAdd(false);
    
    toast({
      title: "Event added",
      description: `"${title}" has been added to your calendar.`,
    });
  }, [quickAddDate, addEvent, toast]);

  // Navigation handlers
  const handleNavigate = useCallback((newDate) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
  }, []);

  // Toolbar navigation
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToPrev = useCallback(() => {
    let newDate = new Date(currentDate);
    if (currentView === VIEWS.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === VIEWS.WEEK) {
      newDate.setDate(newDate.getDate() - 7);
    } else if (currentView === VIEWS.DAY) {
      newDate.setDate(newDate.getDate() - 1);
    } else if (currentView === VIEWS.AGENDA) {
      newDate.setDate(newDate.getDate() - 30);
    }
    setCurrentDate(newDate);
  }, [currentDate, currentView]);

  const goToNext = useCallback(() => {
    let newDate = new Date(currentDate);
    if (currentView === VIEWS.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === VIEWS.WEEK) {
      newDate.setDate(newDate.getDate() + 7);
    } else if (currentView === VIEWS.DAY) {
      newDate.setDate(newDate.getDate() + 1);
    } else if (currentView === VIEWS.AGENDA) {
      newDate.setDate(newDate.getDate() + 30);
    }
    setCurrentDate(newDate);
  }, [currentDate, currentView]);

  const formatTitle = useCallback(() => {
    const options = { year: 'numeric', month: 'long' };
    if (currentView === VIEWS.MONTH) {
      return currentDate.toLocaleDateString('en-US', options);
    } else if (currentView === VIEWS.WEEK) {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else if (currentView === VIEWS.AGENDA) {
      return `${currentDate.toLocaleDateString('en-US', options)} Agenda`;
    } else {
      return currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }, [currentDate, currentView]);

  // Custom event component
  const EventComponent = ({ event }) => {
    const CategoryIcon = categoryIcons[event.category] || CalendarIcon;
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 text-xs font-medium truncate h-full">
              <CategoryIcon className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{event.title}</span>
              {event.priority === 'urgent' && (
                <AlertCircle className="w-3 h-3 flex-shrink-0 text-yellow-300" />
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <div className="space-y-1">
              <div className="font-medium">{event.title}</div>
              {event.description && (
                <div className="text-xs text-muted-foreground">{event.description}</div>
              )}
              <div className="flex items-center gap-2 text-xs">
                <Clock className="w-3 h-3" />
                {event.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - {event.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-xs">
                  <MapPin className="w-3 h-3" />
                  {event.location}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="enhanced-calendar-container space-y-6">
      {/* Enhanced Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 bg-gradient-to-r from-background via-muted/20 to-background rounded-lg border shadow-sm">
        {/* Left: Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPrev}
              className="hover:bg-primary/10 hover:text-primary p-2 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="px-4 py-2 hover:bg-primary/10 hover:text-primary rounded-lg font-medium"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNext}
              className="hover:bg-primary/10 hover:text-primary p-2 rounded-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <h2 className="text-2xl font-bold text-foreground">
            {formatTitle()}
          </h2>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-[30px] w-64 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Categories
                {selectedCategories.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
                    {selectedCategories.length}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter by Category</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategories([])}
                    className="text-xs px-2 py-1"
                  >
                    Clear
                  </Button>
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {categories.map((category) => {
                    const CategoryIcon = categoryIcons[category.id ] || CalendarIcon;
                    const isSelected = selectedCategories.includes(category.id);
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategories(prev => 
                            isSelected 
                              ? prev.filter(id => id !== category.id)
                              : [...prev, category.id]
                          );
                        }}
                        className={cn(
                          "flex items-center gap-2 w-full p-2 rounded text-sm transition-colors",
                          isSelected 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-muted"
                        )}
                      >
                        <CategoryIcon className="h-4 w-4" />
                        <span className="flex-1 text-left">{category.name}</span>
                        <div 
                          className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: category.color }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* View Switcher */}
          <div className="flex bg-muted/50 rounded-lg p-1">
            {[
              { view: VIEWS.DAY, label: 'Day', icon: Clock },
              { view: VIEWS.WEEK, label: 'Week', icon: Grid3X3 },
              { view: VIEWS.MONTH, label: 'Month', icon: CalendarIcon },
              { view: VIEWS.AGENDA, label: 'Agenda', icon: List },
            ].map(({ view, label, icon: Icon }) => (
              <Button
                key={view}
                variant="ghost"
                size="sm"
                onClick={() => handleViewChange(view)}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
                  currentView === view 
                    ? "bg-primary text-white shadow-sm" 
                    : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Container - Placeholder */}
      <Card className="bg-background rounded-xl border shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar View ({currentView})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Calendar Component</h3>
              <p className="text-muted-foreground mb-4">
                Install react-big-calendar to enable full calendar functionality
              </p>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                npm install react-big-calendar moment
              </code>
            </div>
            {filteredEvents.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium mb-3">Upcoming Events:</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredEvents.slice(0, 5).map(event => (
                    <div key={event.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium">{event.title}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-muted-foreground">
                        {event.start.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Popover */}
      {showQuickAdd && (
        <QuickAddEvent
          date={quickAddDate}
          onAdd={handleQuickAdd}
          onClose={() => setShowQuickAdd(false)}
          categories={categories}
        />
      )}
    </div>
  );
};

// Quick Add Event Component
const QuickAddEvent = ({ date, onAdd, onClose, categories }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('personal');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), category);
      setTitle('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-background rounded-lg shadow-xl p-6 w-96 mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Quick Add Event</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title..."
              className="focus:ring-primary"
              autoFocus
            />
          </div>
          
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};