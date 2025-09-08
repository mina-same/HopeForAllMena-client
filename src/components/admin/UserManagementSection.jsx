import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Search, Edit, Trash2, Shield, ShieldCheck, Eye, EyeOff, RefreshCw, AlertCircle } from 'lucide-react';
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
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../layout';
import { formatValidationError, getFieldError, getFieldSuggestion, hasFieldError, VALIDATION_MESSAGES } from '../../lib/validation';
import ConfirmationModal from '../ui/ConfirmationModal';

const availablePermissions = [
  { id: 'books', label: 'Books & Publishing', description: 'Manage books, authors, categories, and reviews' },
  { id: 'courses', label: 'Course Management', description: 'Manage courses and enrollments' },
  { id: 'magazines', label: 'Magazine Management', description: 'Manage magazine content and distribution' },
  { id: 'training', label: 'Training Management', description: 'Manage training programs and requests' },
  { id: 'users', label: 'User Management', description: 'Manage user accounts and permissions' },
  { id: 'analytics', label: 'Analytics & Reports', description: 'View analytics and generate reports' },
  { id: 'settings', label: 'System Settings', description: 'Configure system-wide settings' },
  { id: 'authors', label: 'Authors Management', description: 'Manage author profiles and content' },
  { id: 'categories', label: 'Categories Management', description: 'Manage content categories' },
  { id: 'reviews', label: 'Reviews Management', description: 'Manage user reviews and ratings' },
  { id: 'enrollments', label: 'Enrollments Management', description: 'Manage course enrollments' },
  { id: 'contact-messages', label: 'Contact Messages', description: 'Handle contact form messages' },
  { id: 'training-books', label: 'Training Books', description: 'Manage training book content' },
  { id: 'training-requests', label: 'Training Requests', description: 'Handle training requests' },
  { id: 'training-followup-requests', label: 'Training Follow-up', description: 'Manage training follow-up requests' },
  { id: 'calendar', label: 'Calendar Management', description: 'Manage calendar events and scheduling' },
  { id: 'user-management', label: 'Advanced User Management', description: 'Advanced user management features' }
];

// Separate FormDialog component to prevent re-renders
const FormDialog = React.memo(({ 
  isEdit, 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting,
  error 
}) => {
  const [formData, setFormData] = useState(initialData);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
    setFieldErrors({}); // Clear errors when form resets
  }, [initialData]);

  // Parse error message to extract field-specific errors
  useEffect(() => {
    if (error) {
      const errors = {};
      
      // Try to parse structured error response
      let errorData = error;
      if (typeof error === 'string') {
        // If it's a string, try to parse it as JSON
        try {
          errorData = JSON.parse(error);
        } catch {
          // If not JSON, treat as simple error message
          errorData = { message: error };
        }
      }
      
      // Handle structured error response from API
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach(err => {
          if (err.field && err.message) {
            errors[err.field] = err.message;
          }
        });
      }
      
      // Handle simple error message
      if (errorData.message && Object.keys(errors).length === 0) {
        errors.general = errorData.message;
      }
      
      // If no structured errors found, try to extract field-specific errors from message
      if (Object.keys(errors).length === 0 && errorData.message) {
        const message = errorData.message.toLowerCase();
        
        if (message.includes('email')) {
          errors.email = VALIDATION_MESSAGES.email.taken || 'Email address is already taken';
        }
        if (message.includes('username')) {
          errors.username = VALIDATION_MESSAGES.username.taken || 'Username is already taken';
        }
        if (message.includes('name')) {
          errors.name = VALIDATION_MESSAGES.name.required;
        }
        if (message.includes('password')) {
          errors.password = VALIDATION_MESSAGES.password.required;
        }
        if (message.includes('role')) {
          errors.role = VALIDATION_MESSAGES.role.required;
        }
        if (message.includes('permission')) {
          errors.permissions = VALIDATION_MESSAGES.permissions.required;
        }
        
        // If no specific field errors found, show general error
        if (Object.keys(errors).length === 0) {
          errors.general = errorData.message;
        }
      }
      
      setFieldErrors(errors);
    } else {
      setFieldErrors({});
    }
  }, [error]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePermissionChange = (permissionId, checked) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          permissions: [...prev.permissions, permissionId]
        };
      } else {
        return {
          ...prev,
          permissions: prev.permissions.filter(p => p !== permissionId)
        };
      }
    });
    // Clear permissions error when user makes changes
    if (fieldErrors.permissions) {
      setFieldErrors(prev => ({ ...prev, permissions: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = VALIDATION_MESSAGES.name.required;
    } else if (formData.name.length < 2) {
      errors.name = VALIDATION_MESSAGES.name.minLength;
    } else if (formData.name.length > 100) {
      errors.name = VALIDATION_MESSAGES.name.maxLength;
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
      errors.name = VALIDATION_MESSAGES.name.pattern;
    }
    
    if (!formData.email?.trim()) {
      errors.email = VALIDATION_MESSAGES.email.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = VALIDATION_MESSAGES.email.invalid;
    } else if (formData.email.length > 255) {
      errors.email = VALIDATION_MESSAGES.email.maxLength;
    }
    
    if (!formData.username?.trim()) {
      errors.username = VALIDATION_MESSAGES.username.required;
    } else if (formData.username.length < 3) {
      errors.username = VALIDATION_MESSAGES.username.minLength;
    } else if (formData.username.length > 30) {
      errors.username = VALIDATION_MESSAGES.username.maxLength;
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      errors.username = VALIDATION_MESSAGES.username.pattern;
    }
    
    if (!isEdit && !formData.password?.trim()) {
      errors.password = VALIDATION_MESSAGES.password.required;
    } else if (formData.password && formData.password.length < 6) {
      errors.password = VALIDATION_MESSAGES.password.minLength;
    } else if (formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = VALIDATION_MESSAGES.password.pattern;
    }
    
    if (!formData.role?.trim()) {
      errors.role = VALIDATION_MESSAGES.role.required;
    } else if (formData.role.length > 50) {
      errors.role = VALIDATION_MESSAGES.role.maxLength;
    }
    
    if (!formData.permissions || formData.permissions.length === 0) {
      errors.permissions = VALIDATION_MESSAGES.permissions.required;
    }
    
    return errors;
  };

  const handleSubmit = () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white" onOpenAutoFocus={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-sidebar-text">
          {isEdit ? 'Edit User' : 'Create New User'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* General Error Message */}
        {fieldErrors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800">{fieldErrors.general}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
              className={`border-border focus:border-theme-base focus:ring-1 focus:ring-theme-base ${
                fieldErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              autoComplete="off"
            />
            {fieldErrors.name && (
              <div className="mt-1">
                <p className="text-sm text-red-600">{fieldErrors.name}</p>
                {fieldErrors.name.includes('taken') && (
                  <p className="text-xs text-gray-600 mt-1">💡 Try using a different name or adding numbers</p>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`border-border focus:border-theme-base focus:ring-1 focus:ring-theme-base ${
                fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              autoComplete="off"
            />
            {fieldErrors.email && (
              <div className="mt-1">
                <p className="text-sm text-red-600">{fieldErrors.email}</p>
                {fieldErrors.email.includes('taken') && (
                  <p className="text-xs text-gray-600 mt-1">💡 Try using a different email address</p>
                )}
                {fieldErrors.email.includes('valid') && (
                  <p className="text-xs text-gray-600 mt-1">💡 Example: user@example.com</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Enter username"
              className={`border-border focus:border-theme-base focus:ring-1 focus:ring-theme-base ${
                fieldErrors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              autoComplete="off"
            />
            {fieldErrors.username && (
              <div className="mt-1">
                <p className="text-sm text-red-600">{fieldErrors.username}</p>
                {fieldErrors.username.includes('taken') && (
                  <p className="text-xs text-gray-600 mt-1">💡 Try adding numbers or changing the username</p>
                )}
                {fieldErrors.username.includes('pattern') && (
                  <p className="text-xs text-gray-600 mt-1">💡 Use only letters, numbers, dots, underscores, and hyphens</p>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{isEdit ? 'Password' : 'Password *'}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={isEdit ? "Leave blank to keep current" : "Enter password"}
                className={`border-border focus:border-theme-base focus:ring-1 focus:ring-theme-base pr-10 ${
                  fieldErrors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                }`}
                autoComplete="new-password"
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
            {fieldErrors.password && (
              <div className="mt-1">
                <p className="text-sm text-red-600">{fieldErrors.password}</p>
                {fieldErrors.password.includes('pattern') && (
                  <p className="text-xs text-gray-600 mt-1">💡 Include at least one lowercase letter, one uppercase letter, and one number</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            placeholder="e.g., Editor, Manager, Administrator"
            className={`border-border focus:border-theme-base focus:ring-1 focus:ring-theme-base ${
              fieldErrors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            autoComplete="off"
          />
          {fieldErrors.role && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.role}</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-theme-base" />
            <Label className="text-black font-semibold">Permissions *</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {availablePermissions.map((permission) => (
              <div 
                key={permission.id} 
                className={`relative p-4 border rounded-xl transition-all duration-200 cursor-pointer group hover:shadow-md ${
                  formData.permissions.includes(permission.id)
                    ? 'border-theme-base bg-theme-light shadow-sm'
                    : 'border-border hover:border-theme-base/50 bg-card'
                }`}
                onClick={() => handlePermissionChange(permission.id, !formData.permissions.includes(permission.id))}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={permission.id}
                    checked={formData.permissions.includes(permission.id)}
                    onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                    className="mt-0.5 border-2 data-[state=checked]:bg-theme-base data-[state=checked]:border-theme-base"
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
                    <div className="w-2 h-2 bg-theme-base rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {fieldErrors.permissions && (
            <p className="text-sm text-red-600 mt-1">{fieldErrors.permissions}</p>
          )}
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <ShieldCheck className="h-3 w-3 inline mr-1" />
            Select the appropriate permissions for this user's role and responsibilities.
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Switch
            id="status"
            checked={formData.status === 'active'}
            onCheckedChange={(checked) => handleInputChange('status', checked ? 'active' : 'inactive')}
          />
          <Label htmlFor="status">Active User</Label>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-button text-white hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEdit ? 'Update User' : 'Create User'
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
});

FormDialog.displayName = 'FormDialog';

export function UserManagementSection() {
  const { user: currentUser } = useAuth();
  
  // State for users data
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });
  
  // State for UI
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Memoize the fetchUsers function to prevent unnecessary re-renders
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search: searchTerm,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      
      const response = await usersAPI.getUsers(params);
      
      if (response.status === 'success') {
        setUsers(response.data.users);
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.pagination.totalPages,
          totalUsers: response.data.pagination.totalUsers
        }));
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, searchTerm]);

  // Load users on component mount and when search/pagination changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Memoize filtered users to prevent unnecessary re-renders
  const filteredUsers = useMemo(() => users, [users]);

  const handleCreateUser = async (formData) => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await usersAPI.createUser(formData);
      
      if (response.status === 'success') {
        await fetchUsers(); // Refresh the list
        setShowCreateDialog(false);
      }
    } catch (err) {
      console.error('Failed to create user:', err);
      setError(err.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
  }, []);

  const handleUpdateUser = async (formData) => {
    if (!editingUser) return;
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const updateData = { ...formData };
      if (!updateData.password) {
        delete updateData.password; // Don't send empty password
      }
      
      const response = await usersAPI.updateUser(editingUser._id, updateData);
      
      if (response.status === 'success') {
        await fetchUsers(); // Refresh the list
        setEditingUser(null);
      }
    } catch (err) {
      console.error('Failed to update user:', err);
      setError(err.response?.data?.message || 'Failed to update user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u._id === userId);
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      setError('');
      const response = await usersAPI.deleteUser(userToDelete._id);
      
      if (response.status === 'success') {
        await fetchUsers(); // Refresh the list
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete user:', err);
      setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setError('');
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const response = await usersAPI.updateUserStatus(userId, newStatus);
      
      if (response.status === 'success') {
        await fetchUsers(); // Refresh the list
      }
    } catch (err) {
      console.error('Failed to update user status:', err);
      setError(err.response?.data?.message || 'Failed to update user status. Please try again.');
    }
  };

  const getPermissionLabel = useCallback((permissionId) => {
    const permission = availablePermissions.find(p => p.id === permissionId);
    return permission ? permission.label : permissionId;
  }, []);

  // Create initial form data for create dialog
  const createFormData = useMemo(() => ({
    name: '',
    email: '',
    username: '',
    password: '',
    role: '',
    permissions: [],
    status: 'active'
  }), []);

  // Create form data for edit dialog
  const editFormData = useMemo(() => {
    if (!editingUser) return createFormData;
    return {
      name: editingUser.name,
      email: editingUser.email,
      username: editingUser.username,
      password: '',
      role: editingUser.role,
      permissions: editingUser.permissions,
      status: editingUser.status
    };
  }, [editingUser, createFormData]);

  // Handle search with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-theme-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError('')}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#2194D1]">
            User Management
          </h2>
          <p className="text-muted-foreground mt-1">Manage user accounts and permissions ({pagination.totalUsers} total)</p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) {
            setEditingUser(null); // Reset editing user when closing create dialog
          }
        }}>
          <DialogTrigger asChild>
            <Button variant="default" className="text-white hover:opacity-90 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <FormDialog 
            isEdit={false} 
            initialData={createFormData} 
            onSubmit={handleCreateUser} 
            onCancel={() => setShowCreateDialog(false)} 
            isSubmitting={isSubmitting}
            error={error}
          />
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-modern">
        <CardContent className="p-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-[30px] border-sidebar-border focus:border-theme-primary"
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 rounded-xl">
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
                  <TableRow key={user.id} className="hover:bg-gray-200">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
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
                          onCheckedChange={() => toggleUserStatus(user._id, user.status)}
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
                        <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => {
                          if (!open) {
                            setEditingUser(null);
                          }
                        }}>
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
                          <FormDialog 
                            isEdit={true} 
                            initialData={editFormData} 
                            onSubmit={handleUpdateUser} 
                            onCancel={() => setEditingUser(null)} 
                            isSubmitting={isSubmitting}
                            error={error}
                          />
                        </Dialog>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user._id === currentUser?._id}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={user._id === currentUser?._id ? "Cannot delete your own account" : "Delete user"}
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

    {/* Delete Confirmation Modal */}
    <ConfirmationModal
      isOpen={showDeleteModal}
      onClose={() => {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }}
      onConfirm={confirmDeleteUser}
      title="Delete User"
      description={`Are you sure you want to delete "${userToDelete?.name || userToDelete?.username || 'this user'}"? This action cannot be undone and will permanently remove the user account.`}
      confirmText="Delete User"
      cancelText="Cancel"
      variant="danger"
      isLoading={isDeleting}
      icon={
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 border-red-200 border-2">
          <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
      }
    />
    </Layout>
  );
}