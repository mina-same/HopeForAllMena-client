import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Calendar, Church, Users, Phone, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { useCalendar } from '../../context/CalendarContext';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Link } from 'gatsby';
import { graphql } from 'gatsby';
import '../../styles/TrainingRequestsManagement-rtl.css';


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

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Check multiple token storage keys for authentication
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      if (!token) {
        console.log('No authentication token found');
        setRequests([]);
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/training-requests', {
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

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      const response = await fetch(`http://localhost:5001/api/training-requests/${requestId}/status`, {
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
        
        fetchRequests(); // Refresh the list
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
        return 'bg-gray-400 text-gray-700 border-gray-300 shadow-sm font-medium hover:bg-gray-200 transition-colors';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">{t('loading.requests')}</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", currentLanguage === 'ar' ? 'rtl' : 'ltr')} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className={cn("flex items-center justify-between flex-row", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={cn("text-sm font-medium text-muted-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('stats.totalRequests')}</p>
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
                <p className={cn("text-sm font-medium text-muted-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('stats.pending')}</p>
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
                <p className={cn("text-sm font-medium text-muted-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('stats.approved')}</p>
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
                <p className={cn("text-sm font-medium text-muted-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('stats.scheduled')}</p>
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

      {/* Requests Table */}
      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className={cn("text-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('table.count', { count: filteredRequests.length })}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className={cn("flex flex-col md:flex-row gap-4 mb-6", currentLanguage === 'ar' ? 'md:flex-row' : '')}>
            <div className="relative flex-1">
              <Search className={cn("absolute top-3 h-4 w-4 text-muted-foreground", currentLanguage === 'ar' ? 'right-3' : 'left-3')} />
              <Input
                placeholder={t('filters.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              />
            </div>
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
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.requester')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.phone')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.church')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.serviceType')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.participants')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.suggestedDate')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.status')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell>{request.phoneNumber}</TableCell>
                    <TableCell>{request.churchName}</TableCell>
                    <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t(`serviceTypes.${request.serviceType}`) || request.serviceType}</TableCell>
                    <TableCell className="text-center">{request.numberOfServed}</TableCell>
                    <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{new Date(request.suggestedDate).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadgeVariant(request.status)}
                        className={cn("capitalize", getStatusColor(request.status))}
                      >
                        {t(`status.${request.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={cn("flex items-center", currentLanguage === 'ar' ? 'space-x-reverse space-x-2' : 'space-x-2')}>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                              className="hover:bg-primary/10 hover:text-primary"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className={cn("text-xl font-semibold", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                {t('detailsModal.title')}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-4">
                                {/* Contact Information */}
                                <div>
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.contactInformation')}</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.contactPerson')}</p>
                                      <p className="text-sm">{selectedRequest.name}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.phone')}</p>
                                      <p className="text-sm">{selectedRequest.phoneNumber}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.email')}</p>
                                      <p className="text-sm">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.status')}</p>
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
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.churchInformation')}</h3>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.churchName')}</p>
                                      <p className="text-sm">{selectedRequest.churchName}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.address')}</p>
                                      <p className="text-sm">{selectedRequest.churchAddress}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Service Information */}
                                <div>
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.serviceInformation')}</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.serviceType')}</p>
                                      <p className={cn("text-sm", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t(`serviceTypes.${selectedRequest.serviceType}`) || selectedRequest.serviceType}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.suggestedDate')}</p>
                                      <p className={cn("text-sm", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{new Date(selectedRequest.suggestedDate).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.numberOfServants')}</p>
                                      <p className="text-sm">{selectedRequest.numberOfServants}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.numberOfServed')}</p>
                                      <p className="text-sm">{selectedRequest.numberOfServed}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Nearby Churches */}
                                {selectedRequest.nearbyChurches && selectedRequest.nearbyChurches.length > 0 && (
                                  <div>
                                    <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.nearbyChurches')}</h3>
                                    <div className="space-y-3">
                                      {selectedRequest.nearbyChurches.map((church, index) => (
                                        <div key={index} className="border rounded p-3">
                                          <div className="space-y-2">
                                            <p className="text-sm font-medium">{church.name}</p>
                                            <p className={cn("text-xs text-muted-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.responsiblePerson')}: {church.responsiblePerson}</p>
                                            <p className="text-xs text-muted-foreground">{church.phoneNumber}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            )}
                          </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateRequestStatus(request._id, 'approved')}
                        className="hover:bg-green-50 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateRequestStatus(request._id, 'cancelled')}
                          className="hover:bg-red-50 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateRequestStatus(request._id, 'scheduled')}
                          className="hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request._id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className={cn("space-y-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                    {/* Header with Name and Status */}
                    <div className={cn("flex items-start justify-between flex-row", currentLanguage === 'ar' ? '' : '')}>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{request.name}</h3>
                        <p className="text-sm text-muted-foreground">{request.phoneNumber}</p>
                      </div>
                      <Badge 
                        variant={getStatusBadgeVariant(request.status)}
                        className={cn("capitalize text-xs", getStatusColor(request.status))}
                      >
                        {t(`status.${request.status}`)}
                      </Badge>
                    </div>

                    {/* Church Information */}
                    <div className="space-y-2 flex-row">
                      <div className={cn("flex items-center flex-row", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                        <Church className={cn("h-4 w-4 text-muted-foreground", currentLanguage === 'ar' ? 'ml-2' : 'mr-2')} />
                        <span className="text-sm font-medium">{request.churchName}</span>
                      </div>
                      <div className={cn("flex items-center flex-row", currentLanguage === 'ar' ? '' : '')}>
                        <Calendar className={cn("h-4 w-4 text-muted-foreground", currentLanguage === 'ar' ? 'ml-2' : 'mr-2')} />
                        <span className="text-sm">{new Date(request.suggestedDate).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</span>
                      </div>
                    </div>

                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">{t('table.headers.serviceType')}</p>
                        <p className="font-medium">{t(`serviceTypes.${request.serviceType}`) || request.serviceType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">{t('table.headers.participants')}</p>
                        <p className="font-medium">{request.numberOfServed}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={cn("flex items-center justify-between pt-2 border-t", currentLanguage === 'ar' ? 'flex-row' : '')}>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                            className={cn("flex items-center", currentLanguage === 'ar' ? 'flex-row' : '')}
                          >
                            <Eye className={cn("h-4 w-4", currentLanguage === 'ar' ? 'ml-1' : 'mr-1')} />
                            <span className="text-xs">{t('actions.view')}</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className={cn("text-xl font-semibold", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                              {t('detailsModal.title')}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              {/* Contact Information */}
                              <div>
                                <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.contactInformation')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.contactPerson')}</p>
                                    <p className="text-sm">{selectedRequest.name}</p>
                                  </div>
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.phone')}</p>
                                    <p className="text-sm">{selectedRequest.phoneNumber}</p>
                                  </div>
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.email')}</p>
                                    <p className="text-sm">{selectedRequest.email}</p>
                                  </div>
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.status')}</p>
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
                                <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.churchInformation')}</h3>
                                <div className="grid grid-cols-1 gap-3">
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.churchName')}</p>
                                    <p className="text-sm">{selectedRequest.churchName}</p>
                                  </div>
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.address')}</p>
                                    <p className="text-sm">{selectedRequest.churchAddress}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Service Information */}
                              <div>
                                <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.serviceInformation')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.serviceType')}</p>
                                    <p className={cn("text-sm", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t(`serviceTypes.${selectedRequest.serviceType}`) || selectedRequest.serviceType}</p>
                                  </div>
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.suggestedDate')}</p>
                                    <p className={cn("text-sm", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{new Date(selectedRequest.suggestedDate).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}</p>
                                  </div>
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.numberOfServants')}</p>
                                    <p className="text-sm">{selectedRequest.numberOfServants}</p>
                                  </div>
                                  <div>
                                    <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.numberOfServed')}</p>
                                    <p className="text-sm">{selectedRequest.numberOfServed}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Nearby Churches */}
                              {selectedRequest.nearbyChurches && selectedRequest.nearbyChurches.length > 0 && (
                                <div>
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.nearbyChurches')}</h3>
                                  <div className="space-y-3">
                                    {selectedRequest.nearbyChurches.map((church, index) => (
                                      <div key={index} className="border rounded p-3">
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium">{church.name}</p>
                                          <p className={cn("text-xs text-muted-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('detailsModal.fields.responsiblePerson')}: {church.responsiblePerson}</p>
                                          <p className="text-xs text-muted-foreground">{church.phoneNumber}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <div className={cn("flex items-center", currentLanguage === 'ar' ? 'flex-row' : 'space-x-1')}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateRequestStatus(request._id, 'approved')}
                          className="hover:bg-green-50 hover:text-green-700 p-2"
                          title={t('actions.approve')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateRequestStatus(request._id, 'cancelled')}
                          className="hover:bg-red-50 hover:text-red-700 p-2"
                          title={t('actions.cancel')}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateRequestStatus(request._id, 'scheduled')}
                          className="hover:bg-blue-50 hover:text-blue-700 p-2"
                          title={t('actions.schedule')}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRequests.length === 0 && !loading && (
            <div className="text-center py-12">
              <Church className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className={cn("text-lg font-medium text-muted-foreground mb-2", currentLanguage === 'ar' ? 'text-center' : 'text-center')}>
                {searchTerm || statusFilter !== 'all' ? t('empty.noMatching') : t('empty.noRequests')}
              </h3>
              <p className={cn("text-sm text-muted-foreground", currentLanguage === 'ar' ? 'text-center' : 'text-center')}>
                {searchTerm || statusFilter !== 'all'
                  ? t('empty.tryAdjusting')
                  : t('empty.description')}
              </p>
              {requests.length === 0 && searchTerm === '' && statusFilter === 'all' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 text-center">
                    <strong>{t('empty.debugInfo')}</strong>
                    <br />
                    {t('empty.adminNote')}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingRequestsSection;

export const query = graphql`
  query($language: String!) {
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