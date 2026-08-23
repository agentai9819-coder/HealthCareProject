import Link from "next/link";
import { HeroSection } from "../components/marketing/HeroSection";
import { ServiceFinder } from "../components/marketing/ServiceFinder";
import { FeaturedServicesSection } from "../components/marketing/FeaturedServicesSection";
import { ClinicalCareSection } from "../components/marketing/ClinicalCareSection";
import { HowItWorksSection } from "../components/marketing/HowItWorksSection";
import { FaqAccordion } from "../components/marketing/FaqAccordion";
import { CtaBanner } from "../components/marketing/CtaBanner";
import { faqsContent } from "../content/marketing/faqs";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="sp-page-shell">
      <main id="top">
        {/* 1. Cinematic Centered Hero with 3D Glowing Amber Wave */}
        <HeroSection />

        {/* 2. Interactive Service Finder & Care Match Guide */}
        <ServiceFinder />

        {/* 3. Core Clinical Programs Catalog */}
        <FeaturedServicesSection />

        {/* 4. Hospital-Grade Clinical Standard & Doctor Tele-Desk */}
        <ClinicalCareSection />

        {/* 5. 3-Step Care Journey Timeline */}
        <HowItWorksSection />

        {/* 6. Patient Clarity & FAQ Knowledgebase */}
        <section className="sp-section" aria-labelledby="home-faq-title">
          <div className="sp-container">
            <div className="sp-section-header">
              <span className="sp-kicker">Patient Clarity</span>
              <h2 id="home-faq-title" className="sp-section-title">
                Frequently Asked <span className="sp-gradient-text">Questions.</span>
              </h2>
              <p className="sp-section-desc">
                Transparent answers regarding clinician licensing, appointment booking, and in-home care delivery.
              </p>
            </div>

            <FaqAccordion items={faqsContent.faqs} limit={4} />

            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <Link href="/faqs" className="sp-btn-secondary">
                <span>Explore Complete FAQ Knowledgebase</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* 7. Direct 24/7 Clinical Concierge Conversion Banner */}
        <CtaBanner />
      </main>
    </div>
  );
}