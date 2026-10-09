import React from "react";
import { useTranslation, useI18next } from "gatsby-plugin-react-i18next";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Heart, BookOpen, Target, MessageCircle } from "lucide-react";
import visionImage from "../../assets/images/resources/about-1-1.jpg";
import missionImage from "../../assets/images/resources/about-1-2.jpg";

const VisionMission = () => {
  const { t } = useTranslation('About');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';

  return (
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .vision-mission h3,
          .vision-mission p,
          .vision-mission blockquote,
          .vision-mission cite {
            text-align: right;
          }
          .vision-mission .text-center,
          .vision-mission h2 {
            text-align: center !important;
          }
          .vision-mission [dir="rtl"] .space-x-2,
          .vision-mission [dir="rtl"] .space-x-3,
          .vision-mission [dir="rtl"] .space-x-4 {
            --tw-space-x-reverse: 1;
          }
        `}</style>
      )}
      <section className="vision-mission relative py-24 bg-gray-100 overflow-hidden" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#2194D1]/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-[#32669C]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-[#2194D1]/3 rounded-full blur-3xl"></div>
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #2194D1 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center justify-center space-x-2 mb-6 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
            <div className="w-12 h-px bg-[#32669C]"></div>
            <Badge variant="outline" className="px-6 py-2 text-[#2194D1] border-[#2194D1]/20 bg-white/50 backdrop-blur-sm font-medium">
              {t('visionMission.header.badge')}
            </Badge>
            <div className="w-12 h-px bg-[#32669C]"></div>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            {t('visionMission.header.title')} 
            <span className="block bg-gradient-to-r from-[#2194D1] to-[#32669C] bg-clip-text text-transparent">
              {t('visionMission.header.titleHighlight')}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('visionMission.header.description')}
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-32">
          {/* Vision Section - Enhanced Creative Layout */}
          <div className="group">
            <Card className="relative overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-700 hover:shadow-2xl">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2194D1]/20 via-transparent to-[#32669C]/10 z-10"></div>
                  <img 
                    src={visionImage} 
                    alt={t('visionMission.vision.imageAlt')}
                    className="w-full h-full object-cover min-h-[500px] transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Icon */}
                  <div className="absolute bottom-8 right-8 z-20">
                    <div className="w-14 h-14 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Heart className="w-7 h-7 text-[#2194D1]" />
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-3 p-12 lg:p-16 flex flex-col justify-center">
                  {/* Section Label */}
                  <div className={`flex items-center space-x-3 mb-8 px-2 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-[#2194D1]/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#2194D1]" />
                    </div>
                    <span className="text-[#2194D1] font-semibold tracking-wide uppercase text-sm">{t('visionMission.vision.label')}</span>
                  </div>

                  {/* Enhanced Biblical Quote */}
                  <div className="relative mb-10 p-8 rounded-2xl bg-gradient-to-r from-[#32669C]/5 to-[#32669C]/10 border-l-4 border-[#32669C]">
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#32669C] rounded-full flex items-center justify-center shadow-md">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    
                    <blockquote className="text-lg text-gray-700 mb-4 italic leading-relaxed">
                      {t('visionMission.vision.quote.text')}
                    </blockquote>
                    
                    <cite className="text-[#32669C] font-semibold">
                      {t('visionMission.vision.quote.reference')}
                    </cite>
                  </div>

                  <p className="text-xl text-gray-800 leading-loose font-medium">
                    {t('visionMission.vision.description')}
                  </p>

                </div>
              </div>
            </Card>
          </div>

          {/* Mission Section - Mirrored Creative Layout */}
          <div className="group">
            <Card className="relative overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm transition-all duration-700 hover:shadow-2xl">
              
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-3 p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
                  {/* Section Label */}
                  <div className={`flex items-center space-x-3 mb-8 px-2 ${currentLanguage === 'ar' ? 'flex-row' : ''}`}>
                    <div className="w-8 h-8 rounded-lg bg-[#32669C]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#32669C]" />
                    </div>
                    <span className="text-[#32669C] font-semibold tracking-wide uppercase text-sm">{t('visionMission.mission.label')}</span>
                  </div>

                  <p className="text-xl text-gray-800 leading-loose font-medium">
                    {t('visionMission.mission.statement')}
                  </p>
                </div>
                
                <div className="lg:col-span-2 relative overflow-hidden order-1 lg:order-2">
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#32669C]/20 via-transparent to-[#2194D1]/10 z-10"></div>
                  <img 
                    src={missionImage} 
                    alt={t('visionMission.mission.imageAlt')}
                    className="w-full h-full object-cover min-h-[500px] transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Icon */}
                  <div className="absolute bottom-8 left-8 z-20">
                    <div className="w-14 h-14 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <BookOpen className="w-7 h-7 text-[#32669C]" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Strategies */}
          <div>
            <Card className="relative overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur-sm p-12 lg:p-16">
              <div className="flex items-center space-x-3 mb-8 px-2">
                <div className="w-8 h-8 rounded-lg bg-[#32669C]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#32669C]" />
                </div>
                <span className="text-[#32669C] font-semibold tracking-wide uppercase text-sm">{t('visionMission.strategies.label')}</span>
              </div>
              <ol className="grid md:grid-cols-2 gap-x-12 gap-y-6 list-none p-0 m-0">
                {(t('visionMission.strategies.items', { returnObjects: true }) || []).map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#32669C] text-white font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-lg text-gray-800 leading-relaxed pt-1">{item}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default VisionMission;