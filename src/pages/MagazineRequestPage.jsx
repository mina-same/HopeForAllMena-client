import React, { useState } from 'react';
import { navigate } from 'gatsby';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useBookstore } from '../context/BookstoreContext';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Send, BookOpenCheck, Plus, X } from 'lucide-react';

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

const MagazineRequestPage = () => {
  const { addMagazineRequest } = useBookstore();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    churchName: '',
    churchAddress: '',
    phoneNumber: '',
    magazineName: '',
    numberOfCopies: ''
  });

  const [additionalMagazines, setAdditionalMagazines] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      magazineName: value
    }));
  };

  const addAdditionalMagazine = () => {
    const newId = Date.now().toString();
    setAdditionalMagazines(prev => [
      ...prev,
      { id: newId, magazineName: '', numberOfCopies: '' }
    ]);
  };

  const removeAdditionalMagazine = (id) => {
    setAdditionalMagazines(prev => prev.filter(mag => mag.id !== id));
  };

  const updateAdditionalMagazine = (id, field, value) => {
    setAdditionalMagazines(prev =>
      prev.map(mag =>
        mag.id === id ? { ...mag, [field]: value } : mag
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create additional magazines string for submission
      const additionalMagazinesText = additionalMagazines
        .filter(mag => mag.magazineName && mag.numberOfCopies)
        .map(mag => `${mag.magazineName} (${mag.numberOfCopies} copies)`)
        .join(', ');

      const finalAnotherBook = additionalMagazinesText ? `Additional Magazines: ${additionalMagazinesText}` : '';

      addMagazineRequest({
        name: formData.name,
        churchName: formData.churchName,
        churchAddress: formData.churchAddress,
        phoneNumber: formData.phoneNumber,
        magazineName: formData.magazineName,
        numberOfCopies: parseInt(formData.numberOfCopies) || 1,
        anotherBook: finalAnotherBook
      });

      toast({
        title: "Request Submitted Successfully!",
        description: "We'll review your magazine request and get back to you soon.",
      });

      // Reset form
      setFormData({
        name: '',
        churchName: '',
        churchAddress: '',
        phoneNumber: '',
        magazineName: '',
        numberOfCopies: ''
      });
      setAdditionalMagazines([]);

      // Navigate back to magazines page after a short delay
      setTimeout(() => {
        navigate('/magazines');
      }, 2000);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/magazines')}
            className="mb-8 text-muted-foreground hover:text-foreground group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Magazines
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-accent to-theme-base rounded-full mb-8 shadow-lg">
              <BookOpenCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Request Our Magazines
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Fill out the form below to request magazines for your church or community.
              We'll process your request promptly.
            </p>
          </div>

          {/* Request Form */}
          <Card className="shadow-2xl border border-border/30 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-accent/5 via-theme-primary/5 to-theme-base/5 border-b border-border/30">
              <CardTitle className="text-3xl text-foreground">Magazine Request Form</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Please provide accurate information for efficient processing
              </CardDescription>
            </CardHeader>

            <CardContent className="p-10">
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-theme-base rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">1</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-foreground font-medium text-base">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-14 text-base bg-background border-border/50 focus:border-accent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phoneNumber" className="text-foreground font-medium text-base">
                        Phone Number *
                      </Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="h-14 text-base bg-background border-border/50 focus:border-accent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Church Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-theme-base rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">2</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">
                      Church Information
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="churchName" className="text-foreground font-medium text-base">
                        Name of the Church *
                      </Label>
                      <Input
                        id="churchName"
                        name="churchName"
                        type="text"
                        value={formData.churchName}
                        onChange={handleInputChange}
                        required
                        className="h-14 text-base bg-background border-border/50 focus:border-accent"
                        placeholder="Enter church name"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="churchAddress" className="text-foreground font-medium text-base">
                        Church Address *
                      </Label>
                      <Textarea
                        id="churchAddress"
                        name="churchAddress"
                        value={formData.churchAddress}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="text-base bg-background border-border/50 focus:border-accent resize-none"
                        placeholder="Enter complete church address including city, state, and postal code"
                      />
                    </div>
                  </div>
                </div>

                {/* Magazine Request Details */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent to-theme-base rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">3</span>
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground">
                      Magazine Selection
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="magazineName" className="text-foreground font-medium text-base">
                        Select Magazine *
                      </Label>
                      <Select value={formData.magazineName} onValueChange={handleSelectChange} required>
                        <SelectTrigger className="h-14 text-base bg-background border-border/50 focus:border-accent">
                          <SelectValue placeholder="Choose a magazine" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border/50">
                          {availableMagazines.map((magazine) => (
                            <SelectItem key={magazine} value={magazine} className="text-base py-3">
                              {magazine}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="numberOfCopies" className="text-foreground font-medium text-base">
                        Number of Copies *
                      </Label>
                      <Input
                        id="numberOfCopies"
                        name="numberOfCopies"
                        type="number"
                        min="1"
                        value={formData.numberOfCopies}
                        onChange={handleInputChange}
                        required
                        className="h-14 text-base bg-background border-border/50 focus:border-accent"
                        placeholder="How many copies?"
                      />
                    </div>
                  </div>

                  {/* Additional Magazines Section */}
                  <div className="space-y-6 pt-8">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-medium text-base">
                        Additional Magazines (Optional)
                      </Label>
                      <Button
                        type="button"
                        onClick={addAdditionalMagazine}
                        variant="outline"
                        size="sm"
                        className="group relative overflow-hidden border-2 border-accent/30 text-accent hover:text-white hover:border-accent transition-all duration-300 shadow-sm hover:shadow-lg"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent to-theme-base opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative flex items-center">
                          <Plus className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                          Add Another Magazine
                        </div>
                      </Button>
                    </div>

                    {additionalMagazines.map((additionalMag, index) => (
                      <div
                        key={additionalMag.id}
                        className="relative group p-8 bg-gradient-to-br from-muted/40 via-muted/30 to-background/50 rounded-2xl border-2 border-border/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-accent/30"
                      >
                        <div className="absolute top-4 right-4">
                          <Button
                            type="button"
                            onClick={() => removeAdditionalMagazine(additionalMag.id)}
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-accent to-theme-base rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">{index + 2}</span>
                              </div>
                              <Label className="text-foreground font-semibold text-base">
                                Select Magazine *
                              </Label>
                            </div>
                            <Select
                              value={additionalMag.magazineName}
                              onValueChange={(value) => updateAdditionalMagazine(additionalMag.id, 'magazineName', value)}
                            >
                              <SelectTrigger className="h-14 text-base bg-background/80 backdrop-blur-sm border-2 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 shadow-sm">
                                <SelectValue placeholder="Choose a magazine" />
                              </SelectTrigger>
                              <SelectContent className="bg-popover/95 backdrop-blur-sm border-border/50 shadow-xl">
                                {availableMagazines.map((magazine) => (
                                  <SelectItem key={magazine} value={magazine} className="text-base py-4 hover:bg-accent/10 focus:bg-accent/10">
                                    {magazine}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-4">
                            <Label className="text-foreground font-semibold text-base">
                              Number of Copies *
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              value={additionalMag.numberOfCopies}
                              onChange={(e) => updateAdditionalMagazine(additionalMag.id, 'numberOfCopies', e.target.value)}
                              className="h-14 text-base bg-background/80 backdrop-blur-sm border-2 border-border/50 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-200 shadow-sm"
                              placeholder="How many copies?"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="w-full bg-gradient-to-r from-accent to-theme-base text-white shadow-xl hover:shadow-2xl transition-all duration-300 h-16 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                        Submitting Request...
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6 mr-3" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MagazineRequestPage;