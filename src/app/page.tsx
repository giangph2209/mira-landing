import Navbar from "@/components/layout/Navbar";
import FooterSection from "@/components/layout/FooterSection";
import HeroSection from "@/components/sections/HeroSection";
import PartnersSection from "@/components/sections/PartnersSection";
import AIServicesSection from "@/components/sections/AIServicesSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import TeamSection from "@/components/sections/TeamSection";
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
import { SITE } from "@/lib/site";

// Schema Organization thuộc về trang chủ. Trước đây nó nằm ở root layout nên bị chèn vào
// cả /privacy-policy và toàn bộ khu vực /admin.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  legalName: SITE.legalName,
  taxID: SITE.taxCode,
  url: SITE.url,
  logo: `${SITE.url}${SITE.ogImage}`,
  email: SITE.email,
  telephone: SITE.phoneHref,
  description: SITE.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.district,
    addressRegion: SITE.address.city,
    addressCountry: SITE.address.country,
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: SITE.email,
    telephone: SITE.phoneHref,
    availableLanguage: ["Vietnamese", "English"],
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Navbar />
      <div className="banner-area pt-18">
        <HeroSection />
      </div>
      <PartnersSection />
      <AIServicesSection />
      <WhyUsSection />
      <TeamSection />
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
