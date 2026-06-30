import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Mail, User, Book, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';
import contactMessageService from '../../services/contactMessageService';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';


const ContactMessagesPage = () => {
  const { t } = useTranslation('ContactMessages');
  const { language: currentLanguage } = useI18next();
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
      case 'closed':
      case 'replied': return 'bg-green-400 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300 transition-colors cursor-pointer';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200 hover:border-orange-300 transition-colors cursor-pointer';
      case 'read': return 'bg-emerald-400 text-emerald-800 border-emerald-200 hover:bg-emerald-500 hover:border-emerald-300 transition-colors cursor-pointer';
      case 'new':
      case 'unread': return 'bg-red-400 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300 transition-colors cursor-pointer';
      default: return 'bg-muted text-muted-foreground border-border hover:bg-muted transition-colors cursor-pointer';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'book-order':
      case 'book-inquiry': return 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:border-purple-300 transition-colors cursor-pointer';
      case 'support': return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300 transition-colors cursor-pointer';
      case 'general': return 'bg-indigo-400 text-indigo-800 border-indigo-200 hover:bg-indigo-500 hover:border-indigo-300 transition-colors cursor-pointer';
      default: return 'bg-muted text-muted-foreground border-border hover:bg-muted transition-colors cursor-pointer';
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

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'name',
      label: t('table.headers.sender') || 'Sender',
      render: (row) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-sm text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      label: t('table.headers.subject') || 'Subject',
      render: (row) => (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium line-clamp-1">{row.subject}</span>
          {row.isNew && (
            <Badge className="bg-red-500 text-white animate-pulse text-xs">{t('messageCard.new')}</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'date',
      label: t('table.headers.date') || 'Date',
      render: (row) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{new Date(row.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: t('table.headers.status') || 'Status',
      render: (row) => {
        const TypeIcon = getTypeIcon(row.type);
        return (
          <div className="flex flex-wrap gap-1">
            <Badge className={getStatusColor(row.status) + " text-xs"}>
              {t(`statuses.${row.status}`)}
            </Badge>
            <Badge className={getTypeColor(row.type) + " text-xs"}>
              <TypeIcon className={`h-3 w-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {t(`types.${row.type.replace('-', '')}`) || row.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
        );
      },
    },
    {
      key: '_actions',
      label: t('table.headers.actions') || 'Actions',
      align: 'end',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedMessage(row);
              if (row.status === 'unread') {
                handleStatusChange(row.id, 'read');
              }
            }}
            className="hover:bg-muted rounded-md"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'unread' && (
            <Button
              size="sm"
              onClick={() => handleStatusChange(row.id, 'read')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className={`h-4 w-4 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              <span className="hidden md:inline">{t('messageCard.markRead')}</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="text-red-600 hover:bg-red-50 hover:bg-muted rounded-md"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <SectionShell
      title={t('title')}
      subtitle={t('description')}
      dir={dir}
      actions={
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center gap-3 text-sm flex-row">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{t('stats.unread', { count: unreadCount })}</span>
            </div>
            {newCount > 0 && (
              <>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <span className="font-medium text-red-600">{t('stats.new', { count: newCount })}</span>
                </div>
              </>
            )}
          </div>
        </div>
      }
      filters={
        <div className={`flex flex-col md:flex-row gap-4`}>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            dir={dir}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t('filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.status.all')}</SelectItem>
              <SelectItem value="new">{t('filters.status.new')}</SelectItem>
              <SelectItem value="unread">{t('filters.status.unread')}</SelectItem>
              <SelectItem value="read">{t('filters.status.read')}</SelectItem>
              <SelectItem value="in-progress">{t('filters.status.inProgress')}</SelectItem>
              <SelectItem value="resolved">{t('filters.status.resolved')}</SelectItem>
              <SelectItem value="closed">{t('filters.status.closed')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t('filters.filterByType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.type.all')}</SelectItem>
              <SelectItem value="book-order">{t('filters.type.bookOrder')}</SelectItem>
              <SelectItem value="book-inquiry">{t('filters.type.bookInquiry')}</SelectItem>
              <SelectItem value="general">{t('filters.type.general')}</SelectItem>
              <SelectItem value="support">{t('filters.type.support')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-600">{t('error.title')}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('error.tryAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!error && (
        <DataTable
          columns={columns}
          data={filteredMessages}
          loading={loading}
          emptyTitle={t('empty.title')}
          emptyDescription={searchTerm || statusFilter !== 'all' || typeFilter !== 'all' ? t('empty.withFilters') : t('empty.noMessages')}
          emptyIcon={<Mail className="h-8 w-8 text-muted-foreground" />}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          dir={dir}
        />
      )}

      {/* View/Reply Modal */}
      <AdminModal
        open={!!selectedMessage}
        onClose={setSelectedMessage}
        title={selectedMessage?.subject || ''}
        size="lg"
        dir={dir}
        footer={
          <Button variant="outline" onClick={() => setSelectedMessage(null)}>
            {t('actions.close') || 'Close'}
          </Button>
        }
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <div className={`flex items-center gap-2`}>
                  <Badge className={getStatusColor(selectedMessage.status) + " text-xs"}>
                    {t(`statuses.${selectedMessage.status}`)}
                  </Badge>
                  <Badge className={getTypeColor(selectedMessage.type) + " text-xs"}>
                    {t(`types.${selectedMessage.type.replace('-', '')}`) || selectedMessage.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  {selectedMessage.isNew && (
                    <Badge className="bg-red-500 text-white animate-pulse text-xs">{t('messageCard.new')}</Badge>
                  )}
                </div>
              </div>
              <div className={`${isRTL ? 'text-left' : 'text-right'} text-sm text-muted-foreground`}>
                <p>{new Date(selectedMessage.createdAt || selectedMessage.date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</p>
                <p>{new Date(selectedMessage.createdAt || selectedMessage.date).toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US')}</p>
              </div>
            </div>

            {/* Contact Information Card */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className={`flex items-center gap-2`}>
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm text-muted-foreground">{t('viewDialog.contact')}</span>
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
                      <div className={`flex items-center gap-2`}>
                        <Book className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm text-muted-foreground">{t('viewDialog.relatedBook')}</span>
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
                <div className={`flex items-center gap-2`}>
                  <Mail className="h-4 w-4 text-green-600" />
                  <CardTitle className="text-base">{t('viewDialog.message')}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg p-4 ${isRTL ? 'border-r-4 border-r-green-500' : 'border-l-4 border-l-green-500'}`}>
                  <p className={`leading-relaxed text-foreground whitespace-pre-wrap ${isRTL ? 'text-right' : 'text-left'}`} dir={dir}>{selectedMessage.message}</p>
                </div>
              </CardContent>
            </Card>

            {/* Replied Status */}
            {selectedMessage.status === 'replied' && (
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <p className="font-semibold text-green-800">{t('viewDialog.replySent')}</p>
                      <p className="text-sm text-green-700">{t('viewDialog.replySuccess')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </AdminModal>
    </SectionShell>
  );
};

export default ContactMessagesPage;
