import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { WebflowNavbar } from "../components/webflow/WebflowNavbar";
import { WebflowFooter } from "../components/webflow/WebflowFooter";
import { CookieBanner } from "../components/CookieBanner";
import { StickyMobileCta } from "../components/StickyMobileCta";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#252B61",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Veridian Care — In-Home Clinical Healthcare & Nursing",
    template: "%s | Veridian Care",
  },
  description:
    "NABH-aligned in-home clinical nursing, physiotherapy, wound dressing, and elder care delivered by state-licensed clinicians across Delhi NCR, Mumbai, Bengaluru, and Hyderabad.",
  keywords: [
    "in-home healthcare",
    "skilled nursing visit",
    "physical therapy at home",
    "elder wellness check",
    "post-op recovery care",
    "home health assessment",
    "licensed RN",
  ],
  authors: [{ name: "Veridian Care Clinical Team" }],
  creator: "Veridian Care",
  publisher: "Veridian Care",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/assets/images/favicon_io/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/assets/images/favicon_io/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/assets/images/favicon_io/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/assets/images/favicon_io/favicon.ico",
  },
  manifest: "/assets/images/favicon_io/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://veridiancare.vercel.app",
    siteName: "Veridian Care",
    title: "Veridian Care — In-Home Clinical Healthcare & Nursing",
    description:
      "NABH-aligned in-home clinical nursing, physiotherapy, wound dressing, and elder care delivered by state-licensed clinicians.",
    images: [
      {
        url: "/assets/images/about-img.png",
        width: 1200,
        height: 630,
        alt: "Veridian Care Clinical Team In-Home Care Visit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veridian Care — In-Home Clinical Healthcare & Nursing",
    description:
      "NABH-aligned in-home clinical nursing, physiotherapy, wound dressing, and elder care delivered by state-licensed clinicians.",
    images: ["/assets/images/about-img.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "wB7DFyJxxysgOt1gd_-X9M4pyepew6heR4lcrqrRrv0",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head></head>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
          backgroundColor: "#ffffff",
          color: "#1e293b",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <WebflowNavbar />
        <div style={{ flex: 1, position: "relative" }}>{children}</div>
        <WebflowFooter />
        <CookieBanner />
        <StickyMobileCta />
      </body>
    </html>
  );
}