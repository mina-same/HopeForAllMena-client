import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Trash2, Mail, User, Book, CheckCircle, MessageSquare, Clock, Send, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import contactMessageService from '../../services/contactMessageService';


const ContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalMessages: 0 });

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contactMessageService.getContactMessages({
          page: pagination.currentPage,
          limit: 20,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined
        });
        
        // Transform API data to match component expectations
        const transformedMessages = response.data.messages.map(msg => ({
          id: msg._id,
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          subject: msg.subject,
          message: msg.message,
          bookTitle: msg.bookTitle,
          date: msg.createdAt,
          status: msg.status === 'new' ? 'unread' : msg.status,
          isNew: msg.status === 'new',
          type: msg.type,
          book: msg.book
        }));
        
        setMessages(transformedMessages);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Failed to fetch contact messages:', err);
        setError('Failed to load messages. Please try again.');
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [pagination.currentPage, searchTerm, statusFilter, typeFilter]);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    const matchesType = typeFilter === 'all' || message.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const unreadCount = messages.filter(m => m.status === 'unread' || m.status === 'new').length;
  const newCount = messages.filter(m => m.isNew).length;

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      await contactMessageService.updateContactMessageStatus(messageId, newStatus);
      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, status: newStatus, isNew: false }
          : message
      ));
    } catch (error) {
      console.error('Failed to update message status:', error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await contactMessageService.deleteContactMessage(messageId);
      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleReply = async (messageId) => {
    try {
      await contactMessageService.respondToContactMessage(messageId, replyText);
      handleStatusChange(messageId, 'replied');
      setReplyText('');
      setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
      case 'replied': return 'bg-green-400 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300 transition-colors cursor-pointer';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 hover:border-orange-300 transition-colors cursor-pointer';
      case 'read': return 'bg-emerald-400 text-emerald-800 border-emerald-200 hover:bg-emerald-500 hover:border-emerald-300 transition-colors cursor-pointer';
      case 'new':
      case 'unread': return 'bg-red-400 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300 transition-colors cursor-pointer';
      default: return 'bg-gray-400 text-gray-800 border-gray-200 hover:bg-gray-200 hover:border-gray-300 transition-colors cursor-pointer';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'book-order':
      case 'book-inquiry': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:border-purple-300 transition-colors cursor-pointer';
      case 'support': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300 transition-colors cursor-pointer';
      case 'general': return 'bg-indigo-400 text-indigo-800 border-indigo-200 hover:bg-indigo-500 hover:border-indigo-300 transition-colors cursor-pointer';
      default: return 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 hover:border-slate-300 transition-colors cursor-pointer';
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
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
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
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages, names, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-[30px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Messages</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="book-order">Book Orders</SelectItem>
                <SelectItem value="book-inquiry">Book Inquiries</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center animate-pulse">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Loading messages...</h3>
              <p className="text-muted-foreground">Please wait while we fetch your contact messages.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-600">Error Loading Messages</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      {!loading && !error && (
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
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="border-b pb-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <DialogTitle className="text-xl font-semibold">{selectedMessage?.subject}</DialogTitle>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(selectedMessage?.status) + " text-xs"}>
                                  {selectedMessage?.status?.charAt(0).toUpperCase() + selectedMessage?.status?.slice(1)}
                                </Badge>
                                <Badge className={getTypeColor(selectedMessage?.type) + " text-xs"}>
                                  {selectedMessage?.type?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                                {selectedMessage?.isNew && (
                                  <Badge className="bg-red-500 text-white animate-pulse text-xs">New</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right text-sm text-muted-foreground">
                              <p>{new Date(selectedMessage?.createdAt || selectedMessage?.date).toLocaleDateString()}</p>
                              <p>{new Date(selectedMessage?.createdAt || selectedMessage?.date).toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </DialogHeader>
                        {selectedMessage && (
                          <div className="space-y-6 pt-6">
                            {/* Contact Information Card */}
                            <Card className="border-l-4 border-l-blue-500">
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-blue-600" />
                                      <span className="font-medium text-sm text-muted-foreground">Contact</span>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-lg">{selectedMessage.name}</p>
                                      <p className="text-muted-foreground">{selectedMessage.email}</p>
                                      {selectedMessage.phone && (
                                        <p className="text-muted-foreground">{selectedMessage.phone}</p>
                                      )}
                                    </div>
                                  </div>
                                  {selectedMessage.bookTitle && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Book className="h-4 w-4 text-purple-600" />
                                        <span className="font-medium text-sm text-muted-foreground">Related Book</span>
                                      </div>
                                      <p className="font-medium">{selectedMessage.bookTitle}</p>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>

                            {/* Message Content */}
                            <Card>
                              <CardHeader className="pb-3">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-green-600" />
                                  <CardTitle className="text-base">Message</CardTitle>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-4 border-l-4 border-l-green-500">
                                  <p className="leading-relaxed text-foreground whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Reply Section */}
                            {selectedMessage.status !== 'replied' && (
                              <Card className="border-dashed">
                                <CardHeader className="pb-3">
                                  <div className="flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-blue-600" />
                                    <CardTitle className="text-base">Send Reply</CardTitle>
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <Textarea 
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type your reply here..."
                                    className="min-h-[120px] resize-none"
                                  />
                                  <div className="flex justify-end gap-3">
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        setReplyText('');
                                        setSelectedMessage(null);
                                      }}
                                      className="px-6"
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={() => handleReply(selectedMessage.id)}
                                      disabled={!replyText.trim()}
                                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6"
                                    >
                                      <Send className="h-4 w-4 mr-2" />
                                      Send Reply
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Replied Status */}
                            {selectedMessage.status === 'replied' && (
                              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                                <CardContent className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-green-800">Reply Sent</p>
                                      <p className="text-sm text-green-700">This message has been replied to successfully.</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
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
    )}
    </div>
  );
};

export default ContactMessagesPage;