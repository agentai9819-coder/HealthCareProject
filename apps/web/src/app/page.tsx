import { WebflowNavbar } from "../components/webflow/WebflowNavbar";
import { WebflowHeroBanner } from "../components/webflow/WebflowHeroBanner";
import { TreatmentCategoriesSection } from "../components/webflow/TreatmentCategoriesSection";
import { DoctorAppointmentSection } from "../components/webflow/DoctorAppointmentSection";
import { LabDealsSection } from "../components/webflow/LabDealsSection";
import { CallToActionSection } from "../components/webflow/CallToActionSection";
import { ExpertiseSection } from "../components/webflow/ExpertiseSection";
import { WebflowTestimonialsSection } from "../components/webflow/WebflowTestimonialsSection";
import { AppDownloadSection } from "../components/webflow/AppDownloadSection";
import { BlogSection } from "../components/webflow/BlogSection";
import { WebflowFooter } from "../components/webflow/WebflowFooter";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="wf-page-wrapper" style={{ background: "#ffffff", color: "#1e293b" }}>
      {/* 1. Webflow Modern Search & Location Header */}
      <WebflowNavbar />

      <main id="top">
        {/* 2. Webflow Hero Banner (Cutout Doctor + Healthcare Typography + Outcome Badges) */}
        <WebflowHeroBanner />

        {/* 3. 4 Colorful Treatment Category Cards */}
        <TreatmentCategoriesSection />

        {/* 4. Doctor Appointment Booking with Specialty Tabs */}
        <DoctorAppointmentSection />

        {/* 5. Frequently Booked Lab Tests & Today's Best Deals */}
        <LabDealsSection />

        {/* 6. Call To Action Banner ("Your health is our Top priority") */}
        <CallToActionSection />

        {/* 7. Clinical Expertise, Podcast & Experience Counters */}
        <ExpertiseSection />

        {/* 8. 5,000+ Google Reviews & Testimonials Carousel */}
        <WebflowTestimonialsSection />

        {/* 9. Healthcare Mobile App Download Area */}
        <AppDownloadSection />

        {/* 10. Health Expert Articles & Blog */}
        <BlogSection />
      </main>

      {/* 11. Clean Multi-Column Webflow Footer */}
      <WebflowFooter />
    </div>
  );
}