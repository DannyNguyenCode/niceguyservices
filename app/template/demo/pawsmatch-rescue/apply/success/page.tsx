import type { Metadata } from "next";
import { Suspense } from "react";
import { PawsMatchApplySuccessBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchApplySuccessBody";

export const metadata: Metadata = {
  title: "Application received — PawsMatch Rescue (demo)",
};

export default function PawsMatchApplySuccessPage() {
  return (
    <Suspense fallback={<main className="py-24 text-center text-sm">Loading…</main>}>
      <PawsMatchApplySuccessBody />
    </Suspense>
  );
}
