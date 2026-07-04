import type { Metadata } from "next";
import { NeopetsSuccessStoriesBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsSuccessStoriesBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Happy Tails — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/success-stories"),
  },
};

export default function NeopetsSuccessStoriesPage() {
  return <NeopetsSuccessStoriesBody />;
}
