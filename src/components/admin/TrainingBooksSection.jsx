import React, { useState } from 'react';
import { Plus, Edit2, Trash2, BookOpen, Upload } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

// interface TrainingBook {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   createdAt: string;
//   updatedAt: string;
// }

const TrainingBooksSection= () => {
  const { toast } = useToast();
  const [trainingBooks, setTrainingBooks] = useState([
    {
      id: '1',
      name: 'Evangelistic Training Manual',
      description: 'Comprehensive guide for evangelistic outreach and community engagement. This manual provides practical tools and strategies for effective gospel sharing in modern contexts.',
      image: '/api/placeholder/300/400',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Discipleship Foundations',
      description: 'Essential principles for building strong discipleship programs. Learn how to mentor new believers and establish lasting spiritual growth patterns in your congregation.',
      image: '/api/placeholder/300/400',
      createdAt: '2024-01-20',
      updatedAt: '2024-01-20',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingBook) {
      // Update existing book
      setTrainingBooks(prev => prev.map(book => 
        book.id === editingBook.id 
          ? { ...book, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : book
      ));
      toast({
        title: "Training Book Updated",
        description: "The training book has been successfully updated.",
      });
    } else {
      // Add new book
      const newBook = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setTrainingBooks(prev => [...prev, newBook]);
      toast({
        title: "Training Book Added",
        description: "New training book has been successfully added.",
      });
    }

    resetForm();
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      name: book.name,
      description: book.description,
      image: book.image,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (bookId) => {
    if (window.confirm('Are you sure you want to delete this training book?')) {
      setTrainingBooks(prev => prev.filter(book => book.id !== bookId));
      toast({
        title: "Training Book Deleted",
        description: "The training book has been successfully deleted.",
      });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image: '' });
    setEditingBook(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Training Books</h2>
          <p className="text-muted-foreground">Manage your training materials and resources</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Training Book
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Training Book' : 'Add New Training Book'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Book Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter training book name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter book description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Book Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Enter image URL or upload image"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    You can use a URL or upload an image file
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <Label>Upload Image File</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop an image here, or click to select
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-2"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // In a real app, you'd upload this to a server
                          const url = URL.createObjectURL(file);
                          setFormData(prev => ({ ...prev, image: url }));
                        }
                      }}
                    />
                  </div>
                </div>

                {formData.image && (
                  <div>
                    <Label>Preview</Label>
                    <div className="mt-2 max-w-xs">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingBook ? 'Update Book' : 'Add Book'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Training Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainingBooks.map((book) => (
          <Card key={book.id} className="border-0 shadow-modern bg-card hover:shadow-glow transition-all duration-300">
            <CardContent className="p-0">
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-lg">
                <img
                  src={book.image}
                  alt={book.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-foreground line-clamp-2">
                    {book.name}
                  </h3>
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
                      onClick={() => handleDelete(book.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {book.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Training Material
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Updated {book.updatedAt}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

      {/* Statistics */}
      <Card className="border-0 shadow-modern bg-muted/30">
        <CardHeader>
          <CardTitle className="text-foreground">Training Books Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {trainingBooks.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Books</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {trainingBooks.filter(book => 
                  new Date(book.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Updated This Month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {trainingBooks.filter(book => book.image).length}
              </div>
              <div className="text-sm text-muted-foreground">With Images</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export { TrainingBooksSection };
export default TrainingBooksSection;