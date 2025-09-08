import React from 'react';
import { navigate } from 'gatsby';
import { Users, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useBookstore } from '../context/BookstoreContext';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Layout from '../components/layout';
import Footer from '../components/footer';


const TrainingSelectionPage = () => {
  const { filters, setFilters } = useBookstore();

  const handleSearchChange = (search) => {
    setFilters({ search });
  };

  const handleNewTraining = () => {
    navigate('/TrainingNewRequestPage');
  };

  const handleFollowUpTraining = () => {
    navigate('/TrainingFollowUpRequestPage');
  };

  return (
    <Layout>

      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background">

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Training Selection</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
                Choose Your Training Path
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Select the option that best describes your church's training experience with Hope For All MENA
              </p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* New Training Card */}
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-primary/5 hover:shadow-glow transition-all duration-500 group cursor-pointer">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-primary" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      First Time Training
                    </h3>

                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      This is our first time requesting training from Hope For All MENA.
                      We want to start a new training program for our church.
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Complete needs assessment</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Customized training plan</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Initial consultation included</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Ongoing support & materials</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleNewTraining}
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    >
                      Start New Training
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up Training Card */}
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-accent/5 hover:shadow-glow transition-all duration-500 group cursor-pointer">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="w-8 h-8 text-accent" />
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-foreground">
                      Follow-up Training
                    </h3>

                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      We have previously received training from Hope For All MENA.
                      We need additional materials or follow-up training sessions.
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Access to advanced materials</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Trainer assignment verification</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>T-shirts & additional resources</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>Expedited processing</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleFollowUpTraining}
                      size="lg"
                      variant="outline"
                      className="w-full text-[#050517] text-accent hover:bg-[#050517] hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    >
                      Request Follow-up
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default TrainingSelectionPage;