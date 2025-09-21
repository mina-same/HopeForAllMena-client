import React from 'react';
import { graphql } from 'gatsby';
import { Link, useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { Users, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useBookstore } from '../context/BookstoreContext';
import HeaderTwo from '../components/header/header-two';
import StickyHeader from '../components/header/sticky-header';
import Layout from '../components/layout';
import Footer from '../components/footer';


const TrainingSelectionPage = () => {
  const { t } = useTranslation('TrainingSelection');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  
  const { filters, setFilters } = useBookstore();

  const handleSearchChange = (search) => {
    setFilters({ search });
  };

  return (
    <Layout pageTitle={t('pageTitle')}>

      <HeaderTwo />
      <StickyHeader />
      <div className="min-h-screen bg-background" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-8">
                <GraduationCap className="w-4 h-4 text-[#2194D1]" />
                <span className="text-sm font-medium text-[#2194D1]">{t('header.badge')}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
                {t('header.title')}
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t('header.description')}
              </p>
            </div>

            {/* Selection Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* New Training Card */}
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-primary/5 hover:shadow-glow transition-all duration-500 group cursor-pointer h-full">
                <CardContent className="p-8 h-full">
                  <div className="text-center h-full flex flex-col">
                    <div className="flex-grow">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-8 h-8 text-[#2194D1]" />
                      </div>

                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        {t('newTraining.title')}
                      </h3>

                      <p className="text-muted-foreground mb-8 leading-relaxed">
                        {t('newTraining.description')}
                      </p>

                      {/* <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('newTraining.features.assessment')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('newTraining.features.customPlan')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('newTraining.features.consultation')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('newTraining.features.support')}</span>
                        </div>
                      </div> */}
                    </div>

                    <div className="mt-auto">
                      <Link to="/TrainingNewRequestPage">
                        <Button
                          size="lg"
                          className="w-full bg-primary hover:bg-primary/90 text-[#2194D1]-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                        >
                          {t('newTraining.button')}
                          <ArrowRight className={`w-4 h-4 ${currentLanguage === 'ar' ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Follow-up Training Card */}
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-card to-accent/5 hover:shadow-glow transition-all duration-500 group cursor-pointer h-full">
                <CardContent className="p-8 h-full">
                  <div className="text-center h-full flex flex-col">
                    <div className="flex-grow">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-8 h-8 text-accent" />
                      </div>

                      <h3 className="text-2xl font-bold mb-4 text-foreground">
                        {t('followUpTraining.title')}
                      </h3>

                      <p className="text-muted-foreground mb-8 leading-relaxed">
                        {t('followUpTraining.description')}
                      </p>

                      {/* <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('followUpTraining.features.materials')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('followUpTraining.features.verification')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('followUpTraining.features.resources')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{t('followUpTraining.features.processing')}</span>
                        </div>
                      </div> */}
                    </div>

                    <div className="mt-auto">
                      <Link to="/TrainingFollowUpRequestPage">
                        <Button
                          size="lg"
                          variant="outline"
                          className="w-full text-[#050517] text-accent hover:bg-[#050517] hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                        >
                          {t('followUpTraining.button')}
                          <ArrowRight className={`w-4 h-4 ${currentLanguage === 'ar' ? 'mr-2 group-hover:-translate-x-1' : 'ml-2 group-hover:translate-x-1'} transition-transform`} />
                        </Button>
                      </Link>
                    </div>
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

// GraphQL query for i18n
export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

// Gatsby head export for SEO
export const Head = ({ data }) => {
  const { t } = useTranslation('TrainingSelection');
  return (
    <>
      <title>{t('pageTitle')}</title>
      <meta name="description" content={t('seoDescription')} />
    </>
  );
};