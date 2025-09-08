import React from 'react';
import Layout from '../components/layout';
import ColorSystemTest from '../components/ColorSystemTest';

const ColorTestPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary to-primary-hover py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Color System Test
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Test and preview both HSL and OKLCH color systems to ensure proper styling across the application.
            </p>
          </div>
        </section>

        {/* Color Test Component */}
        <ColorSystemTest />
      </div>
    </Layout>
  );
};

export default ColorTestPage;
