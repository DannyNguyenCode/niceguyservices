"use client";

import { usePathname } from "next/navigation";
import { KC_PATHS } from "./kinshipCapitalConfig";
import { KcFooter, type KcFooterVariant } from "./KinshipCapitalShared";

function footerVariantForPath(pathname: string): KcFooterVariant {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === KC_PATHS.contact) return "contact";
  if (path === KC_PATHS.pricing) return "pricing";
  if (path === KC_PATHS.services) return "services";
  if (path === KC_PATHS.faq) return "faq";
  if (path === KC_PATHS.about) return "about";
  return "home";
}

export function KinshipCapitalLayoutFooter() {
  const pathname = usePathname();
  return <KcFooter variant={footerVariantForPath(pathname)} />;
}
