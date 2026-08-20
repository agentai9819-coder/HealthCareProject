export const metadata = {
  title: "Terms of Service & Clinical Agreement — Veridian Care",
  description: "Review the terms and conditions for in-home clinical visits, appointment scheduling, cancellations, and caregiver safety standards.",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px 100px 20px" }}>
      <div style={{ marginBottom: "36px" }}>
        <span style={{ color: "#34d399", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Terms of Service
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Outfit', sans-serif)", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 800, color: "#f6f7f3", margin: "12px 0 16px 0" }}>
          Terms & Conditions of Care
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px" }}>Last updated: August 2026</p>
      </div>

      <section style={{ backgroundColor: "rgba(18, 30, 27, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "32px", backdropFilter: "blur(16px)", color: "#cbd5e1", lineHeight: 1.7, fontSize: "15px" }}>
        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: 0 }}>1. Scope of In-Home Care Services</h2>
        <p>
          Veridian Care provides non-emergency, scheduled and same-day in-home clinical assessments, nursing visits, physical therapy, and elder wellness checks. Our service does <strong>NOT</strong> replace hospital emergency rooms or 911 trauma services.
        </p>

        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: "28px" }}>2. Appointment Scheduling & Transparent Pricing</h2>
        <p>
          All pricing shown on our booking console is transparent and upfront. Payment authorization occurs prior to clinician dispatch, and receipts are delivered digitally.
        </p>

        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: "28px" }}>3. Clinician Safety & Safe Home Environment</h2>
        <p>
          To maintain high sterile and clinical standards, patients and households agree to provide a clean, safe, and respectful environment for our visiting state-licensed clinicians.
        </p>

        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: "28px" }}>4. Cancellation Policy</h2>
        <p>
          Appointments can be rescheduled or cancelled up to 2 hours prior to the scheduled window without any fee.
        </p>
      </section>
    </main>
  );
}
