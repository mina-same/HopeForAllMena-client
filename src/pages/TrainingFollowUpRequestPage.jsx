import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Upload, Shirt, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';
import TrainingHeader from '../components/training/TrainingHeader';
import { useBookstore } from '../context/BookstoreContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';

const bookRequestSchema = z.object({
  bookName: z.string().min(1, 'Book name is required'),
  partName: z.string().min(1, 'Part name is required'),
  copies: z.string().min(1, 'Number of copies is required').refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, 'Must be a valid number greater than 0'),
});

const tshirtSizeSchema = z.object({
  size6: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Must be a valid number'),
  size8: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Must be a valid number'),
  size10: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Must be a valid number'),
  sizeL: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Must be a valid number'),
  sizeXL: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Must be a valid number'),
  sizeXXL: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), 'Must be a valid number'),
});

const formSchema = z.object({
  trainerName: z.string().min(1, 'Trainer name is required'),
  name: z.string().min(1, 'Name is required'),
  churchName: z.string().min(1, 'Church name is required'),
  churchAddress: z.string().min(1, 'Church address is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  numberOfServed: z.string().min(1, 'Number of served is required').refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, 'Must be a valid number greater than 0'),
  books: z.array(bookRequestSchema).min(1, 'At least one book is required'),
  servedListFile: z.any().optional(),
  tshirtSizes: tshirtSizeSchema,
});


// Training books will be loaded from API
const defaultTrainingBooks = [
  'Look and Learn',
  'Story Time',
  'Explorers Club',
  '17 Stories',
  '75 Stories',
  'Rajaa for Children',
  'Be a Leader',
  'Best Friends',
];

const defaultBookPartsMapping = {
  'Look and Learn': ['Part One', 'Part Two'],
  'Story Time': ['Part One', 'Part Two'],
  'Explorers Club': ['Part One', 'Part Two'],
  '17 Stories': ['The Student\'s Part'],
  '75 Stories': ['The Student\'s Part'],
  'Rajaa for Children': ['The Student\'s Part'],
  'Be a Leader': ['The Student\'s Part'],
  'Best Friends': ['Part One', 'Part Two'],
};

const TrainingFollowUpRequestPage = () => {
  const { filters, setFilters } = useBookstore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrainingBooks, setShowTrainingBooks] = useState(false);
  const [trainingBooks, setTrainingBooks] = useState(defaultTrainingBooks);
  const [bookPartsMapping, setBookPartsMapping] = useState(defaultBookPartsMapping);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainerName: '',
      name: '',
      churchName: '',
      churchAddress: '',
      phoneNumber: '',
      numberOfServed: '',
      books: [{ bookName: '', partName: '', copies: '' }],
      tshirtSizes: {
        size6: '',
        size8: '',
        size10: '',
        sizeL: '',
        sizeXL: '',
        sizeXXL: '',
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'books',
  });

  // Load training books from API
  useEffect(() => {
    const loadTrainingBooks = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/training-books', {});
        if (response.ok) {
          const books = await response.json();
          const bookNames = books.map(book => book.name);
          const partsMapping = {};
          
          books.forEach(book => {
            partsMapping[book.name] = book.parts.map(part => part.name);
          });
          
          setTrainingBooks(bookNames);
          setBookPartsMapping(partsMapping);
        }
      } catch (error) {
        console.error('Error loading training books:', error);
        // Keep default books if API fails
      } finally {
        setLoadingBooks(false);
      }
    };

    loadTrainingBooks();
  }, []);

  const handleSearchChange = (search) => {
    setFilters({ search });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      console.log('Form data before processing:', data);
      
      const formData = new FormData();
      
      // Process books data - convert copies to numbers
      const processedBooks = data.books.map(book => ({
        ...book,
        copies: parseInt(book.copies) || 0
      }));
      
      // Process t-shirt sizes - convert to numbers and filter out empty values
      const processedTshirtSizes = {};
      Object.keys(data.tshirtSizes).forEach(size => {
        const value = parseInt(data.tshirtSizes[size]) || 0;
        processedTshirtSizes[size] = value;
      });
      
      // Add all form fields
      Object.keys(data).forEach(key => {
        if (key === 'books') {
          formData.append('books', JSON.stringify(processedBooks));
        } else if (key === 'tshirtSizes') {
          formData.append('tshirtSizes', JSON.stringify(processedTshirtSizes));
        } else if (key === 'servedListFile' && data.servedListFile) {
          formData.append('servedListFile', data.servedListFile);
        } else if (key !== 'servedListFile') {
          formData.append(key, data[key]);
        }
      });

      console.log('Processed form data:', {
        books: processedBooks,
        tshirtSizes: processedTshirtSizes,
        ...Object.fromEntries(
          Object.keys(data)
            .filter(key => !['books', 'tshirtSizes', 'servedListFile'].includes(key))
            .map(key => [key, data[key]])
        )
      });

      const response = await fetch('http://localhost:5001/api/training-follow-ups', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit follow-up request';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Server error response:', errorData);
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
          console.error('Non-JSON error response:', response.status, response.statusText);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Success response:', result);

      toast({
        title: "✅ Successfully Submitted!",
        description: "Your follow-up training request has been submitted successfully. We'll process your request and contact you within 24 hours.",
        duration: 5000,
      });

      // Reset form after successful submission
      form.reset();
      
      // Wait a moment before navigating to let user see the success message
      setTimeout(() => {
        navigate('/training');
      }, 2000);
    } catch (error) {
      console.error('Follow-up request submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit follow-up request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addBook = () => {
    append({ bookName: '', partName: '', copies: '' });
  };

  const removeBook = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Layout>
      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background">

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <TrainingHeader
              icon={<Shirt className="w-4 h-4 text-accent" />}
              badgeText="Follow-up Training Request"
              title="Training Follow-up Request"
              description="Request additional training materials and resources for your ongoing program"
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Trainer & Contact Information */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Trainer & Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="trainerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name of the Trainer *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter the full name of the trainer who trained you"
                              {...field}
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            If you don't know, <a href="/contact" className="text-primary hover:underline">contact us</a> to know which trainer full name trained you
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="churchName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Church Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter church name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="numberOfServed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Served (Attendees/Recipients) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter number"
                                min="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="churchAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Church Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter complete church address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Training Books Available - Collapsible */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">Training Books Available</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Reference guide for available training materials and their parts
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowTrainingBooks(!showTrainingBooks)}
                        className="flex items-center gap-2"
                      >
                        {showTrainingBooks ? 'Hide' : 'Show'} Training Books Available
                        {showTrainingBooks ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {showTrainingBooks && (
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground mb-3">Available Books & Parts:</h4>
                          <div className="space-y-3 text-sm">
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">1. Look and Learn</div>
                              <div className="text-muted-foreground ml-4">• Part One</div>
                              <div className="text-muted-foreground ml-4">• Part Two</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">2. Story Time</div>
                              <div className="text-muted-foreground ml-4">• Part One</div>
                              <div className="text-muted-foreground ml-4">• Part Two</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">3. Explorers Club</div>
                              <div className="text-muted-foreground ml-4">• Part One</div>
                              <div className="text-muted-foreground ml-4">• Part Two</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">4. 17 Stories</div>
                              <div className="text-muted-foreground ml-4">• The Student's Part</div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-3 text-sm">
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">5. 75 Stories</div>
                              <div className="text-muted-foreground ml-4">• The Student's Part</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">6. Rajaa for Children</div>
                              <div className="text-muted-foreground ml-4">• The Student's Part</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">7. Be a Leader</div>
                              <div className="text-muted-foreground ml-4">• The Student's Part</div>
                            </div>
                            <div className="p-3 rounded-lg bg-muted/30">
                              <div className="font-medium text-foreground">8. Best Friends</div>
                              <div className="text-muted-foreground ml-4">• Part One</div>
                              <div className="text-muted-foreground ml-4">• Part Two</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Book Requests */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Book Requests</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Select the books and parts you need for your training program
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="border border-border/50 bg-muted/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-foreground">Book Request {index + 1}</h4>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBook(index)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`books.${index}.bookName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Book Name *</FormLabel>
                                  <Select
                                    onValueChange={(value) => {
                                      field.onChange(value);
                                      // Reset part selection when book changes
                                      form.setValue(`books.${index}.partName`, '');
                                    }}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Choose book" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {trainingBooks.map((book) => (
                                        <SelectItem key={book} value={book}>
                                          {book}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`books.${index}.partName`}
                              render={({ field }) => {
                                const selectedBook = form.watch(`books.${index}.bookName`);
                                const availableParts = selectedBook ? bookPartsMapping[selectedBook] || [] : [];

                                return (
                                  <FormItem>
                                    <FormLabel>Book Part *</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      disabled={!selectedBook}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder={selectedBook ? "Choose part" : "Select book first"} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {availableParts.map((part) => (
                                          <SelectItem key={part} value={part}>
                                            {part}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                );
                              }}
                            />

                            <FormField
                              control={form.control}
                              name={`books.${index}.copies`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Number of Copies *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder="Enter number"
                                      min="1"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={addBook}
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Book
                    </Button>
                  </CardContent>
                </Card>

                {/* File Upload */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Upload className="w-5 h-5" />
                      Served List File
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Upload a file with the names of served attendees (PDF, Word, or Image format)
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="servedListFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>File with Names of Served</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={(e) => field.onChange(e.target.files?.[0])}
                              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            Accepted formats: PDF, Word (.doc, .docx), Images (.jpg, .png)
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* T-shirt Size Guide */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">T-shirt Size Guide</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Please refer to this sizing chart when requesting t-shirts
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <img
                        src="/traning.png"
                        alt="T-shirt sizing guide with measurements in Arabic"
                        className="max-w-full h-auto rounded-lg border shadow-sm"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* T-shirt Sizes */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Shirt className="w-5 h-5 text-accent" />
                      T-shirt Requests
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      How many t-shirts do you need for each size?
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <FormField
                        control={form.control}
                        name="tshirtSizes.size6"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size 6</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tshirtSizes.size8"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size 8</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tshirtSizes.size10"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size 10</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tshirtSizes.sizeL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size L</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tshirtSizes.sizeXL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size XL</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tshirtSizes.sizeXXL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Size XXL</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/TrainingSelectionPage')}
                    className="px-8"
                  >
                    Back to Selection
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent hover:bg-accent/90 px-8"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Follow-up Request'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <Footer />
      </div>
      <footer />
    </Layout>
  );
};

export default TrainingFollowUpRequestPage;