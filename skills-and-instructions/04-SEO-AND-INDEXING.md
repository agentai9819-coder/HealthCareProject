# 04. SEO, Crawling & Google Indexing Mastery

This guide explains how to configure full search engine optimization and rapid Google Search indexing.

---

## 1. Dynamic `sitemap.ts` (Next.js App Router)

Create `apps/web/src/app/sitemap.ts`:
```typescript
import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";

  const routes = [
    "",
    "/services",
    "/how-it-works",
    "/about",
    "/faqs",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
```

---

## 2. Dynamic `robots.ts` (Next.js App Router)

Create `apps/web/src/app/robots.ts`:
```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/staff", "/account"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 3. Metadata & Google Search Console Verification in `layout.tsx`

In `apps/web/src/app/layout.tsx`:
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "BrandName — Primary Keyword & Tagline",
    template: "%s | BrandName",
  },
  description: "High-conversion, accurate description of your services and value proposition.",
  keywords: ["Service 1", "Service 2", "Location"],
  authors: [{ name: "BrandName Team" }],
  openGraph: {
    title: "BrandName — Tagline",
    description: "Share preview description for WhatsApp and LinkedIn.",
    url: "https://your-domain.com",
    siteName: "BrandName",
    locale: "en_IN",
    type: "website",
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_CODE",
  },
};
```
