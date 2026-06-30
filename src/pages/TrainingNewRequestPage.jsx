import React, { useState } from 'react';
import { graphql } from 'gatsby';
import { Link, useTranslation, useI18next, navigate } from 'gatsby-plugin-react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, X, Calendar, Church, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar as CalendarComponent } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { format } from 'date-fns';
import Layout from '../components/layout';
import TrainingHeader from '../components/training/TrainingHeader';
import BasicInfoCard from '../components/training/BasicInfoCard';
import { useBookstore } from '../context/BookstoreContext';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Footer from '../components/footer';

const API_URL = process.env.GATSBY_API_URL || 'http://localhost:5001/api';

const nearbyChurchSchema = z.object({
  name: z.string().min(1, 'Church name is required'),
  responsiblePerson: z.string().min(1, 'Responsible person name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
});

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  churchName: z.string().min(1, 'Church name is required'),
  churchAddress: z.string().min(1, 'Church address is required'),
  serviceType: z.string().min(1, 'Service type is required'),
  otherServiceType: z.string().optional(),
  numberOfServants: z.string().min(1, 'Number of servants is required'),
  numberOfServed: z.string().min(1, 'Number of served is required'),
  suggestedDate: z.date({
    required_error: 'Suggested training date is required',
  }).refine((date) => {
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
    return date >= twoWeeksFromNow;
  }, 'Date must be at least two weeks from today'),
  nearbyChurches: z.array(nearbyChurchSchema).optional(),
});


const TrainingNewRequestPage = () => {
  const { t } = useTranslation('TrainingNewRequest');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const { filters, setFilters } = useBookstore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      churchName: '',
      churchAddress: '',
      serviceType: '',
      otherServiceType: '',
      numberOfServants: '',
      numberOfServed: '',
      nearbyChurches: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'nearbyChurches',
  });

  const handleSearchChange = (search) => {
    setFilters({ search });
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/training-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit training request');
      }

      const result = await response.json();

      toast({
        title: t('toast.success.title'),
        description: t('toast.success.description'),
      });

      navigate('/training');
    } catch (error) {
      console.error('Training request submission error:', error);
      toast({
        title: t('toast.error.title'),
        description: error.message || t('toast.error.description'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNearbyChurch = () => {
    append({ name: '', responsiblePerson: '', phoneNumber: '' });
  };

  const removeNearbyChurch = (index) => {
    remove(index);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 14);

  return (
    <Layout pageTitle={t('pageTitle')}>
      <HeaderTwo />
      <StickyHeader />
      <div className={`min-h-screen bg-background ${currentLanguage === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <TrainingHeader
              icon={<Church className="w-4 h-4 text-[#2194D1]" />}
              badgeText={t('header.badge')}
              title={t('header.title')}
              description={t('header.description')}
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                <BasicInfoCard form={form} />

                {/* Service Information */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Church className="w-5 h-5 text-[#2194D1]" />
                      {t('serviceInfo.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('serviceInfo.serviceType.label')} *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('serviceInfo.serviceType.placeholder')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sunday-school">{t('serviceInfo.serviceType.options.sundaySchool')}</SelectItem>
                              <SelectItem value="youth">{t('serviceInfo.serviceType.options.youth')}</SelectItem>
                              <SelectItem value="other">{t('serviceInfo.serviceType.options.other')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('serviceType') === 'other' && (
                      <FormField
                        control={form.control}
                        name="otherServiceType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('serviceInfo.otherServiceType.label')}</FormLabel>
                            <FormControl>
                              <Input placeholder={t('serviceInfo.otherServiceType.placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="numberOfServants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('serviceInfo.numberOfServants.label')} *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={t('serviceInfo.numberOfServants.placeholder')}
                                min="1"
                                {...field}
                              />
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
                            <FormLabel>{t('serviceInfo.numberOfServed.label')} *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder={t('serviceInfo.numberOfServed.placeholder')}
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

                {/* Training Schedule */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-5 h-5 text-[#2194D1]" />
                      {t('schedule.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="suggestedDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('schedule.suggestedDate.label')} *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t('schedule.suggestedDate.placeholder')}</span>
                                  )}
                                  <Calendar className={`${currentLanguage === 'ar' ? 'mr-auto' : 'ml-auto'} h-4 w-4 opacity-50`} />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => {
                                  const today = new Date();
                                  const twoWeeksFromNow = new Date();
                                  twoWeeksFromNow.setDate(today.getDate() + 14);
                                  return date < twoWeeksFromNow;
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <p className="text-sm text-muted-foreground">
                            {t('schedule.suggestedDate.description')}
                            <br />
                            <strong>{t('schedule.suggestedDate.important')}</strong>
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Nearby Churches (Optional) */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-5 h-5 text-accent" />
                      {t('nearbyChurches.title')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t('nearbyChurches.description')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="border border-border/50 bg-muted/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-foreground">{t('nearbyChurches.churchNumber')} {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeNearbyChurch(index)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`nearbyChurches.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('nearbyChurches.fields.name.label')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t('nearbyChurches.fields.name.placeholder')} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`nearbyChurches.${index}.responsiblePerson`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('nearbyChurches.fields.responsiblePerson.label')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t('nearbyChurches.fields.responsiblePerson.placeholder')} {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`nearbyChurches.${index}.phoneNumber`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('nearbyChurches.fields.phoneNumber.label')}</FormLabel>
                                  <FormControl>
                                    <Input placeholder={t('nearbyChurches.fields.phoneNumber.placeholder')} {...field} />
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
                      onClick={addNearbyChurch}
                      className="w-full border-primary/30 text-[#2194D1] hover:bg-primary/10"
                    >
                      <Plus className={`h-4 w-4 ${currentLanguage === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {t('nearbyChurches.addButton')}
                    </Button>
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
                    className="w-full sm:w-auto bg-[#2194D1] hover:bg-[#2194D1]/90 px-6 sm:px-8"
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

export default TrainingNewRequestPage;

// GraphQL query for i18n
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
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

// Gatsby head export for SEO
export const Head = ({ data }) => {
  const { t } = useTranslation('TrainingNewRequest');
  return (
    <>
      <title>{t('pageTitle')}</title>
      <meta name="description" content={t('seoDescription')} />
    </>
  );
};