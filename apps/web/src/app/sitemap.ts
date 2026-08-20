import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://health-care-project-api-delta.vercel.app";

  const staticRoutes = [
    "",
    "/services",
    "/how-it-works",
    "/about",
    "/why-us",
    "/faqs",
    "/contact",
    "/service-areas",
    "/privacy",
    "/terms",
    "/auth/login",
    "/auth/register",
  ];

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/services" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/services" ? 0.9 : 0.7,
  }));
}
