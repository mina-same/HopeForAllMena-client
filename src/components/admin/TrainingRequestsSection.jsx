import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Calendar, Church, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DataTable } from '../ui/DataTable';
import { AdminModal } from '../ui/AdminModal';
import { SectionShell, SearchInput } from '../ui/SectionShell';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { useCalendar } from '../../context/CalendarContext';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import '../../styles/TrainingRequestsManagement-rtl.css';

const API_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

const TrainingRequestsSection = () => {
  const { t } = useTranslation('TrainingRequestsManagement');
  const { language: currentLanguage } = useI18next();
  const { toast } = useToast();
  const { scheduleRequest } = useCalendar();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Check multiple token storage keys for authentication
        const { authStorage } = require('../../utils/storage');
        const token = authStorage.getToken();

        if (!token) {
          console.log('No authentication token found');
          setRequests([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/training-requests`, {
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
          throw new Error('Failed to fetch training requests');
        }
      } catch (error) {
        console.error('Error fetching training requests:', error);
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

      const response = await fetch(`${API_URL}/training-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const request = requests.find(r => r._id === requestId);

        // If status is changed to scheduled, add to calendar
        if (newStatus === 'scheduled' && request) {
          scheduleRequest({
            requestId: request._id,
            organizationName: request.churchName,
            contactPerson: request.name,
            eventType: request.serviceType,
            participants: request.numberOfServed,
            suggestedDate: request.suggestedDate,
            location: request.churchAddress,
          });
        }

        toast({
          title: t('errors.statusUpdated'),
          description: t(`statusMessages.${newStatus}`),
        });

        setRefetchTrigger(prev => prev + 1); // Refresh the list
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

  // Filter requests based on search term and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.churchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.churchAddress?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved': return 'default';
      case 'cancelled': return 'destructive';
      case 'scheduled': return 'secondary';
      case 'completed': return 'default';
      default: return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-400 text-green-800 border-green-300 shadow-sm font-medium hover:bg-green-200 transition-colors';
      case 'cancelled':
        return 'bg-red-400 text-red-800 border-red-300 shadow-sm font-medium hover:bg-red-200 transition-colors';
      case 'scheduled':
        return 'bg-blue-400 text-blue-800 border-blue-300 shadow-sm font-medium hover:bg-blue-200 transition-colors';
      case 'completed':
        return 'bg-emerald-400 text-emerald-800 border-emerald-300 shadow-sm font-medium hover:bg-emerald-200 transition-colors';
      case 'pending':
        return 'bg-amber-400 text-amber-800 border-amber-300 shadow-sm font-medium hover:bg-amber-200 transition-colors';
      default:
        return 'bg-muted text-muted-foreground border-border shadow-sm font-medium hover:bg-muted transition-colors';
    }
  };

  const isRTL = currentLanguage === 'ar';
  const dir = isRTL ? 'rtl' : 'ltr';

  const columns = [
    {
      key: 'name',
      label: t('table.headers.requester'),
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: 'phoneNumber',
      label: t('table.headers.phone'),
    },
    {
      key: 'churchName',
      label: t('table.headers.church'),
    },
    {
      key: 'serviceType',
      label: t('table.headers.serviceType'),
      render: (row) => <span>{t(`serviceTypes.${row.serviceType}`) || row.serviceType}</span>,
    },
    {
      key: 'numberOfServed',
      label: t('table.headers.participants'),
      align: 'center',
    },
    {
      key: 'suggestedDate',
      label: t('table.headers.suggestedDate'),
      render: (row) => <span>{new Date(row.suggestedDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</span>,
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
            onClick={() => updateRequestStatus(row._id, 'cancelled')}
            className="hover:bg-red-50 hover:text-red-700"
          >
            <XCircle className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => updateRequestStatus(row._id, 'scheduled')}
            className="hover:bg-blue-50 hover:text-blue-700"
          >
            <Calendar className="h-4 w-4" />
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
              <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
              <SelectItem value="scheduled">{t('filters.status.scheduled')}</SelectItem>
              <SelectItem value="completed">{t('filters.status.completed')}</SelectItem>
              <SelectItem value="cancelled">{t('filters.status.cancelled')}</SelectItem>
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
                <Church className="h-8 w-8 text-primary" />
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
                <Calendar className="h-8 w-8 text-status-pending" />
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

        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-status-scheduled/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={cn("text-sm font-medium text-muted-foreground", isRTL ? 'text-right' : 'text-left')}>{t('stats.scheduled')}</p>
                <p className="text-3xl font-bold text-status-scheduled">
                  {filteredRequests.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-status-scheduled/10">
                <Users className="h-8 w-8 text-status-scheduled" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={filteredRequests}
        loading={loading}
        emptyTitle={searchTerm || statusFilter !== 'all' ? t('empty.noMatching') : t('empty.noRequests')}
        emptyDescription={searchTerm || statusFilter !== 'all' ? t('empty.tryAdjusting') : t('empty.description')}
        emptyIcon={<Church className="h-12 w-12 text-muted-foreground opacity-50" />}
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
          <div className="space-y-4">
            {/* Contact Information */}
            <div>
              <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.contactInformation')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.contactPerson')}</p>
                  <p className="text-sm">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.phone')}</p>
                  <p className="text-sm">{selectedRequest.phoneNumber}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.email')}</p>
                  <p className="text-sm">{selectedRequest.email}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.status')}</p>
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
              <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.churchInformation')}</h3>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.churchName')}</p>
                  <p className="text-sm">{selectedRequest.churchName}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.address')}</p>
                  <p className="text-sm">{selectedRequest.churchAddress}</p>
                </div>
              </div>
            </div>

            {/* Service Information */}
            <div>
              <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.serviceInformation')}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.serviceType')}</p>
                  <p className={cn("text-sm", isRTL ? 'text-right' : 'text-left')}>{t(`serviceTypes.${selectedRequest.serviceType}`) || selectedRequest.serviceType}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.suggestedDate')}</p>
                  <p className={cn("text-sm", isRTL ? 'text-right' : 'text-left')}>{new Date(selectedRequest.suggestedDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US')}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.numberOfServants')}</p>
                  <p className="text-sm">{selectedRequest.numberOfServants}</p>
                </div>
                <div>
                  <p className={cn("text-xs text-muted-foreground mb-1", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.numberOfServed')}</p>
                  <p className="text-sm">{selectedRequest.numberOfServed}</p>
                </div>
              </div>
            </div>

            {/* Nearby Churches */}
            {selectedRequest.nearbyChurches && selectedRequest.nearbyChurches.length > 0 && (
              <div>
                <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.nearbyChurches')}</h3>
                <div className="space-y-3">
                  {selectedRequest.nearbyChurches.map((church, index) => (
                    <div key={index} className="border border-border rounded p-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{church.name}</p>
                        <p className={cn("text-xs text-muted-foreground", isRTL ? 'text-right' : 'text-left')}>{t('detailsModal.fields.responsiblePerson')}: {church.responsiblePerson}</p>
                        <p className="text-xs text-muted-foreground">{church.phoneNumber}</p>
                      </div>
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

export default TrainingRequestsSection;
