import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { magazineRequestsAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import { Search, Eye, Check, X, Trash2, BookOpen, Phone, MapPin, Church, Hash, FileText, Package, Truck } from 'lucide-react';

export const MagazinesSection = () => {
  const { t } = useTranslation('MagazinesManagement');
  const { language: currentLanguage } = useI18next();
  const { toast } = useToast();
  const [magazineRequests, setMagazineRequests] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  });

  useEffect(() => {
    fetchRequests();
    fetchStatistics();
  }, [searchTerm, statusFilter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 50 // Get more results for admin view
      };

      const response = await magazineRequestsAPI.getAllRequests(params);
      setMagazineRequests(response.data.requests);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: t('toast.error'),
        description: t('toast.failedToFetch'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await magazineRequestsAPI.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filteredRequests = magazineRequests;

  const handleStatusUpdate = async (id, status) => {
    try {
      await magazineRequestsAPI.updateRequestStatus(id, { status });
      toast({
        title: t('toast.statusUpdated', { status: t(`status.${status}`) }),
        description: t('toast.statusUpdated', { status: t(`status.${status}`) }),
      });
      fetchRequests();
      fetchStatistics();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: t('toast.error'),
        description: error.response?.data?.message || t('toast.failedToUpdate'),
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await magazineRequestsAPI.deleteRequest(id);
      toast({
        title: t('toast.requestDeleted'),
        description: t('toast.requestDeleted'),
      });
      fetchRequests();
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: t('toast.error'),
        description: error.response?.data?.message || t('toast.failedToDelete'),
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-400 text-white border-emerald-300 font-medium">{t('status.approved')}</Badge>;
      case 'rejected':
        return <Badge className="bg-rose-400 text-white border-rose-300 font-medium">{t('status.rejected')}</Badge>;
      case 'fulfilled':
        return <Badge className="bg-green-400 text-white border-green-300 font-medium">{t('status.fulfilled')}</Badge>;
      case 'cancelled':
        return <Badge className="bg-slate-400 text-white border-slate-300 font-medium">{t('status.cancelled')}</Badge>;
      default:
        return <Badge className="bg-amber-400 text-white border-amber-300 font-medium">{t('status.pending')}</Badge>;
    }
  };

  const stats = statistics ? {
    total: statistics.totalRequests,
    pending: statistics.pendingRequests,
    approved: statistics.statusBreakdown?.find(s => s._id === 'approved')?.count || 0,
    rejected: statistics.statusBreakdown?.find(s => s._id === 'rejected')?.count || 0,
    fulfilled: statistics.fulfilledRequests
  } : {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    fulfilled: 0
  };

  return (
    <div className={`space-y-6 ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t('title')}</h2>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-muted-foreground">{t('stats.totalRequests')}</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-muted-foreground">{t('stats.pending')}</p>
                <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-muted-foreground">{t('stats.approved')}</p>
                <p className="text-3xl font-bold text-foreground">{stats.approved}</p>
              </div>
              <Check className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className={`flex items-center justify-between flex-row ${currentLanguage === 'ar' ? '' : 'flex-row'}`}>
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <p className="text-sm font-medium text-muted-foreground">{t('stats.fulfilled')}</p>
                <p className="text-3xl font-bold text-foreground">{stats.fulfilled}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('filters.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`flex flex-col md:flex-row gap-4 ${currentLanguage === 'ar' ? 'md:' : ''}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute top-3 h-4 w-4 text-muted-foreground ${currentLanguage === 'ar' ? 'right-3' : 'left-3'}`} />
                <Input
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={currentLanguage === 'ar' ? 'pr-[30px] text-right' : 'pl-[30px]'}
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px] flex-row">
                <SelectValue placeholder={t('filters.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('filters.status.all')}</SelectItem>
                <SelectItem value="pending">{t('filters.status.pending')}</SelectItem>
                <SelectItem value="approved">{t('filters.status.approved')}</SelectItem>
                <SelectItem value="rejected">{t('filters.status.rejected')}</SelectItem>
                <SelectItem value="fulfilled">{t('filters.status.fulfilled')}</SelectItem>
                <SelectItem value="cancelled">{t('filters.status.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
            {t('table.count', { count: filteredRequests.length })}
          </CardTitle>
          <CardDescription className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
            {t('table.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-3 xs:p-4 sm:p-6">
          {loading ? (
            <div className="text-center py-8">{t('loading.requests')}</div>
          ) : (
            <>
              {/* Desktop Table - Hidden on mobile */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.requestDetails')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.churchInfo')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.magazine')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.status')}</TableHead>
                      <TableHead className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t('table.headers.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                          <div className="space-y-2">
                            {request.magazines && request.magazines.length > 0 ? (
                              <div>
                                <p className="font-medium">{t('table.magazines')}</p>
                                <ul className={`mt-1 ${currentLanguage === 'ar' ? 'mr-4' : 'ml-4'}`}>
                                  {request.magazines.map((mag, index) => (
                                    <li key={index} className="text-sm text-gray-600">
                                      • {mag.magazineName} ({t('table.copiesCount', { count: mag.numberOfCopies })})
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <>
                                <p><span className="font-medium">{t('table.magazine')}</span> {request.magazineName}</p>
                                <p><span className="font-medium">{t('table.copies')}</span> {request.numberOfCopies}</p>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                          <div className="space-y-1">
                            <div className={`flex items-center text-sm ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <Church className={`h-3 w-3 text-muted-foreground ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                              <span className="font-medium">{request.churchName}</span>
                            </div>
                            <div className={`flex items-start text-xs text-muted-foreground ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <MapPin className={`h-3 w-3 mt-0.5 flex-shrink-0 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                              <span className="line-clamp-2">{request.churchAddress}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                          <div className="space-y-1">
                            <div className={`flex items-center text-sm font-medium ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <BookOpen className={`h-3 w-3 text-muted-foreground ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                              {request.magazineName}
                            </div>
                            <div className={`flex items-center text-xs text-muted-foreground ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                              <Hash className={`h-3 w-3 ${currentLanguage === 'ar' ? 'ml-1' : 'mr-1'}`} />
                              {t('table.copiesCount', { count: request.numberOfCopies })}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'justify-end' : 'justify-start'}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                              title={t('actions.view')}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {request.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(request._id, 'approved')}
                                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                  title={t('actions.approve')}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                  title={t('actions.reject')}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            {request.status === 'approved' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(request._id, 'fulfilled')}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                title={t('actions.fulfill')}
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                            )}

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title={t('actions.delete')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                                    {t('deleteModal.title')}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                                    {t('deleteModal.description')}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className={`${currentLanguage === 'ar' ? 'justify-start flex-row-reverse gap-3' : 'gap-3'}`}>
                                  <AlertDialogCancel className="mt-0">{t('deleteModal.cancelText')}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(request._id)}
                                    className="bg-red-600 hover:bg-red-700 mt-0"
                                  >
                                    {t('deleteModal.confirmText')}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card Layout - Visible on mobile/tablet */}
              <div className="lg:hidden space-y-3 xs:space-y-4">
                {filteredRequests.map((request) => (
                  <Card key={request._id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-3 xs:p-4">
                      {/* Request Header */}
                      <div className={`flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3 ${currentLanguage === 'ar' ? 'xs:flex-row-reverse' : ''}`}>
                        <div className={`flex-1 min-w-0 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <div className={`flex items-center gap-2 ${currentLanguage === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                            <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <h3 className="font-semibold text-foreground text-sm xs:text-base truncate">
                              {request.magazineName}
                            </h3>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 text-xs xs:text-sm text-muted-foreground ${currentLanguage === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                            <Hash className="h-3 w-3" />
                            <span>{t('table.copiesCount', { count: request.numberOfCopies })}</span>
                          </div>
                        </div>
                        <div className={`flex-shrink-0 ${currentLanguage === 'ar' ? 'self-end xs:self-start' : 'self-start'}`}>
                          {getStatusBadge(request.status)}
                        </div>
                      </div>

                      {/* Church Information */}
                      <div className={`mt-3 p-2 xs:p-3 bg-muted/30 rounded-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-2 text-sm font-medium ${currentLanguage === 'ar' ? 'flex-row-reverse justify-end' : ''}`}>
                          <Church className="h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{request.churchName}</span>
                        </div>
                        <div className={`flex items-start gap-2 mt-1 text-xs xs:text-sm text-muted-foreground ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <MapPin className="h-3 w-3 xs:h-4 xs:w-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{request.churchAddress}</span>
                        </div>
                      </div>

                      {/* Multiple Magazines (if applicable) */}
                      {request.magazines && request.magazines.length > 0 && (
                        <div className={`mt-3 p-2 xs:p-3 bg-blue-50 rounded-lg ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                          <p className="text-xs xs:text-sm font-medium text-blue-800 mb-2">{t('table.magazines')}</p>
                          <div className="space-y-1">
                            {request.magazines.map((mag, index) => (
                              <div key={index} className="text-xs xs:text-sm text-blue-700">
                                • {mag.magazineName} ({t('table.copiesCount', { count: mag.numberOfCopies })})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className={`flex flex-wrap items-center gap-1 xs:gap-2 mt-3 pt-3 border-t border-border ${currentLanguage === 'ar' ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                        >
                          <Eye className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                          {t('actions.view')}
                        </Button>

                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(request._id, 'approved')}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                            >
                              <Check className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                              {t('actions.approve')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusUpdate(request._id, 'rejected')}
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                            >
                              <X className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                              {t('actions.reject')}
                            </Button>
                          </>
                        )}

                        {request.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(request._id, 'fulfilled')}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                          >
                            <Truck className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                            {t('actions.fulfill')}
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs xs:text-sm px-2 xs:px-3 py-1 xs:py-2"
                            >
                              <Trash2 className="h-3 w-3 xs:h-4 xs:w-4 mr-1" />
                              {t('actions.delete')}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                                {t('deleteModal.title')}
                              </AlertDialogTitle>
                              <AlertDialogDescription className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                                {t('deleteModal.description')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className={`${currentLanguage === 'ar' ? 'justify-start flex-row-reverse gap-3' : 'gap-3'}`}>
                              <AlertDialogCancel className="mt-0">{t('deleteModal.cancelText')}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(request._id)}
                                className="bg-red-600 hover:bg-red-700 mt-0"
                              >
                                {t('deleteModal.confirmText')}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Empty State */}
              {filteredRequests.length === 0 && (
                <div className="text-center py-8 xs:py-12">
                  <BookOpen className="h-8 w-8 xs:h-12 xs:w-12 text-muted-foreground mx-auto mb-3 xs:mb-4" />
                  <p className="text-base xs:text-lg font-medium text-muted-foreground mb-2 text-center">{t('empty.noRequests')}</p>
                  <p className="text-sm xs:text-base text-muted-foreground text-center">
                    {searchTerm || statusFilter !== 'all'
                      ? t('empty.adjustCriteria')
                      : t('empty.willAppear')
                    }
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <AlertDialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className={`flex items-center gap-2 ${currentLanguage === 'ar' ? ' text-right' : 'text-left'}`}>
                <BookOpen className="h-5 w-5" />
                {t('modal.title')}
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    <label className="text-sm font-medium text-muted-foreground">{t('modal.requesterName')}</label>
                    <p className="text-foreground font-medium">{selectedRequest.name}</p>
                  </div>
                  <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    <label className="text-sm font-medium text-muted-foreground">{t('modal.phoneNumber')}</label>
                    <p className="text-foreground">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    <label className="text-sm font-medium text-muted-foreground">{t('modal.churchName')}</label>
                    <p className="text-foreground font-medium">{selectedRequest.churchName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                    <label className="text-sm font-medium text-muted-foreground">{t('modal.status')}</label>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  {selectedRequest.priority && (
                    <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                      <label className="text-sm font-medium text-muted-foreground">{t('modal.priority')}</label>
                      <p className="text-foreground capitalize">{t(`priority.${selectedRequest.priority}`)}</p>
                    </div>
                  )}
                  {selectedRequest.trackingNumber && (
                    <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                      <label className="text-sm font-medium text-muted-foreground">{t('modal.trackingNumber')}</label>
                      <p className="text-foreground font-mono">{selectedRequest.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <label className="text-sm font-medium text-muted-foreground">{t('modal.churchAddress')}</label>
                <p className="text-foreground mt-1">{selectedRequest.churchAddress}</p>
              </div>

              {/* Magazine Requests */}
              <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                <label className="text-sm font-medium text-muted-foreground">{t('modal.magazineRequests')}</label>
                <div className="space-y-3">
                  {selectedRequest.magazines && selectedRequest.magazines.length > 0 ? (
                    selectedRequest.magazines.map((magazine, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg border ${currentLanguage === 'ar' ? '' : ''}`}>
                        <div className={`flex items-center gap-3 ${currentLanguage === 'ar' ? '' : ''}`}>
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{magazine.magazineName}</span>
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {t('table.copiesCount', { count: magazine.numberOfCopies })}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    // Fallback for old format
                    selectedRequest.magazineName && (
                      <div className={`flex items-center justify-between p-3 bg-muted/50 rounded-lg border ${currentLanguage === 'ar' ? '' : ''}`}>
                        <div className={`flex items-center gap-3 ${currentLanguage === 'ar' ? '' : ''}`}>
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{selectedRequest.magazineName}</span>
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {t('table.copiesCount', { count: selectedRequest.numberOfCopies })}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              {selectedRequest.adminNotes && (
                <div className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>
                  <label className="text-sm font-medium text-muted-foreground">{t('modal.adminNotes')}</label>
                  <p className="text-foreground mt-1 p-3 bg-muted rounded-lg">{selectedRequest.adminNotes}</p>
                </div>
              )}

              <div className={`text-sm text-muted-foreground ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                <p>{t('modal.requestSubmitted')} {new Date(selectedRequest.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <AlertDialogFooter className={`${currentLanguage === 'ar' ? 'justify-start' : ''}`}>
              <AlertDialogCancel>{t('modal.close')}</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
