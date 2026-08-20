export const metadata = {
  title: "Privacy & HIPAA Compliance Policy — Veridian Care",
  description: "Learn how Veridian Care protects customer healthcare records, clinical briefs, and personal health information under strict HIPAA and data protection standards.",
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 20px 100px 20px" }}>
      <div style={{ marginBottom: "36px" }}>
        <span style={{ color: "#34d399", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Legal & Regulatory Compliance
        </span>
        <h1 style={{ fontFamily: "var(--font-display, 'Outfit', sans-serif)", fontSize: "clamp(30px, 4vw, 42px)", fontWeight: 800, color: "#f6f7f3", margin: "12px 0 16px 0" }}>
          Privacy Policy & HIPAA Notice
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px" }}>Last updated: August 2026</p>
      </div>

      <section style={{ backgroundColor: "rgba(18, 30, 27, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "20px", padding: "32px", backdropFilter: "blur(16px)", color: "#cbd5e1", lineHeight: 1.7, fontSize: "15px" }}>
        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: 0 }}>1. Commitment to Health Data Security</h2>
        <p>
          Veridian Care operates in strict compliance with HIPAA (Health Insurance Portability and Accountability Act) and international data privacy regulations. All medical histories, nursing visit records, caregiver notes, and scheduling details are encrypted in transit and at rest.
        </p>

        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: "28px" }}>2. Collection of Health Information</h2>
        <p>
          We only collect data necessary to coordinate and deliver in-home clinical care, including customer contact details, home address, medical briefings, medication reconciliations, and appointment preferences.
        </p>

        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: "28px" }}>3. Data Minimization & Third-Party Non-Disclosure</h2>
        <p>
          We never sell, rent, or trade your personal or clinical health data. Information is only shared with the assigned licensed clinician arriving at your home and verified medical coordination desks.
        </p>

        <h2 style={{ color: "#f6f7f3", fontSize: "20px", fontWeight: 700, marginTop: "28px" }}>4. Your Rights & Access</h2>
        <p>
          You have the right to request a complete copy of your in-home visit summaries, modify contact details, or request data deletion by contacting our privacy officer at <strong>privacy@veridiancare.com</strong>.
        </p>
      </section>
    </main>
  );
}
