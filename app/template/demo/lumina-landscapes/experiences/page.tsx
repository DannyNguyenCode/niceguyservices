import type { Metadata } from "next";
import { LuminaExperiencesSection } from "@/components/templates/demos/lumina-landscapes/LuminaExperiencesSection";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Private Resort Experiences | Lumina Landscapes (demo)",
  description:
    "Outdoor destination concepts — fire lounge, garden walk, dining terrace, water features, and evening lighting. Fictional placeholder copy.",
  alternates: { canonical: absoluteUrl("/template/demo/lumina-landscapes/experiences") },
};

export default function LuminaExperiencesPage() {
  return (
    <main>
      <LuminaExperiencesSection standalone />
    </main>
  );
}
