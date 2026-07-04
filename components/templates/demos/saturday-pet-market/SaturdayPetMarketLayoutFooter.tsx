"use client";

import { usePathname } from "next/navigation";
import { SpmFooter, type SpmFooterVariant } from "./SaturdayPetMarketShared";
import { SPM_PATHS, isSpmMinimalChromePath, isSpmProductPath } from "./saturdayPetMarketConfig";

function resolveFooterVariant(pathname: string): SpmFooterVariant | null {
  const path = pathname.replace(/\/$/, "") || "/";
  if (isSpmMinimalChromePath(pathname)) return null;
  if (path === SPM_PATHS.cart) return "cart";
  if (path === SPM_PATHS.shop) return "shop";
  if (isSpmProductPath(path)) return "product";
  if (path === SPM_PATHS.account) return "account";
  if (path === SPM_PATHS.rewards) return "rewards";
  if (path === SPM_PATHS.community) return "community";
  if (path === SPM_PATHS.resources) return "resources";
  if (path === SPM_PATHS.locations) return "locations";
  if (path === SPM_PATHS.contact) return "contact";
  if (path === SPM_PATHS.faq) return "faq";
  if (path === SPM_PATHS.login) return "home";
  return "home";
}

export function SaturdayPetMarketLayoutFooter() {
  const pathname = usePathname();
  const variant = resolveFooterVariant(pathname);
  if (!variant) return null;
  return <SpmFooter variant={variant} />;
}
