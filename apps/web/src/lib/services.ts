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

export function findServiceBySlug(services: Service[], slug: string): Service | undefined {
  if (!slug) return undefined;
  // 1. Match by exact slugified name
  const matched = services.find((s) => slugify(s.name) === slug);
  if (matched) return matched;
  // 2. Match by direct ID if slug is a UUID
  return services.find((s) => s.id === slug);
}
