import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import FeatureSection from './FeatureSection';
import InventorySection from './InventorySection';
import StockMarketsSection from './StockMarketsSection';
import InvestmentPlansSection from './InvestmentPlansSection';
import SocialProofSection from './SocialProofSection';
import OnboardingSection from './OnboardingSection';
import Footer from '../../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Navbar />
      <HeroSection />
      <FeatureSection />
      <InventorySection />
      <StockMarketsSection />
      <InvestmentPlansSection />
      <SocialProofSection />
      <OnboardingSection />
      <Footer />
    </div>
  );
};

export default Home;
