import type { Metadata } from "next";
import { Suspense } from "react";
import { PawsMatchApplyBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchApplyBody";

export const metadata: Metadata = {
  title: "Adoption application — PawsMatch Rescue (demo)",
};

export default function PawsMatchApplyPage() {
  return (
    <Suspense fallback={<main className="py-24 text-center text-sm">Loading…</main>}>
      <PawsMatchApplyBody />
    </Suspense>
  );
}
