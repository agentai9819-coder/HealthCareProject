export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
  if (envUrl && (envUrl.startsWith("http://") || envUrl.startsWith("https://"))) {
    return envUrl;
  }
  if (typeof window !== "undefined") {
    return envUrl || "/api/v1";
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/api/v1`;
  }
  return "http://localhost:3001/api/v1";
}

export const API_BASE: string = getApiBaseUrl();
