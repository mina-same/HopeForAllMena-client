import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, Shirt, Download, Trash2, AlertTriangle, Package, Truck, XCircle, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';

const TrainingFollowUpRequestsSection = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Debug authentication state
    const token = localStorage.getItem('token');
    const authToken = localStorage.getItem('authToken');
    const accessToken = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    console.log('=== Authentication Debug ===');
    console.log('token:', !!token);
    console.log('authToken:', !!authToken);
    console.log('accessToken:', !!accessToken);
    console.log('User data exists:', !!user);
    console.log('============================');
    
    // Try to get token from different possible keys
    const finalToken = token || authToken || accessToken;
    if (!finalToken && user) {
      toast({
        title: "Authentication Issue",
        description: "Please log out and log back in. Token is missing but user data exists.",
        variant: "destructive",
        duration: 8000,
      });
    }
    
    fetchFollowUpRequests();
  }, []);

  const fetchFollowUpRequests = async () => {
    try {
      console.log('Fetching follow-up requests...');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);
      console.log('Using token from:', token === localStorage.getItem('token') ? 'token' : token === localStorage.getItem('authToken') ? 'authToken' : 'accessToken');
      
      const response = await fetch('http://localhost:5001/api/training-follow-ups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        console.log('Follow-ups array:', data.followUps);
        console.log('Follow-ups length:', data.followUps?.length);
        setRequests(data.followUps || []);
      } else {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        
        if (response.status === 401) {
          toast({
            title: "Authentication Required",
            description: "Please log in as an admin to view follow-up requests. Use: admin@azino.com / Admin@2024",
            variant: "destructive",
            duration: 8000,
          });
        }
        
        throw new Error(`Failed to fetch follow-up requests: ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast({
        title: "Error",
        description: "Failed to load follow-up requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      console.log('=== STATUS UPDATE DEBUG ===');
      console.log('Request ID:', requestId);
      console.log('New Status:', newStatus);
      console.log('Request ID type:', typeof requestId);
      
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      console.log('Token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const requestBody = { status: newStatus };
      console.log('Request body:', JSON.stringify(requestBody));
      
      const url = `http://localhost:5001/api/training-follow-ups/${requestId}/status`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Update successful:', responseData);
        
        const statusMessages = {
          processing: 'Follow-up request is being processed',
          fulfilled: 'Follow-up request has been fulfilled',
          cancelled: 'Follow-up request has been cancelled',
          pending: 'Follow-up request status updated',
        };

        toast({
          title: "Status Updated",
          description: statusMessages[newStatus],
        });
        
        console.log('Refreshing requests list...');
        await fetchFollowUpRequests(); // Refresh the list
      } else {
        const errorText = await response.text();
        console.error('❌ Update failed - Response:', errorText);
        console.error('❌ Status code:', response.status);
        
        // Try to parse error as JSON
        let errorMessage = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorText;
        } catch (e) {
          // Keep original error text
        }
        
        throw new Error(`Failed to update status (${response.status}): ${errorMessage}`);
      }
    } catch (error) {
      console.error('❌ Update request error:', error);
      console.error('❌ Error stack:', error.stack);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    console.log('=== END STATUS UPDATE DEBUG ===');
  };

  const downloadFile = async (requestId, filename) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/training-follow-ups/${requestId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to download file');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:5001/api/training-follow-ups/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "Request Deleted",
          description: "Follow-up request has been successfully deleted",
        });
        
        fetchFollowUpRequests(); // Refresh the list
        setDeleteDialogOpen(false);
        setRequestToDelete(null);
      } else {
        throw new Error('Failed to delete request');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (request) => {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (requestToDelete) {
      deleteRequest(requestToDelete._id);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'processing': return 'default';
      case 'fulfilled': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  // Filter requests based on search term and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.trainingType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return 'bg-blue-400 text-blue-800 border-blue-200';
      case 'fulfilled': return 'bg-green-400 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-400 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-400 text-yellow-800 border-yellow-200';
      default: return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading follow-up requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Training Follow-up Requests</h2>
          <p className="text-muted-foreground">Manage follow-up training material requests</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold text-foreground">{requests.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Shirt className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10">
                <Package className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-purple-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                <p className="text-3xl font-bold text-blue-600">
                  {requests.filter(r => r.status === 'processing').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fulfilled</p>
                <p className="text-3xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'fulfilled').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shirt className="h-5 w-5" />
            Training Follow-up Requests ({filteredRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, training type, or company..."
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
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Church</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Books</TableHead>
                <TableHead>T-shirts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell>{request.trainerName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.phoneNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.churchName}</TableCell>
                  <TableCell title={request.address}>{request.address || 'N/A'}</TableCell>
                  <TableCell>{request.books?.length || 0} books</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Shirt className="h-4 w-4" />
                      {Object.entries(request.tshirtSizes || {}).filter(([size]) => size !== '_id').reduce((total, [, qty]) => total + (parseInt(qty) || 0), 0)}
                    </div>
                  </TableCell>
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
                        <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-foreground">
                              Follow-up Request Details
                            </DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-3">Contact Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Trainer:</span>
                                        <span className="font-medium">{selectedRequest.trainerName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Requester:</span>
                                        <span className="font-medium">{selectedRequest.name}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Church:</span>
                                        <span className="font-medium">{selectedRequest.churchName}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span className="font-medium">{selectedRequest.phoneNumber}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Address:</span>
                                        <span className="font-medium">{selectedRequest.address || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">People Served:</span>
                                        <span className="font-medium">{selectedRequest.numberOfServed}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold text-foreground mb-3">T-shirt Sizes</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      {Object.entries(selectedRequest.tshirtSizes || {}).filter(([size]) => size !== '_id').map(([size, quantity]) => (
                                        <div key={size} className="flex justify-between p-2 bg-muted/50 rounded">
                                          <span className="text-muted-foreground capitalize">
                                            {size.replace('size', 'Size ')}:
                                          </span>
                                          <span className="font-medium">{quantity}</span>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="mt-2 p-2 bg-primary/10 rounded text-sm">
                                      <div className="flex justify-between font-medium">
                                        <span>Total T-shirts:</span>
                                        <span>{Object.entries(selectedRequest.tshirtSizes || {}).filter(([size]) => size !== '_id').reduce((total, [, qty]) => total + (parseInt(qty) || 0), 0)}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-3">Books Requested</h4>
                                    <div className="space-y-3">
                                      {(selectedRequest.books || []).map((book, i) => (
                                        <div key={i} className="p-3 border rounded-lg">
                                          <p className="font-medium text-sm">{book.bookName || 'Unknown Book'}</p>
                                          <p className="text-sm text-muted-foreground">{book.partName}</p>
                                          <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-muted-foreground">Copies needed:</span>
                                            <Badge variant="secondary">{book.copies}</Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {selectedRequest.servedListFile && (
                                    <div>
                                      <h4 className="font-semibold text-foreground mb-3">Attendee Names File</h4>
                                      <div className="p-3 border rounded-lg bg-muted/30">
                                        <div className="flex items-center gap-2">
                                          <Download className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm text-muted-foreground">
                                            {selectedRequest.servedListFile.originalName}
                                          </span>
                                        </div>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-2 w-full"
                                          onClick={() => downloadFile(selectedRequest._id, selectedRequest.servedListFile.originalName)}
                                        >
                                          <Download className="h-3 w-3 mr-1" />
                                          Download Names File
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="font-semibold text-foreground mb-3">Request Details</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Submitted:</span>
                                        <span className="font-medium">
                                          {new Date(selectedRequest.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge 
                                          variant={getStatusBadgeVariant(selectedRequest.status)}
                                          className={cn("capitalize", getStatusColor(selectedRequest.status))}
                                        >
                                          {selectedRequest.status}
                                        </Badge>
                                      </div>
                                      {selectedRequest.notes && (
                                        <div>
                                          <span className="text-muted-foreground">Notes:</span>
                                          <p className="font-medium mt-1">{selectedRequest.notes}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log('Processing request:', request._id);
                          updateRequestStatus(request._id, 'processing');
                        }}
                        className="hover:bg-blue-50 hover:text-blue-700"
                        title="Mark as Processing"
                      >
                        <Package className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log('Fulfilling request:', request._id);
                          updateRequestStatus(request._id, 'fulfilled');
                        }}
                        className="hover:bg-green-50 hover:text-green-700"
                        title="Mark as Fulfilled"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log('Cancelling request:', request._id);
                          updateRequestStatus(request._id, 'cancelled');
                        }}
                        className="hover:bg-red-50 hover:text-red-700"
                        title="Mark as Cancelled"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(request)}
                        className="hover:bg-red-50 hover:text-red-700 text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRequests.length === 0 && !loading && (
            <div className="text-center py-12">
              <Shirt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No matching requests found' : 'No Follow-up Requests'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Follow-up requests will appear here when submitted.'}
              </p>
            </div>
          )}

          {requests.length === 0 && !loading && searchTerm === '' && statusFilter === 'all' && (
            <div className="text-center py-12">
              <Shirt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Follow-up Requests</h3>
              <p className="text-sm text-muted-foreground">Follow-up requests will appear here when submitted.</p>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Debug Info:</strong> Check browser console for authentication details.
                  <br />
                  Expected: 5 requests in database. If not showing, check login status.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md bg-white border-0 shadow-2xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              Confirm Deletion
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium mb-2">
                Are you sure you want to delete this follow-up request?
              </p>
              <p className="text-red-700 text-sm">
                This action cannot be undone. All request data will be permanently removed.
              </p>
            </div>
            
            {requestToDelete && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-sm text-gray-600 mb-1">Request Details:</p>
                <p className="font-semibold text-gray-900">{requestToDelete.name}</p>
                <p className="text-sm text-gray-600">{requestToDelete.churchName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Submitted: {new Date(requestToDelete.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setRequestToDelete(null);
                }}
                className="flex-1 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingFollowUpRequestsSection;