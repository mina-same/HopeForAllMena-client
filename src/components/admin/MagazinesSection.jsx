import React, { useState, useEffect } from 'react';
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
        title: "Error",
        description: "Failed to fetch magazine requests",
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
        title: "Status Updated",
        description: `Magazine request has been ${status}.`,
      });
      fetchRequests();
      fetchStatistics();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await magazineRequestsAPI.deleteRequest(id);
      toast({
        title: "Request Deleted",
        description: "Magazine request has been deleted successfully.",
      });
      fetchRequests();
      fetchStatistics();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete request",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-400 text-white border-emerald-300 font-medium">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-rose-400 text-white border-rose-300 font-medium">Rejected</Badge>;
      case 'fulfilled':
        return <Badge className="bg-green-400 text-white border-green-300 font-medium">Fulfilled</Badge>;
      case 'cancelled':
        return <Badge className="bg-slate-400 text-white border-slate-300 font-medium">Cancelled</Badge>;
      default:
        return <Badge className="bg-amber-400 text-white border-amber-300 font-medium">Pending</Badge>;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Magazine Requests</h2>
          <p className="text-muted-foreground">Manage magazine subscription requests from churches and communities.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-3xl font-bold text-foreground">{stats.approved}</p>
              </div>
              <Check className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fulfilled</p>
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
          <CardTitle>Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, church, or magazine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-[30px]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Magazine Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>
            Review and manage magazine subscription requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading requests...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request Details</TableHead>
                    <TableHead>Church Info</TableHead>
                    <TableHead>Magazine</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        <div className="space-y-2">
                          {request.magazines && request.magazines.length > 0 ? (
                            <div>
                              <p className="font-medium">Magazines:</p>
                              <ul className="ml-4 mt-1">
                                {request.magazines.map((mag, index) => (
                                  <li key={index} className="text-sm text-gray-600">
                                    • {mag.magazineName} ({mag.numberOfCopies} copies)
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <>
                              <p><span className="font-medium">Magazine:</span> {request.magazineName}</p>
                              <p><span className="font-medium">Copies:</span> {request.numberOfCopies}</p>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Church className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="font-medium">{request.churchName}</span>
                          </div>
                          <div className="flex items-start text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{request.churchAddress}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm font-medium">
                            <BookOpen className="h-3 w-3 mr-1 text-muted-foreground" />
                            {request.magazineName}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Hash className="h-3 w-3 mr-1" />
                            {request.numberOfCopies} copies
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
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
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
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
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Request</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this magazine request? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(request._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
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

              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">No magazine requests found</p>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm || statusFilter !== 'all'
                      ? 'Try adjusting your search criteria'
                      : 'Magazine requests will appear here when submitted'
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <AlertDialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <AlertDialogContent className="max-w-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Magazine Request Details
              </AlertDialogTitle>
            </AlertDialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Requester Name</label>
                    <p className="text-foreground font-medium">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-foreground">{selectedRequest.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Church Name</label>
                    <p className="text-foreground font-medium">{selectedRequest.churchName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  {selectedRequest.priority && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Priority</label>
                      <p className="text-foreground capitalize">{selectedRequest.priority}</p>
                    </div>
                  )}
                  {selectedRequest.trackingNumber && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Tracking Number</label>
                      <p className="text-foreground font-mono">{selectedRequest.trackingNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Church Address</label>
                <p className="text-foreground mt-1">{selectedRequest.churchAddress}</p>
              </div>

              {/* Magazine Requests */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Magazine Requests</label>
                <div className="mt-2 space-y-3">
                  {selectedRequest.magazines && selectedRequest.magazines.length > 0 ? (
                    selectedRequest.magazines.map((magazine, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{magazine.magazineName}</span>
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {magazine.numberOfCopies} copies
                        </Badge>
                      </div>
                    ))
                  ) : (
                    // Fallback for old format
                    selectedRequest.magazineName && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{selectedRequest.magazineName}</span>
                        </div>
                        <Badge variant="outline" className="font-medium">
                          {selectedRequest.numberOfCopies} copies
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>

              {selectedRequest.adminNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Admin Notes</label>
                  <p className="text-foreground mt-1 p-3 bg-muted rounded-lg">{selectedRequest.adminNotes}</p>
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>Request submitted on: {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};