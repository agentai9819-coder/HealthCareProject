const careJourney = [
  {
    step: "01",
    kicker: "Care Brief",
    title: "Discover & Choose Program",
    copy: "Select your clinical need, desired appointment time, and any physician instructions in under two minutes.",
  },
  {
    step: "02",
    kicker: "Clinical Match",
    title: "Hospital-Trained Specialist Dispatch",
    copy: "Our clinical coordination desk pairs your request with a verified, licensed RN or Physiotherapist.",
  },
  {
    step: "03",
    kicker: "Bedside Visit",
    title: "Sterile In-Home Care",
    copy: "Your clinician arrives on time with single-use sterile kits, vitals telemetry, and calm reassurance.",
  },
  {
    step: "04",
    kicker: "Continuity",
    title: "ABHA Care Report & Follow-up",
    copy: "Receive an encrypted digital summary synced to your family and primary physician within 30 minutes.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="sp-section" aria-labelledby="journey-title">
      <div className="sp-container">
        <div className="sp-section-header">
          <span className="sp-kicker">Simple 4-Stage Rhythm</span>
          <h2 id="journey-title" className="sp-section-title">
            How In-Home Clinical Care Works: <br />
            <span className="sp-gradient-text">From request to doorstep.</span>
          </h2>
          <p className="sp-section-desc">
            A clear, clinician-led rhythm designed to give families total confidence without administrative friction.
          </p>
        </div>

        <div className="journey-track">
          {careJourney.map((item) => (
            <article className="journey-item" key={item.step}>
              <span className="journey-number">{item.step}</span>
              <div className="journey-content">
                <span className="journey-step">{item.kicker}</span>
                <h3 className="journey-title">{item.title}</h3>
                <p className="journey-copy">{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
