"use client";

import { useState } from "react";

export function WebflowTestimonialsSection() {
  const testimonials = [
    {
      author: "Esther Howard",
      role: "Verified Patient · Delhi NCR",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbc3_Rectangle%204285.png",
      quote: "I had a great experience with the in-home healthcare team. The registered nurse arrived right on time with sterile equipment, and the physician tele-consultation gave my family complete peace of mind.",
    },
    {
      author: "Rajesh Kulkarni",
      role: "Post-Operative Patient · Mumbai",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbed_Gradient%202-2.png",
      quote: "Exceptional clinical care at home. Their physiotherapist helped me recover knee mobility 3 weeks faster than expected. The transparent billing and digital prescription records made insurance claim seamless.",
    },
    {
      author: "Dr. Anita Desai",
      role: "Senior Consultant & Caregiver",
      image: "https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbee_Gradient%202-3.png",
      quote: "As a physician myself, I hold high standards for clinical hygiene. Veridian Care's strict NABH-aligned protocols and licensed nurses are the gold standard for in-home patient care.",
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
            Our doctors and clinicians have earned over 5,000+ reviews on Google!
          </div>
          <div className="wf-star-row">
            {[1, 2, 3, 4].map((n) => (
              <img
                key={n}
                src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbe_Star.svg"
                alt="Star"
                className="wf-star-img"
              />
            ))}
            <img
              src="https://cdn.prod.website-files.com/6a8a9b834012eb47b04bdb10/6a8a9b844012eb47b04bdbbf_Half%20Star.svg"
              alt="Star"
              className="wf-star-img"
            />
          </div>
          <div className="wf-avg-rating-text">Average Google Rating is 4.6 / 5.0</div>
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
