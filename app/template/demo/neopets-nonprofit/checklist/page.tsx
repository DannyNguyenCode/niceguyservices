import type { Metadata } from "next";
import { NeopetsChecklistHubBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsChecklistHubBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Adoption Checklist Hub — Toronto Adopt-A-Pet (demo)",
  description:
    "Interactive adoption preparation checklists — before adopting, supplies, first week and first month guides. Fictional demo.",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/checklist"),
  },
};

export default function NeopetsChecklistPage() {
  return <NeopetsChecklistHubBody />;
}
