import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle, Calendar, Church, Users, Phone } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';
import { useCalendar } from '../../context/CalendarContext';


const TrainingRequestsSection = () => {
  const { toast } = useToast();
  const { scheduleRequest } = useCalendar();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requests, setRequests] = useState([
    {
      id: '1',
      name: 'Pastor John Smith',
      churchName: 'Grace Community Church',
      churchAddress: '123 Main Street, Springfield, IL 62701',
      serviceType: 'Sunday School',
      numberOfServants: 8,
      numberOfServed: 45,
      suggestedDate: '2024-02-15',
      nearbyChurches: [
        {
          name: 'First Baptist Church',
          responsiblePerson: 'Pastor Mike Johnson',
          phoneNumber: '+1-555-0123',
        },
      ],
      status: 'pending',
      submittedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      churchName: 'New Life Fellowship',
      churchAddress: '456 Oak Avenue, Chicago, IL 60601',
      serviceType: 'Youth',
      numberOfServants: 12,
      numberOfServed: 75,
      suggestedDate: '2024-02-20',
      nearbyChurches: [],
      status: 'approved',
      submittedAt: '2024-01-12T14:20:00Z',
    },
    {
      id: '3',
      name: 'David Brown',
      churchName: 'Hope Christian Center',
      churchAddress: '789 Pine Street, Detroit, MI 48201',
      serviceType: 'Other',
      otherServiceType: 'Community Outreach Program',
      numberOfServants: 15,
      numberOfServed: 120,
      suggestedDate: '2024-03-01',
      nearbyChurches: [
        {
          name: 'Trinity Methodist Church',
          responsiblePerson: 'Rev. Mary Davis',
          phoneNumber: '+1-555-0456',
        },
        {
          name: 'St. Paul Lutheran Church',
          responsiblePerson: 'Pastor Tom Wilson',
          phoneNumber: '+1-555-0789',
        },
      ],
      status: 'scheduled',
      submittedAt: '2024-01-10T09:15:00Z',
    },
  ]);

  const updateRequestStatus = (requestId, newStatus) => {
    const request = requests.find(r => r.id === requestId);
    
    setRequests(prev => prev.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
    
    // If status is changed to scheduled, add to calendar
    if (newStatus === 'scheduled' && request) {
      scheduleRequest({
        requestId: request.id,
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
      rejected: 'Training request has been rejected',
      scheduled: 'Training has been scheduled and added to calendar',
      pending: 'Training request status updated',
    };

    toast({
      title: "Status Updated",
      description: statusMessages[newStatus],
    });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'scheduled': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-status-approved/10 text-status-approved border-status-approved/20';
      case 'rejected': return 'bg-status-rejected/10 text-status-rejected border-status-rejected/20';
      case 'scheduled': return 'bg-status-scheduled/10 text-status-scheduled border-status-scheduled/20';
      case 'pending': return 'bg-status-pending/10 text-status-pending border-status-pending/20';
      default: return 'bg-muted/50 text-muted-foreground border-muted';
    }
  };

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
                <p className="text-3xl font-bold text-foreground">{requests.length}</p>
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
                  {requests.filter(r => r.status === 'pending').length}
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
                  {requests.filter(r => r.status === 'approved').length}
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
                  {requests.filter(r => r.status === 'scheduled').length}
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
          <CardTitle className="text-foreground">Recent Training Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Requester</TableHead>
                <TableHead>Church</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Participants</TableHead>
                <TableHead>Suggested Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.churchName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {request.churchAddress}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{request.serviceType}</p>
                      {request.otherServiceType && (
                        <p className="text-sm text-muted-foreground">{request.otherServiceType}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3" />
                        <span>{request.numberOfServants} servants</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>{request.numberOfServed} served</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(request.suggestedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={cn("border", getStatusColor(request.status))}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>Training Request Details</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h4 className="font-semibold mb-3">Contact Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Name:</span> {selectedRequest.name}</p>
                                    <p><span className="font-medium">Church:</span> {selectedRequest.churchName}</p>
                                    <p><span className="font-medium">Address:</span> {selectedRequest.churchAddress}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold mb-3">Service Details</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="font-medium">Type:</span> {selectedRequest.serviceType}</p>
                                    {selectedRequest.otherServiceType && (
                                      <p><span className="font-medium">Specific Type:</span> {selectedRequest.otherServiceType}</p>
                                    )}
                                    <p><span className="font-medium">Servants:</span> {selectedRequest.numberOfServants}</p>
                                    <p><span className="font-medium">Served:</span> {selectedRequest.numberOfServed}</p>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">Suggested Training Date</h4>
                                <p className="text-sm">{new Date(selectedRequest.suggestedDate).toLocaleDateString()}</p>
                              </div>

                              {selectedRequest.nearbyChurches.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-3">Nearby Churches</h4>
                                  <div className="space-y-3">
                                      {selectedRequest.nearbyChurches.map((church, index) => (
                                      <Card key={index} className="border border-border/50">
                                        <CardContent className="p-4">
                                          <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Church:</span> {church.name}</p>
                                            <p><span className="font-medium">Contact:</span> {church.responsiblePerson}</p>
                                            <div className="flex items-center gap-1">
                                              <Phone className="h-3 w-3" />
                                              <span>{church.phoneNumber}</span>
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="flex justify-end space-x-4">
                                {selectedRequest.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                                      className="border-status-rejected/20 text-status-rejected hover:bg-status-rejected/10"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                    <Button
                                      onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
                                      className="bg-status-approved hover:bg-status-approved/90 text-white"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </Button>
                                  </>
                                )}
                                {selectedRequest.status === 'approved' && (
                                  <Button
                                    onClick={() => updateRequestStatus(selectedRequest.id, 'scheduled')}
                                    className="bg-status-scheduled hover:bg-status-scheduled/90 text-white"
                                  >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Training
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'approved')}
                            className="hover:bg-status-approved/10 hover:text-status-approved"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateRequestStatus(request.id, 'rejected')}
                            className="hover:bg-status-rejected/10 hover:text-status-rejected"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {requests.length === 0 && (
            <div className="text-center py-12">
              <Church className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No training requests yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingRequestsSection;