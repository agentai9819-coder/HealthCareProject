import Link from "next/link";
import { HeroSection } from "../components/marketing/HeroSection";
import { ClinicianSection } from "../components/marketing/ClinicianSection";
import { ClinicalCareSection } from "../components/marketing/ClinicalCareSection";
import { WhoWeHelpSection } from "../components/marketing/WhoWeHelpSection";
import { FeaturedServicesSection } from "../components/marketing/FeaturedServicesSection";
import { HowItWorksSection } from "../components/marketing/HowItWorksSection";
import { TrustQualitySection } from "../components/marketing/TrustQualitySection";
import { FaqAccordion } from "../components/marketing/FaqAccordion";
import { CtaBanner } from "../components/marketing/CtaBanner";
import { faqsContent } from "../content/marketing/faqs";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="site-shell">
      {/* Refined Architectural Grid Background */}
      <div className="architectural-grid" aria-hidden="true" />

      <div className="page-frame">
        <main id="top">
          {/* 1. Veridian Care Hero with Live Dispatch Console */}
          <HeroSection />

          {/* 2. Clinician Spotlight Section */}
          <ClinicianSection />

          {/* 3. Hospital Precision & Sterile Bedside Care */}
          <ClinicalCareSection />

          {/* 4. Tailored Clinical Care Pathways */}
          <WhoWeHelpSection />

          {/* 4. Featured Clinical Services with upfront INR Pricing */}
          <FeaturedServicesSection />

          {/* 5. 4-Step Care Journey Timeline Track */}
          <HowItWorksSection />

          {/* 6. The Veridian Clinical Standard */}
          <TrustQualitySection />

          {/* 7. Frequently Asked Questions */}
          <section style={styles.faqSection} aria-labelledby="home-faq-title">
            <div style={styles.container}>
              <div style={styles.faqHeader}>
                <span className="section-kicker" style={{ justifyContent: "center" }}>
                  - 09 / Patient Clarity
                </span>
                <h2 id="home-faq-title" className="section-heading" style={{ textAlign: "center", margin: "14px auto" }}>
                  Frequently Asked <em>Questions.</em>
                </h2>
                <p style={styles.faqSubtitle}>
                  Transparent answers regarding clinician licensing, appointment booking, and in-home care delivery.
                </p>
              </div>

              <FaqAccordion items={faqsContent.faqs} limit={4} />

              <div style={styles.faqFooter}>
                <Link href="/faqs" style={styles.viewAllFaqsLink}>
                  <span>Explore Complete FAQ Knowledgebase</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* 8. Conversion Banner with 24/7 Desk */}
          <CtaBanner />
        </main>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  faqSection: {
    padding: "80px 0 60px",
    position: "relative",
  },
  container: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  faqHeader: {
    textAlign: "center",
    maxWidth: "680px",
    margin: "0 auto 3rem",
  },
  faqSubtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    lineHeight: 1.6,
    margin: "0 auto",
  },
  faqFooter: {
    textAlign: "center",
    marginTop: "3rem",
  },
  viewAllFaqsLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#38bdf8",
    fontWeight: 800,
    fontSize: "14px",
    textDecoration: "none",
    padding: "0.75rem 1.75rem",
    backgroundColor: "rgba(56, 189, 248, 0.08)",
    border: "1px solid rgba(56, 189, 248, 0.3)",
    borderRadius: "9999px",
    boxShadow: "0 0 16px rgba(56, 189, 248, 0.12)",
    transition: "all 0.18s ease",
  },
};