"use client";

import type { ReactNode } from "react";
import { PawsMatchAuthProvider } from "./PawsMatchAuthContext";
import { PawsMatchNav } from "./PawsMatchNav";

export function PawsMatchShell({ children }: { children: ReactNode }) {
  return (
    <PawsMatchAuthProvider>
      <PawsMatchNav />
      <div className="min-w-0 flex-1 pt-[4.5rem]">{children}</div>
    </PawsMatchAuthProvider>
  );
}
