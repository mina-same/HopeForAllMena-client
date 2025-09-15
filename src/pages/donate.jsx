import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Heart, Shield, Users } from "lucide-react";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import Footer from "../components/footer";
import Layout from "../components/layout";

const DonationCard = () => {
    const donationAmounts = [50, 100, 250, 500, 1000];

    return (
        <Layout>
            <HeaderTwo/>
            <StickyHeader/>
            <div className="w-full max-w-4xl mx-auto space-y-8 py-14">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-gradient-soft px-4 py-2 rounded-full">
                        <Heart className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Make a Difference Today</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-[#2194D1] bg-clip-text text-transparent">
                        Support Our Mission
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Your generous donation helps us continue our work and make a positive impact in our community.
                        Every contribution, no matter the size, makes a difference.
                    </p>
                </div>

                {/* Main Donation Section */}
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* QR Code Section */}
                    <Card className="p-8 text-center shadow-primary">
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold">Instant Payment</h3>
                                <p className="text-muted-foreground">
                                    Scan the QR code below to make a quick and secure donation
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
                                    <span>Secure & Instant Transfer</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Simply open your payment app, scan the code, and enter your desired amount
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Donation Options */}
                    <div className="space-y-6">
                        <Card className="p-6 shadow-secondary">
                            <CardContent className="space-y-6">
                                <h3 className="text-xl font-semibold">Quick Donation Amounts</h3>

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
                                        Custom Amount
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Trust Indicators */}
                        <Card className="p-6 bg-gradient-soft">
                            <CardContent className="space-y-4">
                                <h4 className="font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    Why Donate?
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>100% of donations go directly to our programs</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Transparent reporting on fund usage</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                        <span>Secure and encrypted payment processing</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center space-y-4 pt-8 border-t">
                    <h4 className="text-lg font-semibold">Need Help?</h4>
                    <p className="text-muted-foreground">
                        If you have any questions about donating or need assistance,
                        please don't hesitate to contact our support team.
                    </p>
                    <Button variant="outline" className="hover:bg-gradient-soft">
                        Contact Support
                    </Button>
                </div>
            </div>
            <Footer/>
        </Layout>
    );
};

export default DonationCard;