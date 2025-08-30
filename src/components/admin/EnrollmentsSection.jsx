import React, { useState } from 'react';
import { Users, Calendar, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useCourses } from '../../context/CourseContext';
import { useToast } from '../../hooks/use-toast';

export const EnrollmentsSection = () => {
  const { enrollments, courses, updateEnrollmentStatus, deleteEnrollment } = useCourses();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEnrollments = enrollments.filter(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const matchesSearch = enrollment.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course?.title.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (enrollmentId, newStatus) => {
    updateEnrollmentStatus(enrollmentId, newStatus);
    toast({
      title: "Status Updated",
      description: `Enrollment status changed to ${newStatus}`,
    });
  };

  const handleDelete = (enrollmentId) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      deleteEnrollment(enrollmentId);
      toast({
        title: "Enrollment Deleted",
        description: "The enrollment has been removed.",
      });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Enrollment Management</h2>
          <p className="text-sm md:text-base text-muted-foreground">Manage course enrollments and applications</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Enrollments</p>
                <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-theme-base to-theme-primary bg-clip-text text-transparent">
                  {enrollments.length}
                </p>
              </div>
              <Users className="h-6 w-6 md:h-8 md:w-8 text-theme-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-xl md:text-2xl font-bold text-orange-500">
                  {enrollments.filter(e => e.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8 text-orange-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-xl md:text-2xl font-bold text-green-500">
                  {enrollments.filter(e => e.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-green-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-theme-light/20">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-xl md:text-2xl font-bold text-red-500">
                  {enrollments.filter(e => e.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500 opacity-70" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search enrollments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-44 md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enrollments List/Table */}
      <Card className="border-0 shadow-modern">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl">Enrollments ({filteredEnrollments.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {filteredEnrollments.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <Users className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm md:text-base text-muted-foreground">No enrollments found.</p>
            </div>
          ) : (
            <div>
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredEnrollments.map(enrollment => {
                  const course = courses.find(c => c.id === enrollment.courseId);
                  return (
                    <Card key={enrollment.id} className="border border-border/50">
                      <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{enrollment.studentName}</h4>
                                <p className="text-xs text-muted-foreground">{enrollment.studentEmail}</p>
                                <p className="text-xs text-muted-foreground mt-1">{course?.title}</p>
                              </div>
                            <Badge variant={enrollment.status === 'approved' ? 'default' : enrollment.status === 'pending' ? 'secondary' : 'destructive'} className="text-xs">
                              {enrollment.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              {enrollment.enrollmentDate}
                            </span>
                            <div className="flex gap-1">
                              <Select value={enrollment.status} onValueChange={value => handleStatusChange(enrollment.id, value)}>
                                <SelectTrigger className="h-7 w-20 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 w-7 p-0"
                                onClick={() => handleDelete(enrollment.id)}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Enrollment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEnrollments.map(enrollment => {
                      const course = courses.find(c => c.id === enrollment.courseId);
                      return (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{enrollment.studentName}</p>
                              <p className="text-sm text-muted-foreground">{enrollment.studentEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{course?.title}</p>
                              <p className="text-sm text-muted-foreground">{course?.instructor}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              {enrollment.enrollmentDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={enrollment.status === 'approved' ? 'default' : enrollment.status === 'pending' ? 'secondary' : 'destructive'}>
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Select value={enrollment.status} onValueChange={(value) => handleStatusChange(enrollment.id, value)}>
                                <SelectTrigger className="w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDelete(enrollment.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};