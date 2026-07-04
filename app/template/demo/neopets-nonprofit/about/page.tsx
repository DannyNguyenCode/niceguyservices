import type { Metadata } from "next";
import { NeopetsAboutBody } from "@/components/templates/demos/neopets-nonprofit/NeopetsAboutBody";
import { absoluteUrl } from "@/lib/templates/urls";

export const metadata: Metadata = {
  title: "About — Toronto Adopt-A-Pet (demo)",
  alternates: {
    canonical: absoluteUrl("/template/demo/neopets-nonprofit/about"),
  },
};

export default function NeopetsAboutPage() {
  return <NeopetsAboutBody />;
}
