import React, { useState } from 'react';
import { navigate } from 'gatsby';
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
  'The Great Book, the Book of Hope',
  'The Book of Hope',
  'The Gift That Changes Everything',
  'A Journey in the World of the Bible',
  'The Bible for Children',
  'The Path of Hope',
  'On the Edge'
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
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        title: "Request Submitted Successfully!",
        description: "We'll review your magazine request and get back to you soon.",
      });

      setTimeout(() => {
        navigate('/magazines');
      }, 2000);

    } catch (error) {
      console.error('Error submitting magazine request:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit your request. Please try again.",
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
              badgeText="Magazine Request"
              title="Request Our Magazines"
              description="Fill out the form below to request magazines for your church or community. We'll process your request promptly."
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Church className="w-5 h-5 text-primary" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
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
                              <Input type="tel" placeholder="Enter your phone number" {...field} />
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
                      Church Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="churchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name of the Church *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter church name" {...field} />
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
                          <FormLabel>Church Address *</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Enter complete church address including city, state, and postal code bg-white"
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
                      Magazine Selection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Select magazines and specify the number of copies for each
                        </p>
                        <Button
                          type="button"
                          onClick={addMagazine}
                          variant="outline"
                          size="sm"
                          className="border-primary/30 text-primary hover:bg-primary/10"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Magazine
                        </Button>
                      </div>

                      {fields.map((field, index) => (
                        <div key={field.id} className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-gray-900">Magazine {index + 1}</h4>
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
                                  <FormLabel>Magazine Name *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select a magazine" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {getAvailableMagazines(index).map((magazine) => (
                                        <SelectItem key={magazine} value={magazine}>
                                          {magazine}
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
                                  <FormLabel>Number of Copies *</FormLabel>
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/magazines')}
                    className="px-8"
                  >
                    Back to Magazines
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#2194D1] hover:bg-[#2194D1]/90 px-8"
                  >
                    {isSubmitting ? 'Submitting Request...' : 'Submit Magazine Request'}
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