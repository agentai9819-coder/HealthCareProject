export const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (typeof window === "undefined" ? "http://localhost:3001/api/v1" : "http://localhost:3001/api/v1");
