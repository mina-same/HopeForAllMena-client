import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';


const mockUsers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@publishing.com',
    username: 'sarah.j',
    role: 'Editor',
    status: 'active',
    permissions: ['books', 'authors', 'categories'],
    lastLogin: '2024-01-15',
    createdAt: '2023-12-01'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@publishing.com',
    username: 'michael.c',
    role: 'Course Manager',
    status: 'active',
    permissions: ['courses', 'enrollments'],
    lastLogin: '2024-01-14',
    createdAt: '2023-11-15'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@publishing.com',
    username: 'emily.r',
    role: 'Content Manager',
    status: 'inactive',
    permissions: ['magazines', 'training-books'],
    lastLogin: '2024-01-10',
    createdAt: '2023-10-20'
  }
];

const availablePermissions = [
  { id: 'books', label: 'Books & Publishing', description: 'Manage books, authors, categories, and reviews' },
  { id: 'courses', label: 'Course Management', description: 'Manage courses and enrollments' },
  { id: 'magazines', label: 'Magazine Management', description: 'Manage magazine content and distribution' },
  { id: 'training', label: 'Training Management', description: 'Manage training programs and requests' },
  { id: 'users', label: 'User Management', description: 'Manage user accounts and permissions' },
  { id: 'analytics', label: 'Analytics & Reports', description: 'View analytics and generate reports' },
  { id: 'settings', label: 'System Settings', description: 'Configure system-wide settings' }
];

export function UserManagementSection() {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    permissions: [], // string[]
    status: 'active'
  });

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      username: formData.username,
      role: formData.role,
      status: formData.status,
      permissions: formData.permissions,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    resetForm();
    setShowCreateDialog(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username,
      password: '',
      role: user.role,
      permissions: user.permissions,
      status: user.status
    });
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? {
            ...user,
            name: formData.name,
            email: formData.email,
            username: formData.username,
            role: formData.role,
            permissions: formData.permissions,
            status: formData.status
          }
        : user
    );
    setUsers(updatedUsers);
    resetForm();
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    );
    setUsers(updatedUsers);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      password: '',
      role: '',
      permissions: [],
      status: 'active'
    });
  };

  const handlePermissionChange = (permissionId, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }));
    }
  };

  const getPermissionLabel = (permissionId) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.label : permissionId;
  };

  const UserDialog = ({ isEdit = false }) => (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-theme-primary to-theme-base bg-clip-text text-transparent">
          {isEdit ? 'Edit User' : 'Create New User'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter full name"
              className="border-sidebar-border focus:border-theme-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter email address"
              className="border-sidebar-border focus:border-theme-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Enter username"
              className="border-sidebar-border focus:border-theme-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
                className="border-sidebar-border focus:border-theme-primary pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g., Editor, Manager, Administrator"
            className="border-sidebar-border focus:border-theme-primary"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-theme-primary" />
            <Label className="text-black font-semibold">Permissions</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {availablePermissions.map((permission) => (
              <div 
                key={permission.id} 
                className={`relative p-4 border rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md ${
                  formData.permissions.includes(permission.id)
                    ? 'border-theme-primary bg-gradient-to-br from-theme-primary/5 to-theme-base/5 shadow-sm'
                    : 'border-border hover:border-theme-primary/50 bg-card'
                }`}
                onClick={() => handlePermissionChange(permission.id, !formData.permissions.includes(permission.id))}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                    className="mt-0.5 border-2 data-[state=checked]:bg-theme-primary data-[state=checked]:border-theme-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={permission.id}
                      className="text-sm font-semibold cursor-pointer block mb-1"
                    >
                      {permission.label}
                    </Label>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {permission.description}
                    </p>
                  </div>
                </div>
                {formData.permissions.includes(permission.id) && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-theme-primary rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <ShieldCheck className="h-3 w-3 inline mr-1" />
            Select the appropriate permissions for this user's role and responsibilities.
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            id="status"
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => setFormData(prev => ({ 
              ...prev, 
              status: checked ? 'active' : 'inactive' 
            }))}
          />
          <Label htmlFor="status">Active User</Label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              if (isEdit) setEditingUser(null);
              else setShowCreateDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={isEdit ? handleUpdateUser : handleCreateUser}
            className="bg-gradient-to-r from-theme-base to-theme-primary text-white hover:opacity-90"
          >
            {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-theme-primary to-theme-base bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-theme-base to-theme-primary text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <UserDialog />
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-muted/30">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-sidebar-border focus:border-theme-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-muted/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-theme-primary" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-theme-base to-theme-primary text-white text-sm">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-theme-light text-theme-primary">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {user.permissions.slice(0, 2).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {getPermissionLabel(permission)}
                          </Badge>
                        ))}
                        {user.permissions.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.permissions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.status === 'active'}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                        />
                        <Badge 
                          variant={user.status === 'active' ? 'default' : 'secondary'}
                          className={user.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }
                        >
                          {user.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <UserDialog isEdit />
                        </Dialog>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}