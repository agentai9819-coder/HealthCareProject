import "./globals.css";
import { Header } from "../components/Header";
import { MarketingFooter } from "../components/MarketingFooter";

export const metadata = {
  title: "HomeCare — Professional In-Home Clinical Healthcare",
  description:
    "Compassionate, state-licensed in-home clinical care, nursing assessments, physical therapy, and personalized care delivered directly to your home.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
          backgroundColor: "#080d0c",
          color: "#f8fafc",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <div style={{ flex: 1 }}>{children}</div>
        <MarketingFooter />
      </body>
    </html>
  );
}