import React from "react";
import Layout from "../components/layout";
import HeaderTwo from "../components/header/header-two";
import StickyHeader from "../components/header/sticky-header";
import PageHeader from "../components/page-header";
import Footer from "../components/footer";
import WorldVectorMap from "../components/map/WorldVectorMap";

const MapPage = () => {
    return (
        <Layout pageTitle="Global Reach || Hope For All Mena Ministry">
            <HeaderTwo />
            <StickyHeader />
            <PageHeader title="Our Global Reach" crumbTitle="Map" />

            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">

                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Countries We Serve
                            </h3>
                            <p className="text-gray-600">
                                Click on any highlighted country to learn more about our work in that region.
                            </p>
                        </div>

                        <div className="map-container">
                            <WorldVectorMap
                                value="world_mill"
                                width="100%"
                                color="#2194D1"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </Layout>
    );
};

export default MapPage;