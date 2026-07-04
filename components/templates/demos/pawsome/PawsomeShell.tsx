"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PS_BASE, PS_PATHS } from "./pawsomeConfig";
import { PawsomeHeader, type PsHeaderVariant } from "./PawsomeHeader";
import { PawsomeBottomNav } from "./PawsomeBottomNav";

type PawsomeShellProps = {
  children: ReactNode;
  hideBottomNav?: boolean;
  headerVariant?: PsHeaderVariant;
  headerTitle?: string;
};

function normalizePath(pathname: string): string {
  return pathname.replace(/\/$/, "") || "/";
}

function resolveShellConfig(pathname: string): {
  hideBottomNav: boolean;
  headerVariant: PsHeaderVariant;
  headerTitle?: string;
} {
  const path = normalizePath(pathname);
  const base = normalizePath(PS_BASE);

  const hidePaths = new Set([
    normalizePath(PS_PATHS.checkout),
    normalizePath(PS_PATHS.checkoutSuccess),
    normalizePath(PS_PATHS.orderTrack),
    normalizePath(PS_PATHS.review),
    normalizePath(PS_PATHS.reviewWrite),
    normalizePath(PS_PATHS.reviewSuccess),
    normalizePath(PS_PATHS.accountAddPet),
    normalizePath(PS_PATHS.accountAddPetHealth),
    normalizePath(PS_PATHS.accountAddPetSuccess),
  ]);

  let headerVariant: PsHeaderVariant = "default";
  let headerTitle: string | undefined;

  if (path === normalizePath(PS_PATHS.checkout)) {
    headerVariant = "checkout";
  } else if (path === normalizePath(PS_PATHS.checkoutSuccess)) {
    headerVariant = "success";
  } else if (path === normalizePath(PS_PATHS.orderTrack)) {
    headerVariant = "back";
    headerTitle = "Track Order";
  } else if (path === normalizePath(PS_PATHS.shopLuna)) {
    headerVariant = "minimal";
  } else if (path === normalizePath(PS_PATHS.accountOrders)) {
    headerVariant = "back";
    headerTitle = "Order History";
  } else if (path === normalizePath(PS_PATHS.accountAddPet)) {
    headerVariant = "task";
    headerTitle = "Add New Pet";
  } else if (path === normalizePath(PS_PATHS.accountAddPetHealth)) {
    headerVariant = "task";
    headerTitle = "Health Profile";
  } else if (path === normalizePath(PS_PATHS.accountAddPetSuccess)) {
    headerVariant = "success";
  } else if (path === normalizePath(PS_PATHS.reviewWrite)) {
    headerVariant = "task";
    headerTitle = "Write a Review";
  } else if (path === normalizePath(PS_PATHS.reviewSuccess)) {
    headerVariant = "success";
  } else if (path.startsWith(`${base}/shop/`) && path !== normalizePath(PS_PATHS.shop)) {
    headerVariant = "default";
  }

  return {
    hideBottomNav: hidePaths.has(path),
    headerVariant,
    headerTitle,
  };
}

export function PawsomeShell({
  children,
  hideBottomNav,
  headerVariant,
  headerTitle,
}: PawsomeShellProps) {
  const pathname = usePathname();
  const defaults = resolveShellConfig(pathname);

  const showBottomNav = !(hideBottomNav ?? defaults.hideBottomNav);
  const variant = headerVariant ?? defaults.headerVariant;
  const title = headerTitle ?? defaults.headerTitle;

  return (
    <>
      <PawsomeHeader variant={variant} title={title} />
      <div className={`min-w-0 flex-1 ${showBottomNav ? "pb-24 md:pb-0" : ""}`}>{children}</div>
      {showBottomNav ? <PawsomeBottomNav /> : null}
    </>
  );
}
