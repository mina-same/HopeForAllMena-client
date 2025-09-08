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


const TrainingRequestsSection = () => {
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
        title: "Error",
        description: "Failed to load training requests",
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
        
        const statusMessages = {
          approved: 'Training request has been approved',
          cancelled: 'Training request has been cancelled',
          scheduled: 'Training has been scheduled and added to calendar',
          completed: 'Training has been marked as completed',
          pending: 'Training request status updated',
        };

        toast({
          title: "Status Updated",
          description: statusMessages[newStatus],
        });
        
        fetchRequests(); // Refresh the list
      } else {
        throw new Error('Failed to update request status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
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
        <div className="text-lg">Loading training requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Training Requests</h2>
          <p className="text-muted-foreground">Manage new training requests from churches</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Scheduled</p>
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
          <CardTitle className="text-foreground">Training Requests ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, church, service type, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-[30px]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Church</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Suggested Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{request.name}</TableCell>
                  <TableCell>{request.phoneNumber}</TableCell>
                  <TableCell>{request.churchName}</TableCell>
                  <TableCell>{request.serviceType}</TableCell>
                  <TableCell className="text-center">{request.numberOfServed}</TableCell>
                  <TableCell>{new Date(request.suggestedDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(request.status)}
                      className={cn("capitalize", getStatusColor(request.status))}
                    >
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
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
                            <DialogTitle className="text-xl font-semibold">
                              Training Request Details
                            </DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              {/* Contact Information */}
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Contact Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Contact Person</p>
                                    <p className="text-sm">{selectedRequest.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Phone</p>
                                    <p className="text-sm">{selectedRequest.phoneNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                                    <p className="text-sm">{selectedRequest.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                    <Badge 
                                      variant={getStatusBadgeVariant(selectedRequest.status)}
                                      className={cn("capitalize text-xs", getStatusColor(selectedRequest.status))}
                                    >
                                      {selectedRequest.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Church Information */}
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Church Information</h3>
                                <div className="grid grid-cols-1 gap-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Church Name</p>
                                    <p className="text-sm">{selectedRequest.churchName}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Address</p>
                                    <p className="text-sm">{selectedRequest.churchAddress}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Service Information */}
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-3">Service Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Service Type</p>
                                    <p className="text-sm">{selectedRequest.serviceType}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Suggested Date</p>
                                    <p className="text-sm">{new Date(selectedRequest.suggestedDate).toLocaleDateString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Number of Servants</p>
                                    <p className="text-sm">{selectedRequest.numberOfServants}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">Number of People Served</p>
                                    <p className="text-sm">{selectedRequest.numberOfServed}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Nearby Churches */}
                              {selectedRequest.nearbyChurches && selectedRequest.nearbyChurches.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Nearby Churches</h3>
                                  <div className="space-y-3">
                                    {selectedRequest.nearbyChurches.map((church, index) => (
                                      <div key={index} className="border rounded p-3">
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium">{church.name}</p>
                                          <p className="text-xs text-muted-foreground">{church.responsiblePerson}</p>
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

          {filteredRequests.length === 0 && !loading && (
            <div className="text-center py-12">
              <Church className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No matching requests found' : 'No Training Requests'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Training requests will appear here when submitted.'}
              </p>
              {requests.length === 0 && searchTerm === '' && statusFilter === 'all' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Debug Info:</strong> Check browser console for authentication details.
                    <br />
                    If logged in as admin, requests should appear here.
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