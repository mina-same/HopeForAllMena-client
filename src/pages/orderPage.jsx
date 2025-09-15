import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useBookstore } from '../context/BookstoreContext';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';
import StickyHeader from '../components/header/sticky-header';
import HeaderTwo from '../components/header/header-two';
import Footer from '../components/footer';

const OrderPage = () => {
  const location = useLocation();
  const { addContact, setFilters } = useBookstore();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    // Pre-fill form if coming from book order
    if (location.state) {
      const { bookTitle, preFilledMessage } = location.state;
      if (preFilledMessage) {
        setForm(prev => ({ ...prev, message: preFilledMessage }));
      }
    }
  }, [location.state]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({
        title: "Please fill all fields",
        description: "Name, email, and message are required.",
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

    addContact({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      bookTitle: location.state?.bookTitle
    });

    setForm({ name: '', email: '', message: '' });

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
  };

  return (
    <Layout>
      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background">

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 text-foreground">Contact Us</h1>
              <p className="text-xl text-muted-foreground">
                Have questions about our books or need help with an order? We're here to help!
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
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-hero hover:opacity-90"
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
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
                        <p className="text-muted-foreground">info@bookhaven.com</p>
                        <p className="text-sm text-muted-foreground">We reply within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-theme-base/10 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-theme-base" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM EST</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-theme-base/10 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-theme-base" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="text-muted-foreground">
                          123 Book Street<br />
                          Reading City, RC 12345<br />
                          United States
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose BookHaven?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Curated collection of high-quality technical books
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Fast and reliable delivery worldwide
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Expert customer support team
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        Competitive pricing and special offers
                      </li>
                      <li className="flex items-start">
                        <span className="text-theme-base mr-2">•</span>
                        PDF samples available for most books
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