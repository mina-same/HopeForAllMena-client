import React from "react";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Heart, BookOpen, Users, Target, Globe, MessageCircle } from "lucide-react";
import visionImage from "../../assets/images/resources/about-1-1.jpg";
import missionImage from "../../assets/images/resources/about-1-2.jpg";

const VisionMission = () => {
  return (
    <section className="relative py-24 bg-gray-100 overflow-hidden">
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
          <div className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-px bg-[#32669C]"></div>
            <Badge variant="outline" className="px-6 py-2 text-[#2194D1] border-[#2194D1]/20 bg-white/50 backdrop-blur-sm font-medium">
              Our Foundation
            </Badge>
            <div className="w-12 h-px bg-[#32669C]"></div>
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
            Vision & 
            <span className="block bg-gradient-to-r from-[#2194D1] to-[#32669C] bg-clip-text text-transparent">
              Mission
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering church leaders across the Middle East and North Africa to transform communities through intentional discipleship
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
                    alt="Our Vision - Transforming Communities"
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
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-[#2194D1]/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#2194D1]" />
                    </div>
                    <span className="text-[#2194D1] font-semibold tracking-wide uppercase text-sm">Our Vision</span>
                  </div>

                  {/* Enhanced Biblical Quote */}
                  <div className="relative mb-10 p-8 rounded-2xl bg-gradient-to-r from-[#32669C]/5 to-[#32669C]/10 border-l-4 border-[#32669C]">
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#32669C] rounded-full flex items-center justify-center shadow-md">
                      <MessageCircle className="w-4 h-4 text-white" />
                    </div>
                    
                    <blockquote className="text-lg text-gray-700 mb-4 italic leading-relaxed">
                      "What you have heard from me in the presence of many witnesses entrust to faithful men, who will be able to teach others also."
                    </blockquote>
                    
                    <cite className="text-[#32669C] font-semibold">
                      2 Timothy 2:2, ESV
                    </cite>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Multiplying Disciples Across Nations
                  </h3>

                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Our vision is to equip local church leaders across Egypt, the Middle East, and North Africa to become disciple-makers who multiply, establish healthy churches, and reach unreached areas—proclaiming Christ to all.
                  </p>

                  {/* Vision Statistics */}
                  <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-2 text-white/80">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span className="text-sm">Making Disciples</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span className="text-sm">Building Churches</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80">
                      <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                      <span className="text-sm">Transforming Nations</span>
                    </div>
                  </div>
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
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-[#32669C]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#32669C]" />
                    </div>
                    <span className="text-[#32669C] font-semibold tracking-wide uppercase text-sm">Our Mission</span>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    Equipping Leaders for Kingdom Impact
                  </h3>

                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    We are committed to equipping and empowering local church leaders by providing comprehensive and accessible training resources for all.
                  </p>

                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    We focus on developing a network of qualified trainers who will:
                  </p>

                  {/* Enhanced Mission Points */}
                  <div className="space-y-4 mb-8">
                    {[
                      { icon: Users, text: "Promote intentional discipleship", color: "text-blue-600" },
                      { icon: Heart, text: "Support marginalized communities", color: "text-red-500" },
                      { icon: Globe, text: "Engage their societies with the hope of Christ", color: "text-green-600" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 group/item">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center transition-colors group-hover/item:bg-primary/5">
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <span className="text-lg text-gray-700 font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 bg-gray-50 rounded-xl">
                    <p className="text-gray-700 italic text-center font-medium">
                      "Maintaining the unity of the Church as the Body of Christ"
                    </p>
                  </div>
                </div>
                
                <div className="lg:col-span-2 relative overflow-hidden order-1 lg:order-2">
                  <div className="absolute inset-0 bg-gradient-to-bl from-[#32669C]/20 via-transparent to-[#2194D1]/10 z-10"></div>
                  <img 
                    src={missionImage} 
                    alt="Our Mission - Training Leaders"
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
        </div>
      </div>
    </section>
  );
};

export default VisionMission;