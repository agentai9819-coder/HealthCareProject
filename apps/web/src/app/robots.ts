import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://health-care-project-api-delta.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/admin", "/staff", "/booking/view"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
