import Navbar from "@/components/layout/Navbar";
import FooterSection from "@/components/layout/FooterSection";
import HeroSection from "@/components/sections/HeroSection";
import PartnersSection from "@/components/sections/PartnersSection";
import AIServicesSection from "@/components/sections/AIServicesSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import EngagementModelsSection from "@/components/sections/EngagementModelsSection";
import DevelopmentProcessSection from "@/components/sections/DevelopmentProcessSection";
import TechnicalExpertiseSection from "@/components/sections/TechnicalExpertiseSection";
import CaseStudiesSection from "@/components/sections/CaseStudiesSection";
import CertificationsSection from "@/components/sections/CertificationsSection";
import CTASection from "@/components/sections/CTASection";
import ComplianceBannerSection from "@/components/sections/ComplianceBannerSection";
import RegionSectionLazy from "@/components/sections/RegionSectionLazy";
import { HomeHashScroll } from "@/components/sections/HomeHashScroll";
import PageButton from "@/components/sections/page-button";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="banner-area pt-18">
        <HeroSection />
      </div>
      <PartnersSection />
      <AIServicesSection />
      <WhyUsSection />
      <TestimonialsSection />
      <EngagementModelsSection />
      <DevelopmentProcessSection />
      <TechnicalExpertiseSection />
      <CaseStudiesSection />
      <CertificationsSection />
      <RegionSectionLazy />
      <CTASection />
      <ComplianceBannerSection />
      <FooterSection />
      <HomeHashScroll />
      <PageButton />
    </main>
  );
}
