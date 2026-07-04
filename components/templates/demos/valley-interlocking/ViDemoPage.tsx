import type { ReactNode } from "react";
import { ViHeroPreload } from "./ViHeroPreload";

/** Wraps demo page bodies with optional hero image preload (server-rendered). */
export function ViDemoPage({ heroSrc, children }: { heroSrc?: string; children: ReactNode }) {
  return (
    <>
      {heroSrc ? <ViHeroPreload src={heroSrc} /> : null}
      {children}
    </>
  );
}
