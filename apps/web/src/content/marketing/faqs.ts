export interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const faqsContent: {
  header: { badge: string; title: string; subtitle: string };
  categories: string[];
  faqs: FaqItem[];
} = {
  header: {
    badge: "Frequently Asked Questions",
    title: "Everything You Need to Know About In-Home Care",
    subtitle:
      "Find clear answers regarding appointment scheduling, clinician qualifications, visit preparation, pricing, and safety.",
  },
  categories: ["All", "Booking & Scheduling", "Clinical Care & Clinicians", "Pricing & Billing", "Safety & Emergency"],
  faqs: [
    {
      category: "Booking & Scheduling",
      question: "How do I book an in-home healthcare appointment?",
      answer:
        "You can book directly on our website! Browse our Services page, choose the service you need, select a convenient date and time slot from our real-time calendar, enter your address, and confirm. You can also include pre-visit intake notes for your clinician.",
    },
    {
      category: "Booking & Scheduling",
      question: "Can I reschedule or cancel my appointment if my plans change?",
      answer:
        "Yes. You can reschedule or cancel any confirmed future appointment directly from your 'My Bookings' patient portal, as long as the clinician is not yet en route or on-site. Rescheduling automatically releases your previous slot and reserves your new chosen time.",
    },
    {
      category: "Booking & Scheduling",
      question: "Can I book a follow-up appointment after my visit is completed?",
      answer:
        "Yes! Completed appointments in your patient portal include a 1-click 'Book Again' button that pre-selects the same service and saved address so you can quickly pick your next available appointment slot.",
    },
    {
      category: "Clinical Care & Clinicians",
      question: "Who will provide my in-home care?",
      answer:
        "All clinical visits are performed by state-licensed Registered Nurses (RNs) or Certified Physical Therapists (PTs). Every clinician undergoes comprehensive criminal background vetting, license verification, and clinical competency screening.",
    },
    {
      category: "Clinical Care & Clinicians",
      question: "What should I have ready before the clinician arrives?",
      answer:
        "Please ensure safe access to your home, have a current list of medications or prescription bottles accessible, have photo identification ready, and prepare a well-lit, comfortable seating area for the examination or physical therapy exercises.",
    },
    {
      category: "Clinical Care & Clinicians",
      question: "Will I receive a summary after the visit?",
      answer:
        "Yes. Following every visit, your clinician logs a plain-language Care Summary in the system. You can view this summary anytime by logging into your patient portal under 'My Bookings'.",
    },
    {
      category: "Pricing & Billing",
      question: "How much do services cost and are there hidden fees?",
      answer:
        "We believe in 100% pricing transparency. Every service lists its exact duration and fee upfront on the Services page before you book. There are no travel surcharges or surprise billing.",
    },
    {
      category: "Pricing & Billing",
      question: "Do you provide receipts for insurance or FSA/HSA reimbursement?",
      answer:
        "Yes. Itemized digital receipts detailing the clinical service, duration, and date of care are generated in your patient account for your records and flexible spending account (FSA/HSA) submission.",
    },
    {
      category: "Safety & Emergency",
      question: "What should I do if I am having a medical emergency?",
      answer:
        "HomeCare provides scheduled, non-emergency clinical visits and does not provide emergency medical rescue. If you or a loved one are experiencing a life-threatening medical emergency, call 911 immediately.",
    },
    {
      category: "Safety & Emergency",
      question: "What safety and hygiene measures do your clinicians follow?",
      answer:
        "Our clinicians adhere to strict infection control standards, including hand hygiene protocols, single-use sterile supplies for wound dressings, sanitized diagnostic equipment, and appropriate personal protective equipment (PPE).",
    },
  ],
};
