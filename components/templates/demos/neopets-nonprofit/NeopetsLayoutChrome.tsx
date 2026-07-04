"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { NeopetsDonateFab } from "./NeopetsDonateFab";
import { isNeopetsNavActive, NEOPETS_PATHS } from "./neopetsConfig";

export function NeopetsLayoutChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = isNeopetsNavActive(pathname, NEOPETS_PATHS.home);

  return (
    <>
      <div className={isHome ? "pb-0" : "pb-8 sm:pb-10"}>{children}</div>
      {!isHome ? <NeopetsDonateFab /> : null}
    </>
  );
}
