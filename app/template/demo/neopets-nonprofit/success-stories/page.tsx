import type { Metadata } from "next";
import { NeopetsSuccessStoriesBody } from "@/components/experience-templates/neopets-nonprofit/NeopetsSuccessStoriesBody";
import { absoluteUrl } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Success Stories — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/success-stories"),
  },
};

export default function NeopetsSuccessStoriesPage() {
  return <NeopetsSuccessStoriesBody />;
}
