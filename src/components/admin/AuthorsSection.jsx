import React, { useState } from 'react';
import { Plus, Edit, Trash2, Book, Calendar, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { useBookstore } from '../../context/BookstoreContext';
import { useToast } from '../../hooks/use-toast';

// interface Author {
//   id: string;
//   name: string;
//   bio: string;
//   email: string;
//   avatar?: string;
//   booksCount: number;
//   joinDate: string;
// }

export function AuthorsSection() {
  const { books } = useBookstore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [authorForm, setAuthorForm] = useState({
    name: '',
    bio: '',
    email: '',
    avatar: ''
  });

  // Extract authors from books
  const authors = React.useMemo(() => {
    const authorMap = new Map();

    books.forEach(book => {
      if (!authorMap.has(book.author)) {
        const authorBooks = books.filter(b => b.author === book.author);
        authorMap.set(book.author, {
          id: book.author.toLowerCase().replace(/\s+/g, '-'),
          name: book.author,
          bio: `Professional author with ${authorBooks.length} published book${authorBooks.length !== 1 ? 's' : ''}.`,
          email: `${book.author.toLowerCase().replace(/\s+/g, '.')}@publishinghouse.com`,
          booksCount: authorBooks.length,
          joinDate: '2024-01-01'
        });
      }
    });

    return Array.from(authorMap.values());
  }, [books]);

  const resetForm = () => {
    setAuthorForm({
      name: '',
      bio: '',
      email: '',
      avatar: ''
    });
    setEditingAuthor(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!authorForm.name.trim() || !authorForm.email.trim()) {
      toast({
        title: "Please fill required fields",
        description: "Name and email are required.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: editingAuthor ? "Author Updated" : "Author Added",
      description: `${authorForm.name} has been ${editingAuthor ? 'updated' : 'added'} successfully.`,
    });

    resetForm();
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setAuthorForm({
      name: author.name,
      bio: author.bio,
      email: author.email,
      avatar: author.avatar || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (author) => {
    if (window.confirm(`Are you sure you want to delete "${author.name}"? This action cannot be undone.`)) {
      toast({
        title: "Author Deleted",
        description: `${author.name} has been removed.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Authors Management</h2>
          <p className="text-muted-foreground text-sm md:text-base">Manage your publishing house authors</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-theme-base to-theme-primary text-white shadow-elegant hover:shadow-lg transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Add New Author
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAuthor ? 'Edit Author' : 'Add New Author'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={authorForm.name}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Author name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={authorForm.email}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="author@example.com"
                />
              </div>
              <div>
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={authorForm.bio}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Author biography"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={authorForm.avatar}
                  onChange={(e) => setAuthorForm(prev => ({ ...prev, avatar: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                {editingAuthor ? 'Update Author' : 'Add Author'}
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
              {authors.map((author) => (
                <Card key={author.id} className="border border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12 flex-shrink-0">
                        <AvatarImage src={author.avatar} alt={author.name} />
                        <AvatarFallback className="bg-gradient-to-br from-theme-base to-theme-primary text-white text-xs">
                          {author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm">{author.name}</h3>
                        <p className="text-xs text-muted-foreground truncate">{author.bio}</p>
                        <p className="text-xs text-muted-foreground mt-1">{author.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="secondary" className="bg-theme-light text-theme-primary border-theme-primary/20 text-xs">
                          <Book className="h-3 w-3 mr-1" />
                          {author.booksCount}
                        </Badge>
                        <span className="text-muted-foreground">{author.joinDate}</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(author)}
                          className="h-8 w-8 p-0 hover:bg-theme-light hover:border-theme-primary hover:text-theme-primary"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(author)}
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
                  <TableHead>Author</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Books</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authors.map((author) => (
                  <TableRow key={author.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={author.avatar} alt={author.name} />
                          <AvatarFallback className="bg-gradient-to-br from-theme-base to-theme-primary text-white">
                            {author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{author.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{author.bio}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">{author.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-theme-light text-theme-primary border-theme-primary/20">
                        <Book className="h-3 w-3 mr-1" />
                        {author.booksCount} book{author.booksCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {author.joinDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(author)}
                          className="hover:bg-theme-light hover:border-theme-primary hover:text-theme-primary transition-all"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(author)}
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

          {authors.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No authors found. Add your first author to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}