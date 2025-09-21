import React from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

const BasicInfoCard = ({ form, showAddress = true }) => {
  const { t } = useTranslation('TrainingNewRequest');
  
  return (
    <Card className="border-0 shadow-modern bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Users className="w-5 h-5 text-[#2194D1]" />
          {t('basicInfo.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('basicInfo.name.label')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('basicInfo.name.placeholder')} {...field} />
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
                <FormLabel>{t('basicInfo.phoneNumber.label')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('basicInfo.phoneNumber.placeholder')} {...field} />
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
              <FormLabel>{t('basicInfo.churchName.label')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('basicInfo.churchName.placeholder')} {...field} />
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
                <FormLabel>{t('basicInfo.churchAddress.label')} *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder={t('basicInfo.churchAddress.placeholder')}
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