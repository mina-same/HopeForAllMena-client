import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Calendar, Eye } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import FileInput from '../ui/file-input';
import { useBookstore } from '../../context/BookstoreContext';
import { useToast } from '../../hooks/use-toast';

export function BooksSection() {
  const {
    books,
    addBook,
    updateBook,
    deleteBook
  } = useBookstore();
  const { toast } = useToast();

  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    description: '',
    shortDescription: '',
    category: '',
    coverImageUrl: ''
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);

  const handleCoverImageChange = (file) => {
    setCoverImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };

  const handleAddBook = () => {
    if (!bookForm.title.trim() || !bookForm.author.trim() || !bookForm.description.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Title, author, and description are required.",
        variant: "destructive"
      });
      return;
    }

    const coverUrl = imagePreview || bookForm.coverImageUrl || '/api/placeholder/300/400';

    const bookData = {
      ...bookForm,
      shortDescription: bookForm.shortDescription || bookForm.description.substring(0, 150) + '...',
      coverImageUrl: coverUrl,
      reviews: []
    };

    addBook(bookData);
    resetForm();

    toast({
      title: "Book Added",
      description: `"${bookData.title}" has been added to the catalog.`,
    });
  };

  const resetForm = () => {
    setBookForm({
      title: '',
      author: '',
      description: '',
      shortDescription: '',
      category: '',
      coverImageUrl: ''
    });
    setCoverImageFile(null);
    setImagePreview('');
    setIsBookDialogOpen(false);
  };

  const handleEditBook = () => {
    if (!editingBook || !bookForm.title.trim() || !bookForm.author.trim() || !bookForm.description.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Title, author, and description are required.",
        variant: "destructive"
      });
      return;
    }

    const coverUrl = imagePreview || bookForm.coverImageUrl;

    updateBook(editingBook.id, {
      ...bookForm,
      shortDescription: bookForm.shortDescription || bookForm.description.substring(0, 150) + '...',
      ...(coverUrl && { coverImageUrl: coverUrl })
    });

    setEditingBook(null);
    resetForm();

    toast({
      title: "Book Updated",
      description: `"${bookForm.title}" has been updated.`,
    });
  };

  const handleDeleteBook = (book) => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"? This action cannot be undone.`)) {
      deleteBook(book.id);
      toast({
        title: "Book Deleted",
        description: `"${book.title}" has been removed from the catalog.`,
      });
    }
  };

  const openEditDialog = (book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      description: book.description,
      shortDescription: book.shortDescription,
      category: book.category,
      coverImageUrl: book.coverImageUrl
    });
    setImagePreview(book.coverImageUrl);
    setCoverImageFile(null);
    setIsBookDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingBook(null);
    resetForm();
  };

  const categories = [...new Set(books.map(book => book.category))].sort();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Books Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage your publishing house book catalog</p>
        </div>
        <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="bg-gradient-to-r from-theme-base to-theme-primary text-white shadow-elegant hover:shadow-lg transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={bookForm.title}
                  onChange={(e) => setBookForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Book title"
                />
              </div>
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={bookForm.author}
                  onChange={(e) => setBookForm(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={bookForm.category}
                  onValueChange={(value) => setBookForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Database">Database</SelectItem>
                    <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <FileInput
                  label="Cover Image"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  value={coverImageFile}
                  preview={imagePreview}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="shortDesc">Short Description</Label>
                <Input
                  id="shortDesc"
                  value={bookForm.shortDescription}
                  onChange={(e) => setBookForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for book cards"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={bookForm.description}
                  onChange={(e) => setBookForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Full book description"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button
                onClick={editingBook ? handleEditBook : handleAddBook}
                className="bg-primary hover:bg-primary/90"
              >
                {editingBook ? 'Update Book' : 'Add Book'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-modern bg-gradient-to-br from-card to-muted/30">
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="block md:hidden">
            <div className="space-y-4 p-4">
              {books.map(book => (
                <Card key={book.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex gap-3 mb-3">
                      <div className="w-12 h-16 rounded-md overflow-hidden shadow-sm bg-gradient-to-br from-muted to-muted/50 flex-shrink-0">
                        <img
                          src={book.coverImageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{book.shortDescription}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="bg-theme-light text-theme-primary border-theme-primary/20 text-xs">
                          {book.category}
                        </Badge>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">{book.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/book/${book.id}`, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(book)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBook(book)}
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:border-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border/50">
                  <TableHead>Book</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map(book => (
                  <TableRow key={book.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-16 rounded-md overflow-hidden shadow-sm bg-gradient-to-br from-muted to-muted/50">
                          <img
                            src={book.coverImageUrl}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1">{book.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{book.shortDescription}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{book.author}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-theme-light text-theme-primary border-theme-primary/20">
                        {book.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{book.averageRating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {book.uploadDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/book/${book.id}`, '_blank')}
                          className="hover:bg-theme-light hover:border-theme-primary hover:text-theme-primary transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(book)}
                          className="hover:bg-theme-light hover:border-theme-primary hover:text-theme-primary transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBook(book)}
                          className="text-destructive hover:bg-destructive/10 hover:border-destructive transition-all"
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

          {books.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No books found. Add your first book to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}