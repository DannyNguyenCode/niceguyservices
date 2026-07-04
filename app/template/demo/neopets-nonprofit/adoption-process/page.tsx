import type { Metadata } from "next";
import { NeopetsAdoptionProcessBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsAdoptionProcessBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Adoption Journey — Toronto Adopt-A-Pet (demo)",
  description:
    "Interactive adoption adventure map — seven welcoming checkpoints from exploring pets to ongoing support. Fictional demo.",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/adoption-process"),
  },
};

export default function NeopetsAdoptionProcessPage() {
  return <NeopetsAdoptionProcessBody />;
}
