import React, { useState } from 'react';
import { navigate, graphql } from 'gatsby';
import { Link, useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import TrainingHeader from '../../components/training/TrainingHeader';
import { magazineRequestsAPI } from '../../services/api';
import { useToast } from '../../hooks/use-toast';
import { ArrowLeft, Send, BookOpen, Plus, X, Church, BookOpenCheck } from 'lucide-react';
import Layout from '../../components/layout';
import StickyHeader from '../../components/header/sticky-header';
import HeaderTwo from '../../components/header/header-two';
import Footer from "../../components/footer"

// Available magazines list
const availableMagazines = [
  'The Great Book',
  'The Book of Hope',
  'The Gift That Changes Everything',
  'Journey in the World of the Bible',
  'The Bible',
  'The Way of Hope',
  'On the Edge',
  'How the Shepherd Saved His Sheep',
  'The Good Neighbor'
];


const magazineSchema = z.object({
  magazineName: z.string().min(1, 'Magazine name is required'),
  numberOfCopies: z.string().min(1, 'Number of copies is required'),
});

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  churchName: z.string().min(1, 'Church name is required'),
  churchAddress: z.string().min(1, 'Church address is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  magazines: z.array(magazineSchema).min(1, 'At least one magazine must be selected'),
});

const MagazineRequestPage = () => {
  const { t } = useTranslation('Magazines');
  const { i18n } = useI18next();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function for language-aware navigation
  const navigateWithLanguage = (path) => {
    const currentLanguage = i18n?.resolvedLanguage || 'en';
    const languagePath = currentLanguage === 'en' ? path : `/${currentLanguage}${path}`;
    navigate(languagePath);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      churchName: '',
      churchAddress: '',
      phoneNumber: '',
      magazines: [{ magazineName: '', numberOfCopies: '1' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'magazines'
  });

  // Get selected magazines to prevent duplicates
  const watchedValues = form.watch();
  const selectedMagazines = (watchedValues.magazines?.map(mag => mag.magazineName) || []).filter(Boolean);

  // Get available magazines for each dropdown
  const getAvailableMagazines = (currentIndex) => {
    const otherSelectedMagazines = selectedMagazines.filter((mag, index) => index !== currentIndex);
    return availableMagazines.filter(mag => !otherSelectedMagazines.includes(mag));
  };

  const addMagazine = () => {
    append({ magazineName: '', numberOfCopies: '1' });
  };

  const removeMagazine = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const magazines = data.magazines
        ?.filter(mag => mag.magazineName && mag.numberOfCopies)
        .map(mag => ({
          magazineName: mag.magazineName,
          numberOfCopies: parseInt(mag.numberOfCopies) || 1
        })) || [];

      const requestData = {
        name: data.name,
        churchName: data.churchName,
        churchAddress: data.churchAddress,
        phoneNumber: data.phoneNumber,
        magazines: magazines,
        preferredContactMethod: 'phone'
      };

      await magazineRequestsAPI.createRequest(requestData);

      toast({
        title: t('request.successTitle'),
        description: t('request.successDescription'),
      });

      setTimeout(() => {
        navigateWithLanguage('/magazines');
      }, 2000);

    } catch (error) {
      console.error('Error submitting magazine request:', error);
      toast({
        title: t('request.errorTitle'),
        description: error.response?.data?.message || t('request.errorDescription'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout >
      <HeaderTwo/>
      <StickyHeader/>
      <div className="min-h-screen bg-background">

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <TrainingHeader
              icon={<BookOpen className="w-4 h-4 text-primary" />}
              badgeText={t('request.badgeText')}
              title={t('request.title')}
              description={t('request.description')}
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Church className="w-5 h-5 text-primary" />
                      {t('request.personalInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('request.fullName')} *</FormLabel>
                            <FormControl>
                              <Input placeholder={t('request.fullNamePlaceholder')} {...field} />
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
                            <FormLabel>{t('request.phoneNumber')} *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder={t('request.phoneNumberPlaceholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Church Information */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Church className="w-5 h-5 text-primary" />
                      {t('request.churchInfo')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="churchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('request.churchName')} *</FormLabel>
                          <FormControl>
                            <Input placeholder={t('request.churchNamePlaceholder')} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="churchAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('request.churchAddress')} *</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder={t('request.churchAddressPlaceholder')}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Magazine Selection */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <BookOpenCheck className="w-5 h-5 text-primary" />
                      {t('request.magazineSelection')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {t('request.selectionDescription')}
                        </p>
                        <Button
                          type="button"
                          onClick={addMagazine}
                          variant="outline"
                          size="sm"
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('request.addAnother')}
                        </Button>
                      </div>

                      {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">{t('request.magazine')} {index + 1}</h4>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeMagazine(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`magazines.${index}.magazineName`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('request.magazineName')} *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-white">
                                        <SelectValue placeholder={t('request.selectMagazine')} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {getAvailableMagazines(index).map((magazine) => (
                                        <SelectItem key={magazine} value={magazine}>
                                          {t(`titles.${magazine.replace(/[^a-zA-Z0-9]/g, '')}`)}
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
                              name={`magazines.${index}.numberOfCopies`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t('request.numberOfCopies')} *</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="10000"
                                      placeholder="1"
                                      {...field}
                                      className="bg-white"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/magazines">
                    <Button
                      type="button"
                      variant="outline"
                      className="px-8"
                    >
                      {t('request.backToMagazines')}
                    </Button>
                  </Link>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2194D1] hover:bg-[#2194D1]/90 px-8"
                  >
                    {isSubmitting ? t('request.submitting') : t('request.submitRequest')}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <Footer />
      </div>
    </Layout>
  );
};

export default MagazineRequestPage;

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