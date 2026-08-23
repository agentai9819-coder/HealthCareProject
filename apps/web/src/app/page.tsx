import Link from "next/link";
import { HeroSection } from "../components/marketing/HeroSection";
import { FeaturedServicesSection } from "../components/marketing/FeaturedServicesSection";
import { ClinicalCareSection } from "../components/marketing/ClinicalCareSection";
import { TestimonialsCarousel } from "../components/marketing/TestimonialsCarousel";
import { ServiceFinder } from "../components/marketing/ServiceFinder";
import { HowItWorksSection } from "../components/marketing/HowItWorksSection";
import { FaqAccordion } from "../components/marketing/FaqAccordion";
import { CtaBanner } from "../components/marketing/CtaBanner";
import { StickyPromoBanner } from "../components/marketing/StickyPromoBanner";
import { faqsContent } from "../content/marketing/faqs";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="editorial-page-shell">
      <main id="top">
        {/* 1. Dark Cinematic Hero with 3D Glowing Amber Orbit */}
        <HeroSection />

        {/* 2. Light Cream Clinical Services Catalog (Stark Visual Rhythm) */}
        <FeaturedServicesSection />

        {/* 3. Dark Edge-to-Edge Feature Protocol Cards with Bottom Overlays */}
        <ClinicalCareSection />

        {/* 4. Light Cream Verified Patient Stories Carousel with Line Progress Indicator */}
        <TestimonialsCarousel />

        {/* 5. Dark Interactive 1-Minute Service Guide / Care Matcher */}
        <ServiceFinder />

        {/* 6. Dark 4-Stage Care Timeline */}
        <HowItWorksSection />

        {/* 7. Dark FAQ Section with '+' and '-' Accordions */}
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

        {/* 8. Conversion Banner */}
        <CtaBanner />

        {/* 9. Floating Persistent Sticky Promo Bar at Bottom */}
        <StickyPromoBanner />
      </main>
    </div>
  );
}