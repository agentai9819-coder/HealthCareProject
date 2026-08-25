export interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number | string;
  category?: string;
  whatsIncluded?: string[];
  whoItsFor?: string[];
  preparationTips?: string[];
}

export const DEFAULT_SERVICES: Service[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Home Health Assessment",
    description: "Comprehensive in-home clinical evaluation by a licensed registered nurse to determine vital health metrics and personalized care planning.",
    durationMinutes: 60,
    price: 2400,
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    name: "Skilled Nursing Visit",
    description: "Dedicated bedside nursing care including medication administration, wound dressing, catheter management, and vital signs monitoring.",
    durationMinutes: 60,
    price: 2800,
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    name: "Physical Therapy & Rehabilitation",
    description: "Specialized in-home therapeutic exercise, mobility restoration, and fall-risk prevention by certified physical therapists.",
    durationMinutes: 60,
    price: 2600,
  },
  {
    id: "d4e5f6a7-b8c9-0123-def1-234567890123",
    name: "Elder Wellness & Companion Check",
    description: "Holistic senior wellness visit ensuring daily living support, hydration/nutrition review, and reassurance for family caregivers.",
    durationMinutes: 60,
    price: 1900,
  },
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getServiceSlug(service: { id: string; name: string }): string {
  const base = slugify(service.name);
  return base || service.id;
}

export async function getServicesCatalog(): Promise<Service[]> {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  // If running in production SSR without a live remote HTTPS backend, return static curated services immediately (0ms)
  if (!envUrl || (process.env.NODE_ENV === "production" && !envUrl.startsWith("https://") && typeof window === "undefined")) {
    return DEFAULT_SERVICES;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 400);
    const res = await fetch(`${envUrl}/services`, {
      next: { revalidate: 3600 },
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch {
    // Fall back instantly to curated clinical catalog
  }
  return DEFAULT_SERVICES;
}

const SLUG_ALIASES: Record<string, string> = {
  "critical-care-nursing": "skilled-nursing-visit",
  "wound-care-and-dressing": "skilled-nursing-visit",
  "physical-therapy-session": "physical-therapy-rehabilitation",
  "geriatric-vitality": "elder-wellness-companion-check",
  "teleconsultation": "home-health-assessment",
};

export function findServiceBySlug(services: Service[], slug: string): Service | undefined {
  if (!slug) return undefined;
  const canonicalSlug = SLUG_ALIASES[slug] || slug;
  // 1. Match by exact slugified name
  const matched = services.find((s) => slugify(s.name) === canonicalSlug || slugify(s.name) === slug);
  if (matched) return matched;
  // 2. Match by direct ID if slug is a UUID
  const matchedById = services.find((s) => s.id === canonicalSlug || s.id === slug);
  if (matchedById) return matchedById;
  // 3. Match from default catalog
  const matchedDefault = DEFAULT_SERVICES.find(
    (s) => slugify(s.name) === canonicalSlug || slugify(s.name) === slug || s.id === canonicalSlug || s.id === slug
  );
  return matchedDefault;
}


