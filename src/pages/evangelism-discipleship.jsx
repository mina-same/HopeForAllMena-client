import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Heart, Users, MessageCircle, Calendar } from "lucide-react";
import HeroSection from "../components/HeroSection";
import MinistryCard from "../components/MinistryCard";
import ImpactSection from "../components/ImpactSection";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import Footer from "../components/footer";

const EvangelismDiscipleship = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeaderTwo />
      <StickyHeader />
      {/* Hero Section */}
      <HeroSection />

      {/* Ministry Focus Areas */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Our Ministry <span className="text-primary">Focus Areas</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transforming lives through evangelism, discipleship, and community
              engagement across the MENA region and beyond.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <MinistryCard
              icon={Heart}
              title="Evangelism & Personal Ministry"
              description="Equipping and educating a new generation of believers is the key to transformative change, not only in their lives but across the world."
              features={[
                "Transformative Gospel sharing",
                "Personal ministry training",
                "Community outreach programs",
                "Cross-cultural evangelism",
              ]}
              buttonText="Explore Evangelism"
              buttonVariant="default"
            />

            <MinistryCard
              icon={Users}
              title="Spiritual Discipleship"
              description="Through personal ministry and heartfelt discipleship, we guide believers toward spiritual maturity and effective leadership."
              features={[
                "Leadership development",
                "Spiritual growth guidance",
                "Mentorship programs",
                "Church equipping",
              ]}
              buttonText="Join Discipleship"
              buttonVariant="outline"
            />
          </div>
        </div>
      </section>

      {/* Impact and Publications */}
      <ImpactSection />

      {/* Community Engagement */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 text-primary font-semibold">
              <Calendar className="h-5 w-5" />
              <span>Community Engagement</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Festivals & <span className="text-primary">Celebrations</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We actively participate in Christian festivals and celebrations,
              seizing vibrant opportunities to proclaim Jesus Christ as the hope
              of the world.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "Community Engagement",
                description:
                  "Building meaningful connections with communities during celebrations and fostering lasting relationships.",
              },
              {
                icon: MessageCircle,
                title: "Gospel Proclamation",
                description:
                  "Sharing the life-giving message of the Gospel at every opportunity through festivals and events.",
              },
              {
                icon: Heart,
                title: "Unity Building",
                description:
                  "Fostering unity and love within the global Christian community through shared celebrations.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="group hover:shadow-hover transition-all duration-300 bg-card border shadow-card"
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className="h-20 w-20 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center mx-auto group-hover:scale-105 transition-transform duration-200 shadow-card">
                    <item.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-6xl font-bold text-foreground">
                Ready to <span className="text-primary">Transform Lives?</span>
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                Join us in spreading hope, building faith, and transforming
                communities through the power of the Gospel. Your journey of
                impact starts here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="font-semibold px-8">
                Get Involved Today
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold px-8"
              >
                Contact Our Team
              </Button>
            </div>

            <div className="pt-8 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Lives Transformed
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    50+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Programs
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    25+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Communities
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    100+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Publications
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default EvangelismDiscipleship;
