import React, { useState, useEffect } from 'react';
import { useLocation } from '@reach/router';
import { graphql } from 'gatsby';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';
import StickyHeader from '../components/header/sticky-header';
import PageHeader from '../components/page-header';
import HeaderTwo from '../components/header/header-two';
import Footer from '../components/footer';

const OrderPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation('PublishingHouse');
  const { language: currentLanguage } = useI18next();
  const isRTL = currentLanguage === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    subject: ''
  });

  useEffect(() => {
    // Pre-fill form if coming from book order
    if (location.state) {
      const { bookTitle, bookAuthor, bookId, preFilledMessage } = location.state;
      if (bookTitle) {
        setForm(prev => ({
          ...prev,
          subject: `${t('orderPage.form.bookOrderPrefix')}: ${bookTitle}`,
          message: preFilledMessage || `${t('orderPage.form.defaultMessage')} "${bookTitle}"${bookAuthor ? ` ${t('orderPage.form.by')} ${bookAuthor}` : ''}. ${t('orderPage.form.availabilityRequest')}`
        }));
      }
    }
  }, [location.state, t]);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message || !form.subject) {
      toast({
        title: t('orderPage.validation.fillAllFields'),
        description: t('orderPage.validation.allFieldsRequired'),
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast({
        title: t('orderPage.validation.invalidEmail'),
        description: t('orderPage.validation.validEmailRequired'),
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const contactData = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        subject: form.subject.trim() || 'General Inquiry',
        message: form.message.trim(),
        type: location.state?.bookId ? 'book-order' : 'general',
        book: location.state?.bookId || undefined,
        bookTitle: location.state?.bookTitle || undefined,
        bookAuthor: location.state?.bookAuthor || undefined,
        source: 'website',
        preferredContactMethod: 'email'
      };

      const response = await fetch('http://localhost:5001/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      const result = await response.json();

      if (response.ok) {
        setForm({ name: '', email: '', message: '', subject: '' });
        toast({
          title: t('orderPage.success.title'),
          description: t('orderPage.success.description'),
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: t('orderPage.error.title'),
        description: t('orderPage.error.description'),
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout pageTitle={`${t('orderPage.pageTitle')} || Hope For All Mena Ministry`}>
      <HeaderTwo />
      <StickyHeader />
      <PageHeader title={t('orderPage.pageTitle')} crumbTitle={t('orderPage.crumbTitle')} />
      <div className="min-h-screen bg-background pt-[50px]" dir={isRTL ? 'rtl' : 'ltr'}>

        <main className="container mx-auto px-4 py-12">
          <div className="">

            {/* Physical Book Locations */}
            <div className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 text-center ${isRTL ? 'font-arabic' : ''}`}>
                {t('orderPage.locations.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className={`h-5 w-5 text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('orderPage.locations.cairo.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isRTL ? 'text-right' : ''}>
                    <p className="text-muted-foreground mb-2">
                      {t('orderPage.locations.cairo.address1')}<br />
                      {t('orderPage.locations.cairo.address2')}
                    </p>
                    <p className="text-sm font-semibold text-theme-base">
                      {t('orderPage.locations.phone')}: <a href={`tel:${t('orderPage.locations.cairo.phone')}`} className="hover:underline">{t('orderPage.locations.cairo.phone')}</a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderPage.locations.open')}: {t('orderPage.locations.cairo.hours')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className={`h-5 w-5 text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('orderPage.locations.alexandria.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isRTL ? 'text-right' : ''}>
                    <p className="text-muted-foreground mb-2">
                      {t('orderPage.locations.alexandria.address1')}<br />
                      {t('orderPage.locations.alexandria.address2')}
                    </p>
                    <p className="text-sm font-semibold text-theme-base">
                      {t('orderPage.locations.phone')}: <a href={`tel:${t('orderPage.locations.alexandria.phone')}`} className="hover:underline">{t('orderPage.locations.alexandria.phone')}</a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderPage.locations.open')}: {t('orderPage.locations.alexandria.hours')}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className={`h-5 w-5 text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('orderPage.locations.assiut.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isRTL ? 'text-right' : ''}>
                    <p className="text-muted-foreground mb-2">
                      {t('orderPage.locations.assiut.address1')}<br />
                      {t('orderPage.locations.assiut.address2')}
                    </p>
                    <p className="text-sm font-semibold text-theme-base">
                      {t('orderPage.locations.phone')}: <a href={`tel:${t('orderPage.locations.assiut.phone')}`} className="hover:underline">{t('orderPage.locations.assiut.phone')}</a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t('orderPage.locations.open')}: {t('orderPage.locations.assiut.hours')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center mb-12">
              <h1 className={`text-4xl font-bold mb-4 text-foreground ${isRTL ? 'font-arabic' : ''}`}>
                {t('orderPage.hero.title')}
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('orderPage.hero.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className={isRTL ? 'text-right font-arabic' : ''}>
                    {t('orderPage.form.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className={isRTL ? 'text-right block' : ''}>
                      {t('orderPage.form.name')} *
                    </Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('orderPage.form.namePlaceholder')}
                      required
                      disabled={isSubmitting}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className={isRTL ? 'text-right block' : ''}>
                      {t('orderPage.form.email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder={t('orderPage.form.emailPlaceholder')}
                      required
                      disabled={isSubmitting}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className={isRTL ? 'text-right block' : ''}>
                      {t('orderPage.form.subject')} *
                    </Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder={t('orderPage.form.subjectPlaceholder')}
                      required
                      disabled={isSubmitting}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className={isRTL ? 'text-right block' : ''}>
                      {t('orderPage.form.message')} *
                    </Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={t('orderPage.form.messagePlaceholder')}
                      rows={6}
                      required
                      disabled={isSubmitting}
                      className={isRTL ? 'text-right' : ''}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className={`w-full bg-gradient-hero hover:opacity-90 ${isRTL ? 'flex-row-reverse' : ''}`}
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {isSubmitting ? t('orderPage.form.sending') : t('orderPage.form.sendButton')}
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={isRTL ? 'text-right font-arabic' : ''}>
                      {t('orderPage.contactInfo.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className={`flex items-start ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-4`}>
                      <div className="bg-theme-base/10 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-theme-base" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className={`font-semibold mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                          {t('orderPage.contactInfo.email.label')}
                        </h3>
                        <a href={`mailto:${t('orderPage.contactInfo.email.address')}`} className="text-muted-foreground hover:text-theme-base hover:underline transition-colors">
                          {t('orderPage.contactInfo.email.address')}
                        </a>
                        <p className="text-sm text-muted-foreground">{t('orderPage.contactInfo.email.note')}</p>
                      </div>
                    </div>

                    <div className={`flex items-start ${isRTL ? 'flex-row-reverse space-x-reverse' : ''} space-x-4`}>
                      <div className="bg-theme-base/10 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-theme-base" />
                      </div>
                      <div className={isRTL ? 'text-right' : ''}>
                        <h3 className={`font-semibold mb-1 ${isRTL ? 'font-arabic' : ''}`}>
                          {t('orderPage.contactInfo.phone.label')}
                        </h3>
                        <a href={`tel:${t('orderPage.contactInfo.phone.number')}`} className="text-muted-foreground hover:text-theme-base hover:underline transition-colors">
                          {t('orderPage.contactInfo.phone.number')}
                        </a>
                        <p className="text-sm text-muted-foreground">{t('orderPage.contactInfo.phone.hours')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className={isRTL ? 'text-right font-arabic' : ''}>
                      {t('orderPage.whyChoose.title')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className={`space-y-3 text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                      <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`}>•</span>
                        {t('orderPage.whyChoose.reasons.0')}
                      </li>
                      <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`}>•</span>
                        {t('orderPage.whyChoose.reasons.1')}
                      </li>
                      <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`}>•</span>
                        {t('orderPage.whyChoose.reasons.2')}
                      </li>
                      <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`}>•</span>
                        {t('orderPage.whyChoose.reasons.3')}
                      </li>
                      <li className={`flex items-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className={`text-theme-base ${isRTL ? 'ml-2' : 'mr-2'}`}>•</span>
                        {t('orderPage.whyChoose.reasons.4')}
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Layout>
  );
};

export default OrderPage;

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
