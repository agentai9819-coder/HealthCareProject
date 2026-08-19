export interface ServiceEnrichment {
  category: string;
  shortSummary: string;
  whatsIncluded: string[];
  whoItsFor: string[];
  preparationTips: string[];
}

export const servicesEnrichmentMap: Record<string, ServiceEnrichment> = {
  "home-health-assessment": {
    category: "Nursing Assessment",
    shortSummary:
      "A comprehensive, head-to-toe in-home health and vital evaluation conducted by a licensed Registered Nurse.",
    whatsIncluded: [
      "Complete baseline vital signs evaluation (blood pressure, pulse, oxygen, temperature)",
      "Medication reconciliation and regimen safety review",
      "Fall-risk and home safety hazard assessment",
      "Detailed clinical observation notes & personalized care summary",
      "Recommendations for ongoing nursing or therapy support",
    ],
    whoItsFor: [
      "Patients newly discharged from the hospital",
      "Seniors establishing a routine wellness and health baseline",
      "Individuals experiencing recent changes in functional mobility or health status",
      "Family members coordinating care for an aging relative",
    ],
    preparationTips: [
      "Have all current prescription and over-the-counter medications accessible",
      "Prepare a list of recent hospitalizations, allergies, and medical history",
      "Ensure a clear, well-lit seating area is available for examination",
    ],
  },
  "physical-therapy-session": {
    category: "Therapy & Rehabilitation",
    shortSummary:
      "One-on-one personalized physical rehabilitation and mobility training by a Certified Physical Therapist.",
    whatsIncluded: [
      "Targeted mobility, gait, and balance assessment",
      "Therapeutic exercises customized for your recovery goals",
      "Assistive device evaluation (walkers, canes, wheelchairs)",
      "Home exercise program instruction and safety guidelines",
      "Progress tracking and functional milestone evaluation",
    ],
    whoItsFor: [
      "Patients recovering from orthopedic surgery or joint replacement",
      "Individuals recovering from stroke or neurological conditions",
      "Seniors seeking fall prevention and balance improvement",
      "Patients needing in-home strength and endurance conditioning",
    ],
    preparationTips: [
      "Wear comfortable, loose-fitting clothing and non-slip footwear",
      "Clear a small open floor area for safe exercise movement",
      "Have your assistive devices (walker, cane, braces) ready",
    ],
  },
  "wound-care-and-dressing": {
    category: "Clinical Nursing",
    shortSummary:
      "Sterile wound management, surgical incision care, and dressing changes by a skilled Registered Nurse.",
    whatsIncluded: [
      "Aseptic wound cleansing and measurement of healing progress",
      "Prescribed dressing change and barrier application",
      "Infection surveillance and vital signs check",
      "Patient and caregiver education on daily wound hygiene",
      "Comprehensive clinical documentation and physician reporting notes",
    ],
    whoItsFor: [
      "Patients with post-operative surgical incisions",
      "Individuals managing chronic diabetic or vascular ulcers",
      "Patients with pressure sores requiring sterile dressing changes",
      "Caregivers needing skilled support for complex dressings",
    ],
    preparationTips: [
      "Keep any physician-prescribed wound care supplies or ointments nearby",
      "Ensure clean hand-washing facilities are accessible for the clinician",
    ],
  },
};

export const defaultEnrichment: ServiceEnrichment = {
  category: "Clinical Healthcare Service",
  shortSummary: "Professional in-home clinical care delivered by state-licensed healthcare professionals.",
  whatsIncluded: [
    "One-on-one in-home care delivery by a verified clinician",
    "Pre-visit intake instructions review",
    "Clinical documentation and post-visit patient care summary",
    "Adherence to strict infection-control and safety standards",
  ],
  whoItsFor: [
    "Patients requiring scheduled in-home clinical support",
    "Families seeking trustworthy, professional healthcare coordination",
  ],
  preparationTips: [
    "Ensure safe, lighted access to your residence",
    "Have relevant medical information and photo identification ready",
  ],
};
