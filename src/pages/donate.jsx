import React from "react";
import { graphql } from "gatsby";
import { useTranslation, useI18next, Link } from "gatsby-plugin-react-i18next";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Heart, Shield, Users } from "lucide-react";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import Footer from "../components/footer";
import Layout from "../components/layout";
import PageHeader from "../components/page-header";

const DonationCard = () => {
    const { t } = useTranslation('Donate');
    const { i18n } = useI18next();
    const currentLanguage = i18n?.resolvedLanguage || 'en';
    const donationAmounts = [50, 100, 250, 500, 1000];

    return (
        <>
            {/* RTL-specific styles for Arabic */}
            {currentLanguage === 'ar' && (
                <style jsx>{`
                    .donation-container {
                        direction: rtl;
                    }
                    .donation-container .text-left {
                        text-align: right !important;
                    }
                    .donation-container .text-center {
                        text-align: center !important;
                    }
                    .donation-container .grid {
                        direction: rtl;
                    }
                    .donation-container .flex {
                        direction: rtl;
                    }
                    .donation-container .space-y-3 .flex {
                        direction: rtl;
                        text-align: right;
                    }
                `}</style>
            )}
            <Layout pageTitle={`${t('pageTitle')} || Hope For All Mena Ministry`}>
                <HeaderTwo/>
                <StickyHeader/>
                <PageHeader title={t('pageTitle')} crumbTitle={t('crumbTitle')} />
                <div className="donation-container w-full max-w-4xl mx-auto space-y-8 py-14" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-soft px-4 py-2 rounded-full">
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{t('header.badge')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-[#2194D1] bg-clip-text text-transparent">
                        {t('header.title')}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('header.description')}
                    </p>
                </div>

                {/* Main Donation Section */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* QR Code Section */}
                    <Card className="p-8 text-center shadow-primary">
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold">{t('qrSection.title')}</h3>
                                <p className="text-muted-foreground">
                                    {t('qrSection.description')}
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <div className="p-4 bg-white rounded-2xl shadow-lg">
                                    <img
                                        src="/instabay.jpg"
                                        alt="FCN Donation QR Code"
                                        className="w-64 h-64 object-contain"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                    <Shield className="h-4 w-4" />
                                    <span>{t('qrSection.security')}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('qrSection.instructions')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Donation Options */}
                    <div className="space-y-6">
                        <Card className="p-6 shadow-secondary">
                            <CardContent className="space-y-6">
                                <h3 className="text-xl font-semibold">{t('donationOptions.title')}</h3>

                                <div className="grid grid-cols-2 gap-3">
                                    {donationAmounts.map((amount) => (
                                        <Button
                                            key={amount}
                                            variant="outline"
                                            className="h-12 text-lg font-semibold hover:bg-gradient-soft hover:border-primary transition-all"
                                        >
                                            ${amount}
                                        </Button>
                                    ))}
                                </div>

                                <div className="pt-4 border-t">
                                    <Button className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:opacity-90 transition-opacity">
                                        {t('donationOptions.customAmount')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trust Indicators */}
                        <Card className="p-6 bg-gradient-soft">
                            <CardContent className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    {t('trustIndicators.title')}
                                </h4>
                                <div className="space-y-3 text-sm">
                                    {t('trustIndicators.benefits', { returnObjects: true }).map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`w-2 h-2 ${index % 2 === 0 ? 'bg-primary' : 'bg-secondary'} rounded-full mt-2 flex-shrink-0`}></div>
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center space-y-4 pt-8 border-t">
                    <h4 className="text-lg font-semibold">{t('support.title')}</h4>
                    <p className="text-muted-foreground">
                        {t('support.description')}
                    </p>
                    <Link to="/contact" className="inline-block">
                        <Button variant="outline" className="hover:bg-gradient-soft">
                            {t('support.contactButton')}
                        </Button>
                    </Link>
                </div>
                </div>
                <Footer/>
            </Layout>
        </>
    );
};

export default DonationCard;

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