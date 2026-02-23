import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import ImpactSection from '../components/ImpactSection';
import CTASection from '../components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ImpactSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}