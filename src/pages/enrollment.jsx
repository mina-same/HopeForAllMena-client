import React, { useState, useEffect } from 'react';
import { useCourses } from '../context/CourseContext';
import { useI18next, useTranslation, Link, navigate } from 'gatsby-plugin-react-i18next';
import { graphql } from 'gatsby';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, GraduationCap, MapPin, Users, Star, Award, User, Mail, Phone, Home, Church, BookOpen, Heart, FileText, ChevronRight, Tag } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import Layout from '../components/layout';
import StickyHeader from '../components/header/sticky-header';
import HeaderTwo from '../components/header/header-two';
import Footer from '../components/footer';
import '../styles/enrollment-rtl.css';

const EnrollmentPage = ({ location }) => {
    const searchParams = new URLSearchParams(location?.search || '');
    const { toast } = useToast();
    const { courses, addEnrollment } = useCourses();
    const { language: currentLanguage } = useI18next();
    const { t } = useTranslation('Enrollment');
    const isRTL = currentLanguage === 'ar';

    const courseId = searchParams.get('courseId');
    const course = courseId ? courses.find(c => c.id === courseId) : null;

    const [formData, setFormData] = useState({
        courseId: courseId || '',
        studentName: '',
        // Full name (4 parts)
        fullName: {
            firstName: '',
            secondName: '',
            thirdName: '',
            fourthName: ''
        },
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        studentEmail: '',
        studentPhone: '',
        highestEducation: '',
        graduationYear: '',
        currentJobOrStudy: '',
        detailedAddress: '',
        // Church information
        churchInfo: {
            churchName: '',
            denomination: '',
            pastorName: '',
            pastorPhone: '',
            sundaySchoolSupervisorName: '',
            servantPhone: ''
        },
        // Service experience
        serviceExperience: {
            currentService: '',
            currentServiceDuration: '',
            serviceSupervisor: '',
            supervisorPhone: '',
            hasServedWithChildren: false,
            serviceDuration: '',
            talentsOrSkills: ''
        },
        // Education
        hasPreviousEducation: false,
        previousEducationDetails: '',
        motivation: '',ق
        referralSource: '',
        referralSourceOther: '',
        startDate: '',
        additionalInfo: ''
    });

    const [errors, setErrors] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        if (!formData.courseId) newErrors.courseId = t('form.courseSelection.courseRequired');
        if (!formData.studentName.trim() && !formData.fullName.firstName.trim()) {
            newErrors.studentName = t('form.validation.nameRequired');
        }
        if (!formData.studentEmail.trim()) newErrors.studentEmail = t('form.personalInfo.emailRequired');
        else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) newErrors.studentEmail = t('form.personalInfo.emailInvalid');
        if (!formData.studentPhone.trim()) newErrors.studentPhone = t('form.personalInfo.phoneRequired');
        if (!formData.dateOfBirth) newErrors.dateOfBirth = t('form.personalInfo.dateOfBirthRequired');
        if (!formData.gender) newErrors.gender = t('form.personalInfo.genderRequired');
        if (!formData.churchInfo.churchName.trim()) newErrors.churchName = t('form.churchInfo.churchNameRequired');
        if (!formData.churchInfo.pastorName.trim()) newErrors.pastorName = t('form.churchInfo.pastorNameRequired');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Build full name from parts or use studentName
            const fullName = formData.fullName.firstName
                ? `${formData.fullName.firstName} ${formData.fullName.secondName || ''} ${formData.fullName.thirdName || ''} ${formData.fullName.fourthName || ''}`.trim()
                : formData.studentName;

            const enrollmentData = {
                courseId: formData.courseId,
                studentName: fullName || formData.studentName,
                fullName: formData.fullName,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                maritalStatus: formData.maritalStatus,
                studentEmail: formData.studentEmail,
                studentPhone: formData.studentPhone,
                highestEducation: formData.highestEducation,
                graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
                currentJobOrStudy: formData.currentJobOrStudy,
                detailedAddress: formData.detailedAddress,
                churchInfo: formData.churchInfo,
                serviceExperience: formData.serviceExperience,
                hasPreviousEducation: formData.hasPreviousEducation,
                previousEducationDetails: formData.previousEducationDetails,
                motivation: formData.motivation,
                referralSource: formData.referralSource,
                referralSourceOther: formData.referralSourceOther,
                startDate: formData.startDate,
                additionalInfo: formData.additionalInfo
            };

            const result = await addEnrollment(enrollmentData);

            const courseTitle = isRTL
                ? (course?.titleAr || course?.title)
                : (course?.titleEn || course?.title);

            toast({
                title: t('success.title'),
                description: t('success.description', {
                    courseTitle,
                    email: formData.studentEmail,
                    enrollmentId: result.id || result._id
                }),
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
            let errorMessage = t('error.description');

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            toast({
                title: t('error.title'),
                description: errorMessage,
                variant: "destructive",
                duration: 6000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleNestedInputChange = (parentField, childField, value) => {
        setFormData(prev => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [childField]: value
            }
        }));
        if (errors[childField]) {
            setErrors(prev => ({ ...prev, [childField]: '' }));
        }
    };

    const formSections = [
        { id: 0, title: t('form.sections.courseSelection'), icon: BookOpen },
        { id: 1, title: t('form.sections.personalInfo'), icon: User },
        { id: 2, title: t('form.sections.churchInfo'), icon: Church },
        { id: 3, title: t('form.sections.serviceExperience'), icon: Heart },
        { id: 4, title: t('form.sections.educationMotivation'), icon: GraduationCap }
    ];

    const formatPrice = (price, currency) => {
        return price === 0 ? t('courseSummary.free') : `${price.toLocaleString()} ${currency}`;
    };

    const formatDate = (dateString) => {
        const locale = isRTL ? 'ar-EG' : 'en-US';
        return new Date(dateString).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const sectionVariants = {
        hidden: { opacity: 0, x: isRTL ? 20 : -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    return (
        <Layout>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) rotate(12deg); }
                    50% { transform: translateY(-10px) rotate(12deg); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
                .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}} />
            <HeaderTwo />
            <StickyHeader />
            <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 ${isRTL ? 'enrollment-rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-[#2194D1] via-[#1e7bb8] to-[#1a6ba0] py-24 md:py-32 overflow-hidden">
                    {/* Dynamic Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
                        <div className="absolute -bottom-24 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

                        {/* Decorative Shapes */}
                        <div className="absolute top-20 right-[10%] w-12 h-12 border-2 border-white/20 rounded-lg rotate-12 animate-bounce-slow"></div>
                        <div className="absolute bottom-20 left-[15%] w-16 h-16 border-2 border-white/10 rounded-full animate-float"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className={`max-w-4xl mx-auto`}>
                            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-8 leading-[1.1] text-center`}>
                                <span className="inline-block relative">
                                    {t('title')}
                                </span>
                            </h1>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="max-w-6xl mx-auto">

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                            {/* Enrollment Form - Takes 2 columns */}
                            <div className="lg:col-span-2">
                                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                                    <CardHeader className="pb-6 bg-white border-b border-slate-100">
                                        <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row' : ''}`}>
                                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row' : ''}`}>
                                                <div className="p-2 bg-blue-50 rounded-lg">
                                                    <FileText className="h-5 w-5 text-[#2194D1]" />
                                                </div>
                                                <div>
                                                    <CardTitle className={`text-xl font-bold text-slate-900 ${isRTL ? 'font-arabic' : ''}`}>
                                                        {t('form.title')}
                                                    </CardTitle>
                                                    <p className={`text-slate-500 text-xs mt-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                        {t('form.subtitle')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Simple Stepper */}
                                        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                            {formSections.map((section, idx) => {
                                                const isActive = currentSection === section.id;
                                                const isCompleted = currentSection > section.id;
                                                return (
                                                    <React.Fragment key={section.id}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentSection(section.id)}
                                                            className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full transition-all duration-200 ${
                                                                isActive 
                                                                    ? 'bg-[#2194D1] text-white shadow-sm' 
                                                                    : isCompleted 
                                                                        ? 'text-[#2194D1] bg-blue-50/50 hover:bg-blue-100' 
                                                                        : 'text-slate-400 bg-slate-50 hover:bg-slate-100'
                                                            }`}
                                                        >
                                                            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                                                                isActive ? 'bg-white text-[#2194D1]' : 'border border-current'
                                                            }`}>
                                                                {isCompleted ? '✓' : idx + 1}
                                                            </span>
                                                            <span className="text-xs font-bold">{section.title}</span>
                                                        </button>
                                                        {idx < formSections.length - 1 && (
                                                            <div className="w-4 h-px bg-slate-200 shrink-0" />
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-8 px-8 pb-8">
                                        <form onSubmit={handleSubmit} className="space-y-8">
                                            {/* Section 0: Course Selection */}
                                            {currentSection === 0 && (
                                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                    <div className={`flex items-center gap-5 pb-6 border-b border-slate-100 ${isRTL ? 'flex-row' : ''}`}>
                                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                                            <BookOpen className="h-7 w-7 text-[#2194D1]" />
                                                        </div>
                                                        <div>
                                                            <h3 className={`text-2xl font-black text-slate-800 tracking-tight ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                                                                {t('form.courseSelection.title')}
                                                            </h3>
                                                            <p className={`text-slate-500 text-sm mt-1 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                {isRTL ? 'ابدأ رحلتك التعليمية باختيار البرنامج المناسب' : 'Start your educational journey by choosing the right program'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Label htmlFor="course" className={`text-slate-700 font-bold text-sm block mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                                                            {t('form.courseSelection.courseLabel')} <span className="text-red-500">*</span>
                                                        </Label>
                                                        <div className="relative group">
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
                                                                <SelectTrigger className={`h-14 bg-slate-50 border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] transition-all group-hover:bg-white ${errors.courseId ? 'border-red-500' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                                                    <SelectValue placeholder={t('form.courseSelection.coursePlaceholder')} />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-slate-200 shadow-2xl">
                                                                    {courses.map((course) => {
                                                                        const courseTitle = isRTL
                                                                            ? (course.titleAr || course.title)
                                                                            : (course.titleEn || course.title);
                                                                        return (
                                                                            <SelectItem key={course.id} value={course.id} className="py-3 focus:bg-blue-50 font-medium">
                                                                                <div className={`flex items-center justify-between w-full gap-4 ${isRTL ? 'flex-row' : ''}`}>
                                                                                    <span>{courseTitle}</span>
                                                                                    <span className="text-[#2194D1] font-bold text-xs bg-blue-50 px-2 py-0.5 rounded-full">{formatPrice(course.price, course.currency)}</span>
                                                                                </div>
                                                                            </SelectItem>
                                                                        );
                                                                    })}
                                                                </SelectContent>
                                                            </Select>
                                                            {errors.courseId && <p className={`text-xs text-red-500 mt-2 font-bold ${isRTL ? 'text-right' : 'text-left'}`}>{errors.courseId}</p>}
                                                        </div>
                                                    </div>

                                                    <div className={`flex pt-6 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                                                        <Button
                                                            type="button"
                                                            onClick={() => setCurrentSection(1)}
                                                            className={`h-14 px-10 bg-gradient-to-r from-[#2194D1] to-[#1e7bb8] hover:shadow-xl hover:shadow-[#2194D1]/20 rounded-2xl text-base font-bold transition-all duration-300 transform hover:translate-y-[-2px] ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />
                                                                    {t('form.courseSelection.nextButton')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {t('form.courseSelection.nextButton')}
                                                                    <ChevronRight className="ml-3 h-5 w-5" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Section 1: Personal Information */}
                                            {currentSection === 1 && (
                                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                    <div className={`flex items-center gap-5 pb-6 border-b border-slate-100 ${isRTL ? 'flex-row' : ''}`}>
                                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                                            <User className="h-7 w-7 text-[#2194D1]" />
                                                        </div>
                                                        <div>
                                                            <h3 className={`text-2xl font-black text-slate-800 tracking-tight ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                                                                {t('form.personalInfo.title')}
                                                            </h3>
                                                            <p className={`text-slate-500 text-sm mt-1 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                {isRTL ? 'أدخل بياناتك الشخصية للتواصل معك' : 'Enter your personal information to contact you'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50/50 p-6 rounded-3xl space-y-6 border border-slate-100">
                                                        <h4 className={`text-sm font-black text-slate-400 uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'}`}>
                                                            {isRTL ? 'الاسم بالكامل' : 'Full Name'}
                                                        </h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                            {[
                                                                { field: 'firstName', label: t('form.personalInfo.firstName'), req: true },
                                                                { field: 'secondName', label: t('form.personalInfo.secondName') },
                                                                { field: 'thirdName', label: t('form.personalInfo.thirdName') },
                                                                { field: 'fourthName', label: t('form.personalInfo.fourthName') }
                                                            ].map((input) => (
                                                                <div key={input.field} className="space-y-2">
                                                                    <Label className={`text-xs font-bold text-slate-600 ${isRTL ? 'text-right block' : 'text-left block'}`}>{input.label} {input.req && '*'}</Label>
                                                                    <Input
                                                                        value={formData.fullName[input.field]}
                                                                        onChange={(e) => handleNestedInputChange('fullName', input.field, e.target.value)}
                                                                        placeholder={input.label}
                                                                        className={`h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] ${input.field === 'firstName' && errors.studentName ? 'border-red-500' : ''}`}
                                                                        dir={isRTL ? 'rtl' : 'ltr'}
                                                                    />
                                                                    {input.field === 'firstName' && errors.studentName && <p className={`text-xs text-red-500 font-bold mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.studentName}</p>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="dateOfBirth" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.dateOfBirth')} *</Label>
                                                            <Input
                                                                id="dateOfBirth"
                                                                type="date"
                                                                value={formData.dateOfBirth}
                                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                                className={`h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                            {errors.dateOfBirth && <p className={`text-xs text-red-500 font-bold mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.dateOfBirth}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="gender" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.gender')} *</Label>
                                                            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                                                                <SelectTrigger className={`h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] ${errors.gender ? 'border-red-500' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                                                                    <SelectValue placeholder={t('form.personalInfo.genderPlaceholder')} />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl shadow-xl">
                                                                    <SelectItem value="male">{t('form.personalInfo.male')}</SelectItem>
                                                                    <SelectItem value="female">{t('form.personalInfo.female')}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            {errors.gender && <p className={`text-xs text-red-500 font-bold mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.gender}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="maritalStatus" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.maritalStatus')}</Label>
                                                            <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                                                                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]" dir={isRTL ? 'rtl' : 'ltr'}>
                                                                    <SelectValue placeholder={t('form.personalInfo.maritalStatusPlaceholder')} />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl shadow-xl">
                                                                    <SelectItem value="single">{t('form.personalInfo.single')}</SelectItem>
                                                                    <SelectItem value="married">{t('form.personalInfo.married')}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="highestEducation" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.highestEducation')}</Label>
                                                            <Input
                                                                id="highestEducation"
                                                                value={formData.highestEducation}
                                                                onChange={(e) => handleInputChange('highestEducation', e.target.value)}
                                                                placeholder={t('form.personalInfo.highestEducationPlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="graduationYear" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.graduationYear')}</Label>
                                                            <Input
                                                                id="graduationYear"
                                                                type="number"
                                                                value={formData.graduationYear}
                                                                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                                                                placeholder={t('form.personalInfo.graduationYearPlaceholder')}
                                                                min="1900"
                                                                max={new Date().getFullYear()}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="currentJobOrStudy" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.currentJob')}</Label>
                                                            <Input
                                                                id="currentJobOrStudy"
                                                                value={formData.currentJobOrStudy}
                                                                onChange={(e) => handleInputChange('currentJobOrStudy', e.target.value)}
                                                                placeholder={t('form.personalInfo.currentJobPlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="email" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.email')} *</Label>
                                                            <div className="relative">
                                                                <Mail className={`absolute top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 ${isRTL ? 'right-4' : 'left-4'}`} />
                                                                <Input
                                                                    id="email"
                                                                    type="email"
                                                                    value={formData.studentEmail}
                                                                    onChange={(e) => handleInputChange('studentEmail', e.target.value)}
                                                                    className={`h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] ${isRTL ? 'pr-11' : 'pl-11'} ${errors.studentEmail ? 'border-red-500' : ''}`}
                                                                    placeholder={t('form.personalInfo.emailPlaceholder')}
                                                                    dir={isRTL ? 'rtl' : 'ltr'}
                                                                />
                                                            </div>
                                                            {errors.studentEmail && <p className={`text-xs text-red-500 font-bold mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.studentEmail}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label htmlFor="phone" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.phone')} *</Label>
                                                            <div className="relative">
                                                                <Phone className={`absolute top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 ${isRTL ? 'right-4' : 'left-4'}`} />
                                                                <Input
                                                                    id="phone"
                                                                    type="tel"
                                                                    value={formData.studentPhone}
                                                                    onChange={(e) => handleInputChange('studentPhone', e.target.value)}
                                                                    className={`h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] ${isRTL ? 'pr-11' : 'pl-11'} ${errors.studentPhone ? 'border-red-500' : ''}`}
                                                                    placeholder={t('form.personalInfo.phonePlaceholder')}
                                                                    dir={isRTL ? 'rtl' : 'ltr'}
                                                                />
                                                            </div>
                                                            {errors.studentPhone && <p className={`text-xs text-red-500 font-bold mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.studentPhone}</p>}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="detailedAddress" className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.personalInfo.address')}</Label>
                                                        <Textarea
                                                            id="detailedAddress"
                                                            value={formData.detailedAddress}
                                                            onChange={(e) => handleInputChange('detailedAddress', e.target.value)}
                                                            placeholder={t('form.personalInfo.addressPlaceholder')}
                                                            rows={3}
                                                            className="bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                            dir={isRTL ? 'rtl' : 'ltr'}
                                                        />
                                                    </div>

                                                    <div className={`flex flex-col md:flex-row justify-between gap-4 pt-8 ${isRTL ? 'md:flex-row' : ''}`}>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => setCurrentSection(0)}
                                                            className={`h-14 px-8 text-slate-500 hover:text-slate-800 font-bold rounded-2xl ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() => setCurrentSection(2)}
                                                            className={`h-14 px-10 bg-gradient-to-r from-[#2194D1] to-[#1e7bb8] hover:shadow-xl hover:shadow-[#2194D1]/20 rounded-2xl text-base font-bold transition-all duration-300 transform hover:translate-y-[-2px] ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />
                                                                    {t('form.personalInfo.nextButton')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {t('form.personalInfo.nextButton')}
                                                                    <ChevronRight className="ml-3 h-5 w-5" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Section 2: Church Information */}
                                            {currentSection === 2 && (
                                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                    <div className={`flex items-center gap-5 pb-6 border-b border-slate-100 ${isRTL ? 'flex-row' : ''}`}>
                                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                                            <Church className="h-7 w-7 text-[#2194D1]" />
                                                        </div>
                                                        <div>
                                                            <h3 className={`text-2xl font-black text-slate-800 tracking-tight ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                                                                {t('form.churchInfo.title')}
                                                            </h3>
                                                            <p className={`text-slate-500 text-sm mt-1 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                {isRTL ? 'بيانات الكنيسة التي تخدم بها' : 'Information about the church you serve in'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.churchInfo.churchName')} *</Label>
                                                            <Input
                                                                value={formData.churchInfo.churchName}
                                                                onChange={(e) => handleNestedInputChange('churchInfo', 'churchName', e.target.value)}
                                                                className={`h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] ${errors.churchName ? 'border-red-500' : ''}`}
                                                                placeholder={t('form.churchInfo.churchNamePlaceholder')}
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                            {errors.churchName && <p className={`text-xs text-red-500 font-bold mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.churchName}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.churchInfo.denomination')}</Label>
                                                            <Input
                                                                value={formData.churchInfo.denomination}
                                                                onChange={(e) => handleNestedInputChange('churchInfo', 'denomination', e.target.value)}
                                                                placeholder={t('form.churchInfo.denominationPlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.churchInfo.pastorName')} *</Label>
                                                            <Input
                                                                value={formData.churchInfo.pastorName}
                                                                onChange={(e) => handleNestedInputChange('churchInfo', 'pastorName', e.target.value)}
                                                                className={`h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1] ${errors.pastorName ? 'border-red-500' : ''}`}
                                                                placeholder={t('form.churchInfo.pastorNamePlaceholder')}
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                            {errors.pastorName && <p className={`text-xs text-red-500 font-bold mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.pastorName}</p>}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.churchInfo.pastorPhone')}</Label>
                                                            <Input
                                                                value={formData.churchInfo.pastorPhone}
                                                                onChange={(e) => handleNestedInputChange('churchInfo', 'pastorPhone', e.target.value)}
                                                                placeholder={t('form.churchInfo.pastorPhonePlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.churchInfo.sundaySchoolSupervisor')}</Label>
                                                            <Input
                                                                value={formData.churchInfo.sundaySchoolSupervisorName}
                                                                onChange={(e) => handleNestedInputChange('churchInfo', 'sundaySchoolSupervisorName', e.target.value)}
                                                                placeholder={t('form.churchInfo.sundaySchoolSupervisorPlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.churchInfo.servantPhone')}</Label>
                                                            <Input
                                                                value={formData.churchInfo.servantPhone}
                                                                onChange={(e) => handleNestedInputChange('churchInfo', 'servantPhone', e.target.value)}
                                                                placeholder={t('form.churchInfo.servantPhonePlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className={`flex flex-col md:flex-row justify-between gap-4 pt-8 ${isRTL ? 'md:flex-row' : ''}`}>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => setCurrentSection(1)}
                                                            className={`h-14 px-8 text-slate-500 hover:text-slate-800 font-bold rounded-2xl ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() => setCurrentSection(3)}
                                                            className={`h-14 px-10 bg-gradient-to-r from-[#2194D1] to-[#1e7bb8] hover:shadow-xl hover:shadow-[#2194D1]/20 rounded-2xl text-base font-bold transition-all duration-300 transform hover:translate-y-[-2px] ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />
                                                                    {t('form.churchInfo.nextButton')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {t('form.churchInfo.nextButton')}
                                                                    <ChevronRight className="ml-3 h-5 w-5" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Section 3: Service Experience */}
                                            {currentSection === 3 && (
                                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                    <div className={`flex items-center gap-5 pb-6 border-b border-slate-100 ${isRTL ? 'flex-row' : ''}`}>
                                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                                            <Heart className="h-7 w-7 text-[#2194D1]" />
                                                        </div>
                                                        <div>
                                                            <h3 className={`text-2xl font-black text-slate-800 tracking-tight ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                                                                {t('form.serviceExperience.title')}
                                                            </h3>
                                                            <p className={`text-slate-500 text-sm mt-1 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                {isRTL ? 'خبراتك في مجال الخدمة' : 'Your service experience details'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.serviceExperience.currentService')}</Label>
                                                        <Textarea
                                                            value={formData.serviceExperience.currentService}
                                                            onChange={(e) => handleNestedInputChange('serviceExperience', 'currentService', e.target.value)}
                                                            placeholder={t('form.serviceExperience.currentServicePlaceholder')}
                                                            rows={3}
                                                            className="bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                            dir={isRTL ? 'rtl' : 'ltr'}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.serviceExperience.currentServiceDuration')}</Label>
                                                            <Input
                                                                value={formData.serviceExperience.currentServiceDuration}
                                                                onChange={(e) => handleNestedInputChange('serviceExperience', 'currentServiceDuration', e.target.value)}
                                                                placeholder={t('form.serviceExperience.currentServiceDurationPlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.serviceExperience.servedWithChildren')}</Label>
                                                            <Select
                                                                value={formData.serviceExperience.hasServedWithChildren ? 'yes' : 'no'}
                                                                onValueChange={(value) => handleNestedInputChange('serviceExperience', 'hasServedWithChildren', value === 'yes')}
                                                            >
                                                                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]" dir={isRTL ? 'rtl' : 'ltr'}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl shadow-xl">
                                                                    <SelectItem value="yes">{t('form.serviceExperience.yes')}</SelectItem>
                                                                    <SelectItem value="no">{t('form.serviceExperience.no')}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.serviceExperience.serviceSupervisor')}</Label>
                                                            <Input
                                                                value={formData.serviceExperience.serviceSupervisor}
                                                                onChange={(e) => handleNestedInputChange('serviceExperience', 'serviceSupervisor', e.target.value)}
                                                                placeholder={t('form.serviceExperience.serviceSupervisorPlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.serviceExperience.supervisorPhone')}</Label>
                                                            <Input
                                                                value={formData.serviceExperience.supervisorPhone}
                                                                onChange={(e) => handleNestedInputChange('serviceExperience', 'supervisorPhone', e.target.value)}
                                                                placeholder={t('form.serviceExperience.supervisorPhonePlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                    </div>

                                                    {formData.serviceExperience.hasServedWithChildren && (
                                                        <div className="space-y-4 pt-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50 animate-in fade-in zoom-in-95 duration-300">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.serviceExperience.serviceDuration')}</Label>
                                                            <Input
                                                                value={formData.serviceExperience.serviceDuration}
                                                                onChange={(e) => handleNestedInputChange('serviceExperience', 'serviceDuration', e.target.value)}
                                                                placeholder={t('form.serviceExperience.serviceDurationPlaceholder')}
                                                                className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-4">
                                                        <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.serviceExperience.talents')}</Label>
                                                        <Textarea
                                                            value={formData.serviceExperience.talentsOrSkills}
                                                            onChange={(e) => handleNestedInputChange('serviceExperience', 'talentsOrSkills', e.target.value)}
                                                            placeholder={t('form.serviceExperience.talentsPlaceholder')}
                                                            rows={3}
                                                            className="bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                            dir={isRTL ? 'rtl' : 'ltr'}
                                                        />
                                                    </div>

                                                    <div className={`flex flex-col md:flex-row justify-between gap-4 pt-8 ${isRTL ? 'md:flex-row' : ''}`}>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => setCurrentSection(2)}
                                                            className={`h-14 px-8 text-slate-500 hover:text-slate-800 font-bold rounded-2xl ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={() => setCurrentSection(4)}
                                                            className={`h-14 px-10 bg-gradient-to-r from-[#2194D1] to-[#1e7bb8] hover:shadow-xl hover:shadow-[#2194D1]/20 rounded-2xl text-base font-bold transition-all duration-300 transform hover:translate-y-[-2px] ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />    
                                                                    {t('form.serviceExperience.nextButton')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {t('form.serviceExperience.nextButton')}
                                                                    <ChevronRight className="ml-3 h-5 w-5" />
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Section 4: Education & Motivation */}
                                            {currentSection === 4 && (
                                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                                    <div className={`flex items-center gap-5 pb-6 border-b border-slate-100 ${isRTL ? 'flex-row' : ''}`}>
                                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
                                                            <GraduationCap className="h-7 w-7 text-[#2194D1]" />
                                                        </div>
                                                        <div>
                                                            <h3 className={`text-2xl font-black text-slate-800 tracking-tight ${isRTL ? 'text-right font-arabic' : 'text-left'}`}>
                                                                {t('form.educationMotivation.title')}
                                                            </h3>
                                                            <p className={`text-slate-500 text-sm mt-1 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                                {isRTL ? 'لماذا تريد الانضمام إلينا؟' : 'Why do you want to join us?'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Selected Course Summary */}
                                                    {course && (
                                                        <div className={`bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden group ${isRTL ? 'text-right' : 'text-left'}`}>
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2194D1]/10 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                                                            <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row' : ''}`}>
                                                                <div className="p-2 bg-[#2194D1]/20 rounded-lg">
                                                                    <BookOpen className="h-5 w-5 text-[#2194D1]" />
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-400">
                                                                    {isRTL ? 'البرنامج التعليمي المختار' : 'Selected Educational Program'}
                                                                </span>
                                                            </div>
                                                            <h4 className={`text-2xl font-black text-white hover:text-[#2194D1] transition-colors ${isRTL ? 'font-arabic' : ''}`}>
                                                                {isRTL ? (course.titleAr || course.title) : (course.titleEn || course.title)}
                                                            </h4>
                                                            <div className={`flex gap-4 mt-4 ${isRTL ? 'flex-row' : ''}`}>
                                                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                                                                    <Clock className="h-3 w-3" />
                                                                    {course.totalHours} {isRTL ? 'ساعة' : 'Hours'}
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[#2194D1] text-xs font-bold">
                                                                    <Tag className="h-3 w-3" />
                                                                    {formatPrice(course.price, course.currency)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="space-y-4">
                                                        <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.educationMotivation.previousEducation')}</Label>
                                                        <Select
                                                            value={formData.hasPreviousEducation ? 'yes' : 'no'}
                                                            onValueChange={(value) => handleInputChange('hasPreviousEducation', value === 'yes')}
                                                        >
                                                            <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]" dir={isRTL ? 'rtl' : 'ltr'}>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl shadow-xl">
                                                                <SelectItem value="yes">{t('form.educationMotivation.yes')}</SelectItem>
                                                                <SelectItem value="no">{t('form.educationMotivation.no')}</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {formData.hasPreviousEducation && (
                                                        <div className="space-y-4 pt-4 animate-in fade-in zoom-in-95 duration-300">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.educationMotivation.previousEducationDetails')}</Label>
                                                            <Textarea
                                                                value={formData.previousEducationDetails}
                                                                onChange={(e) => handleInputChange('previousEducationDetails', e.target.value)}
                                                                placeholder={t('form.educationMotivation.previousEducationDetailsPlaceholder')}
                                                                rows={4}
                                                                className="bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                dir={isRTL ? 'rtl' : 'ltr'}
                                                            />
                                                        </div>
                                                    )}

                                                    <div className="space-y-4">
                                                        <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.educationMotivation.motivation')} *</Label>
                                                        <Textarea
                                                            value={formData.motivation}
                                                            onChange={(e) => handleInputChange('motivation', e.target.value)}
                                                            placeholder={t('form.educationMotivation.motivationPlaceholder')}
                                                            rows={4}
                                                            required
                                                            className="bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                            dir={isRTL ? 'rtl' : 'ltr'}
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-4">
                                                            <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.educationMotivation.referralSource')}</Label>
                                                            <Select
                                                                value={formData.referralSource}
                                                                onValueChange={(value) => handleInputChange('referralSource', value)}
                                                            >
                                                                <SelectTrigger className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]" dir={isRTL ? 'rtl' : 'ltr'}>
                                                                    <SelectValue placeholder={t('form.educationMotivation.referralSourcePlaceholder')} />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl shadow-xl">
                                                                    <SelectItem value="social_media">{t('form.educationMotivation.socialMedia')}</SelectItem>
                                                                    <SelectItem value="church_announcement">{t('form.educationMotivation.churchAnnouncement')}</SelectItem>
                                                                    <SelectItem value="friend">{t('form.educationMotivation.friend')}</SelectItem>
                                                                    <SelectItem value="other">{t('form.educationMotivation.other')}</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        {formData.referralSource === 'other' && (
                                                            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                                                                <Label className={`text-sm font-bold text-slate-700 ${isRTL ? 'text-right block' : 'text-left block'}`}>{t('form.educationMotivation.referralSourceOther')}</Label>
                                                                <Input
                                                                    value={formData.referralSourceOther}
                                                                    onChange={(e) => handleInputChange('referralSourceOther', e.target.value)}
                                                                    placeholder={t('form.educationMotivation.referralSourceOtherPlaceholder')}
                                                                    className="h-12 bg-white border-slate-200 rounded-xl focus:ring-[#2194D1]/20 focus:border-[#2194D1]"
                                                                    dir={isRTL ? 'rtl' : 'ltr'}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className={`flex flex-col md:flex-row justify-between gap-4 pt-8 border-t border-slate-100 ${isRTL ? 'md:flex-row' : ''}`}>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={() => setCurrentSection(3)}
                                                            className={`h-14 px-8 text-slate-500 hover:text-slate-800 font-bold rounded-2xl ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isRTL ? (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ChevronRight className="mr-3 h-5 w-5 rotate-180" />
                                                                    {t('form.buttons.previous')}
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className={`h-14 px-12 bg-slate-900 hover:bg-[#2194D1] text-white rounded-2xl text-base font-black transition-all duration-300 shadow-xl hover:shadow-[#2194D1]/40 transform hover:translate-y-[-4px] active:translate-y-0 ${isRTL ? 'flex-row' : ''}`}
                                                        >
                                                            {isSubmitting ? (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                                    {isRTL ? 'جاري الإرسال...' : 'Submitting...'}
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-3">
                                                                    <GraduationCap className="h-6 w-6" />
                                                                    {t('form.educationMotivation.submitButton')}
                                                                </div>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Course Summary - Takes 1 column */}
                            {course && (
                                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm h-fit sticky top-28 overflow-hidden">
                                    <CardHeader className="pb-6 bg-gradient-to-br from-[#2194D1]/5 via-blue-50/50 to-indigo-50/30 border-b border-[#2194D1]/10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-br from-[#2194D1] to-[#1e7bb8] rounded-lg shadow-lg">
                                                <Award className="h-5 w-5 text-white" />
                                            </div>
                                            <CardTitle className={`text-2xl font-bold bg-gradient-to-r from-[#2194D1] to-[#1e7bb8] bg-clip-text text-transparent ${isRTL ? 'text-right' : 'text-left'}`}>
                                                {t('courseSummary.title')}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6 p-6">
                                        {/* Course Hero with Image */}
                                        {course.imageUrl && (
                                            <div className="relative rounded-xl overflow-hidden mb-6 shadow-lg">
                                                <img
                                                    src={course.imageUrl}
                                                    alt={isRTL ? (course.titleAr || course.title) : (course.titleEn || course.title)}
                                                    className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                            </div>
                                        )}
                                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2194D1]/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>

                                            <h3 className={`font-bold text-xl mb-3 text-slate-900 group-hover:text-[#2194D1] transition-colors ${isRTL ? 'font-arabic text-right' : 'text-left'}`}>
                                                {isRTL ? (course.titleAr || course.title) : (course.titleEn || course.title)}
                                            </h3>
                                            <p className={`text-slate-500 text-sm mb-6 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                                                {isRTL
                                                    ? (course.shortDescriptionAr || course.shortDescription || course.descriptionAr?.substring(0, 150) || course.description?.substring(0, 150))
                                                    : (course.shortDescriptionEn || course.shortDescription || course.descriptionEn?.substring(0, 150) || course.description?.substring(0, 150))
                                                }
                                            </p>

                                            <div className={`flex flex-wrap gap-2 mb-6 ${isRTL ? 'flex-row' : ''}`}>
                                                <Badge className="bg-[#2194D1] text-white hover:bg-[#1e7bb8] border-0 px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-tight">
                                                    {isRTL ? (course.categoryAr || course.category) : (course.categoryEn || course.category)}
                                                </Badge>
                                                <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-tight">
                                                    {course.level}
                                                </Badge>
                                                <Badge variant="outline" className="border-emerald-100 text-emerald-600 bg-emerald-50 px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-tight">
                                                    {course.format}
                                                </Badge>
                                            </div>

                                            {/* Rating and Enrollment Stats */}
                                            <div className={`flex items-center justify-between p-4 bg-slate-50/80 rounded-xl border border-slate-100 ${isRTL ? 'flex-row' : ''}`}>
                                                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row' : ''}`}>
                                                    <div className="flex -space-x-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-3 w-3 ${star <= Math.round(course.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="font-bold text-xs text-slate-700">{course.averageRating.toFixed(1)}</span>
                                                </div>
                                                <div className={`flex items-center gap-2 text-slate-500 ${isRTL ? 'flex-row' : ''}`}>
                                                    <Users className="h-4 w-4" />
                                                    <span className="text-xs font-bold">{course.totalEnrollments} {t('courseSummary.enrolled')}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Course Details */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#2194D1]/5 to-transparent border border-[#2194D1]/10">
                                                <GraduationCap className="h-5 w-5 text-[#2194D1]" />
                                                <div className="flex-1">
                                                    <p className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                        {isRTL ? (course.instructorAr || course.instructor) : (course.instructorEn || course.instructor)}
                                                    </p>
                                                    <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                                                        {t('courseSummary.instructor')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#2194D1]/5 to-transparent border border-[#2194D1]/10">
                                                <Award className="h-5 w-5 text-[#2194D1]" />
                                                <div className="flex-1">
                                                    <p className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                        {isRTL ? (course.institution.nameAr || course.institution.name) : (course.institution.nameEn || course.institution.name)}
                                                    </p>
                                                    <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                                                        {course.institution.location || t('courseSummary.institution')}
                                                    </p>
                                                </div>
                                            </div>

                                            {course.totalHours && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#2194D1]/5 to-transparent border border-[#2194D1]/10">
                                                    <Clock className="h-5 w-5 text-[#2194D1]" />
                                                    <div className="flex-1">
                                                        <p className={`font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                                            {course.totalHours} {t('courseSummary.studyHours')}
                                                        </p>
                                                        <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>
                                                            {course.onlinePercentage && course.offlinePercentage
                                                                ? isRTL
                                                                    ? `${course.onlinePercentage}% أونلاين، ${course.offlinePercentage}% أوفلاين`
                                                                    : `${course.onlinePercentage}% Online, ${course.offlinePercentage}% Offline`
                                                                : isRTL
                                                                    ? (course.durationAr || course.duration || t('courseSummary.courseDuration'))
                                                                    : (course.durationEn || course.duration || t('courseSummary.courseDuration'))}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {course.weeklySchedule?.day && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#2194D1]/5 to-transparent border border-[#2194D1]/10">
                                                    <Calendar className="h-5 w-5 text-[#2194D1]" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{course.weeklySchedule.day} {course.weeklySchedule.startTime} - {course.weeklySchedule.endTime}</p>
                                                        <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{t('courseSummary.weeklySchedule')}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {!course.weeklySchedule?.day && course.startDate && (
                                                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[#2194D1]/5 to-transparent border border-[#2194D1]/10">
                                                    <Calendar className="h-5 w-5 text-[#2194D1]" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">{formatDate(course.startDate)}</p>
                                                        <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : 'text-left'}`}>{t('courseSummary.startDate')}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {course.diplomaLevels && course.diplomaLevels.length > 0 && (
                                                <div className="p-3 rounded-lg bg-gradient-to-r from-[#2194D1]/5 to-transparent border border-[#2194D1]/10">
                                                    <p className={`font-medium mb-2 text-[#2194D1] ${isRTL ? 'text-right' : 'text-left'}`}>{t('courseSummary.diplomaLevels')}:</p>
                                                    <div className="space-y-1">
                                                        {course.diplomaLevels.map((level, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <span className="font-semibold">{t('courseSummary.level')} {level.level}:</span> {level.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Price and Availability - High Contrast Design */}
                                        <div className="relative p-6 bg-slate-900 rounded-2xl border-0 shadow-2xl overflow-hidden group">
                                            {/* Background Accent */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2194D1]/20 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-125"></div>

                                            <div className={`relative z-10 flex flex-col gap-4`}>
                                                <div className={`flex items-center justify-between ${isRTL ? 'flex-row' : ''}`}>
                                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                                                        {isRTL ? 'إجمالي الرسوم' : 'Total Investment'}
                                                    </span>
                                                    <div className={`flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-tighter ${isRTL ? 'flex-row' : ''}`}>
                                                        <Users className="h-3 w-3" />
                                                        {course.availableSeats} {t('courseSummary.seatsLeft')}
                                                    </div>
                                                </div>

                                                <div className={`flex items-baseline gap-1 ${isRTL ? 'flex-row' : ''}`}>
                                                    <span className="text-4xl font-black text-white tracking-tighter">
                                                        {formatPrice(course.price, course.currency).split(' ')[0]}
                                                    </span>
                                                    <span className="text-lg font-bold text-[#2194D1] uppercase tracking-widest">
                                                        {formatPrice(course.price, course.currency).split(' ')[1]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </Layout>
    );
};

export default EnrollmentPage;



export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`
