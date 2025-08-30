import React, { useState } from 'react';
import { Plus, Edit, Trash2, FolderOpen, Book, Tag } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useBookstore } from '../../context/BookstoreContext';
import { useToast } from '../../hooks/use-toast';

const categoryIcons = [
  'FolderOpen', 'Book', 'Tag', 'Code', 'Database', 'Shield', 'Cloud', 'Brain'
];

const categoryColors = [
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-pink-100 text-pink-800 border-pink-200'
];

export function CategoriesSection() {
  const { books } = useBookstore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '',
    icon: ''
  });

  // Extract categories from books
  const categories = React.useMemo(() => {
    const categoryMap = new Map();
    
    books.forEach(book => {
      if (book.category && !categoryMap.has(book.category)) {
        const categoryBooks = books.filter(b => b.category === book.category);
        const colorIndex = Array.from(categoryMap.keys()).length % categoryColors.length;
        
        categoryMap.set(book.category, {
          id: book.category.toLowerCase().replace(/\s+/g, '-'),
          name: book.category,
          description: `Category containing ${categoryBooks.length} book${categoryBooks.length !== 1 ? 's' : ''} in ${book.category.toLowerCase()}.`,
          color: categoryColors[colorIndex],
          booksCount: categoryBooks.length,
          icon: categoryIcons[colorIndex % categoryIcons.length]
        });
      }
    });
    
    return Array.from(categoryMap.values());
  }, [books]);

  const resetForm = () => {
    setCategoryForm({
      name: '',
      description: '',
      color: '',
      icon: ''
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Category name is required.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: editingCategory ? "Category Updated" : "Category Added",
      description: `${categoryForm.name} has been ${editingCategory ? 'updated' : 'added'} successfully.`,
    });

    resetForm();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      toast({
        title: "Category Deleted",
        description: `${category.name} has been removed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Categories Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Organize your books by categories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-theme-base to-theme-primary text-white shadow-elegant hover:shadow-lg transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Category name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Category description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="color">Color Theme</Label>
                <Select 
                  value={categoryForm.color} 
                  onValueChange={(value) => setCategoryForm(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryColors.map((color, index) => (
                      <SelectItem key={color} value={color}>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded ${color}`} />
                          Color {index + 1}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="icon">Icon</Label>
                <Select 
                  value={categoryForm.icon} 
                  onValueChange={(value) => setCategoryForm(prev => ({ ...prev, icon: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryIcons.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        {icon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="border-0 shadow-modern bg-gradient-to-br from-card to-muted/30 hover:shadow-elegant transition-all duration-300 group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-theme-base/20 to-theme-primary/20">
                    <FolderOpen className="h-5 w-5 text-theme-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{category.name}</CardTitle>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8 p-0 hover:bg-theme-light hover:border-theme-primary hover:text-theme-primary"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:border-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <Badge className={`${category.color} border font-medium`}>
                  <Book className="h-3 w-3 mr-1" />
                  {category.booksCount} book{category.booksCount !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {category.icon}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="border-0 shadow-modern">
          <CardContent className="text-center py-12">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No categories found. Add your first category to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}