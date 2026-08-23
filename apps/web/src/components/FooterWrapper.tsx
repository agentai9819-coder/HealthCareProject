"use client";

import { usePathname } from "next/navigation";
import { MarketingFooter } from "./MarketingFooter";

export function FooterWrapper() {
  const pathname = usePathname();

  // If on homepage, the Webflow footer is rendered within the page
  if (pathname === "/") {
    return null;
  }

  return <MarketingFooter />;
}
