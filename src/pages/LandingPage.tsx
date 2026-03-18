/**
 * Landing Page — Premium SaaS marketing page for RoomForge.
 * Assembled from modular sections following atomic design methodology.
 * 
 * HCI Rationale:
 * - F-pattern layout matches natural reading flow (Nielsen: Eye Tracking)
 * - Scroll-based progressive disclosure maintains engagement (Nielsen H8)
 * - Consistent section rhythm reduces cognitive load (Gestalt: Continuity)
 */

import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import ShowcaseSection from '@/components/landing/ShowcaseSection';
import StatsSection from '@/components/landing/StatsSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ShowcaseSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
