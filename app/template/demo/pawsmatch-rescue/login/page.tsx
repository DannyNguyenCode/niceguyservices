import type { Metadata } from "next";
import { Suspense } from "react";
import { PawsMatchLoginBody } from "@/components/templates/demos/pawsmatch-rescue/PawsMatchLoginBody";

export const metadata: Metadata = {
  title: "Sign in — PawsMatch Rescue (demo)",
};

export default function PawsMatchLoginPage() {
  return (
    <Suspense fallback={<main className="py-24 text-center text-sm">Loading…</main>}>
      <PawsMatchLoginBody />
    </Suspense>
  );
}
