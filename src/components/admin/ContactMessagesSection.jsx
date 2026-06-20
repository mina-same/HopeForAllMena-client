import React, { useState, useEffect } from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { Mail, Clock, CheckCircle, XCircle, MessageSquare, Book, User, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import contactMessageService from '../../services/contactMessageService';
import ConfirmationModal from '../ui/ConfirmationModal';
import '../../styles/ContactMessages-rtl.css';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';

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
        return <Badge variant="default" className="bg-blue-400 text-blue-800"><Book className={iconClass} />{t('types.bookorder')}</Badge>;
      case 'general':
        return <Badge variant="secondary"><MessageSquare className={iconClass} />{t('types.general')}</Badge>;
      case 'support':
        return <Badge variant="outline" className="bg-purple-400 text-purple-800"><User className={iconClass} />{t('types.support')}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    const iconClass = currentLanguage === 'ar' ? 'h-3 w-3 ml-1' : 'h-3 w-3 mr-1';
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-400 text-blue-800"><Clock className={iconClass} />{t('statuses.new')}</Badge>;
      case 'read':
        return <Badge variant="secondary"><CheckCircle className={iconClass} />{t('statuses.read')}</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-400 text-green-800"><CheckCircle className={iconClass} />{t('statuses.resolved')}</Badge>;
      case 'closed':
        return <Badge variant="destructive"><XCircle className={iconClass} />{t('statuses.closed')}</Badge>;
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

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'sender',
      label: t('table.sender'),
      skeletonWidth: '70%',
      render: (message) => (
        <div>
          <p className="font-medium text-foreground text-sm">{message.name}</p>
          <p className="text-xs text-muted-foreground">{message.email}</p>
          {message.phone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Phone className="h-3 w-3" />
              <span>{message.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'subject',
      label: t('table.subject'),
      skeletonWidth: '80%',
      render: (message) => (
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            {getTypeIcon(message.type)}
            <span className="font-medium text-foreground text-sm">{message.subject}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 max-w-xs">{message.message}</p>
        </div>
      ),
    },
    {
      key: 'date',
      label: t('table.date'),
      skeletonWidth: '60%',
      render: (message) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">{formatDate(message.createdAt)}</span>
      ),
    },
    {
      key: 'status',
      label: t('table.status'),
      align: 'center',
      skeletonWidth: '50%',
      render: (message) => (
        <div className="flex flex-col items-center gap-1">
          {getStatusBadge(message.status)}
          {getTypeBadge(message.type)}
          {message.priority && getPriorityBadge(message.priority)}
        </div>
      ),
    },
    {
      key: '_actions',
      label: '',
      align: 'end',
      skeletonWidth: '80px',
      render: (message) => (
        <div className="flex items-center justify-end gap-1 flex-wrap">
          {message.status === 'new' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAsRead(message)}
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs"
            >
              {t('actions.markAsRead')}
            </Button>
          )}
          {message.status === 'read' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleMarkAsResolved(message)}
              className="bg-green-50 text-green-700 hover:bg-green-100 text-xs"
            >
              {t('actions.markAsResolved')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRespond(message)}
            title={t('actions.respond')}
            className="h-8 w-8 p-0 hover:bg-muted rounded-md"
          >
            <Mail className="h-4 w-4" />
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
      filters={
        <>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            dir={dir}
          />
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
        </>
      }
    >
      <DataTable
        columns={columns}
        data={messages}
        loading={loading}
        emptyTitle={t('empty.noMessages')}
        emptyIcon={Mail}
        countLabel={t('messagesCount', { count: totalMessages })}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        dir={dir}
      />

      {/* Response Modal */}
      <AdminModal
        open={showResponseModal}
        onClose={setShowResponseModal}
        title={t('modal.respondTitle')}
        size="md"
        dir={dir}
        disabled={isResponding}
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowResponseModal(false);
                setMessageToRespond(null);
              }}
              disabled={isResponding}
            >
              {t('modal.cancel')}
            </Button>
            <Button
              type="submit"
              form="response-form"
              disabled={isResponding || !responseText.trim()}
            >
              {t('modal.sendResponse')}
            </Button>
          </>
        }
      >
        <form id="response-form" onSubmit={(e) => { e.preventDefault(); confirmResponse(); }} className="space-y-4">
          <div className={`space-y-1 ${isRTL ? 'text-right' : ''}`}>
            <p className="text-sm text-muted-foreground">
              <strong>{t('message.from')}</strong> {messageToRespond?.name} ({messageToRespond?.email})
            </p>
            <p className="text-sm text-muted-foreground">
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
              dir={dir}
            />
          </div>
        </form>
      </AdminModal>
    </SectionShell>
  );
}
