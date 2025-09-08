import React, { useState, useEffect } from 'react';
import { Mail, Search, Clock, CheckCircle, XCircle, MessageSquare, Book, User, Phone, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import { contactMessagesAPI } from '../../services/publishingAPI';
import ConfirmationModal from '../ui/ConfirmationModal';

export function ContactMessagesSection() {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  
  // Response modal state
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [messageToRespond, setMessageToRespond] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm,
        type: typeFilter === 'all' ? '' : typeFilter,
        status: statusFilter === 'all' ? '' : statusFilter,
        priority: priorityFilter === 'all' ? '' : priorityFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const response = await contactMessagesAPI.getContactMessages(params);
      setMessages(response.data.data.messages);
      setTotalPages(response.data.data.pagination.totalPages);
      setTotalMessages(response.data.data.pagination.totalMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchTerm, typeFilter, statusFilter, priorityFilter]);

  const handleRespond = (message) => {
    setMessageToRespond(message);
    setResponseText('');
    setShowResponseModal(true);
  };

  const confirmResponse = async () => {
    if (!messageToRespond || !responseText.trim()) return;
    
    setIsResponding(true);
    try {
      await contactMessagesAPI.respondToMessage(messageToRespond._id, responseText);
      toast({
        title: "Response Sent",
        description: "Response has been sent successfully.",
      });
      fetchMessages();
      setShowResponseModal(false);
      setMessageToRespond(null);
    } catch (error) {
      console.error('Failed to send response:', error);
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResponding(false);
    }
  };

  const handleMarkAsRead = async (message) => {
    try {
      await contactMessagesAPI.updateContactMessage(message._id, { status: 'read' });
      toast({
        title: "Message Updated",
        description: "Message marked as read.",
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to update message:', error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsResolved = async (message) => {
    try {
      await contactMessagesAPI.updateContactMessage(message._id, { status: 'resolved' });
      toast({
        title: "Message Updated",
        description: "Message marked as resolved.",
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to update message:', error);
      toast({
        title: "Error",
        description: "Failed to update message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book_order':
        return <Book className="h-4 w-4" />;
      case 'general_inquiry':
        return <MessageSquare className="h-4 w-4" />;
      case 'support':
        return <User className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'book_order':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Book className="h-3 w-3 mr-1" />Book Order</Badge>;
      case 'general_inquiry':
        return <Badge variant="secondary"><MessageSquare className="h-3 w-3 mr-1" />General Inquiry</Badge>;
      case 'support':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800"><User className="h-3 w-3 mr-1" />Support</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />New</Badge>;
      case 'read':
        return <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />Read</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>;
      case 'closed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Contact Messages</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage customer inquiries and book orders</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-[30px]"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="book_order">Book Order</SelectItem>
                <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="read">Read</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-theme-base" />
            Messages ({totalMessages})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message._id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTypeIcon(message.type)}
                        <h3 className="font-semibold text-foreground">{message.subject}</h3>
                        {getTypeBadge(message.type)}
                        {getStatusBadge(message.status)}
                        {message.priority && getPriorityBadge(message.priority)}
                      </div>
                      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                        <span>From: {message.name} ({message.email})</span>
                        <span>•</span>
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{message.phone}</span>
                        </div>
                      )}
                      <p className="text-sm text-foreground mb-2">{message.message}</p>
                      
                      {/* Book Order Details */}
                      {message.type === 'book_order' && message.book && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-md">
                          <h4 className="font-medium text-sm mb-2">Book Order Details:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Book:</span> {message.book.title}
                            </div>
                            <div>
                              <span className="text-muted-foreground">Author:</span> {message.book.author.name}
                            </div>
                            {message.quantity && (
                              <div>
                                <span className="text-muted-foreground">Quantity:</span> {message.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {message.status === 'new' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(message)}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          Mark as Read
                        </Button>
                      )}
                      {message.status === 'read' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsResolved(message)}
                          className="bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRespond(message)}
                      className="bg-theme-base/10 text-theme-base hover:bg-theme-base/20"
                    >
                      Respond
                    </Button>
                  </div>
                  
                  {message.response && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        <strong>Response:</strong> {message.response}
                      </p>
                      {message.respondedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Responded on: {formatDate(message.respondedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No messages found.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Modal */}
      <ConfirmationModal
        isOpen={showResponseModal}
        onClose={() => {
          setShowResponseModal(false);
          setMessageToRespond(null);
        }}
        onConfirm={confirmResponse}
        title="Respond to Message"
        description={
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>From:</strong> {messageToRespond?.name} ({messageToRespond?.email})
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Subject:</strong> {messageToRespond?.subject}
              </p>
              <p className="text-sm text-foreground">{messageToRespond?.message}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Response</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response here..."
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-base"
                rows={4}
              />
            </div>
          </div>
        }
        confirmText="Send Response"
        cancelText="Cancel"
        variant="info"
        isLoading={isResponding}
        icon={
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 border-blue-200 border-2">
            <Mail className="h-6 w-6 text-blue-500" />
          </div>
        }
      />
    </div>
  );
}
