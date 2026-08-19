const careJourney = [
  {
    step: "01",
    kicker: "Care brief",
    title: "Discover & Choose Service",
    copy: "Share the clinical need, preferred appointment window, and any physician instructions in under two minutes.",
  },
  {
    step: "02",
    kicker: "Clinical match",
    title: "A licensed fit, not a generic handoff",
    copy: "Our dispatch coordination desk pairs your request with the right licensed RN or therapist and confirms sterile kit prep.",
  },
  {
    step: "03",
    kicker: "At-home visit",
    title: "Care arrives prepared",
    copy: "Your clinician arrives on time with hospital-grade equipment, sterile supplies, and an unhurried bedside presence.",
  },
  {
    step: "04",
    kicker: "Continued clarity",
    title: "Care Summary & Continuity",
    copy: "Receive an easy-to-review digital update, next-step guidance, and seamless follow-on care coordination.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="journey" className="journey-section" aria-labelledby="journey-title">
      <div className="journey-top">
        <div>
          <span className="section-kicker">4-Step Care Journey</span>
          <h2 id="journey-title" className="section-heading">
            How In-Home Care Works: From First Call to Bedside Care
          </h2>
        </div>
        <p className="journey-caption">
          A clear, clinician-led rhythm that gives families total confidence without asking them to manage every logistical detail.
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
    </section>
  );
}
