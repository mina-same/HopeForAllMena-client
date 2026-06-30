import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, FileText, Download, Paperclip } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';

const API_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

const DevelopmentProjectRequestsSection = () => {
  const { t } = useTranslation('DevelopmentRequestsManagement');
  const { language: currentLanguage } = useI18next();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { authStorage } = require('../../utils/storage');
        const token = authStorage.getToken();

        if (!token) {
          console.log('No authentication token found');
          setRequests([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/development-project-requests`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests || []);
        } else if (response.status === 401) {
          console.log('Authentication failed - token may be invalid');
          setRequests([]);
        } else {
          throw new Error('Failed to fetch development project requests');
        }
      } catch (error) {
        console.error('Error fetching development project requests:', error);
        toast({
          title: t('errors.title'),
          description: t('errors.loadFailed'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [refetchTrigger, t, toast]);

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const { authStorage } = require('../../utils/storage');
      const token = authStorage.getToken();

      const response = await fetch(`${API_URL}/development-project-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: t('errors.statusUpdated'),
          description: t(`statusMessages.${newStatus}`),
        });

        setRefetchTrigger(prev => prev + 1);
      } else {
        throw new Error('Failed to update request status');
      }
    } catch (error) {
      toast({
        title: t('errors.title'),
        description: t('errors.updateFailed'),
        variant: "destructive",
      });
    }
  };

  const downloadAttachment = async (requestId, filename, originalName) => {
    try {
      const { authStorage } = require('../../utils/storage');
      const token = authStorage.getToken();

      const response = await fetch(`${API_URL}/development-project-requests/${requestId}/attachments/${filename}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = originalName || filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download attachment');
      }
    } catch (error) {
      toast({
        title: t('errors.downloadFailed'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Filter requests based on search term and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requesterName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.churchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.projectTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.projectCategory?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'reviewing': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-400 text-green-800 border-green-300 shadow-sm font-medium hover:bg-green-200 transition-colors';
      case 'rejected':
        return 'bg-red-400 text-red-800 border-red-300 shadow-sm font-medium hover:bg-red-200 transition-colors';
      case 'reviewing':
        return 'bg-blue-400 text-blue-800 border-blue-300 shadow-sm font-medium hover:bg-blue-200 transition-colors';
      case 'pending':
        return 'bg-amber-400 text-amber-800 border-amber-300 shadow-sm font-medium hover:bg-amber-200 transition-colors';
      default:
        return 'bg-muted text-muted-foreground border-border shadow-sm font-medium hover:bg-muted transition-colors';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'requesterName',
      label: t('table.headers.requester'),
      render: (row) => <span className="font-medium">{row.requesterName}</span>,
    },
    {
      key: 'churchName',
      label: t('table.headers.church'),
    },
    {
      key: 'projectTitle',
      label: t('table.headers.projectTitle'),
      render: (row) => <span className="max-w-xs truncate block">{row.projectTitle}</span>,
    },
    {
      key: 'projectCategory',
      label: t('table.headers.category'),
      render: (row) => <span>{t(`categories.${row.projectCategory}`) || row.projectCategory}</span>,
    },
    {
      key: 'status',
      label: t('table.headers.status'),
      render: (row) => (
        <Badge
          variant={getStatusBadgeVariant(row.status)}
          className={cn("capitalize", getStatusColor(row.status))}
        >
          {t(`status.${row.status}`)}
        </Badge>
      ),
    },
    {
      key: '_actions',
      label: t('table.headers.actions'),
      align: 'end',
      render: (row) => (
        <div className={cn("flex items-center", isRTL ? 'space-x-reverse space-x-2' : 'space-x-2')}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRequest(row)}
            className="hover:bg-muted rounded-md"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateRequestStatus(row._id, 'approved')}
            className="hover:bg-green-50 hover:text-green-700"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateRequestStatus(row._id, 'rejected')}
            className="hover:bg-red-50 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateRequestStatus(row._id, 'reviewing')}
            className="hover:bg-blue-50 hover:text-blue-700"
          >
            <Eye className="h-4 w-4" />
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
        <div className={cn("flex flex-col md:flex-row gap-4", isRTL ? 'md:flex-row' : '')}>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('filters.searchPlaceholder')}
            dir={dir}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 flex-row">
              <SelectValue placeholder={t('filters.filterByStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.status.all')}</SelectItem>
              <SelectItem value="pending">{t('filters.status.pending')}</SelectItem>
              <SelectItem value="reviewing">{t('filters.status.reviewing')}</SelectItem>
              <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
              <SelectItem value="rejected">{t('filters.status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={cn("text-sm font-medium text-muted-foreground", isRTL ? 'text-right' : 'text-left')}>{t('stats.totalRequests')}</p>
                <p className="text-3xl font-bold text-foreground">{filteredRequests.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-status-pending/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={cn("text-sm font-medium text-muted-foreground", isRTL ? 'text-right' : 'text-left')}>{t('stats.pending')}</p>
                <p className="text-3xl font-bold text-status-pending">
                  {filteredRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-status-pending/10">
                <Paperclip className="h-8 w-8 text-status-pending" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-status-approved/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={cn("text-sm font-medium text-muted-foreground", isRTL ? 'text-right' : 'text-left')}>{t('stats.approved')}</p>
                <p className="text-3xl font-bold text-status-approved">
                  {filteredRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-status-approved/10">
                <CheckCircle className="h-8 w-8 text-status-approved" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-status-reviewing/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={cn("text-sm font-medium text-muted-foreground", isRTL ? 'text-right' : 'text-left')}>{t('stats.reviewing')}</p>
                <p className="text-3xl font-bold text-status-reviewing">
                  {filteredRequests.filter(r => r.status === 'reviewing').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-status-reviewing/10">
                <Eye className="h-8 w-8 text-status-reviewing" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={filteredRequests}
        loading={loading}
        emptyTitle={t('empty.noRequests')}
        emptyIcon={<FileText className="h-12 w-12 text-muted-foreground" />}
        countLabel={t('table.count', { count: filteredRequests.length })}
        dir={dir}
      />

      <AdminModal
        open={!!selectedRequest}
        onClose={setSelectedRequest}
        title={t('detailsModal.title')}
        size="lg"
        dir={dir}
        footer={
          <Button variant="outline" onClick={() => setSelectedRequest(null)}>
            {t('actions.close') || 'Close'}
          </Button>
        }
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Project Information */}
            <div>
              <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>
                {t('detailsModal.projectInformation')}
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.projectTitle')}
                  </p>
                  <p className="text-sm font-medium">{selectedRequest.projectTitle}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.category')}
                  </p>
                  <p className="text-sm">{t(`categories.${selectedRequest.projectCategory}`) || selectedRequest.projectCategory}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.problemStatement')}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.problemStatement}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.proposedSolution')}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.proposedSolution}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>
                {t('detailsModal.contactInformation')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.requesterName')}
                  </p>
                  <p className="text-sm">{selectedRequest.requesterName}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.phone')}
                  </p>
                  <p className="text-sm">{selectedRequest.phoneNumber}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.email')}
                  </p>
                  <p className="text-sm">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.status')}
                  </p>
                  <Badge
                    variant={getStatusBadgeVariant(selectedRequest.status)}
                    className={cn("capitalize text-xs", getStatusColor(selectedRequest.status))}
                  >
                    {t(`status.${selectedRequest.status}`)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Church Information */}
            <div>
              <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>
                {t('detailsModal.churchInformation')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.churchName')}
                  </p>
                  <p className="text-sm">{selectedRequest.churchName}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.denomination')}
                  </p>
                  <p className="text-sm">{selectedRequest.denomination || '-'}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.country')}
                  </p>
                  <p className="text-sm">{selectedRequest.country}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.city')}
                  </p>
                  <p className="text-sm">{selectedRequest.city}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.churchAddress')}
                  </p>
                  <p className="text-sm">{selectedRequest.churchAddress}</p>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>
                {t('detailsModal.projectDetails')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.beneficiaries')}
                  </p>
                  <p className="text-sm">{selectedRequest.beneficiariesCount}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.targetGroup')}
                  </p>
                  <p className="text-sm">{selectedRequest.targetGroup}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.projectPhases')}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.projectPhases}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.sustainabilityPlan')}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.sustainabilityPlan}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.teamInfo')}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.teamInfo}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>
                    {t('detailsModal.fields.budgetDetails')}
                  </p>
                  <p className="text-sm whitespace-pre-wrap">{selectedRequest.budgetDetails}</p>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
              <div>
                <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>
                  {t('detailsModal.attachments')}
                </h3>
                <div className="space-y-2">
                  {selectedRequest.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{attachment.originalName}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadAttachment(selectedRequest._id, attachment.filename)}
                        className="hover:bg-muted rounded-md"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>
    </SectionShell>
  );
};

export default DevelopmentProjectRequestsSection;
