import React, { useState } from 'react';
import { Eye, CheckCircle, Shirt, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

// interface FollowUpRequest {
//   id: string;
//   trainerName: string;
//   name: string;
//   churchName: string;
//   phoneNumber: string;
//   numberOfServed: number;
//   books: Array<{ bookName: string; partName: string; copies: number }>;
//   tshirtSizes: Record<string, number>;
//   status: 'pending' | 'processed' | 'shipped';
//   submittedAt: string;
// }

const TrainingFollowUpRequestsSection = () => {
  const [requests] = useState([
    {
      id: '1',
      trainerName: 'Rev. Michael Johnson',
      name: 'Pastor Sarah Davis',
      churchName: 'Hope Community Church',
      phoneNumber: '+1-555-0123',
      numberOfServed: 35,
      books: [
        { bookName: 'Evangelistic Training Manual', partName: 'Part 2: Application', copies: 40 },
        { bookName: 'Youth Ministry Excellence', partName: 'Complete Book', copies: 15 },
      ],
      tshirtSizes: { sizeL: 10, sizeXL: 8, sizeXXL: 5 },
      status: 'pending',
      submittedAt: '2024-01-18T09:30:00Z',
    },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Training Follow-up Requests</h2>
        <p className="text-muted-foreground">Manage follow-up training material requests</p>
      </div>

      <Card className="border-0 shadow-modern">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trainer</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Church</TableHead>
                <TableHead>Books</TableHead>
                <TableHead>T-shirts</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.trainerName}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-muted-foreground">{request.phoneNumber}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.churchName}</TableCell>
                  <TableCell>{request.books.length} books</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Shirt className="h-4 w-4" />
                      {Object.values(request.tshirtSizes).reduce((a, b) => a + b, 0)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={request.status === 'pending' ? 'outline' : 'default'}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Follow-up Request Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Trainer:</span>
                                    <span className="font-medium">{request.trainerName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Requester:</span>
                                    <span className="font-medium">{request.name}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Church:</span>
                                    <span className="font-medium">{request.churchName}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Phone:</span>
                                    <span className="font-medium">{request.phoneNumber}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">People Served:</span>
                                    <span className="font-medium">{request.numberOfServed}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-foreground mb-3">T-shirt Sizes</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {Object.entries(request.tshirtSizes).map(([size, quantity]) => (
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
                                    <span>{Object.values(request.tshirtSizes).reduce((a, b) => a + b, 0)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Books Requested</h4>
                                <div className="space-y-3">
                                  {request.books.map((book, i) => (
                                    <div key={i} className="p-3 border rounded-lg">
                                      <p className="font-medium text-sm">{book.bookName}</p>
                                      <p className="text-sm text-muted-foreground">{book.partName}</p>
                                      <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-muted-foreground">Copies needed:</span>
                                        <Badge variant="secondary">{book.copies}</Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Attendee Names File</h4>
                                <div className="p-3 border rounded-lg bg-muted/30">
                                  <div className="flex items-center gap-2">
                                    <Download className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                      attendee-names-{request.id}.pdf
                                    </span>
                                  </div>
                                  <Button variant="outline" size="sm" className="mt-2 w-full">
                                    <Download className="h-3 w-3 mr-1" />
                                    Download Names File
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold text-foreground mb-3">Request Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Submitted:</span>
                                    <span className="font-medium">
                                      {new Date(request.submittedAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant={request.status === 'pending' ? 'outline' : 'default'}>
                                      {request.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingFollowUpRequestsSection;