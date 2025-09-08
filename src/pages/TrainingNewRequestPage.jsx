import React, { useState } from 'react';
import { navigate } from 'gatsby';
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
      const response = await fetch('http://localhost:5001/api/training-requests', {
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
        title: "Training Request Submitted",
        description: "We'll contact you within 48 hours to confirm your training schedule.",
      });

      navigate('/training');
    } catch (error) {
      console.error('Training request submission error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit training request. Please try again.",
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
    <Layout>
      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <TrainingHeader
              icon={<Church className="w-4 h-4 text-primary" />}
              badgeText="New Training Request"
              title="Training Request Form"
              description="Help us understand your church's training needs so we can create the perfect program for you"
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <BasicInfoCard form={form} />

                {/* Service Information */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Church className="w-5 h-5 text-primary" />
                      Service Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Service Provided *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sunday-school">Sunday School</SelectItem>
                              <SelectItem value="youth">Youth</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
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
                            <FormLabel>Please specify the kind of service</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe your service type" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="numberOfServants"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Servants (Workers) *</FormLabel>
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
                  </CardContent>
                </Card>

                {/* Training Schedule */}
                <Card className="border-0 shadow-modern bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Calendar className="w-5 h-5 text-primary" />
                      Training Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="suggestedDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Suggested Training Date *</FormLabel>
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
                                    <span>Pick a date</span>
                                  )}
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
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
                            This is a proposed schedule, not mandatory. Our team will contact you to confirm or make changes.
                            <br />
                            <strong>Important:</strong> You cannot select a date earlier than two weeks from today.
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
                      Help Us Impact Nearby Churches (Optional)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Share information about nearby churches to help us extend our training impact to the broader community.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {fields.map((field, index) => (
                      <Card key={field.id} className="border border-border/50 bg-muted/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-foreground">Church {index + 1}</h4>
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

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField
                              control={form.control}
                              name={`nearbyChurches.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Church Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Church name" {...field} />
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
                                  <FormLabel>Responsible Person</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Name of responsible person" {...field} />
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
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Contact number" {...field} />
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
                      className="w-full border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Church
                    </Button>
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
                    className="bg-primary hover:bg-primary/90 px-8"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Training Request'}
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