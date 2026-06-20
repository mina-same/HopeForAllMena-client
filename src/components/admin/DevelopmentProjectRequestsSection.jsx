import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, FileText, Search, Download, Paperclip } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';

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

        const response = await fetch('http://localhost:5001/api/development-project-requests', {
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
      
      const response = await fetch(`http://localhost:5001/api/development-project-requests/${requestId}/status`, {
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
      
      const response = await fetch(`http://localhost:5001/api/development-project-requests/${requestId}/attachments/${filename}`, {
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
        return 'bg-gray-400 text-gray-700 border-gray-300 shadow-sm font-medium hover:bg-gray-200 transition-colors';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
                <FileText className="h-8 w-8 text-primary" />
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
                <Paperclip className="h-8 w-8 text-status-pending" />
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
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-status-reviewing/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-row">
              <div>
                <p className={cn("text-sm font-medium text-muted-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>{t('stats.reviewing')}</p>
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

      {/* Requests Table */}
      <Card className="border-0 shadow-modern">
        <CardHeader>
          <CardTitle className={cn("text-foreground", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
            {t('table.count', { count: filteredRequests.length })}
          </CardTitle>
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
                <SelectItem value="reviewing">{t('filters.status.reviewing')}</SelectItem>
                <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('filters.status.rejected')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.requester')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.church')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.projectTitle')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.category')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.status')}</TableHead>
                  <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request._id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{request.requesterName}</TableCell>
                    <TableCell>{request.churchName}</TableCell>
                    <TableCell className="max-w-xs truncate">{request.projectTitle}</TableCell>
                    <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                      {t(`categories.${request.projectCategory}`) || request.projectCategory}
                    </TableCell>
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
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className={cn("text-xl font-semibold", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                {t('detailsModal.title')}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedRequest && (
                              <div className="space-y-6">
                                {/* Project Information */}
                                <div>
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                    {t('detailsModal.projectInformation')}
                                  </h3>
                                  <div className="grid grid-cols-1 gap-4">
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.projectTitle')}
                                      </p>
                                      <p className="text-sm font-medium">{selectedRequest.projectTitle}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.category')}
                                      </p>
                                      <p className="text-sm">{t(`categories.${selectedRequest.projectCategory}`) || selectedRequest.projectCategory}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.problemStatement')}
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.problemStatement}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.proposedSolution')}
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.proposedSolution}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Information */}
                                <div>
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                    {t('detailsModal.contactInformation')}
                                  </h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.requesterName')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.requesterName}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.phone')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.phoneNumber}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.email')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
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
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                    {t('detailsModal.churchInformation')}
                                  </h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.churchName')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.churchName}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.denomination')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.denomination || '-'}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.country')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.country}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.city')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.city}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.churchAddress')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.churchAddress}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Project Details */}
                                <div>
                                  <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                    {t('detailsModal.projectDetails')}
                                  </h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.beneficiaries')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.beneficiariesCount}</p>
                                    </div>
                                    <div>
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.targetGroup')}
                                      </p>
                                      <p className="text-sm">{selectedRequest.targetGroup}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.projectPhases')}
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.projectPhases}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.sustainabilityPlan')}
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.sustainabilityPlan}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.teamInfo')}
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.teamInfo}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <p className={cn("text-xs text-muted-foreground mb-1", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                        {t('detailsModal.fields.budgetDetails')}
                                      </p>
                                      <p className="text-sm whitespace-pre-wrap">{selectedRequest.budgetDetails}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Attachments */}
                                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                                  <div>
                                    <h3 className={cn("text-sm font-medium text-muted-foreground mb-3", currentLanguage === 'ar' ? 'text-right' : 'text-left')}>
                                      {t('detailsModal.attachments')}
                                    </h3>
                                    <div className="space-y-2">
                                      {selectedRequest.attachments.map((attachment, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
                                            className="hover:bg-primary/10 hover:text-primary"
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
                          onClick={() => updateRequestStatus(request._id, 'rejected')}
                          className="hover:bg-red-50 hover:text-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateRequestStatus(request._id, 'reviewing')}
                          className="hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('empty.noRequests')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DevelopmentProjectRequestsSection;
