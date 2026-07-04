"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { isSpmMinimalChromePath } from "./saturdayPetMarketConfig";
import { SpmNav } from "./SaturdayPetMarketShared";

export function SaturdayPetMarketShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isMinimal = isSpmMinimalChromePath(pathname);

  if (isMinimal) {
    return <div className="min-w-0">{children}</div>;
  }

  return (
    <>
      <Suspense fallback={null}>
        <SpmNav />
      </Suspense>
      <div className="min-w-0">{children}</div>
    </>
  );
}
