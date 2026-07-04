import type { Metadata } from "next";
import { NeopetsProfileBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsProfileBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "Profile — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/profile"),
  },
};

export default function NeopetsProfilePage() {
  return <NeopetsProfileBody />;
}
