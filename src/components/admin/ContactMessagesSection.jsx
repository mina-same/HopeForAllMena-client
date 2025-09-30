import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { Mail, Search, Clock, CheckCircle, XCircle, MessageSquare, Book, User, Phone, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import contactMessageService from '../../services/contactMessageService';
import ConfirmationModal from '../ui/ConfirmationModal';
import '../../styles/ContactMessages-rtl.css';

export function ContactMessagesSection() {
  const { t } = useTranslation('ContactMessages');
  const { language: currentLanguage } = useI18next();
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
        sortOrder: 'desc',
        language: currentLanguage
      };

      const response = await contactMessageService.getContactMessages(params);
      setMessages(response.data.messages || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotalMessages(response.data.pagination?.totalMessages || 0);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.fetchFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [currentPage, searchTerm, typeFilter, statusFilter, priorityFilter, currentLanguage]);

  const handleRespond = (message) => {
    setMessageToRespond(message);
    setResponseText('');
    setShowResponseModal(true);
  };

  const confirmResponse = async () => {
    if (!messageToRespond || !responseText.trim()) return;
    
    setIsResponding(true);
    try {
      await contactMessageService.respondToContactMessage(messageToRespond._id, responseText);
      toast({
        title: t('toast.responseSent.title'),
        description: t('toast.responseSent.description'),
      });
      fetchMessages();
      setShowResponseModal(false);
      setMessageToRespond(null);
    } catch (error) {
      console.error('Failed to send response:', error);
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.responseFailed'),
        variant: "destructive"
      });
    } finally {
      setIsResponding(false);
    }
  };

  const handleMarkAsRead = async (message) => {
    try {
      await contactMessageService.updateContactMessageStatus(message._id, 'read');
      toast({
        title: t('toast.messageUpdated.title'),
        description: t('toast.messageUpdated.description', { status: t('statuses.read') }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to update message:', error);
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.updateFailed'),
        variant: "destructive"
      });
    }
  };

  const handleMarkAsResolved = async (message) => {
    try {
      await contactMessageService.updateContactMessageStatus(message._id, 'resolved');
      toast({
        title: t('toast.messageUpdated.title'),
        description: t('toast.messageUpdated.description', { status: t('statuses.resolved') }),
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to update message:', error);
      toast({
        title: t('toast.error.title'),
        description: t('toast.error.updateFailed'),
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString) => {
    const locale = currentLanguage === 'ar' ? 'ar-SA' : 'en-US';
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book-order':
        return <Book className="h-4 w-4" />;
      case 'general':
        return <MessageSquare className="h-4 w-4" />;
      case 'support':
        return <User className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type) => {
    const iconClass = currentLanguage === 'ar' ? 'h-3 w-3 ml-1' : 'h-3 w-3 mr-1';
    switch (type) {
      case 'book-order':
        return <Badge variant="default" className={`bg-blue-400 text-blue-800 ${currentLanguage === 'ar' ? '' : ''}`}><Book className={iconClass} />{t('types.bookorder')}</Badge>;
      case 'general':
        return <Badge variant="secondary" className={currentLanguage === 'ar' ? '' : ''}><MessageSquare className={iconClass} />{t('types.general')}</Badge>;
      case 'support':
        return <Badge variant="outline" className={`bg-purple-400 text-purple-800 ${currentLanguage === 'ar' ? '' : ''}`}><User className={iconClass} />{t('types.support')}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    const iconClass = currentLanguage === 'ar' ? 'h-3 w-3 ml-1' : 'h-3 w-3 mr-1';
    switch (status) {
      case 'new':
        return <Badge variant="default" className={`bg-blue-400 text-blue-800 ${currentLanguage === 'ar' ? '' : ''}`}><Clock className={iconClass} />{t('statuses.new')}</Badge>;
      case 'read':
        return <Badge variant="secondary" className={currentLanguage === 'ar' ? '' : ''}><CheckCircle className={iconClass} />{t('statuses.read')}</Badge>;
      case 'resolved':
        return <Badge variant="default" className={`bg-green-400 text-green-800 ${currentLanguage === 'ar' ? '' : ''}`}><CheckCircle className={iconClass} />{t('statuses.resolved')}</Badge>;
      case 'closed':
        return <Badge variant="destructive" className={currentLanguage === 'ar' ? '' : ''}><XCircle className={iconClass} />{t('statuses.closed')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">{t('filters.priority.high')}</Badge>;
      case 'medium':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">{t('filters.priority.medium')}</Badge>;
      case 'low':
        return <Badge variant="secondary">{t('filters.priority.low')}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl contact-messages-rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${currentLanguage === 'ar' ? 'sm:' : ''}`}>
        <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground text-sm md:text-base">{t('description')}</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4">
          <div className={`flex flex-col sm:flex-row gap-4 ${currentLanguage === 'ar' ? 'sm:' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('filters.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('filters.filterByType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.type.all')}</SelectItem>
                <SelectItem value="book-order">{t('filters.type.bookOrder')}</SelectItem>
                <SelectItem value="general">{t('filters.type.general')}</SelectItem>
                <SelectItem value="support">{t('filters.type.support')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('filters.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                <SelectItem value="new">{t('filters.status.new')}</SelectItem>
                <SelectItem value="read">{t('filters.status.read')}</SelectItem>
                <SelectItem value="resolved">{t('filters.status.resolved')}</SelectItem>
                <SelectItem value="closed">{t('filters.status.closed')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('filters.priority.all')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.priority.all')}</SelectItem>
                <SelectItem value="high">{t('filters.priority.high')}</SelectItem>
                <SelectItem value="medium">{t('filters.priority.medium')}</SelectItem>
                <SelectItem value="low">{t('filters.priority.low')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${currentLanguage === 'ar' ? ' text-right' : ''}`}>
            <Mail className="h-5 w-5 text-theme-base" />
            {t('messagesCount', { count: totalMessages })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-base mx-auto"></div>
              <p className="text-muted-foreground mt-2">{t('loading.messages')}</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message._id} className={`p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
                  <div className={`flex items-start justify-between mb-3 ${currentLanguage === 'ar' ? '' : ''}`}>
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 mb-2 ${currentLanguage === 'ar' ? ' justify-end' : ''}`}>
                        {getTypeIcon(message.type)}
                        <h3 className="font-semibold text-foreground">{message.subject}</h3>
                        {getTypeBadge(message.type)}
                        {getStatusBadge(message.status)}
                        {message.priority && getPriorityBadge(message.priority)}
                      </div>
                      <div className={`flex items-center gap-2 mb-2 text-sm text-muted-foreground ${currentLanguage === 'ar' ? ' justify-end' : ''}`}>
                        <span>{t('message.from')} {message.name} ({message.email})</span>
                        <span>•</span>
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                      {message.phone && (
                        <div className={`flex items-center gap-1 mb-2 text-sm text-muted-foreground ${currentLanguage === 'ar' ? ' justify-end' : ''}`}>
                          <Phone className="h-3 w-3" />
                          <span>{message.phone}</span>
                        </div>
                      )}
                      <p className={`text-sm text-foreground mb-2 ${currentLanguage === 'ar' ? 'text-right' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>{message.message}</p>
                      
                      {/* Book Order Details */}
                      {message.type === 'book-order' && message.book && (
                        <div className={`mt-3 p-3 bg-muted/50 rounded-md ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
                          <h4 className="font-medium text-sm mb-2">{t('message.bookOrderDetails')}</h4>
                          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
                            <div>
                              <span className="text-muted-foreground">{t('message.book')}</span> {currentLanguage === 'ar' && message.book.titleAr ? message.book.titleAr : message.book.title}
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t('message.author')}</span> {currentLanguage === 'ar' && message.book.author?.nameAr ? message.book.author.nameAr : (message.book.author?.name || message.bookAuthor || 'N/A')}
                            </div>
                            {message.quantity && (
                              <div>
                                <span className="text-muted-foreground">{t('message.quantity')}</span> {message.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={`flex items-center justify-between ${currentLanguage === 'ar' ? '' : ''}`}>
                    <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? '' : ''}`}>
                      {message.status === 'new' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(message)}
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {t('actions.markAsRead')}
                        </Button>
                      )}
                      {message.status === 'read' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsResolved(message)}
                          className="bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          {t('actions.markAsResolved')}
                        </Button>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRespond(message)}
                      className="bg-theme-base/10 text-theme-base hover:bg-theme-base/20"
                    >
                      {t('actions.respond')}
                    </Button>
                  </div>
                  
                  {message.response && (
                    <div className={`mt-3 p-3 bg-muted/50 rounded-md ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
                      <p className="text-sm text-muted-foreground" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        <strong>{t('message.response')}</strong> {message.response}
                      </p>
                      {message.respondedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('message.respondedOn')} {formatDate(message.respondedAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className={`flex justify-center items-center gap-2 mt-6 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}
                  >
                    {currentLanguage === 'ar' ? <ChevronRight className="h-4 w-4 mr-1" /> : <ChevronLeft className="h-4 w-4 mr-1" />}
                    {t('pagination.previous')}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {t('pagination.page', { current: currentPage, total: totalPages })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}
                  >
                    {t('pagination.next')}
                    {currentLanguage === 'ar' ? <ChevronLeft className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">{t('empty.noMessages')}</p>
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
        title={t('modal.respondTitle')}
        description={
          <div className={`space-y-4 ${currentLanguage === 'ar' ? 'text-right' : ''}`}>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('message.from')}</strong> {messageToRespond?.name} ({messageToRespond?.email})
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                <strong>{t('message.subject')}</strong> {messageToRespond?.subject}
              </p>
              <p className="text-sm text-foreground">{messageToRespond?.message}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('modal.yourResponse')}</label>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder={t('modal.responsePlaceholder')}
                className="w-full p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-theme-base"
                rows={4}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
        }
        confirmText={t('modal.sendResponse')}
        cancelText={t('modal.cancel')}
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

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
