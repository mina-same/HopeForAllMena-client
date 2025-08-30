import React, { useState } from 'react';
import { Mail, Search, Eye, Trash2, CheckCircle, Clock, User, Book, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const mockMessages = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    subject: 'Book Order Inquiry',
    message: 'I would like to order "Clean Code" by Robert Martin. Could you please provide pricing and availability information?',
    bookTitle: 'Clean Code',
    date: '2024-01-15',
    status: 'unread',
    isNew: true,
    type: 'book-inquiry'
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    subject: 'General Inquiry',
    message: 'Do you have any books on machine learning for beginners?',
    date: '2024-01-14',
    status: 'read',
    isNew: false,
    type: 'general'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    subject: 'Website Issue',
    message: 'I\'m having trouble with the search function on your website. It doesn\'t seem to return accurate results.',
    date: '2024-01-13',
    status: 'replied',
    isNew: false,
    type: 'support'
  },
  {
    id: '4',
    name: 'David Lee',
    email: 'david@example.com',
    subject: 'Bulk Order Request',
    message: 'We are interested in ordering multiple copies of programming books for our company library. Can you provide bulk pricing?',
    date: '2024-01-12',
    status: 'unread',
    isNew: true,
    type: 'book-inquiry'
  },
  {
    id: '5',
    name: 'Emma Thompson',
    email: 'emma@example.com',
    subject: 'Book Recommendation',
    message: 'I\'m looking for advanced JavaScript books. What would you recommend for someone with 3 years of experience?',
    date: '2024-01-11',
    status: 'unread',
    isNew: true,
    type: 'general'
  }
];

const ContactMessagesPage = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const newCount = messages.filter(m => m.isNew).length;

  const handleStatusChange = (messageId , newStatus) => {
    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, status: newStatus, isNew: false }
        : message
    ));
  };

  const handleDelete = (messageId) => {
    setMessages(prev => prev.filter(message => message.id !== messageId));
  };

  const handleReply = (messageId) => {
    handleStatusChange(messageId, 'replied');
    setReplyText('');
    setSelectedMessage(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'read': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'unread': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'book-inquiry': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'support': return 'bg-red-100 text-red-800 border-red-200';
      case 'general': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book-inquiry': return Book;
      case 'support': return Mail;
      case 'general': return User;
      default: return Mail;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            Manage customer inquiries and support requests
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-card border rounded-lg p-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-medium">{unreadCount} Unread</span>
              </div>
              {newCount > 0 && (
                <>
                  <div className="w-px h-4 bg-border"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-red-600">{newCount} New</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages, names, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="replied">Replied</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="book-inquiry">Book Inquiries</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => {
          const TypeIcon = getTypeIcon(message.type);
          return (
            <Card key={message.id} className={`hover:shadow-md transition-shadow ${message.status === 'unread' ? 'border-l-4 border-l-primary' : ''}`}>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                      <h3 className="font-semibold text-base md:text-lg line-clamp-1">{message.subject}</h3>
                      {message.isNew && (
                        <Badge className="bg-red-500 text-white animate-pulse text-xs">New</Badge>
                      )}
                      <Badge className={getStatusColor(message.status) + " text-xs"}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </Badge>
                      <Badge className={getTypeColor(message.type) + " text-xs"}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {message.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      {message.bookTitle && (
                        <Badge variant="outline" className="text-xs">
                          <Book className="h-3 w-3 mr-1" />
                          {message.bookTitle}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-3 md:h-4 w-3 md:w-4" />
                        <span className="font-medium">{message.name}</span>
                      </div>
                      <span className="hidden sm:inline">{message.email}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 md:h-4 w-3 md:w-4" />
                        <span>{new Date(message.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <p className="text-foreground leading-relaxed line-clamp-2 md:line-clamp-3 text-sm md:text-base">{message.message}</p>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center gap-2 w-full md:w-auto">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            if (message.status === 'unread') {
                              handleStatusChange(message.id, 'read');
                            }
                          }}
                          className="flex-1 md:flex-none"
                        >
                          <Eye className="h-4 w-4 md:mr-0" />
                          <span className="md:hidden ml-2">View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Message Details</DialogTitle>
                        </DialogHeader>
                        {selectedMessage && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">From</label>
                                <p className="font-medium">{selectedMessage.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedMessage.email}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Date</label>
                                <p className="font-medium">{new Date(selectedMessage.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Subject</label>
                              <p className="text-lg font-semibold">{selectedMessage.subject}</p>
                            </div>
                            {selectedMessage.bookTitle && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Related Book</label>
                                <p className="font-medium">{selectedMessage.bookTitle}</p>
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Message</label>
                              <div className="mt-1 p-4 bg-muted/30 rounded-lg">
                                <p className="leading-relaxed">{selectedMessage.message}</p>
                              </div>
                            </div>
                            {selectedMessage.status !== 'replied' && (
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Reply</label>
                                <Textarea 
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type your reply here..."
                                  className="mt-1 min-h-[100px]"
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                  <Button 
                                    variant="outline"
                                    onClick={() => {
                                      setReplyText('');
                                      setSelectedMessage(null);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button 
                                    onClick={() => handleReply(selectedMessage.id)}
                                    disabled={!replyText.trim()}
                                    className="bg-blue-600 hover:bg-blue-700"
                                  >
                                    Send Reply
                                  </Button>
                                </div>
                              </div>
                            )}
                            {selectedMessage.status === 'replied' && (
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center gap-2 text-green-800">
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="font-medium">Replied</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {message.status === 'unread' && (
                      <Button 
                        size="sm"
                        onClick={() => handleStatusChange(message.id, 'read')}
                        className="bg-blue-600 hover:bg-blue-700 flex-1 md:flex-none"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="md:hidden">Read</span>
                        <span className="hidden md:inline">Mark Read</span>
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(message.id)}
                      className="text-red-600 hover:bg-red-50 w-full md:w-auto"
                    >
                      <Trash2 className="h-4 w-4 md:mr-0" />
                      <span className="md:hidden ml-2">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No messages found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No messages have been received yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContactMessagesPage;