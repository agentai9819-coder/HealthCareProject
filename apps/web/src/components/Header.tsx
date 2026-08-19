"use client";

import { usePathname } from "next/navigation";
import { MarketingHeader } from "./MarketingHeader";
import { PortalHeader } from "./PortalHeader";

export function Header() {
  const pathname = usePathname();

  // If on staff or admin operational pages, render the operations header
  if (pathname.startsWith("/staff") || pathname.startsWith("/admin")) {
    return <PortalHeader />;
  }

  // Otherwise, render the dedicated public marketing & customer header
  return <MarketingHeader />;
}
