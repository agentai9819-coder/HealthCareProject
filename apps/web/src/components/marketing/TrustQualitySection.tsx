import Link from "next/link";

const pillars = [
  {
    indexNo: "01",
    title: "100% Verified Credentials",
    desc: "State Nursing Council & NMC registrations verified with rigorous 3-tier police background checks.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    indexNo: "02",
    title: "Sterile Single-Use Kits",
    desc: "Every dressing, catheter, syringe, and PPE kit is sealed, serialized, and opened directly in front of the family.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
      </svg>
    ),
  },
  {
    indexNo: "03",
    title: "Physician On-Call Oversight",
    desc: "Senior consulting physicians supervise critical care telemetry and medication titration in real time.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    indexNo: "04",
    title: "Digital EHR & ABHA Privacy",
    desc: "Comprehensive visit notes and vital charts synced digitally to your family and primary care physician.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

export function TrustQualitySection() {
  return (
    <section className="care-detail" aria-labelledby="detail-title" style={{ padding: "85px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 3.5rem" }}>
          <span className="section-kicker" style={{ justifyContent: "center" }}>
            - 07 / Clinical Assurance
          </span>
          <h2 id="detail-title" className="section-heading" style={{ margin: "14px auto" }}>
            Hospital Rigor, <em>Designed for the Sanctuary of Home.</em>
          </h2>
          <p style={{ fontSize: "15px", color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>
            We adhere to strict NABH-aligned infection control, credentialing, and clinical continuity standards so your loved ones receive unwavering excellence.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {pillars.map((p, idx) => (
            <div key={idx} className="service-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {p.icon}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: "#f59e0b" }}>
                  № {p.indexNo}
                </span>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#ffffff", margin: 0, fontFamily: "var(--font-display)" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
