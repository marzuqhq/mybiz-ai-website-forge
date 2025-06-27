
import React from 'react';
import HeroSection from '@/components/marketing/HeroSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import HowItWorksSection from '@/components/marketing/HowItWorksSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import PricingSection from '@/components/marketing/PricingSection';
import CTASection from '@/components/marketing/CTASection';
import Footer from '@/components/marketing/Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
