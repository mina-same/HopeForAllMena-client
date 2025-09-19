import React, { useState, useEffect } from 'react';
import { useLocation } from '@reach/router';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';
import StickyHeader from '../components/header/sticky-header';
import HeaderTwo from '../components/header/header-two';
import Footer from '../components/footer';

const OrderPage = () => {
  const location = useLocation();
  const { toast } = useToast();
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
          subject: `Book Order: ${bookTitle}`,
          message: preFilledMessage || `I would like to order the book "${bookTitle}"${bookAuthor ? ` by ${bookAuthor}` : ''}. Please let me know about availability and pricing.`
        }));
      }
    }
  }, [location.state]);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message || !form.subject) {
      toast({
        title: "Please fill all fields",
        description: "Name, email, message, and subject are required.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
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
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
        });
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout pageTitle="Order Page || Hope For All Mena Ministry">
      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background pt-[100px]">

        <main className="container mx-auto px-4 py-12">
          <div className="">


            {/* Physical Book Locations */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Visit Our Book Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-theme-base" />
                      Cairo Office
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">
                      15 Tahrir Square<br />
                      Downtown Cairo, Egypt
                    </p>
                    <p className="text-sm font-semibold text-theme-base">
                      Phone: +20 2 2792 1234
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Open: Sun-Thu 9AM-6PM
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-theme-base" />
                      Alexandria Branch
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">
                      45 Corniche Road<br />
                      Alexandria, Egypt
                    </p>
                    <p className="text-sm font-semibold text-theme-base">
                      Phone: +20 3 487 5678
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Open: Sun-Thu 10AM-7PM
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-theme-base" />
                      Assiut Center
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">
                      28 University Street<br />
                      Assiut, Egypt
                    </p>
                    <p className="text-sm font-semibold text-theme-base">
                      Phone: +20 88 231 9012
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Open: Sun-Thu 9AM-5PM
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-foreground">Order Books</h1>
              <p className="text-xl text-muted-foreground">
                Get your books from our physical locations or contact us for delivery!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email address"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="What is this regarding?"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Tell us how we can help you..."
                      rows={6}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-hero hover:opacity-90"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-theme-base/10 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-theme-base" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <p className="text-muted-foreground">info@hopeforallmena.org</p>
                        <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-theme-base/10 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-theme-base" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground">+20 2 2792 1234</p>
                        <p className="text-sm text-muted-foreground">Sun-Thu, 9AM-6PM Cairo Time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose Hope For All MENA?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Educational books promoting hope and positive change
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Available at multiple locations across Egypt
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Supporting community development in MENA region
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Affordable pricing for educational materials
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Dedicated customer service in Arabic and English
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