import React from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { BookOpen, Users, Heart, Play } from "lucide-react";

const ImpactSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 space-y-20">
        
        {/* Publications Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#2194D1] font-semibold">
                <BookOpen className="h-5 w-5" />
                <span>Hope Publications</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Spreading{" "}
                <span className="text-[#2194D1]">
                  Hope & Faith
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Through Hope Publications, we distribute free magazines and books to children and adults, 
                spreading messages of hope and faith across communities worldwide.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-6 bg-card rounded-xl shadow-card border">
                <div className="text-3xl font-bold text-[#2194D1] mb-2">100+</div>
                <div className="text-sm text-muted-foreground">Books Published</div>
              </div>
              <div className="text-center p-6 bg-card rounded-xl shadow-card border">
                <div className="text-3xl font-bold text-[#2194D1] mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Magazine Issues</div>
              </div>
              <div className="text-center p-6 bg-card rounded-xl shadow-card border">
                <div className="text-3xl font-bold text-[#2194D1] mb-2">1K+</div>
                <div className="text-sm text-muted-foreground">Copies Distributed</div>
              </div>
            </div>

            <Button size="lg" className="font-semibold">
              Browse Publications
            </Button>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img 
                src={require("../assets/images/resources/featured-cause.jpg")}
                alt="Hope Publications" 
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Discipleship Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img 
                src={require("../assets/images/resources/Discipleship.jpg")}   
                alt="Discipleship Training" 
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>

          <div className="space-y-8 lg:order-2">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-[#2194D1] font-semibold">
                <Users className="h-5 w-5" />
                <span>Discipleship Training</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Building{" "}
                <span className="text-[#2194D1]">
                  Strong Leaders
                </span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Equipping churches for impactful leadership and preparing courageous leaders 
                through intentional discipleship and spiritual maturity programs.
              </p>
            </div>

            <div className="grid gap-6">
              <Card className="bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Leadership Development</h4>
                    <p className="text-sm text-muted-foreground">Comprehensive training for emerging leaders</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border shadow-card hover:shadow-hover transition-shadow duration-300">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#2194D1] text-white rounded-xl flex items-center justify-center">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Spiritual Maturity</h4>
                    <p className="text-sm text-muted-foreground">Guided growth through intentional discipleship</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button size="lg" variant="outline" className="font-semibold">
              Join Training Program
            </Button>
          </div>
        </div>

        {/* Jesus Film Section */}
        <div className="text-center space-y-12">
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-[#2194D1] font-semibold">
              <Play className="h-5 w-5" />
              <span>The Jesus Film</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Experience the{" "}
              <span className="text-[#2194D1]">
                Story of Jesus
              </span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              We bring the powerful story of Jesus to life through accessible screenings, 
              particularly for communities with limited literacy or for children.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Heart, title: "Accessible to All", desc: "Simple, visual storytelling" },
              { icon: Users, title: "Community Impact", desc: "Transforming entire communities" },
              { icon: BookOpen, title: "Life Transformation", desc: "Powerful message of hope" }
            ].map((feature, index) => (
              <Card key={index} className="bg-card border shadow-card hover:shadow-hover transition-all duration-300 group">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="h-16 w-16 bg-[#2194D1] text-white rounded-xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-200">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button size="lg" variant="outline" className="font-semibold">
            Watch Jesus Film
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
