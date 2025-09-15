import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useCourses } from '../context/CourseContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, DollarSign, GraduationCap, MapPin, Users, Star, Award } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';
import StickyHeader from '../components/header/sticky-header';
import HeaderTwo from '../components/header/header-two';
import Footer from '../components/footer';

const EnrollmentPage = ({ location }) => {
    const searchParams = new URLSearchParams(location?.search || '');
    const { toast } = useToast();
    const { courses, addEnrollment } = useCourses();

    const courseId = searchParams.get('courseId');
    const course = courseId ? courses.find(c => c.id === courseId) : null;

    const [formData, setFormData] = useState({
        courseId: courseId || '',
        studentName: '',
        studentEmail: '',
        studentPhone: '',
        startDate: '',
        additionalInfo: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (courseId && course) {
            setFormData(prev => ({
                ...prev,
                courseId: courseId,
                startDate: course.startDate
            }));
        }
    }, [courseId, course]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.courseId) newErrors.courseId = 'Please select a course';
        if (!formData.studentName.trim()) newErrors.studentName = 'Name is required';
        if (!formData.studentEmail.trim()) newErrors.studentEmail = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) newErrors.studentEmail = 'Invalid email format';
        if (!formData.studentPhone.trim()) newErrors.studentPhone = 'Phone number is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const enrollmentData = {
                courseId: formData.courseId,
                studentName: formData.studentName,
                studentEmail: formData.studentEmail,
                studentPhone: formData.studentPhone,
                startDate: formData.startDate,
                additionalInfo: formData.additionalInfo
            };

            const result = await addEnrollment(enrollmentData);

            toast({
                title: "✅ Enrollment Added Successfully!",
                description: `Your enrollment for "${course?.title}" has been submitted successfully. You will receive a confirmation email at ${formData.studentEmail} shortly. Your enrollment ID is: ${result.id || result._id}`,
                duration: 8000,
            });

            // Reset form
            setFormData({
                courseId: '',
                studentName: '',
                studentEmail: '',
                studentPhone: '',
                startDate: '',
                additionalInfo: ''
            });

            // Navigate after a short delay to let user see the success message
            setTimeout(() => {
                navigate('/courses');
            }, 3000);
        } catch (error) {
            console.error('Enrollment error:', error);
            
            // Extract specific error message from API response
            let errorMessage = "Failed to submit enrollment. Please check your information and try again.";
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast({
                title: "❌ Enrollment Failed",
                description: errorMessage,
                variant: "destructive",
                duration: 6000,
            });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const formatPrice = (price, currency) => {
        return price === 0 ? 'Free' : `${price.toLocaleString()} ${currency}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Layout>
            <HeaderTwo/>
            <StickyHeader/>
            <div className="min-h-screen bg-background">
                {/* Hero Section */}
                <section className="bg-foreground py-16 md:py-24">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Course Enrollment
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
                                Take the next step in your theological journey. Enroll in world-class courses
                                from accredited institutions and expert instructors.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Enrollment Form */}
                            <Card className="shadow-sm">
                                <CardHeader className="pb-6">
                                    <CardTitle className="text-2xl font-bold text-[#2194D1]">
                                        Student Information
                                    </CardTitle>
                                    <p className="text-muted-foreground">
                                        Please fill in your details to complete the enrollment process.
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Course Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="course">Select Course *</Label>
                                            <Select
                                                value={formData.courseId}
                                                onValueChange={(value) => {
                                                    handleInputChange('courseId', value);
                                                    const selectedCourse = courses.find(c => c.id === value);
                                                    if (selectedCourse) {
                                                        setFormData(prev => ({ ...prev, startDate: selectedCourse.startDate }));
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className={errors.courseId ? 'border-destructive' : ''}>
                                                    <SelectValue placeholder="Choose a course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {courses.map((course) => (
                                                        <SelectItem key={course.id} value={course.id}>
                                                            {course.title} - {formatPrice(course.price, course.currency)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.courseId && <p className="text-sm text-destructive">{errors.courseId}</p>}
                                        </div>

                                        {/* Student Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={formData.studentName}
                                                onChange={(e) => handleInputChange('studentName', e.target.value)}
                                                className={errors.studentName ? 'border-destructive' : ''}
                                                placeholder="Enter your full name"
                                            />
                                            {errors.studentName && <p className="text-sm text-destructive">{errors.studentName}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.studentEmail}
                                                onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                                                className={errors.studentEmail ? 'border-destructive' : ''}
                                                placeholder="Enter your email address"
                                            />
                                            {errors.studentEmail && <p className="text-sm text-destructive">{errors.studentEmail}</p>}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formData.studentPhone}
                                                onChange={(e) => handleInputChange('studentPhone', e.target.value)}
                                                className={errors.studentPhone ? 'border-destructive' : ''}
                                                placeholder="Enter your phone number"
                                            />
                                            {errors.studentPhone && <p className="text-sm text-destructive">{errors.studentPhone}</p>}
                                        </div>

                                        {/* Start Date */}
                                        <div className="space-y-2">
                                            <Label htmlFor="startDate">Preferred Start Date *</Label>
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => handleInputChange('startDate', e.target.value)}
                                                className={errors.startDate ? 'border-destructive' : ''}
                                            />
                                            {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
                                        </div>

                                        {/* Additional Information */}
                                        <div className="space-y-2">
                                            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                                            <Textarea
                                                id="additionalInfo"
                                                value={formData.additionalInfo}
                                                onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
                                                placeholder="Any additional information or special requirements..."
                                                rows={4}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-[#2194D1] hover:bg-[#2194D1]/90 text-[#2194D1]-foreground"
                                            size="lg"
                                        >
                                            Submit Enrollment
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Course Summary */}
                            {course && (
                                <Card className="shadow-sm h-fit sticky top-28">
                                    <CardHeader className="pb-6">
                                        <CardTitle className="text-2xl font-bold text-[#2194D1]">
                                            Course Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Course Hero */}
                                        <div className="bg-gray-200 rounded-lg p-6">
                                            <h3 className="font-bold text-xl mb-3 text-[#2194D1]">{course.title}</h3>
                                            <p className="text-foreground text-sm mb-4 leading-relaxed">{course.shortDescription}</p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <Badge variant="secondary" className="bg-foreground text-white">
                                                    {course.category}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {course.level}
                                                </Badge>
                                                <Badge variant="outline">
                                                    {course.format}
                                                </Badge>
                                            </div>

                                            {/* Rating and Enrollment Stats */}
                                            <div className="flex items-center justify-between p-3 bg-background rounded-lg border">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold text-sm">{course.averageRating.toFixed(1)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span className="text-sm font-medium">{course.totalEnrollments} enrolled</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Details */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-200">
                                                <GraduationCap className="h-5 w-5 text-[#2194D1]" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{course.instructor}</p>
                                                    <p className="text-sm text-muted-foreground">Course Instructor</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-200">
                                                <Award className="h-5 w-5 text-[#2194D1]" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{course.institution.name}</p>
                                                    <p className="text-sm text-muted-foreground">{course.institution.location}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-200">
                                                <Clock className="h-5 w-5 text-[#2194D1]" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{course.duration}</p>
                                                    <p className="text-sm text-muted-foreground">Course Duration</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-200">
                                                <Calendar className="h-5 w-5 text-[#2194D1]" />
                                                <div className="flex-1">
                                                    <p className="font-medium">{formatDate(course.startDate)}</p>
                                                    <p className="text-sm text-muted-foreground">Course Start Date</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price and Availability */}
                                        <div className="p-4 bg-gray-200 rounded-lg border">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-5 w-5 text-[#2194D1]" />
                                                    <span className="font-bold text-2xl text-[#2194D1]">
                                                        {formatPrice(course.price, course.currency)}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-full border">
                                                    {course.availableSeats} seats left
                                                </div>
                                            </div>
                                        </div>

                                        {/* What's Included */}
                                        <div className="pt-4 border-t">
                                            <h4 className="font-semibold mb-3 text-[#2194D1]">What's Included:</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {[
                                                    "Full course materials",
                                                    "Expert instruction",
                                                    course.certification,
                                                    "Student support"
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div className="w-2 h-2 bg-[#2194D1] rounded-full"></div>
                                                        <span>{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </Layout>
    );
};

export default EnrollmentPage;