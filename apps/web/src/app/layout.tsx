import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";
import { MarketingFooter } from "../components/MarketingFooter";
import { CookieBanner } from "../components/CookieBanner";
import { StickyMobileCta } from "../components/StickyMobileCta";
import { CursorGlow } from "../components/CursorGlow";
import { AmbientAtmosphere } from "../components/AmbientAtmosphere";
import { ScrollReveal } from "../components/ScrollReveal";

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
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "Veridian Care — Luxury In-Home Clinical Healthcare",
    template: "%s | Veridian Care",
  },
  description:
    "Compassionate, state-licensed in-home clinical care, nursing assessments, physical therapy, and personalized recovery delivered directly to your doorstep.",
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
    url: "https://health-care-project-api-delta.vercel.app",
    siteName: "Veridian Care",
    title: "Veridian Care — Luxury In-Home Clinical Healthcare",
    description:
      "Compassionate, state-licensed in-home clinical care, nursing assessments, physical therapy, and personalized recovery delivered directly to your doorstep.",
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
    title: "Veridian Care — Luxury In-Home Clinical Healthcare",
    description:
      "Compassionate, state-licensed in-home clinical care, nursing assessments, physical therapy, and personalized recovery delivered directly to your doorstep.",
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
  other: {
    "google-site-verification": "wB7DFyJxxysgOt1gd_-X9M4pyepew6heR4lcrqrRrv0",
    "zero-threat-verification": "zeroThreat=MTA4OTA=TVRBNE9UQT0=TVRBNE9UQT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="wB7DFyJxxysgOt1gd_-X9M4pyepew6heR4lcrqrRrv0" />
        <meta name="zero-threat-verification" content="zeroThreat=MTA4OTA=TVRBNE9UQT0=TVRBNE9UQT" />
      </head>
      <body
        suppressHydrationWarning
        style={{
          margin: 0,
          fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
          backgroundColor: "#000000",
          color: "#ffffff",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <AmbientAtmosphere />
        <ScrollReveal />
        <CursorGlow />
        <Header />
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>{children}</div>
        <MarketingFooter />
        <CookieBanner />
        <StickyMobileCta />
      </body>
    </html>
  );
}