import React, { useState, useEffect } from 'react';
import { graphql } from 'gatsby';
import { Link, useTranslation, useI18next, Trans, navigate } from 'gatsby-plugin-react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Upload, Shirt, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import FileUpload from '../components/ui/file-upload';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';
import TrainingHeader from '../components/training/TrainingHeader';
import { useBookstore } from '../context/BookstoreContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';

// Schema will be created inside component to access translations
const createBookRequestSchema = (t) => z.object({
  bookName: z.string().min(1, t('validation.bookNameRequired')),
  partName: z.string().min(1, t('validation.partNameRequired')),
  copies: z.string().min(1, t('validation.copiesRequired')).refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, t('validation.copiesInvalid')),
});

const createTshirtSizeSchema = (t) => z.object({
  size6: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), t('validation.validNumber')),
  size8: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), t('validation.validNumber')),
  size10: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), t('validation.validNumber')),
  sizeL: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), t('validation.validNumber')),
  sizeXL: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), t('validation.validNumber')),
  sizeXXL: z.string().optional().refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0), t('validation.validNumber')),
});

const createFormSchema = (t) => z.object({
  trainerName: z.string().min(1, t('validation.required')),
  name: z.string().min(1, t('validation.required')),
  churchName: z.string().min(1, t('validation.required')),
  churchAddress: z.string().min(1, t('validation.required')),
  phoneNumber: z.string().min(1, t('validation.required')),
  numberOfServed: z.string().min(1, t('validation.numberOfServedRequired')).refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, t('validation.numberOfServedInvalid')),
  books: z.array(createBookRequestSchema(t)).min(1, t('validation.atLeastOneBook')),
  servedListFile: z.any().optional(),
  tshirtSizes: createTshirtSizeSchema(t),
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
  const { t } = useTranslation('TrainingFollowUpRequest');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  const isRTL = currentLanguage === 'ar';
  
  const { filters, setFilters } = useBookstore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTrainingBooks, setShowTrainingBooks] = useState(false);
  const [trainingBooks, setTrainingBooks] = useState(defaultTrainingBooks);
  const [bookPartsMapping, setBookPartsMapping] = useState(defaultBookPartsMapping);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const form = useForm({
    resolver: zodResolver(createFormSchema(t)),
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
          // Use appropriate language field based on current language
          const bookNames = books.map(book => currentLanguage === 'ar' && book.nameAr ? book.nameAr : book.name);
          const partsMapping = {};
          
          books.forEach(book => {
            const bookName = currentLanguage === 'ar' && book.nameAr ? book.nameAr : book.name;
            partsMapping[bookName] = book.parts.map(part => 
              currentLanguage === 'ar' && part.nameAr ? part.nameAr : part.name
            );
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
  }, [currentLanguage]);

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
        title: t('toast.success.title'),
        description: t('toast.success.description'),
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
        title: t('toast.error.title'),
        description: error.message || t('toast.error.description'),
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
      <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>

        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <TrainingHeader
              icon={<Shirt className="w-4 h-4 text-accent" />}
              badgeText={t('header.badge')}
              title={t('header.title')}
              description={t('header.description')}
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                {/* Trainer & Contact Information */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">{t('trainerInfo.title')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <FormField
                      control={form.control}
                      name="trainerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('trainerInfo.trainerName.label')} *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t('trainerInfo.trainerName.placeholder')}
                              {...field}
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            <Trans
                              i18nKey="trainerInfo.trainerName.description"
                              ns="TrainingFollowUpRequest"
                              components={{
                                contactLink: <Link to="/contact" className="text-[#2194D1] hover:underline" />
                              }}
                            />
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('trainerInfo.name.label')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('trainerInfo.name.placeholder')} {...field} />
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
                            <FormLabel>{t('trainerInfo.phoneNumber.label')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('trainerInfo.phoneNumber.placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="churchName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('trainerInfo.churchName.label')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('trainerInfo.churchName.placeholder')} {...field} />
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
                            <FormLabel>{t('trainerInfo.numberOfServed.label')} *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={t('trainerInfo.numberOfServed.placeholder')}
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
                          <FormLabel>{t('trainerInfo.churchAddress.label')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('trainerInfo.churchAddress.placeholder')} {...field} />
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-foreground text-lg sm:text-xl">{t('trainingBooks.title')}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('trainingBooks.description')}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowTrainingBooks(!showTrainingBooks)}
                        className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">{showTrainingBooks ? t('trainingBooks.hideButton') : t('trainingBooks.showButton')}</span>
                        <span className="sm:hidden">{showTrainingBooks ? 'إخفاء' : 'إظهار'}</span>
                        {showTrainingBooks ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {showTrainingBooks && (
                    <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-semibold text-foreground mb-2 sm:mb-3 text-base sm:text-lg">{t('trainingBooks.availableBooks')}</h4>
                          <div className="space-y-2 sm:space-y-3 text-sm">
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">1. {t('trainingBooks.books.lookAndLearn.name')}</div>
                              {t('trainingBooks.books.lookAndLearn.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">2. {t('trainingBooks.books.storyTime.name')}</div>
                              {t('trainingBooks.books.storyTime.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">3. {t('trainingBooks.books.explorersClub.name')}</div>
                              {t('trainingBooks.books.explorersClub.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">4. {t('trainingBooks.books.seventeenStories.name')}</div>
                              {t('trainingBooks.books.seventeenStories.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="space-y-2 sm:space-y-3 text-sm">
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">5. {t('trainingBooks.books.seventyFiveStories.name')}</div>
                              {t('trainingBooks.books.seventyFiveStories.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">6. {t('trainingBooks.books.rajaaForChildren.name')}</div>
                              {t('trainingBooks.books.rajaaForChildren.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">7. {t('trainingBooks.books.beALeader.name')}</div>
                              {t('trainingBooks.books.beALeader.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
                            </div>
                            <div className="p-2 sm:p-3 rounded-lg bg-muted/30 border border-muted">
                              <div className="font-medium text-foreground text-sm sm:text-base mb-1">8. {t('trainingBooks.books.bestFriends.name')}</div>
                              {t('trainingBooks.books.bestFriends.parts', { returnObjects: true }).map((part, index) => (
                                <div key={index} className={`text-muted-foreground text-xs sm:text-sm ${isRTL ? 'mr-3 sm:mr-4' : 'ml-3 sm:ml-4'}`}>• {part}</div>
                              ))}
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
                    <CardTitle className="text-foreground">{t('bookRequests.title')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('bookRequests.description')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="border border-border/50 bg-muted/20">
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h4 className="font-medium text-foreground">{t('bookRequests.bookRequestNumber')} {index + 1}</h4>
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

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`books.${index}.bookName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('bookRequests.fields.bookName.label')} *</FormLabel>
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
                                        <SelectValue placeholder={t('bookRequests.fields.bookName.placeholder')} />
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
                                    <FormLabel>{t('bookRequests.fields.partName.label')} *</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      disabled={!selectedBook}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder={selectedBook ? t('bookRequests.fields.partName.placeholder') : t('bookRequests.fields.partName.selectBookFirst')} />
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
                                  <FormLabel>{t('bookRequests.fields.copies.label')} *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      placeholder={t('bookRequests.fields.copies.placeholder')}
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
                      className="w-full border-primary/30 text-[#2194D1] hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('bookRequests.addButton')}
                    </Button>
                  </CardContent>
                </Card>

                {/* File Upload */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Upload className="w-5 h-5" />
                      {t('fileUpload.title')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('fileUpload.description')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="servedListFile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('fileUpload.label')}</FormLabel>
                          <FormControl>
                            <FileUpload
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onFileChange={(file) => field.onChange(file)}
                              placeholder={t('fileUpload.chooseFile')}
                              noFileText={t('fileUpload.noFileChosen')}
                              dragDropText={t('fileUpload.dragDrop')}
                              isRTL={isRTL}
                            />
                          </FormControl>
                          <p className="text-sm text-muted-foreground">
                            {t('fileUpload.acceptedFormats')}
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
                    <CardTitle className="text-foreground">{t('tshirtGuide.title')}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('tshirtGuide.description')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center px-4">
                      <img
                        src="/traning.png"
                        alt={t('tshirtGuide.altText')}
                        className="max-w-full h-auto rounded-lg border shadow-sm w-full sm:w-auto max-w-md sm:max-w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* T-shirt Sizes */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Shirt className="w-5 h-5 text-accent" />
                      {t('tshirtRequests.title')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('tshirtRequests.description')}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                      <FormField
                        control={form.control}
                        name="tshirtSizes.size6"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">{t('tshirtRequests.sizes.size6')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="text-center sm:text-left"
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
                            <FormLabel className="text-sm">{t('tshirtRequests.sizes.size8')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="text-center sm:text-left"
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
                            <FormLabel className="text-sm">{t('tshirtRequests.sizes.size10')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="text-center sm:text-left"
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
                            <FormLabel className="text-sm">{t('tshirtRequests.sizes.sizeL')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="text-center sm:text-left"
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
                            <FormLabel className="text-sm">{t('tshirtRequests.sizes.sizeXL')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="text-center sm:text-left"
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
                            <FormLabel className="text-sm">{t('tshirtRequests.sizes.sizeXXL')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                min="0"
                                className="text-center sm:text-left"
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
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link to="/TrainingSelectionPage" className="w-full sm:w-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full sm:w-auto px-6 sm:px-8"
                    >
                      {t('buttons.back')}
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-accent hover:bg-accent/90 px-6 sm:px-8"
                  >
                    {isSubmitting ? t('buttons.submitting') : t('buttons.submit')}
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

// Gatsby head export for SEO
export const Head = ({ data }) => {
  const { t } = useTranslation('TrainingFollowUpRequest');
  return (
    <>
      <title>{t('pageTitle')}</title>
      <meta name="description" content={t('seoDescription')} />
    </>
  );
};

// GraphQL query for i18n
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default TrainingFollowUpRequestPage;