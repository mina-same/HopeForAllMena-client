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

// Import magazine images
import theGreatBookImg from '../assets/images/magazines/The Great Book, the Book of Hope.jpg';
import bookOfHopeImg from '../assets/images/magazines/The Book of Hope.jpg';
import giftChangesImg from '../assets/images/magazines/The Gift That Changes Everything.jpg';
import journeyBibleImg from '../assets/images/magazines/A Journey in the World of the Bible.jpg';
import bibleChildrenImg from '../assets/images/magazines/The Bible for Children.jpg';
import pathHopeImg from '../assets/images/magazines/The Path of Hope.jpg';
import onEdgeImg from '../assets/images/magazines/On the Edge.webp';
import shepherdImg from '../assets/images/magazines/How the Shepherd Saved His Sheep.webp';
import goodNeighborImg from '../assets/images/magazines/The Good Neighbor.webp';

// Available magazines list with images
const availableMagazines = [
  {
    id: '1',
    title: 'The Great Book',
    titleAr: 'الكتاب العظيم',
    image: theGreatBookImg,
    category: 'Children'
  },
  {
    id: '2',
    title: 'The Book of Hope',
    titleAr: 'كتاب الرجاء',
    image: bookOfHopeImg,
    category: 'Devotional'
  },
  {
    id: '3',
    title: 'The Gift That Changes Everything',
    titleAr: 'الهدية التي تغير كل شيء',
    image: giftChangesImg,
    category: 'Christmas'
  },
  {
    id: '4',
    title: 'Journey in the World of the Bible',
    titleAr: 'رحلة في عالم الكتاب',
    image: journeyBibleImg,
    category: 'Children'
  },
  {
    id: '5',
    title: 'The Bible',
    titleAr: 'الكتاب المقدس',
    image: bibleChildrenImg,
    category: 'Biblical Study'
  },
  {
    id: '6',
    title: 'The Way of Hope',
    titleAr: 'طريق الرجاء',
    image: pathHopeImg,
    category: 'Youth'
  },
  {
    id: '7',
    title: 'On the Edge',
    titleAr: 'على الحافة',
    image: onEdgeImg,
    category: 'Testimony'
  },
  {
    id: '8',
    title: 'How the Shepherd Saved His Sheep',
    titleAr: 'كيف أنقذ الراعي خرافه',
    image: shepherdImg,
    category: 'Devotional'
  },
  {
    id: '9',
    title: 'The Good Neighbor',
    titleAr: 'الجار الصالح',
    image: goodNeighborImg,
    category: 'Visual'
  }
];

// Custom Magazine Select Component with Images
const MagazineSelect = ({ value, onValueChange, placeholder = "Choose a magazine", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedMagazine = availableMagazines.find(mag => mag.title === value);
  
  // Debug: Log magazine count
  React.useEffect(() => {
    console.log(`Total magazines available: ${availableMagazines.length}`);
    console.log('Available magazines:', availableMagazines.map(m => m.title));
  }, []);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 py-2 text-left bg-background border border-border/50 rounded-md focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {selectedMagazine ? (
            <>
              <img
                src={selectedMagazine.image}
                alt={selectedMagazine.title}
                className="w-8 h-8 object-cover rounded border"
                onError={(e) => {
                  console.log(`Failed to load selected image for ${selectedMagazine.title}:`, selectedMagazine.image);
                  e.target.style.display = 'none';
                }}
              />
              <div>
                <span className="text-foreground font-medium">{selectedMagazine.title}</span>
                <span className="text-xs text-muted-foreground ml-2 px-2 py-1 bg-accent/10 rounded">
                  {selectedMagazine.category}
                </span>
              </div>
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border/50 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {availableMagazines.map((magazine) => (
            <button
              key={magazine.id}
              type="button"
              onClick={() => {
                onValueChange(magazine.title);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-accent/10 focus:bg-accent/10 focus:outline-none transition-colors flex items-center gap-3 border-b border-border/20 last:border-b-0"
            >
              <img
                src={magazine.image}
                alt={magazine.title}
                className="w-10 h-10 object-cover rounded border flex-shrink-0"
                onError={(e) => {
                  console.log(`Failed to load image for ${magazine.title}:`, magazine.image);
                  e.target.style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">{magazine.title}</div>
                <div className="text-sm text-muted-foreground truncate">{magazine.titleAr}</div>
                <span className="inline-block text-xs text-muted-foreground mt-1 px-2 py-1 bg-accent/10 rounded">
                  {magazine.category}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
                      <MagazineSelect
                        value={formData.magazineName}
                        onValueChange={handleSelectChange}
                        placeholder="Choose a magazine"
                      />
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
                            <MagazineSelect
                              value={additionalMag.magazineName}
                              onValueChange={(value) => updateAdditionalMagazine(additionalMag.id, 'magazineName', value)}
                              placeholder="Choose a magazine"
                              className="bg-background/80 backdrop-blur-sm"
                            />
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