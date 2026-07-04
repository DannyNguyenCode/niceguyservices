"use client";

import type { ReactNode } from "react";
import { ValleyInterlockingLayoutFooter } from "./ValleyInterlockingLayoutFooter";
import { ViPageLoadingProvider } from "./ViPageLoadingProvider";
import { ViNav } from "./ValleyInterlockingShared";

export function ViClientShell({ children }: { children: ReactNode }) {
  return (
    <ViPageLoadingProvider>
      <ViNav />
      <div id="vi-main-content" tabIndex={-1} className="min-w-0 overflow-x-clip outline-none">
        {children}
      </div>
      <ValleyInterlockingLayoutFooter />
    </ViPageLoadingProvider>
  );
}
