import { WebflowHeroBanner } from "../components/webflow/WebflowHeroBanner";
import { TreatmentCategoriesSection } from "../components/webflow/TreatmentCategoriesSection";
import { DoctorAppointmentSection } from "../components/webflow/DoctorAppointmentSection";
import { LabDealsSection } from "../components/webflow/LabDealsSection";
import { CallToActionSection } from "../components/webflow/CallToActionSection";
import { ExpertiseSection } from "../components/webflow/ExpertiseSection";
import { WebflowTestimonialsSection } from "../components/webflow/WebflowTestimonialsSection";
import { AppDownloadSection } from "../components/webflow/AppDownloadSection";
import { BlogSection } from "../components/webflow/BlogSection";

export const revalidate = 3600;

export default function HomePage() {
  return (
    <main id="top" className="wf-page-wrapper">
      {/* 1. Hero Banner (Cutout Doctor + Healthcare Typography + Outcome Badges) */}
      <WebflowHeroBanner />

      {/* 2. 4 Colorful Treatment Category Cards */}
      <TreatmentCategoriesSection />

      {/* 3. Doctor Appointment Booking with Specialty Tabs */}
      <DoctorAppointmentSection />

      {/* 4. Frequently Booked Clinical Packages & Bedside Sterile Supplies */}
      <LabDealsSection />

      {/* 5. Call To Action Banner ("Your health is our Top priority") */}
      <CallToActionSection />

      {/* 6. Clinical Guidance, 24/7 Care Desk & Experience Counters */}
      <ExpertiseSection />

      {/* 7. 5,000+ Google Reviews & Testimonials Carousel */}
      <WebflowTestimonialsSection />

      {/* 8. Healthcare Mobile App Download Area */}
      <AppDownloadSection />

      {/* 9. Health Expert Articles & Blog */}
      <BlogSection />
    </main>
  );
}