import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const BasicInfoCard = ({ form, showAddress = true }) => {
  return (
    <Card className="border-0 shadow-modern bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Users className="w-5 h-5 text-primary" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {showAddress && (
          <FormField
            control={form.control}
            name="churchAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Church Address *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter complete church address"
                    className="resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;