import React from "react";
import { Button } from "./ui/button";
import { Heart, BookOpen } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Hero Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-muted rounded-full px-4 py-2 border">
              <div className="h-2 w-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground">Transforming Lives Through Faith</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                Evangelism &{" "}
                <span className="text-primary">
                  Discipleship
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Equipping believers to share the Gospel effectively, fostering spiritual growth and igniting passion for God's purpose across communities and nations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="font-semibold bg-[#007BFF]">
                Explore Ministry
              </Button>
              <Button size="lg" variant="outline" className="font-semibold">
                Watch Jesus Film
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Lives Transformed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Discipleship Groups</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-muted-foreground">Communities Reached</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-hover">
              <img 
                src={require("../assets/images/gallery/EvangelismDiscipleship.jpg")}
                alt="Ministry and Discipleship" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground rounded-xl p-3 shadow-card">
              <Heart className="h-6 w-6" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground rounded-xl p-3 shadow-card border">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
