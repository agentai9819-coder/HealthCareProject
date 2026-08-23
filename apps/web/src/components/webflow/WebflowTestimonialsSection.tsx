"use client";

import { useState } from "react";

export function WebflowTestimonialsSection() {
  const testimonials = [
    {
      author: "Vikram & Ananya Malhotra",
      role: "Post-Operative Orthopedic Care · Gurugram (Sector 54)",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc3_Rectangle%204285.png",
      quote: "After my father's knee replacement at Medanta, having a verified Veridian Care physiotherapist visit daily made recovery seamless. Strict infection control, prompt timekeeping, and clear digital notes.",
    },
    {
      author: "Rohan Kulkarni",
      role: "Geriatric Vitals & Medication Management · Bandra West, Mumbai",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbed_Gradient%202-2.png",
      quote: "Living abroad in Singapore, coordinating elder care for my mother in Mumbai was stressful until we found Veridian. The Registered Nurse provides daily vitals logging and physician tele-reviews.",
    },
    {
      author: "Dr. Meenakshi Sundaram",
      role: "Senior Consultant Cardiologist · Indiranagar, Bengaluru",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbee_Gradient%202-3.png",
      quote: "As a clinician, I hold home healthcare to stringent hospital benchmarks. Veridian Care's INC-licensed nurses and sterile dressing protocols represent the gold standard in bedside clinical practice.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <section className="wf-testimonials-section">
      <div className="wf-container">
        {/* Google Reviews Header Card */}
        <div className="wf-google-review-banner">
          <div className="wf-review-quote">
            Our clinicians have earned 4.9★ from 5,000+ patient families across India!
          </div>
          <div className="wf-star-row">
            {[1, 2, 3, 4, 5].map((n) => (
              <img
                key={n}
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbe_Star.svg"
                alt="Star"
                className="wf-star-img"
              />
            ))}
          </div>
          <div className="wf-avg-rating-text">Verified Google Rating: 4.9 / 5.0</div>
        </div>

        {/* Testimonial Slider Card */}
        <div className="wf-testimonial-slider-card">
          <div className="wf-testimonial-content">
            <div className="wf-author-info">
              <img src={current.image} alt={current.author} className="wf-author-avatar" />
              <div>
                <h3 className="wf-author-name">{current.author}</h3>
                <p className="wf-author-role">{current.role}</p>
              </div>
            </div>

            <div className="wf-author-divider" />

            <div className="wf-quote-wrap">
              <p className="wf-quote-text">“{current.quote}”</p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="wf-slider-nav-arrows">
            <button
              type="button"
              className="wf-slider-arrow-btn"
              onClick={prevSlide}
              aria-label="Previous Testimonial"
            >
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbfb_Union-1.svg"
                alt=""
              />
            </button>
            <button
              type="button"
              className="wf-slider-arrow-btn"
              onClick={nextSlide}
              aria-label="Next Testimonial"
            >
              <img
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbfa_Union.svg"
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
