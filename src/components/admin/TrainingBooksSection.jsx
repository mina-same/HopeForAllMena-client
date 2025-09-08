import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Upload, Calendar, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ImageUpload from '../ui/image-upload';

const TrainingBooksSection = () => {
  const { toast } = useToast();
  const [trainingBooks, setTrainingBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    coverImageUrl: '',
    parts: [{ name: '', nameAr: '' }],
    isActive: true
  });

  useEffect(() => {
    fetchTrainingBooks();
  }, []);

  // Filter books based on search term and status filter
  const filteredBooks = trainingBooks.filter(book => {
    const matchesSearch = searchTerm === '' || 
                         book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (book.nameAr && book.nameAr.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && book.isActive === true) ||
                         (statusFilter === 'inactive' && book.isActive === false);
    
    return matchesSearch && matchesStatus;
  });

  const fetchTrainingBooks = async () => {
    try {
      // Get auth token for admin requests to fetch all books (including inactive)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5001/api/training-books', {
        method: 'GET', 
        headers
      });
      if (response.ok) {
        const data = await response.json();
        setTrainingBooks(data);
      } else {
        throw new Error('Failed to fetch training books');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load training books",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBook 
        ? `http://localhost:5001/api/training-books/${editingBook._id}`
        : 'http://localhost:5001/api/training-books';
      
      const method = editingBook ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Training book ${editingBook ? 'updated' : 'created'} successfully`,
        });
        fetchTrainingBooks();
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save training book');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      name: book.name,
      nameAr: book.nameAr,
      description: book.description || '',
      descriptionAr: book.descriptionAr || '',
      coverImageUrl: book.coverImageUrl || '',
      parts: book.parts.length > 0 ? book.parts : [{ name: '', nameAr: '' }],
      isActive: book.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this training book?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/training-books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken')}`
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Training book deleted successfully",
        });
        fetchTrainingBooks();
      } else {
        throw new Error('Failed to delete training book');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      coverImageUrl: '',
      parts: [{ name: '', nameAr: '' }],
      isActive: true
    });
    setEditingBook(null);
    setIsDialogOpen(false);
  };

  const addPart = () => {
    setFormData({
      ...formData,
      parts: [...formData.parts, { name: '', nameAr: '' }]
    });
  };

  const removePart = (index) => {
    if (formData.parts.length > 1) {
      setFormData({
        ...formData,
        parts: formData.parts.filter((_, i) => i !== index)
      });
    }
  };

  const updatePart = (index, field, value) => {
    const updatedParts = formData.parts.map((part, i) => 
      i === index ? { ...part, [field]: value } : part
    );
    setFormData({ ...formData, parts: updatedParts });
  };

  const handleImageUpload = (imageData) => {
    if (imageData) {
      setFormData(prev => ({
        ...prev,
        coverImageUrl: imageData.url
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        coverImageUrl: ''
      }));
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading training books...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Training Books</h2>
          <p className="text-muted-foreground">Manage your training materials and resources</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Books</p>
                <p className="text-3xl font-bold text-foreground">{trainingBooks.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Books</p>
                <p className="text-3xl font-bold text-green-600">
                  {trainingBooks.filter(book => book.isActive).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-blue-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Updated This Month</p>
                <p className="text-3xl font-bold text-blue-600">
                  {trainingBooks.filter(book => 
                    new Date(book.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search, Filter, and Add Button Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-[30px] w-full"
            />
          </div>
          
          {/* Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Add Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-[#2194D1] hover:bg-[#2194D1]/90 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Training Book
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Training Book' : 'Add New Training Book'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Book Name (English) *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter training book name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nameAr">Book Name (Arabic) *</Label>
                    <Input
                      id="nameAr"
                      value={formData.nameAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, nameAr: e.target.value }))}
                      placeholder="أدخل اسم الكتاب"
                      required
                      dir="rtl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="description">Description (English)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter book description"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionAr">Description (Arabic)</Label>
                    <Textarea
                      id="descriptionAr"
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                      placeholder="أدخل وصف الكتاب"
                      rows={3}
                      dir="rtl"
                    />
                  </div>
                </div>

                <ImageUpload
                  onImageUpload={handleImageUpload}
                  currentImage={formData.coverImageUrl}
                  uploadType="training-book-cover"
                  label="Training Book Cover Image"
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Book Parts</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPart}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Part
                    </Button>
                  </div>
                  {formData.parts.map((part, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2 p-3 border rounded">
                      <Input
                        placeholder="Part name (English)"
                        value={part.name}
                        onChange={(e) => updatePart(index, 'name', e.target.value)}
                        required
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Part name (Arabic)"
                          value={part.nameAr}
                          onChange={(e) => updatePart(index, 'nameAr', e.target.value)}
                          required
                          dir="rtl"
                        />
                        {formData.parts.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePart(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>


                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    Active (Book will be available for training requests)
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingBook ? 'Update Book' : 'Create Book'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Training Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Card key={book._id} className="border-0 shadow-modern bg-card hover:shadow-glow transition-all duration-300">
            <CardContent className="p-0">
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                <img
                  src={book.coverImageUrl || '/api/placeholder/300/400'}
                  alt={book.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                      {book.name}
                    </h3>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(book)}
                      className="hover:bg-primary/10 hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(book._id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {book.description}
                </p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {book.parts.map((part, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {part.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge 
                    variant={book.isActive ? "default" : "secondary"} 
                    className={book.isActive ? "bg-green-400 text-green-700 border-green-200" : "bg-gray-400 text-gray-600 border-gray-200"}
                  >
                    <BookOpen className="h-3 w-3 mr-1" />
                    {book.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Updated {new Date(book.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && trainingBooks.length > 0 && (
        <Card className="border-0 shadow-modern">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No books match your current filters.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search term or filter settings.
            </p>
          </CardContent>
        </Card>
      )}

      {trainingBooks.length === 0 && (
        <Card className="border-0 shadow-modern">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No training books added yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first training book to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { TrainingBooksSection };
export default TrainingBooksSection;